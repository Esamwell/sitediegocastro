/**
 * Preparo de imagens antes de subir para a galeria.
 *
 * Resolve dois problemas de foto vinda de celular:
 *
 * 1. HEIC/HEIF (padrão do iPhone) não é exibido por nenhum navegador. O arquivo
 *    sobe, mas aparece quebrado no painel e no site. Aqui ele é convertido para
 *    JPEG antes do envio.
 * 2. Foto de celular costuma ter 4000px e vários MB. Numa galeria com dezenas
 *    de imagens isso deixa a página lenta. Acima de MAX_SIDE ela é reduzida.
 *
 * REGRA CENTRAL: nada é enviado sem que o navegador prove que consegue decodificar
 * o resultado. Conversão de HEIC falha silenciosamente em alguns arquivos (HDR de
 * 10 bits, Live Photo, HEIC de iPhone recente), e sem essa verificação o arquivo
 * quebrado subia mesmo assim. Agora falha na hora, com mensagem dizendo qual foto
 * e o que fazer.
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

export const isHeic = (file: File) =>
  HEIC_EXTENSION.test(file.name) || /heic|heif/i.test(file.type);

/**
 * Tenta decodificar o blob. É a prova de que o navegador consegue exibir a
 * imagem — se falha aqui, falharia na tag <img> da galeria.
 */
const decode = async (blob: Blob): Promise<ImageBitmap | null> => {
  try {
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

/** Redesenha o bitmap num canvas, opcionalmente reduzindo. Sempre sai JPEG. */
const reencode = async (bitmap: ImageBitmap, scale: number) => {
  const targetW = Math.max(1, Math.round(bitmap.width * scale));
  const targetH = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fundo branco: imagem com transparência viraria preto ao virar JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  return blob ? { blob, width: targetW, height: targetH } : null;
};

export const prepareImageForUpload = async (file: File): Promise<PreparedImage> => {
  const steps: string[] = [];
  let working: Blob = file;
  let extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // --- 1. HEIC/HEIF -> JPEG -------------------------------------------------
  if (isHeic(file)) {
    let raw: unknown;
    try {
      // Import dinâmico: o decodificador é pesado e só deve carregar quando há
      // de fato um arquivo HEIC.
      const mod: any = await import('heic2any');
      const convert = (mod?.default ?? mod) as (opts: any) => Promise<Blob | Blob[]>;
      if (typeof convert !== 'function') {
        throw new Error('conversor não carregou');
      }
      raw = await convert({ blob: file, toType: 'image/jpeg', quality: JPEG_QUALITY });
    } catch (err: any) {
      throw new ImagePrepError(
        `"${file.name}" é um HEIC que não pôde ser convertido (${err?.message || err}). ` +
        `Costuma acontecer com foto HDR de iPhone recente. ` +
        `Abra a foto no celular, use Compartilhar > Salvar como JPEG, ou mude em ` +
        `Ajustes > Câmera > Formatos para "Mais compatível", e envie de novo.`
      );
    }

    const candidate = Array.isArray(raw) ? raw[0] : (raw as Blob);
    if (!candidate || !(candidate instanceof Blob) || candidate.size === 0) {
      throw new ImagePrepError(
        `"${file.name}" foi convertido mas o resultado veio vazio. Salve a foto ` +
        `como JPEG no celular e envie de novo.`
      );
    }

    working = candidate;
    extension = 'jpg';
    steps.push('convertida de HEIC');
  }

  // --- 2. Verificação + redução --------------------------------------------
  const bitmap = await decode(working);

  if (!bitmap) {
    // Chegou aqui significa que nem o arquivo original nem o convertido são
    // exibíveis. Barrar agora evita a foto quebrada na galeria.
    throw new ImagePrepError(
      isHeic(file)
        ? `"${file.name}" continuou ilegível depois da conversão. Salve a foto como ` +
          `JPEG no celular e envie de novo.`
        : `"${file.name}" não é uma imagem que o navegador consiga abrir. ` +
          `Formatos aceitos: JPG, PNG, WEBP, GIF e HEIC de iPhone.`
    );
  }

  const largestSide = Math.max(bitmap.width, bitmap.height);
  if (largestSide > MAX_SIDE) {
    const result = await reencode(bitmap, MAX_SIDE / largestSide);
    if (result) {
      working = result.blob;
      extension = 'jpg';
      steps.push(`reduzida para ${result.width}x${result.height}`);
    }
  }
  bitmap.close();

  return {
    blob: working,
    extension,
    note: steps.length ? steps.join(' e ') : null,
  };
};

/** Formata bytes para mensagem legível. */
export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;
