/**
 * Preparo de imagens antes de subir para a galeria.
 *
 * Resolve dois problemas reais de foto vinda de celular:
 *
 * 1. HEIC/HEIF (padrão do iPhone) não é exibido por nenhum navegador. O arquivo
 *    sobe, mas aparece quebrado no painel e no site. Aqui ele é convertido para
 *    JPEG antes do envio.
 * 2. Foto de celular costuma ter 4000px e vários MB. Numa galeria com dezenas
 *    de imagens isso deixa a página lenta. Acima de MAX_SIDE a imagem é
 *    reduzida.
 *
 * Arquivo que já está num formato exibível e dentro do tamanho passa intacto —
 * não há reencode desnecessário, que só perderia qualidade.
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

const isHeic = (file: File) =>
  HEIC_EXTENSION.test(file.name) || /heic|heif/i.test(file.type);

/** Lê as dimensões sem decodificar a imagem inteira em memória duas vezes. */
const loadBitmap = async (blob: Blob): Promise<ImageBitmap | null> => {
  try {
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

export const prepareImageForUpload = async (file: File): Promise<PreparedImage> => {
  let working: Blob = file;
  let extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const steps: string[] = [];

  // --- 1. HEIC/HEIF -> JPEG -------------------------------------------------
  if (isHeic(file)) {
    // Import dinâmico: a biblioteca carrega um decodificador pesado e só deve
    // entrar em cena quando existe de fato um arquivo HEIC.
    const heic2any = (await import('heic2any')).default as any;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: JPEG_QUALITY,
    });
    working = Array.isArray(converted) ? converted[0] : converted;
    extension = 'jpg';
    steps.push('convertida de HEIC');
  }

  // --- 2. Redução de tamanho ------------------------------------------------
  const bitmap = await loadBitmap(working);
  if (bitmap) {
    const { width, height } = bitmap;
    const largestSide = Math.max(width, height);

    if (largestSide > MAX_SIDE) {
      const scale = MAX_SIDE / largestSide;
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Fundo branco: PNG com transparência viraria preto ao virar JPEG.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(bitmap, 0, 0, targetW, targetH);

        const resized = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
        if (resized) {
          working = resized;
          extension = 'jpg';
          steps.push(`reduzida para ${targetW}x${targetH}`);
        }
      }
    }
    bitmap.close();
  }

  return {
    blob: working,
    extension,
    note: steps.length ? steps.join(' e ') : null,
  };
};

/** Formata bytes para mensagem de erro legível. */
export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;
