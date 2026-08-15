/**
 * Artes padrão dos banners.
 *
 * Quando a configuração correspondente está vazia no Supabase, é este valor que
 * o site exibe. Ficava repetido como string solta no App, na HistoriaPage e na
 * SegurancaPage, o que fazia o painel admin mostrar "vazio" para banner que na
 * prática estava no ar. Centralizado aqui, o painel consegue dizer a verdade.
 *
 * String vazia = banner realmente oculto até subirem uma arte pelo painel.
 */
export const BANNER_DEFAULTS: Record<string, string> = {
  banner_1_image: '/banners/1.jpeg',
  banner_2_image: '/banners/2.jpeg',
  banner_3_image: '',
  banner_4_image: '/banners/4.jpeg',
};

/** Valor que o site realmente usa: o do banco, ou a arte padrão. */
export const resolveBannerImage = (key: string, value?: string | null) =>
  (value || '').trim() || BANNER_DEFAULTS[key] || '';
