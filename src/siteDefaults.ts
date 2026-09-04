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
/** Link padrão do banner de topo: pedido de material de campanha via WhatsApp. */
export const TOPO_BANNER_LINK =
  'https://api.whatsapp.com/send?phone=5571992493802&text=Ol%C3%A1%2C+quero+material+de+Fl%C3%A1vio+Bolsonaro+22+e+do+Deputado+Estadual+Diego+Castro+22380';

/** Texto padrão das tarjas de chamada do banner de topo. */
export const TOPO_BANNER_TEXTO =
  'Clique aqui e solicite material de Flávio Bolsonaro e Diego Castro na Bahia';

export const BANNER_DEFAULTS: Record<string, string> = {
  topo_banner_image: '/banners/topo.avif',
  banner_1_image: '/banners/1.jpeg',
  banner_2_image: '/banners/2.jpeg',
  banner_3_image: '',
  banner_4_image: '/banners/4.jpeg',
};

/** Valor que o site realmente usa: o do banco, ou a arte padrão. */
export const resolveBannerImage = (key: string, value?: string | null) =>
  (value || '').trim() || BANNER_DEFAULTS[key] || '';
