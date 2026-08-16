import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, 
  Newspaper, Video, Link as LinkIcon, ExternalLink,
  ChevronRight, LayoutDashboard, Settings, Shield, Upload,
  ImageOff, Images, Instagram
} from 'lucide-react';
import { resolveBannerImage } from './siteDefaults';
import { extractInstagramShortcode } from './instagram';
import { prepareImageForUpload, formatSize, isHeic } from './imageUpload';

const BOX = 'w-24 h-16 flex-shrink-0 rounded-lg flex items-center justify-center';

/**
 * Miniatura da imagem que está no ar naquela configuração, exibida na lista.
 * Serve para identificar a peça sem precisar abrir a edição — principalmente
 * nos banners, que são vários e só se distinguem pela arte.
 *
 * Importante: o valor pode estar vazio no banco e mesmo assim haver imagem no
 * site, porque o componente cai na arte padrão de BANNER_DEFAULTS. Por isso a
 * miniatura mostra o valor EFETIVO e marca quando ele vem do padrão — dizer
 * "vazio" ali seria mentira, o banner está visível.
 */
const SettingThumb: React.FC<{ settingKey: string; value: string }> = ({ settingKey, value }) => {
  const [failed, setFailed] = useState(false);

  const stored = (value || '').trim();
  const effective = resolveBannerImage(settingKey, stored);
  const usesDefault = !stored && !!effective;
  const isImageKey = /image|banner/i.test(settingKey || '');
  const showsImage = isImageKey && /^(https?:\/\/|\/)/.test(effective);

  useEffect(() => setFailed(false), [effective]);

  if (showsImage && !failed) {
    return (
      <a
        href={effective}
        target="_blank"
        rel="noopener noreferrer"
        title={
          usesDefault
            ? 'Arte padrão do site (nada salvo no painel). Está visível no site.'
            : 'Abrir imagem em tamanho real'
        }
        className={`${BOX} relative overflow-hidden border bg-slate-50 transition-colors ${
          usesDefault ? 'border-amber-300' : 'border-slate-200'
        } hover:border-[#002776]`}
      >
        <img
          src={effective}
          alt=""
          loading="lazy"
          className="max-w-full max-h-full object-contain"
          onError={() => setFailed(true)}
        />
        {usesDefault && (
          <span className="absolute bottom-0 inset-x-0 bg-amber-400/90 text-[8px] font-bold uppercase tracking-wider text-amber-950 text-center leading-tight py-0.5">
            Padrão
          </span>
        )}
      </a>
    );
  }

  if (showsImage && failed) {
    return (
      <div
        title="A imagem não carregou — verifique o link"
        className={`${BOX} border border-red-200 bg-red-50 text-red-400`}
      >
        <ImageOff size={18} />
      </div>
    );
  }

  if (isImageKey && !effective) {
    return (
      <div
        title="Sem arte — este banner está oculto no site"
        className={`${BOX} border border-dashed border-slate-300 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-wider px-1 text-center`}
      >
        Oculto
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
      <Settings size={18} />
    </div>
  );
};

/**
 * Miniatura da galeria que assume o estado de falha.
 *
 * Foto em formato que o navegador não abre (HEIC enviado antes da conversão
 * existir) apareceria como ícone quebrado, sem explicar nada. Aqui vira um aviso
 * explícito, para saber quais apagar e reenviar.
 */
const GalleryThumb: React.FC<{ url: string }> = ({ url }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [url]);

  if (failed) {
    return (
      <div
        title="Formato não exibível pelo navegador. Apague e envie de novo — agora a conversão é automática."
        className="w-16 h-16 flex-shrink-0 rounded-lg border border-red-200 bg-red-50 text-red-400 flex flex-col items-center justify-center gap-0.5 text-center"
      >
        <ImageOff size={16} />
        <span className="text-[7px] font-bold uppercase tracking-wide leading-none">Quebrada</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-slate-100"
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'videos' | 'links' | 'segments' | 'projects' | 'settings' | 'gallery' | 'instagram'>('dashboard');
  
  // Auth States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data States
  const [news, setNews] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [settings, setSettings] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Friendly Labels for Settings
  const SETTING_LABELS: Record<string, { label: string; desc: string; section: string }> = {
    'hero_title': { label: 'Título Principal', desc: 'O título grande que aparece no topo da página inicial.', section: 'Página Inicial - Capa' },
    'hero_subtitle': { label: 'Subtítulo', desc: 'O texto menor abaixo do título na página inicial.', section: 'Página Inicial - Capa' },
    'hero_badge': { label: 'Tagline/Badge', desc: 'O textinho que fica acima do título principal.', section: 'Página Inicial - Capa' },
    'hero_image': { label: 'Imagem Principal', desc: 'A foto grande do Diego Castro na capa.', section: 'Página Inicial - Capa' },
    'hero_badge_2_value': { label: 'Selo Flutuante - Valor', desc: 'Valor do selo (ex: 100%).', section: 'Página Inicial - Capa' },
    'hero_badge_2_label': { label: 'Selo Flutuante - Texto', desc: 'Texto do selo (ex: Bolsonaro).', section: 'Página Inicial - Capa' },

    'stats_1_label': { label: 'Estatística 1 - Rótulo', desc: 'Ex: Recordista de Projetos', section: 'Página Inicial - Estatísticas' },
    'stats_1_value': { label: 'Estatística 1 - Valor', desc: 'Ex: 170+', section: 'Página Inicial - Estatísticas' },
    'stats_2_label': { label: 'Estatística 2 - Rótulo', desc: '', section: 'Página Inicial - Estatísticas' },
    'stats_2_value': { label: 'Estatística 2 - Valor', desc: '', section: 'Página Inicial - Estatísticas' },
    'stats_3_label': { label: 'Estatística 3 - Rótulo', desc: '', section: 'Página Inicial - Estatísticas' },
    'stats_3_value': { label: 'Estatística 3 - Valor', desc: '', section: 'Página Inicial - Estatísticas' },
    'stats_4_label': { label: 'Estatística 4 - Rótulo', desc: '', section: 'Página Inicial - Estatísticas' },
    'stats_4_value': { label: 'Estatística 4 - Valor', desc: '', section: 'Página Inicial - Estatísticas' },

    'about_title': { label: 'Título da Seção', desc: 'O título da seção que resume a história.', section: 'Página Inicial - Sobre o Diego' },
    'about_text_1': { label: 'Texto da Seção 1', desc: 'Primeiro parágrafo do sobre.', section: 'Página Inicial - Sobre o Diego' },
    'about_text_2': { label: 'Texto da Seção 2', desc: 'Segundo parágrafo do sobre.', section: 'Página Inicial - Sobre o Diego' },
    'about_image': { label: 'Imagem Principal', desc: 'A foto principal da seção sobre.', section: 'Página Inicial - Sobre o Diego' },
    'about_image_secondary': { label: 'Imagem Secundária', desc: 'A foto menor da seção sobre.', section: 'Página Inicial - Sobre o Diego' },
    
    'mandato_badge': { label: 'Tagline', desc: 'Ex: Ações Legislativas', section: 'Página Inicial - Projetos' },
    'mandato_title': { label: 'Título Principal', desc: 'Título da seção de mandato.', section: 'Página Inicial - Projetos' },
    'mandato_subtitle': { label: 'Subtítulo', desc: 'Texto descritivo abaixo do título.', section: 'Página Inicial - Projetos' },

    'bahia_title': { label: 'Título', desc: 'Ex: DIEGO PELA BAHIA', section: 'Página Inicial - Bahia' },
    'bahia_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_1_title': { label: 'Card 1 - Título', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_1_text': { label: 'Card 1 - Texto', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_1_footer': { label: 'Card 1 - Rodapé', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_2_title': { label: 'Card 2 - Título', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_2_text': { label: 'Card 2 - Texto', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_item_2_footer': { label: 'Card 2 - Rodapé', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_image': { label: 'Imagem de Fundo', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_image_stats_value': { label: 'Imagem Estatística - Valor', desc: '', section: 'Página Inicial - Bahia' },
    'bahia_image_stats_label': { label: 'Imagem Estatística - Rótulo', desc: '', section: 'Página Inicial - Bahia' },

    'seguranca_image': { label: 'Imagem de Fundo', desc: '', section: 'Página Inicial - Segurança' },
    'seguranca_title': { label: 'Título', desc: '', section: 'Página Inicial - Segurança' },
    'seguranca_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Segurança' },

    'noticias_title': { label: 'Título', desc: '', section: 'Página Inicial - Notícias' },
    'noticias_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Notícias' },

    'bolsonaro_image': { label: 'Imagem de Fundo', desc: 'A imagem grande ao fundo.', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_badge': { label: 'Tagline', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_title': { label: 'Título', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_stats_1_value': { label: 'Estatística 1 - Valor', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_stats_1_label': { label: 'Estatística 1 - Rótulo', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_stats_2_value': { label: 'Estatística 2 - Valor', desc: '', section: 'Página Inicial - Bolsonaro' },
    'bolsonaro_stats_2_label': { label: 'Estatística 2 - Rótulo', desc: '', section: 'Página Inicial - Bolsonaro' },

    'imprensa_title': { label: 'Título', desc: '', section: 'Página Inicial - Imprensa e Arquivos' },
    'imprensa_text': { label: 'Texto da Imprensa', desc: '', section: 'Página Inicial - Imprensa e Arquivos' },
    'arquivos_title': { label: 'Título Arquivos', desc: '', section: 'Página Inicial - Imprensa e Arquivos' },
    'arquivos_text': { label: 'Texto Arquivos', desc: '', section: 'Página Inicial - Imprensa e Arquivos' },
    'arquivos_btn': { label: 'Botão Arquivos', desc: '', section: 'Página Inicial - Imprensa e Arquivos' },

    'contato_title': { label: 'Título', desc: '', section: 'Página Inicial - Contato' },
    'contato_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Contato' },
    'contato_address_1': { label: 'Endereço (Linha 1)', desc: '', section: 'Página Inicial - Contato' },
    'contato_address_2': { label: 'Endereço (Linha 2)', desc: '', section: 'Página Inicial - Contato' },
    'contato_email': { label: 'E-mail', desc: '', section: 'Página Inicial - Contato' },

    'contato_phone_2': { label: 'Telefone 2 (WhatsApp)', desc: '', section: 'Página Inicial - Contato' },

    'videos_title': { label: 'Título', desc: '', section: 'Página Inicial - Vídeos' },

    'downloads_title_1': { label: 'Título (Parte 1)', desc: '', section: 'Página Inicial - Downloads' },
    'downloads_title_2': { label: 'Título (Parte Destaque)', desc: '', section: 'Página Inicial - Downloads' },
    'downloads_subtitle': { label: 'Subtítulo', desc: '', section: 'Página Inicial - Downloads' },

    'familia_image': { label: 'Imagem', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_title': { label: 'Título', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_1_title': { label: 'Item 1 - Título', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_1_text': { label: 'Item 1 - Texto', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_2_title': { label: 'Item 2 - Título', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_2_text': { label: 'Item 2 - Texto', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_3_title': { label: 'Item 3 - Título', desc: '', section: 'Página Inicial - Família e Fé' },
    'familia_item_3_text': { label: 'Item 3 - Texto', desc: '', section: 'Página Inicial - Família e Fé' },

    'agro_image': { label: 'Imagem', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_title': { label: 'Título', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_1_title': { label: 'Item 1 - Título', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_1_text': { label: 'Item 1 - Texto', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_2_title': { label: 'Item 2 - Título', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_2_text': { label: 'Item 2 - Texto', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_3_title': { label: 'Item 3 - Título', desc: '', section: 'Página Inicial - Agro e Propriedade' },
    'agro_item_3_text': { label: 'Item 3 - Texto', desc: '', section: 'Página Inicial - Agro e Propriedade' },

    'historia_hero_title': { label: 'Título Principal', desc: 'O título grande no topo da página de História.', section: 'Página História - Cabeçalho' },
    'historia_hero_subtitle': { label: 'Subtítulo', desc: 'O texto abaixo do título principal da página de História.', section: 'Página História - Cabeçalho' },
    'historia_hero_image': { label: 'Imagem de Capa', desc: 'A imagem de fundo no topo da página de História.', section: 'Página História - Cabeçalho' },
    'historia_main_text': { label: 'Texto de Introdução', desc: 'O primeiro texto grande que conta a história.', section: 'Página História - Conteúdo' },
    'historia_timeline_title': { label: 'Título da Linha do Tempo', desc: 'O título antes das datas importantes.', section: 'Página História - Conteúdo' },
    'historia_mission_title': { label: 'Título da Missão', desc: 'O título da seção de Missão e Valores.', section: 'Página História - Conteúdo' },

    'banner_1_image': { label: 'Banner 1 - Imagem', desc: 'Peça horizontal entre o Hero e os Projetos (e na página História). A arte nunca é cortada: faixa larga (ex: 1200x310) preenche a coluna toda; quadrada aparece inteira, centralizada e menor. Deixe em branco para ocultar.', section: 'Banners Publicitários' },
    'banner_1_link': { label: 'Banner 1 - Link', desc: 'URL de destino para o clique no Banner 1.', section: 'Banners Publicitários' },
    'banner_2_image': { label: 'Banner 2 - Imagem', desc: 'Peça horizontal entre Segurança e Família. Formato ideal: faixa larga (ex: 1200x310). Deixe em branco para ocultar.', section: 'Banners Publicitários' },
    'banner_2_link': { label: 'Banner 2 - Link', desc: 'URL de destino para o clique no Banner 2.', section: 'Banners Publicitários' },
    'banner_3_image': { label: 'Banner 3 - Imagem', desc: 'Peça horizontal entre Agro e Bolsonaro. Está vazio (oculto) — suba uma arte em faixa larga para ativar. Evite repetir a mesma arte do Banner 2.', section: 'Banners Publicitários' },
    'banner_3_link': { label: 'Banner 3 - Link', desc: 'URL de destino para o clique no Banner 3.', section: 'Banners Publicitários' },
    'banner_4_image': { label: 'Banner 4 - Lateral (Notícias)', desc: 'Peça vertical ao lado da grade de notícias e na página Segurança. Ocupa 300px de largura, então formato story (9:16) ou 300x600 cai perfeito. Arte horizontal aqui fica achatada.', section: 'Banners Publicitários' },
    'banner_4_link': { label: 'Banner 4 - Link (Lateral)', desc: 'URL de destino para o clique no Banner lateral de Notícias.', section: 'Banners Publicitários' },
  };
  
  // Form States
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportData, setBulkImportData] = useState('');
  const [bulkImportError, setBulkImportError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.is_admin) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.is_admin) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      const { data: videosData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (videosData) setVideos(videosData);

      const { data: linksData } = await supabase.from('drive_links').select('*');
      if (linksData) {
        setLinks(linksData);
        // Garantir que todas as chaves de links existam
        const requiredKeys = ['releases', 'fotos_alta', 'biografia', 'biblioteca', 'panfletos', 'artes', 'videos_curtos', 'informativos'];
        const existingKeys = linksData.map(l => l.key);
        const missingKeys = requiredKeys.filter(k => !existingKeys.includes(k));
        if (missingKeys.length > 0) {
          const insertData = missingKeys.map(k => ({ key: k, url: '#' }));
          const { error } = await supabase.from('drive_links').insert(insertData);
          if (!error) {
            const { data: newLinksData } = await supabase.from('drive_links').select('*');
            if (newLinksData) setLinks(newLinksData);
          }
        }
      }

      const { data: segmentsData } = await supabase.from('security_segments').select('*');
      if (segmentsData) setSegments(segmentsData);

      const { data: projectsData } = await supabase.from('projects').select('*').order('year', { ascending: false });
      if (projectsData) setProjects(projectsData);

      const { data: galleryData } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (galleryData) setGallery(galleryData);

      const { data: instagramData } = await supabase.from('instagram_posts').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (instagramData) setInstagramPosts(instagramData);

      const { data: settingsData } = await supabase.from('site_settings').select('*').order('key', { ascending: true });
      if (settingsData) setSettings(settingsData);
    };

    fetchData();

    const newsSub = supabase.channel('news-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchData).subscribe();
    const videosSub = supabase.channel('videos-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, fetchData).subscribe();
    const linksSub = supabase.channel('links-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'drive_links' }, fetchData).subscribe();
    const segmentsSub = supabase.channel('segments-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'security_segments' }, fetchData).subscribe();
    const projectsSub = supabase.channel('projects-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData).subscribe();
    const settingsSub = supabase.channel('settings-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(newsSub);
      supabase.removeChannel(videosSub);
      supabase.removeChannel(linksSub);
      supabase.removeChannel(segmentsSub);
      supabase.removeChannel(projectsSub);
      supabase.removeChannel(settingsSub);
    };
  }, [user]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      
      if (error) throw error;
      
      // Verification is handled by the useEffect onAuthStateChange hook
      // But we can add a quick check here to show a specific error if needed
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        setLoginError("Seu usuário não possui permissão de administrador.");
      }
    } catch (error: any) {
      setLoginError(error.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const shortsMatch = url.match(/\/shorts\/([^#&?]+)/);
    if (shortsMatch) {
      return shortsMatch[1];
    }
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        alert("Arquivo muito grande! O limite é 800KB para garantir o desempenho.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Envia fotos para o bucket 'galeria' do Storage e cria as linhas da tabela.
   *
   * Diferente do handleFileChange, que embute a imagem em base64 na própria
   * coluna, aqui o arquivo vai para o Storage e o banco guarda só a URL. É o
   * que permite dezenas de fotos sem estourar o tamanho das consultas — e por
   * isso o limite pode ser bem mais generoso (5MB em vez de 800KB).
   *
   * Aceita seleção múltipla: numa galeria o normal é subir um lote de uma vez.
   */
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Iteração manual em vez de Array.from: o tsconfig do projeto não inclui
    // DOM.Iterable, então Array.from(FileList) perderia a tipagem de File.
    const fileList = e.target.files;
    const files: File[] = [];
    for (let i = 0; i < (fileList?.length || 0); i++) {
      const file = fileList?.item(i);
      if (file) files.push(file);
    }
    if (files.length === 0) return;

    // Teto generoso: a foto é reduzida antes de subir, então o limite serve
    // apenas para barrar arquivo fora do comum (vídeo renomeado, RAW etc).
    const tooBig = files.find(f => f.size > 25 * 1024 * 1024);
    if (tooBig) {
      alert(`"${tooBig.name}" tem ${formatSize(tooBig.size)} e passa do limite de 25MB.`);
      e.target.value = '';
      return;
    }

    const uploaded: any[] = [];
    const adjusted: string[] = [];
    const failed: string[] = [];

    // Cada foto é tratada isoladamente: uma que falhe não pode descartar o
    // restante de um lote de vinte.
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const position = `${i + 1} de ${files.length}`;

      try {
        // A conversão de HEIC é a parte lenta; avisa antes para o botão não
        // parecer travado.
        setUploadProgress(isHeic(file) ? `Convertendo ${position}...` : `Preparando ${position}...`);
        const prepared = await prepareImageForUpload(file);
        if (prepared.note) adjusted.push(`${file.name}: ${prepared.note}`);

        setUploadProgress(`Enviando ${position}...`);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${prepared.extension}`;

        const { error: uploadError } = await supabase.storage
          .from('galeria')
          .upload(path, prepared.blob, {
            cacheControl: '31536000',
            upsert: false,
            contentType: prepared.blob.type || 'image/jpeg',
          });
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from('galeria').getPublicUrl(path);

        const { data: inserted, error: insertError } = await supabase
          .from('gallery')
          .insert([{
            image_url: publicUrl.publicUrl,
            storage_path: path,
            // nome do arquivo sem extensão vira legenda inicial, editável depois
            title: file.name.replace(/\.[^.]+$/, ''),
            sort_order: gallery.length + i,
          }])
          .select();
        if (insertError) throw insertError;
        if (inserted?.[0]) uploaded.push(inserted[0]);
      } catch (error: any) {
        failed.push(error?.message || `${file.name}: ${error}`);
      }
    }

    setUploadProgress(null);
    e.target.value = '';
    if (uploaded.length) setGallery(prev => [...uploaded, ...prev]);

    const report: string[] = [];
    if (uploaded.length) report.push(`${uploaded.length} foto(s) enviada(s) com sucesso.`);
    if (adjusted.length) report.push(`\nAjustes automáticos:\n${adjusted.join('\n')}`);
    if (failed.length) report.push(`\n${failed.length} foto(s) não puderam ser enviadas:\n\n${failed.join('\n\n')}`);
    alert(report.join('\n') || 'Nenhuma foto foi enviada.');
  };

  /** Remove a foto do banco e também o arquivo do Storage, para não deixar lixo. */
  const handleGalleryDelete = async (item: any) => {
    if (!confirm('Excluir esta foto da galeria?')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', item.id);
      if (error) throw error;
      if (item.storage_path) {
        await supabase.storage.from('galeria').remove([item.storage_path]);
      }
      setGallery(prev => prev.filter(g => g.id !== item.id));
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message || error}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    const tableName = activeTab === 'news' ? 'news' : activeTab === 'videos' ? 'videos' : activeTab === 'segments' ? 'security_segments' : activeTab === 'projects' ? 'projects' : activeTab === 'settings' ? 'site_settings' : activeTab === 'gallery' ? 'gallery' : activeTab === 'instagram' ? 'instagram_posts' : 'drive_links';
    
    let finalData = { ...formData };
    
    // Filtrar apenas os campos válidos para cada tabela
    if (activeTab === 'news') {
      finalData = {
        title: finalData.title,
        date: finalData.date,
        category: finalData.category,
        image: finalData.image,
        excerpt: finalData.excerpt,
        full_content: finalData.full_content,
      };
    } else if (activeTab === 'videos') {
      finalData = {
        title: finalData.title,
        url: finalData.url,
        thumbnail: finalData.thumbnail,
        category: finalData.category,
      };
      if (finalData.url && !finalData.thumbnail) {
        const videoId = extractYoutubeId(finalData.url);
        if (videoId) {
          finalData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
    } else if (activeTab === 'projects') {
      finalData = {
        title: finalData.title,
        category: finalData.category,
        year: finalData.year,
        status: finalData.status,
        summary: finalData.summary,
      };
    } else if (activeTab === 'segments') {
      finalData = {
        name: finalData.name,
        description: finalData.description,
        full_content: finalData.full_content,
        image: finalData.image,
      };
    } else if (activeTab === 'links') {
      finalData = {
        key: finalData.key,
        url: finalData.url,
      };
    } else if (activeTab === 'settings') {
      finalData = {
        key: finalData.key,
        value: finalData.value,
      };
    } else if (activeTab === 'gallery') {
      finalData = {
        image_url: finalData.image_url,
        title: finalData.title,
        storage_path: finalData.storage_path,
        sort_order: Number(finalData.sort_order) || 0,
      };
    } else if (activeTab === 'instagram') {
      const shortcode = extractInstagramShortcode(finalData.post_url || '');
      if (!shortcode) {
        alert('URL inválida. Cole o link de um post, reel ou vídeo do Instagram — algo como https://www.instagram.com/p/ABC123/');
        setIsSaving(false);
        return;
      }
      finalData = {
        post_url: finalData.post_url,
        shortcode,
        caption: finalData.caption,
        sort_order: Number(finalData.sort_order) || 0,
      };
    }

    try {
      let result;
      
      if (isEditing && isEditing !== 'new') {
        if (tableName === 'site_settings') {
          const exists = settings.some(item => item.key === isEditing);
          if (exists) {
            result = await supabase.from(tableName).update(finalData).eq('key', isEditing);
          } else {
            result = await supabase.from(tableName).insert([{ ...finalData, description: SETTING_LABELS[finalData.key]?.desc || '' }]).select();
          }
        } else {
          result = await supabase.from(tableName).update(finalData).eq('id', isEditing);
        }
        if (result.error) throw result.error;
        
        // Atualizar estado local (edição)
        if (tableName === 'news') {
          setNews(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'videos') {
          setVideos(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'projects') {
          setProjects(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'security_segments') {
          setSegments(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'site_settings') {
          const exists = settings.some(item => item.key === isEditing);
          if (exists) {
            setSettings(prev => prev.map(item => item.key === isEditing ? { ...item, ...finalData } : item));
          } else {
            const newItem = result.data?.[0] || { ...finalData, description: SETTING_LABELS[finalData.key]?.desc || '' };
            setSettings(prev => [newItem, ...prev]);
          }
        } else if (tableName === 'drive_links') {
          setLinks(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'gallery') {
          setGallery(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        } else if (tableName === 'instagram_posts') {
          setInstagramPosts(prev => prev.map(item => item.id === isEditing ? { ...item, ...finalData } : item));
        }
      } else {
        result = await supabase.from(tableName).insert([finalData]).select();
        if (result.error) throw result.error;
        
        // Atualizar estado local (novo item)
        const newItem = result.data?.[0];
        if (newItem) {
          if (tableName === 'news') {
            setNews(prev => [newItem, ...prev]);
          } else if (tableName === 'videos') {
            setVideos(prev => [newItem, ...prev]);
          } else if (tableName === 'projects') {
            setProjects(prev => [newItem, ...prev]);
          } else if (tableName === 'security_segments') {
            setSegments(prev => [newItem, ...prev]);
          } else if (tableName === 'site_settings') {
            setSettings(prev => [newItem, ...prev]);
          } else if (tableName === 'drive_links') {
            setLinks(prev => [...prev, newItem]);
          } else if (tableName === 'gallery') {
            setGallery(prev => [newItem, ...prev]);
          } else if (tableName === 'instagram_posts') {
            setInstagramPosts(prev => [newItem, ...prev]);
          }
        }
      }

      setIsEditing(null);
      setFormData({});
    } catch (error: any) {
      console.error("Error saving document", error);
      alert("Erro ao salvar: " + (error.message || "Erro desconhecido"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const tableName = activeTab === 'news' ? 'news' : activeTab === 'videos' ? 'videos' : activeTab === 'segments' ? 'security_segments' : activeTab === 'projects' ? 'projects' : activeTab === 'settings' ? 'site_settings' : activeTab === 'gallery' ? 'gallery' : activeTab === 'instagram' ? 'instagram_posts' : 'drive_links';
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        let error;
        if (tableName === 'site_settings') {
          const res = await supabase.from(tableName).delete().eq('key', id);
          error = res.error;
        } else {
          const res = await supabase.from(tableName).delete().eq('id', id);
          error = res.error;
        }
        if (error) throw error;
        
        // Atualizar estado local
        if (tableName === 'news') {
          setNews(prev => prev.filter(item => item.id !== id));
        } else if (tableName === 'videos') {
          setVideos(prev => prev.filter(item => item.id !== id));
        } else if (tableName === 'projects') {
          setProjects(prev => prev.filter(item => item.id !== id));
        } else if (tableName === 'security_segments') {
          setSegments(prev => prev.filter(item => item.id !== id));
        } else if (tableName === 'site_settings') {
          setSettings(prev => prev.filter(item => item.key !== id));
        } else if (tableName === 'drive_links') {
          setLinks(prev => prev.filter(item => item.id !== id));
        } else if (tableName === 'instagram_posts') {
          setInstagramPosts(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error("Error deleting document", error);
      }
    }
  };

  const handleBulkImport = async () => {
    setBulkImportError(null);
    try {
      const parsed = JSON.parse(bulkImportData);
      if (!Array.isArray(parsed)) {
        setBulkImportError('O dados devem ser um array JSON.');
        return;
      }

      const projectsToImport = parsed.map((item: any) => ({
        title: item.title || item.titulo || '',
        category: item.category || item.categoria || '',
        year: item.year || item.ano || new Date().getFullYear(),
        status: item.status || 'Em Tramitação',
        summary: item.summary || item.resumo || '',
      }));

      const { data, error } = await supabase.from('projects').insert(projectsToImport).select();
      if (error) throw error;

      if (data) {
        setProjects(prev => [...data, ...prev]);
      }

      setIsBulkImportOpen(false);
      setBulkImportData('');
      alert(`${projectsToImport.length} projetos importados com sucesso!`);
    } catch (error: any) {
      setBulkImportError('Erro ao processar JSON: ' + (error.message || 'Formato inválido'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 font-medium text-sm tracking-wide">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#002776] to-slate-900 px-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#005a1a]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#002776]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#005a1a]/10 rounded-full blur-3xl" />

        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl relative z-10">
          <div className="mb-8">
            <img src="/LOGO DIEGO VERDE EXTENSA.png" className="h-20 mx-auto mb-6 drop-shadow-lg" alt="Logo" />
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Painel Admin</h1>
            <p className="text-white/50 text-sm mt-2 font-medium">Acesso restrito para gestão do portal do mandato.</p>
          </div>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2 text-left">E-mail</label>
              <input 
                type="email" placeholder="seu@email.com" required
                className="w-full p-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#005a1a]/50 focus:border-[#005a1a] transition-all"
                value={authEmail} onChange={e => setAuthEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2 text-left">Senha</label>
              <input 
                type="password" placeholder="Sua senha" required
                className="w-full p-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#005a1a]/50 focus:border-[#005a1a] transition-all"
                value={authPassword} onChange={e => setAuthPassword(e.target.value)}
              />
            </div>
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-300 text-sm font-bold">{loginError}</p>
              </div>
            )}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#005a1a] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#004a15] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-900/30 mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#002776] to-[#001a52] text-white flex flex-col shadow-xl relative overflow-hidden">
        {/* Sidebar decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-[#005a1a]/20 rounded-full blur-2xl" />

        <div className="p-6 pb-4 relative z-10">
          <img src="/LOGO DIEGO VERDE EXTENSA.png" className="h-10 mb-3" alt="Logo" />
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Mandato</div>
          <div className="text-xs font-bold text-white/50 uppercase tracking-wider">Diego Castro</div>
        </div>

        <nav className="flex-1 px-3 space-y-1 relative z-10">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'news', label: 'Notícias', icon: <Newspaper size={18} /> },
            { id: 'videos', label: 'Vídeos', icon: <Video size={18} /> },
            { id: 'projects', label: 'Projetos', icon: <LayoutDashboard size={18} /> },
            { id: 'gallery', label: 'Galeria', icon: <Images size={18} /> },
            { id: 'instagram', label: 'Instagram', icon: <Instagram size={18} /> },
            { id: 'segments', label: 'Segmentações', icon: <Shield size={18} /> },
            { id: 'links', label: 'Drive Links', icon: <LinkIcon size={18} /> },
            { id: 'settings', label: 'Config. do Site', icon: <Settings size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsEditing(null); setFormData({}); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-[#002776] shadow-lg shadow-black/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {tab.icon}
              <span className="flex-1 text-left">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 relative z-10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-[#002776] uppercase tracking-tight">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'news' ? 'Notícias' : activeTab === 'videos' ? 'Vídeos' : activeTab === 'projects' ? 'Projetos' : activeTab === 'segments' ? 'Segmentações' : activeTab === 'settings' ? 'Configurações' : activeTab === 'gallery' ? 'Galeria' : activeTab === 'instagram' ? 'Instagram' : 'Drive Links'}
            </h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Gerenciar conteúdo do portal</p>
          </div>
          {/* Na Galeria as fotos entram pelo botão "Enviar fotos": um item criado
              por aqui ficaria sem imagem e a inserção falharia. */}
          {activeTab !== 'gallery' && (
            <button
              onClick={() => { setIsEditing('new'); setFormData({}); }}
              className="bg-[#005a1a] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#004a15] transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={18} /> Adicionar
            </button>
          )}
        </header>

        <div className="p-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#002776] uppercase tracking-tight">Visão Geral</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Todos os contadores do portal</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Newspaper size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#002776]">{news.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notícias</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Video size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#002776]">{videos.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vídeos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <LayoutDashboard size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#002776]">{projects.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projetos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                      <Shield size={20} className="text-violet-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#002776]">{segments.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Segmentos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <LinkIcon size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#002776]">{links.length}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drive Links</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Individual Page Counters */}
          {activeTab === 'gallery' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Images size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#002776]">{gallery.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {gallery.length === 1 ? 'foto na galeria' : 'fotos na galeria'}
                    </p>
                  </div>
                </div>
                <label className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${uploadProgress ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-[#002776] text-white hover:bg-[#001a4d] cursor-pointer'}`}>
                  <Upload size={16} />
                  {uploadProgress || 'Enviar fotos'}
                  {/* .heic/.heif explícitos: no Windows o filtro image/* costuma
                      esconder esses arquivos na janela de seleção. */}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.heic,.heif"
                    multiple
                    disabled={!!uploadProgress}
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600">
                  <strong>Dica:</strong> dá para selecionar várias fotos de uma vez, até 25MB cada.
                  Foto de iPhone (HEIC) é convertida automaticamente, e imagens muito grandes são
                  reduzidas para 2000px — nenhum navegador exibe HEIC, e foto de 4000px deixaria a
                  galeria lenta.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                <Instagram size={24} className="text-pink-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{instagramPosts.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {instagramPosts.length === 1 ? 'post publicado' : 'posts publicados'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Newspaper size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{news.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {news.length === 1 ? 'notícia cadastrada' : 'notícias cadastradas'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Video size={24} className="text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{videos.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {videos.length === 1 ? 'vídeo cadastrado' : 'vídeos cadastrados'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <LayoutDashboard size={24} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-black text-[#002776]">{projects.length}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {projects.length === 1 ? 'projeto cadastrado' : 'projetos cadastrados'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="flex items-center gap-2 bg-[#002776] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#001a4d] transition-all"
              >
                <Upload size={16} /> Importar em Lote
              </button>
            </div>
          )}

          {activeTab === 'segments' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-violet-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{segments.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {segments.length === 1 ? 'segmentação cadastrada' : 'segmentações cadastradas'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <LinkIcon size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{links.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {links.length === 1 ? 'link cadastrado' : 'links cadastrados'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Settings size={24} className="text-slate-500" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#002776]">{settings.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {settings.length === 1 ? 'configuração cadastrada' : 'configurações cadastradas'}
                </p>
              </div>
            </div>
          )}

          {/* Bulk Import Modal */}
          {isBulkImportOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto relative">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#002776] to-[#001a52] px-8 py-6 rounded-t-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      Importar Projetos em Lote
                    </h3>
                    <p className="text-white/40 text-xs font-medium mt-0.5">
                      Cole o JSON com os projetos
                    </p>
                  </div>
                  <button onClick={() => setIsBulkImportOpen(false)} className="text-white/40 hover:text-white transition-colors p-1">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">
                      <strong>Formato esperado:</strong> Array de objetos com: title, category, year, status, summary
                    </p>
                    <pre className="mt-2 text-[10px] text-blue-500 bg-white p-2 rounded-lg overflow-x-auto">
{`[
  {
    "title": "Nome do Projeto",
    "category": "Segurança",
    "year": 2024,
    "status": "Em Tramitação",
    "summary": "Resumo do projeto"
  }
]`}
                    </pre>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">JSON dos Projetos</label>
                    <textarea
                      rows={12}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none font-mono"
                      placeholder='[{"title": "Projeto 1", "category": "Segurança", "year": 2024, "status": "Em Tramitação", "summary": "Resumo"}]'
                      value={bulkImportData}
                      onChange={e => setBulkImportData(e.target.value)}
                    />
                  </div>

                  {bulkImportError && (
                    <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-xs text-red-600 font-medium">{bulkImportError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsBulkImportOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={!bulkImportData.trim()}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#002776] text-white hover:bg-[#001a4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Upload size={16} /> Importar Projetos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto relative">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#002776] to-[#001a52] px-8 py-6 rounded-t-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      {isEditing === 'new' ? 'Novo Item' : 'Editar Item'}
                    </h3>
                    <p className="text-white/40 text-xs font-medium mt-0.5">
                      Preencha os campos abaixo
                    </p>
                  </div>
                  <button onClick={() => setIsEditing(null)} className="text-white/40 hover:text-white transition-colors p-1">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSave} className="p-8 space-y-5">
                  {activeTab === 'news' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Título</label>
                        <input 
                          type="text" placeholder="Título da Notícia" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data</label>
                          <input 
                            type="text" placeholder="18 Mar 2024" required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Categoria</label>
                          <input 
                            type="text" placeholder="Categoria" required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Resumo</label>
                        <textarea 
                          placeholder="Resumo/Lead" required rows={3}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none"
                          value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Imagem de Capa</label>
                        <div className="flex gap-3 items-center">
                          <input 
                            type="url" placeholder="URL da Imagem"
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})}
                          />
                          <label className="cursor-pointer bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center">
                            <Plus size={18} className="text-slate-500" />
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
                          </label>
                        </div>
                        {formData.image && <img src={formData.image} className="h-16 rounded-xl border border-slate-200 object-cover" alt="Preview" />}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Conteúdo Completo (opcional)</label>
                        <textarea 
                          placeholder="Texto completo da notícia (aparece ao clicar em 'Ler mais')" rows={6}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none"
                          value={formData.full_content || ''} onChange={e => setFormData({...formData, full_content: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'videos' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Título</label>
                        <input 
                          type="text" placeholder="Título do Vídeo" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">URL do Vídeo</label>
                        <input 
                          type="url" placeholder="URL do YouTube" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.url || ''} onChange={e => {
                            const url = e.target.value;
                            const videoId = extractYoutubeId(url);
                            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : formData.thumbnail;
                            setFormData({...formData, url, thumbnail});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Thumbnail (Auto-gerada ou Upload)</label>
                        <div className="flex gap-3 items-center">
                          <input 
                            type="url" placeholder="URL da Thumbnail"
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                          />
                          <label className="cursor-pointer bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center">
                            <Plus size={18} className="text-slate-500" />
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'thumbnail')} />
                          </label>
                        </div>
                        {formData.thumbnail && <img src={formData.thumbnail} className="h-16 rounded-xl border border-slate-200 object-cover" alt="Preview" />}
                      </div>
                    </>
                  )}

                  {activeTab === 'segments' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome</label>
                        <input 
                          type="text" placeholder="Nome da Segmentação (ex: Polícia Civil)" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descrição</label>
                        <input 
                          type="text" placeholder="Breve Descrição (ex: Projetos e Lutas)" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Conteúdo</label>
                        <textarea 
                          placeholder="Conteúdo Completo (Aparece na subpágina)" required rows={10}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none"
                          value={formData.full_content || ''} onChange={e => setFormData({...formData, full_content: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Imagem de Fundo</label>
                        <div className="flex gap-3 items-center">
                          <input 
                            type="url" placeholder="URL da Imagem"
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})}
                          />
                          <label className="cursor-pointer bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center">
                            <Plus size={18} className="text-slate-500" />
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
                          </label>
                        </div>
                        {formData.image && <img src={formData.image} className="h-16 rounded-xl border border-slate-200 object-cover" alt="Preview" />}
                      </div>
                    </>
                  )}

                  {activeTab === 'projects' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Título</label>
                        <input 
                          type="text" placeholder="Título do Projeto" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Categoria</label>
                          <input 
                            type="text" placeholder="ex: Segurança" required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ano</label>
                          <input 
                            type="number" placeholder="2024" required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                            value={formData.year || ''} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.status || 'Em Tramitação'} onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="Em Tramitação">Em Tramitação</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Arquivado">Arquivado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Resumo</label>
                        <textarea 
                          placeholder="Resumo do Projeto" required rows={4}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none"
                          value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'links' && (
                    <>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600">Chaves: <strong>releases</strong>, <strong>fotos_alta</strong>, <strong>biografia</strong>, <strong>biblioteca</strong>, <strong>panfletos</strong>, <strong>artes</strong>, <strong>videos_curtos</strong>, <strong>informativos</strong></p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chave</label>
                        <input 
                          type="text" placeholder="ex: releases" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.key || ''} onChange={e => setFormData({...formData, key: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">URL do Google Drive</label>
                        <input 
                          type="url" placeholder="URL do Google Drive" required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'gallery' && (
                    <>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-blue-600">
                          <strong>Dica:</strong> para adicionar fotos novas use o botão <strong>Enviar fotos</strong> lá em cima.
                          Este formulário serve para ajustar a legenda e a ordem de uma foto já enviada.
                        </p>
                      </div>
                      {formData.image_url && (
                        <img
                          src={formData.image_url}
                          className="h-40 w-auto max-w-full rounded-xl border border-slate-200 object-contain mb-4"
                          alt="Foto da galeria"
                        />
                      )}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Legenda</label>
                        <input
                          type="text" placeholder="Ex: Visita ao Hospital Regional de Feira de Santana"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ordem de exibição</label>
                        <input
                          type="number" placeholder="0"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.sort_order ?? 0} onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">Menor número aparece primeiro.</p>
                      </div>
                    </>
                  )}

                  {activeTab === 'instagram' && (
                    <>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-blue-600">
                          <strong>Como pegar o link:</strong> abra o post no Instagram, toque nos três pontinhos
                          e escolha <strong>Copiar link</strong>. Cole aqui embaixo. Funciona com post, reel e vídeo.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">URL do post</label>
                        <input
                          type="url" required placeholder="https://www.instagram.com/p/ABC123/"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.post_url || ''} onChange={e => setFormData({ ...formData, post_url: e.target.value })}
                        />
                        {formData.post_url && (
                          extractInstagramShortcode(formData.post_url)
                            ? <p className="text-xs text-emerald-600 font-bold mt-1.5">Link válido — post {extractInstagramShortcode(formData.post_url)}</p>
                            : <p className="text-xs text-red-500 font-bold mt-1.5">Não parece um link de post do Instagram.</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descrição interna (opcional)</label>
                        <input
                          type="text" placeholder="Só para você identificar na lista"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.caption || ''} onChange={e => setFormData({ ...formData, caption: e.target.value })}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">A legenda que aparece no site vem do próprio Instagram, sempre atualizada.</p>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ordem de exibição</label>
                        <input
                          type="number" placeholder="0"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                          value={formData.sort_order ?? 0} onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'settings' && (
                    <>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-blue-600"><strong>Dica:</strong> Altere os valores abaixo. Se for texto, pode colar normalmente. Se for imagem, cole o link da imagem.</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Configuração</label>
                        <input 
                          type="text" placeholder="ex: hero_title" required disabled={!!isEditing}
                          className={`w-full p-3 border rounded-xl text-sm font-bold transition-all ${isEditing ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]'}`}
                          value={isEditing && SETTING_LABELS[formData.key]?.label ? SETTING_LABELS[formData.key].label : (formData.key || '')} 
                          onChange={e => !isEditing && setFormData({...formData, key: e.target.value})}
                        />
                        {isEditing && SETTING_LABELS[formData.key] && (
                          <p className="text-xs text-slate-500 mt-1.5">{SETTING_LABELS[formData.key].desc}</p>
                        )}
                      </div>
                      {formData.key?.includes('image') ? (
                        <div className="space-y-2 mt-4">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Conteúdo / Valor (Imagem)</label>
                          <div className="flex gap-3 items-center">
                            <input 
                              type="url" placeholder="URL da Imagem ou faça o upload"
                              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all"
                              value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})}
                            />
                            <label className="cursor-pointer bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center">
                              <Plus size={18} className="text-slate-500" />
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'value')} />
                            </label>
                          </div>
                          {formData.value && (
                            <div className="mt-3">
                              <img 
                                src={formData.value} 
                                className="h-32 w-auto max-w-full rounded-xl border border-slate-200 object-cover" 
                                alt="Preview"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Imagem+N%C3%A3o+Encontrada';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 mt-4">Conteúdo / Valor</label>
                          <textarea 
                            placeholder="Texto ou URL da imagem" required rows={5}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] transition-all resize-none"
                            value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isSaving ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#002776] hover:bg-[#005a1a] text-white shadow-lg shadow-[#002776]/20'}`}
                    >
                      {isSaving ? (
                        <>Aguarde...</>
                      ) : (
                        <><Save size={18} /> Salvar</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Content Card - Only show when not on Dashboard */}
          {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 scroll-mt-24" id="form-container">
            {/* List View */}
            {activeTab === 'news' && news.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <img src={item.image} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-[#005a1a] uppercase bg-emerald-50 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'videos' && videos.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <img src={item.thumbnail} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.url}</p>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'gallery' && gallery.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <GalleryThumb url={item.image_url} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.title || 'Sem legenda'}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">Ordem: {item.sort_order ?? 0}</p>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleGalleryDelete(item)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'gallery' && gallery.length === 0 && (
              <div className="px-6 py-16 text-center text-slate-400 font-medium text-sm">
                Nenhuma foto ainda. Use o botão <strong>Enviar fotos</strong> acima para começar.
              </div>
            )}

            {activeTab === 'instagram' && instagramPosts.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.caption || `Post ${item.shortcode}`}</h4>
                  <a href={item.post_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-[#002776] font-medium truncate mt-0.5 block">{item.post_url}</a>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'instagram' && instagramPosts.length === 0 && (
              <div className="px-6 py-16 text-center text-slate-400 font-medium text-sm">
                Nenhum post ainda. Clique em <strong>Adicionar</strong> e cole o link de um post do Instagram.
              </div>
            )}

            {activeTab === 'segments' && segments.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <img src={item.image || '/fotos-diego/diego-3.jpeg'} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.description}</p>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'projects' && projects.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <div className="w-12 h-12 bg-[#005a1a]/10 text-[#005a1a] rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">{item.year}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776] truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-[#005a1a] uppercase bg-emerald-50 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-full">{item.status}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'links' && links.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"><LinkIcon size={18} /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002776]">{item.key}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.url}</p>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.id); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {Object.entries((() => {
                  const mergedSettings = [...settings];
                  const existingKeys = new Set(settings.map(s => s.key));
                  Object.keys(SETTING_LABELS).forEach(key => {
                    if (!existingKeys.has(key)) {
                      mergedSettings.push({
                        key,
                        value: '',
                        description: SETTING_LABELS[key].desc
                      });
                    }
                  });
                  return mergedSettings;
                })().reduce((acc, item) => {
                  const section = SETTING_LABELS[item.key]?.section || 'Outras Configurações';
                  if (!acc[section]) acc[section] = [];
                  acc[section].push(item);
                  return acc;
                }, {} as Record<string, any[]>)).map(([sectionName, sectionItems]) => (
                  <div key={sectionName} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200">
                      <h3 className="text-sm font-black text-[#002776] uppercase tracking-wider flex items-center gap-2">
                        <LayoutDashboard size={16} className="text-[#002776]/60" />
                        {sectionName}
                      </h3>
                    </div>
                    <div>
                      {sectionItems.map(item => (
                        <div key={item.key} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                          <SettingThumb settingKey={item.key} value={item.value} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-[#002776]">
                              {SETTING_LABELS[item.key]?.label || item.key}
                            </h4>
                            {SETTING_LABELS[item.key]?.desc && (
                              <p className="text-xs text-slate-500 mt-0.5 mb-1">{SETTING_LABELS[item.key].desc}</p>
                            )}
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.value}</p>
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsEditing(item.key); setFormData(item); }} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(item.key)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
