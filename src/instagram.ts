/**
 * Utilidades para os posts do Instagram.
 *
 * A exibição usa o embed público oficial (instagram.com/p/<código>/embed),
 * que funciona para qualquer post público sem token, sem app na Meta e sem
 * acesso à conta. Em troca, a curadoria é manual: alguém cola a URL do post.
 */

/**
 * Extrai o código do post de uma URL do Instagram.
 *
 * Aceita post (/p/), reel (/reel/ ou /reels/) e tv (/tv/), com ou sem
 * querystring, com ou sem barra final, com ou sem www.
 * Retorna null quando a URL não é de um post.
 */
export const extractInstagramShortcode = (url: string): string | null => {
  if (!url) return null;
  const match = url.trim().match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
};

/** URL do embed oficial para um código de post. */
export const instagramEmbedUrl = (shortcode: string) =>
  `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
