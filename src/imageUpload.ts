/**
 * Preparo de imagens antes de subir para a galeria.
 *
 * Resolve dois problemas de foto vinda de celular:
 *
 * 1. HEIC/HEIF (padrão do iPhone) não é exibido por nenhum navegador. O arquivo
 *    sobe, mas aparece quebrado no painel e no site. Aqui ele é decodificado e
 *    reescrito como JPEG antes do envio.
 * 2. Foto de celular costuma ter 4000px e vários MB. Numa galeria com dezenas
 *    de imagens isso deixa a página lenta. Acima de MAX_SIDE ela é reduzida.
 *
 * REGRA CENTRAL: nada é enviado sem que o navegador tenha decodificado a imagem
 * antes. O caminho de saída sempre passa por um ImageBitmap real, então é
 * impossível subir arquivo que a galeria não conseguiria exibir.
 *
 * A decodificação usa heic-to (libheif atual). A biblioteca anterior, heic2any,
 * embutia um libheif de 2020 que devolvia ERR_LIBHEIF em HEIC de iPhone recente
 * — especialmente foto HDR de 10 bits.
 */

const HEIC_EXTENSION = /\.(heic|heif)$/i;
const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.85;

export interface PreparedImage {
  blob: Blob;
  extension: string;
  /** Descreve o que foi feito, para mostrar no painel. */
  note: string | null;
}

/** Erro com texto pronto para o usuário final. */
export class ImagePrepError extends Error {}

/** Checagem rápida e síncrona, usada para rotular o progresso na tela. */
export const looksLikeHeic = (file: File) =>
  HEIC_EXTENSION.test(file.name) || /heic|heif/i.test(file.type);

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

/** Redesenha o bitmap num canvas aplicando escala. Sempre sai JPEG. */
const toJpeg = async (bitmap: ImageBitmap, scale: number) => {
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ImagePrepError('Não foi possível processar a imagem neste navegador.');

  // Fundo branco: imagem com transparência viraria preto ao virar JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  if (!blob) throw new ImagePrepError('Não foi possível gerar a imagem final.');
  return { blob, width, height };
};

/**
 * Decodifica HEIC. O import é dinâmico de propósito: o libheif em WASM pesa
 * alguns megabytes e não pode entrar no pacote principal do site, que é
 * carregado por todo visitante. Só desce quando alguém envia um HEIC no painel.
 */
const decodeHeic = async (file: File): Promise<ImageBitmap> => {
  const { heicTo } = await import('heic-to');
  // imageOrientation: foto de celular guarda a rotação num campo EXIF. A tag
  // <img> respeita esse campo sozinha, mas o canvas não — sem isso, a imagem
  // é redesenhada deitada e a rotação se perde de vez no arquivo salvo.
  return heicTo({ blob: file, type: 'bitmap', options: { imageOrientation: 'from-image' } });
};

const heicHelp = (file: File, err: any) =>
  new ImagePrepError(
    `"${file.name}" é um HEIC que não pôde ser aberto (${err?.message || err}). ` +
    `No iPhone, abra a foto, toque em Compartilhar e escolha Salvar como JPEG — ` +
    `ou mude em Ajustes > Câmera > Formatos para "Mais compatível" para as ` +
    `próximas fotos já saírem em JPEG.`
  );

export const prepareImageForUpload = async (file: File): Promise<PreparedImage> => {
  const steps: string[] = [];

  // --- 1. Decodificar -------------------------------------------------------
  // Ordem escolhida para evitar baixar o decodificador à toa: tenta primeiro o
  // caminho nativo do navegador, que resolve JPG/PNG/WEBP sem custo nenhum.
  let bitmap: ImageBitmap | null = null;
  let heic = looksLikeHeic(file);

  if (heic) {
    try {
      bitmap = await decodeHeic(file);
    } catch (err: any) {
      throw heicHelp(file, err);
    }
  } else {
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Pode ser um HEIC com extensão trocada — acontece quando a foto passa
      // por transferência ou é renomeada à mão. Vale tentar o decodificador.
      try {
        bitmap = await decodeHeic(file);
        heic = true;
      } catch {
        throw new ImagePrepError(
          `"${file.name}" não é uma imagem que o navegador consiga abrir. ` +
          `Formatos aceitos: JPG, PNG, WEBP, GIF e HEIC de iPhone.`
        );
      }
    }
  }

  if (heic) steps.push('convertida de HEIC');

  // --- 2. Redimensionar quando necessário -----------------------------------
  const largestSide = Math.max(bitmap.width, bitmap.height);
  const needsResize = largestSide > MAX_SIDE;

  // HEIC sempre precisa ser reescrito (o original não é exibível). Os demais só
  // passam pelo canvas se forem grandes demais — reencode à toa perderia
  // qualidade sem motivo.
  if (!heic && !needsResize) {
    bitmap.close();
    return {
      blob: file,
      extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
      note: null,
    };
  }

  const scale = needsResize ? MAX_SIDE / largestSide : 1;
  const result = await toJpeg(bitmap, scale);
  bitmap.close();

  if (needsResize) steps.push(`reduzida para ${result.width}x${result.height}`);

  return {
    blob: result.blob,
    extension: 'jpg',
    note: steps.length ? steps.join(' e ') : null,
  };
};

/** Formata bytes para mensagem legível. */
export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;

/**
 * Baixa uma imagem já publicada, gira e devolve um JPEG novo.
 *
 * A rotação é aplicada no arquivo em si, não por CSS: assim a foto fica correta
 * em qualquer lugar que a use depois (grade, tela cheia, compartilhamento), sem
 * depender de o site lembrar de aplicar uma transformação.
 */
export const rotateImageFromUrl = async (
  url: string,
  degrees: 90 | 180 | 270
): Promise<Blob> => {
  const response = await fetch(url, { mode: 'cors', cache: 'reload' });
  if (!response.ok) {
    throw new ImagePrepError(`Não foi possível baixar a imagem para girar (erro ${response.status}).`);
  }

  const bitmap = await createImageBitmap(await response.blob());
  const swapsAxes = degrees === 90 || degrees === 270;
  const width = swapsAxes ? bitmap.height : bitmap.width;
  const height = swapsAxes ? bitmap.width : bitmap.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ImagePrepError('Não foi possível processar a imagem neste navegador.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  // Gira em torno do centro do novo quadro e desenha a imagem centrada nele.
  ctx.translate(width / 2, height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  bitmap.close();

  const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  if (!blob) throw new ImagePrepError('Não foi possível gerar a imagem girada.');
  return blob;
};
