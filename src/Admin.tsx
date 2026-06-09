import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, 
  Newspaper, Video, Link as LinkIcon, ExternalLink,
  ChevronRight, LayoutDashboard, Settings, Shield
} from 'lucide-react';

const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'videos' | 'links' | 'segments'>('news');
  
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

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
      if (linksData) setLinks(linksData);

      const { data: segmentsData } = await supabase.from('security_segments').select('*');
      if (segmentsData) setSegments(segmentsData);

      const { data: projectsData } = await supabase.from('projects').select('*').order('year', { ascending: false });
      if (projectsData) setProjects(projectsData);
    };

    fetchData();

    const newsSub = supabase.channel('news-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchData).subscribe();
    const videosSub = supabase.channel('videos-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, fetchData).subscribe();
    const linksSub = supabase.channel('links-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'drive_links' }, fetchData).subscribe();
    const segmentsSub = supabase.channel('segments-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'security_segments' }, fetchData).subscribe();
    const projectsSub = supabase.channel('projects-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(newsSub);
      supabase.removeChannel(videosSub);
      supabase.removeChannel(linksSub);
      supabase.removeChannel(segmentsSub);
      supabase.removeChannel(projectsSub);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    const tableName = activeTab === 'news' ? 'news' : activeTab === 'videos' ? 'videos' : activeTab === 'segments' ? 'security_segments' : activeTab === 'projects' ? 'projects' : 'drive_links';
    
    let finalData = { ...formData };
    
    if (activeTab === 'videos' && finalData.url && !finalData.thumbnail) {
      const videoId = extractYoutubeId(finalData.url);
      if (videoId) {
        finalData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    try {
      const { error } = isEditing && isEditing !== 'new'
        ? await supabase.from(tableName).update(finalData).eq('id', isEditing)
        : await supabase.from(tableName).insert([finalData]);

      if (error) throw error;

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
    const tableName = activeTab === 'news' ? 'news' : activeTab === 'videos' ? 'videos' : activeTab === 'segments' ? 'security_segments' : activeTab === 'projects' ? 'projects' : 'drive_links';
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await supabase.from(tableName).delete().eq('id', id);
      } catch (error) {
        console.error("Error deleting document", error);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl">
          <img src="/logo diego castro verde.png" className="h-24 mx-auto mb-8" alt="Logo" />
          <h1 className="text-3xl font-black text-[#002776] mb-4 uppercase">Painel Admin</h1>
          <p className="text-slate-500 mb-10">Acesso restrito para gestão do portal do mandato.</p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input 
              type="email" placeholder="E-mail" required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
              value={authEmail} onChange={e => setAuthEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Senha" required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
              value={authPassword} onChange={e => setAuthPassword(e.target.value)}
            />
            {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#005a1a] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#004a15] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#002776] text-white p-8 flex flex-col">
        <div className="mb-12">
          <img src="/logo diego castro.png" className="h-16" alt="Logo" />
          <div className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest">Mandato Diego Castro</div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'news', label: 'Notícias', icon: <Newspaper size={20} /> },
            { id: 'videos', label: 'Vídeos', icon: <Video size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsEditing(null); setFormData({}); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#002776]' : 'hover:bg-white/10 text-white/60'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
            <button 
              onClick={() => { setActiveTab('projects'); setIsEditing(null); setFormData({}); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'projects' ? 'bg-white text-[#002776]' : 'hover:bg-white/10 text-white/60'}`}
            >
              <LayoutDashboard size={20} /> Projetos
            </button>
            <button 
              onClick={() => { setActiveTab('segments'); setIsEditing(null); setFormData({}); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'segments' ? 'bg-white text-[#002776]' : 'hover:bg-white/10 text-white/60'}`}
            >
              <Shield size={20} /> Segurança
            </button>
            <button 
              onClick={() => { setActiveTab('links'); setIsEditing(null); setFormData({}); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'links' ? 'bg-white text-[#002776]' : 'hover:bg-white/10 text-white/60'}`}
            >
              <LinkIcon size={20} /> Drive Links
            </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 p-4 text-white/60 hover:text-white font-bold transition-all"
        >
          <LogOut size={20} /> Sair do Painel
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#002776] uppercase tracking-tight">
              Gerenciar {activeTab === 'news' ? 'Notícias' : activeTab === 'videos' ? 'Vídeos' : activeTab === 'projects' ? 'Projetos' : activeTab === 'segments' ? 'Segmentações' : 'Links'}
            </h2>
            <p className="text-slate-400 font-medium">Atualize o conteúdo do portal em tempo real.</p>
          </div>
            <button 
            onClick={() => { setIsEditing('new'); setFormData({}); }}
            className="bg-[#005a1a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#004a15] transition-all shadow-xl shadow-emerald-100"
          >
            <Plus size={24} /> Adicionar {activeTab === 'news' ? 'Notícia' : activeTab === 'videos' ? 'Vídeo' : activeTab === 'projects' ? 'Projeto' : 'Link'}
          </button>
        </header>

        {/* Form Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-h-[95vh] overflow-y-auto relative">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-[#002776] uppercase">
                  {isEditing === 'new' ? 'Novo Item' : 'Editar Item'}
                </h3>
                <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={32} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {activeTab === 'news' && (
                  <>
                    <input 
                      type="text" placeholder="Título da Notícia" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Data (ex: 18 Mar 2024)" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                        value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Categoria" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                        value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}
                      />
                    </div>
                    <textarea 
                      placeholder="Resumo/Lead" required rows={3}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Imagem de Capa</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="url" placeholder="URL da Imagem"
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                          value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})}
                        />
                        <label className="cursor-pointer bg-slate-100 p-4 rounded-xl hover:bg-slate-200 transition-all">
                          <Plus size={20} />
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
                        </label>
                      </div>
                      {formData.image && <img src={formData.image} className="h-20 rounded-xl border" alt="Preview" />}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Conteúdo Completo (opcional)</label>
                      <textarea 
                        placeholder="Texto completo da notícia (aparece ao clicar em 'Ler mais')" rows={6}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                        value={formData.full_content || ''} onChange={e => setFormData({...formData, full_content: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'videos' && (
                  <>
                    <input 
                      type="text" placeholder="Título do Vídeo" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                    <input 
                      type="url" placeholder="URL do Vídeo (YouTube)" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.url || ''} onChange={e => {
                        const url = e.target.value;
                        const videoId = extractYoutubeId(url);
                        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : formData.thumbnail;
                        setFormData({...formData, url, thumbnail});
                      }}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Thumbnail (Auto-gerada ou Upload)</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="url" placeholder="URL da Thumbnail"
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                          value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                        />
                        <label className="cursor-pointer bg-slate-100 p-4 rounded-xl hover:bg-slate-200 transition-all">
                          <Plus size={20} />
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'thumbnail')} />
                        </label>
                      </div>
                      {formData.thumbnail && <img src={formData.thumbnail} className="h-20 rounded-xl border" alt="Preview" />}
                    </div>
                  </>
                )}

                {activeTab === 'segments' && (
                  <>
                    <input 
                      type="text" placeholder="Nome da Segmentação (ex: Polícia Civil)" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Breve Descrição (ex: Projetos e Lutas)" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    <textarea 
                      placeholder="Conteúdo Completo (Aparece na subpágina)" required rows={10}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.full_content || ''} onChange={e => setFormData({...formData, full_content: e.target.value})}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Imagem de Fundo</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="url" placeholder="URL da Imagem"
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                          value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})}
                        />
                        <label className="cursor-pointer bg-slate-100 p-4 rounded-xl hover:bg-slate-200 transition-all">
                          <Plus size={20} />
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
                        </label>
                      </div>
                      {formData.image && <img src={formData.image} className="h-20 rounded-xl border" alt="Preview" />}
                    </div>
                  </>
                )}

                {activeTab === 'projects' && (
                  <>
                    <input 
                      type="text" placeholder="Título do Projeto" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Categoria (ex: Segurança)" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                        value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}
                      />
                      <input 
                        type="number" placeholder="Ano (ex: 2024)" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                        value={formData.year || ''} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                      />
                    </div>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.status || 'Em Tramitação'} onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Em Tramitação">Em Tramitação</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Arquivado">Arquivado</option>
                    </select>
                    <textarea 
                      placeholder="Resumo do Projeto" required rows={4}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})}
                    />
                  </>
                )}

                {activeTab === 'links' && (
                  <>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                      <p className="text-sm text-slate-500">Chaves disponíveis: <strong>releases</strong>, <strong>fotos_alta</strong>, <strong>biografia</strong>, <strong>biblioteca</strong>, <strong>panfletos</strong>, <strong>artes</strong>, <strong>videos_curtos</strong>, <strong>informativos</strong></p>
                    </div>
                    <input 
                      type="text" placeholder="Chave (ex: releases)" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.key || ''} onChange={e => setFormData({...formData, key: e.target.value})}
                    />
                    <input 
                      type="url" placeholder="URL do Google Drive" required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})}
                    />
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#002776] hover:bg-[#005a1a]'} text-white`}
                >
                  {isSaving ? (
                    <>Aguarde... Salvando...</>
                  ) : (
                    <><Save size={24} /> Salvar Alterações</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List View */}
        <div className="grid gap-6">
          {activeTab === 'news' && news.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all">
              <img src={item.image} className="w-32 h-24 object-cover rounded-xl" alt="" />
              <div className="flex-1">
                <div className="text-xs font-bold text-[#005a1a] uppercase mb-1">{item.category} • {item.date}</div>
                <h4 className="text-xl font-bold text-[#002776]">{item.title}</h4>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'videos' && videos.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all">
              <img src={item.thumbnail} className="w-32 h-24 object-cover rounded-xl" alt="" />
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#002776]">{item.title}</h4>
                <div className="text-xs text-slate-400 font-medium truncate max-w-xs">{item.url}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'segments' && segments.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all">
              <img src={item.image || '/fotos-diego/diego-3.jpeg'} className="w-32 h-24 object-cover rounded-xl" alt="" />
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#002776]">{item.name}</h4>
                <div className="text-sm text-slate-400 font-medium truncate max-w-xs">{item.description}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'projects' && projects.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-[#005a1a]/10 text-[#005a1a] rounded-xl flex items-center justify-center font-bold">{item.year}</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#005a1a] uppercase mb-1">{item.category} • {item.status}</div>
                <h4 className="text-xl font-bold text-[#002776]">{item.title}</h4>
                <div className="text-sm text-slate-400 font-medium truncate max-w-md">{item.summary}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'links' && links.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><LinkIcon size={24} /></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#002776]">{item.key}</h4>
                <div className="text-xs text-slate-400 font-medium truncate max-w-xs">{item.url}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#002776] hover:text-white transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Admin;
