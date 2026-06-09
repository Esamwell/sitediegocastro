/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Users, Heart, Flag, BookOpen, Briefcase,
  MapPin, Calendar, Play, ChevronRight, Menu, X,
  Instagram, Twitter, Facebook, MessageCircle,
  FileText, Download, Newspaper, Info, Phone, Mail,
  ArrowRight, CheckCircle2, Search, TrendingUp, ArrowLeft
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { supabase } from './src/supabaseClient';
import PatrioticBackground from './components/PatrioticBackground';
import ImpactText from './components/ImpactText';
import CustomCursor from './components/CustomCursor';
import MandateCard from './components/MandateCard';
import Admin from './src/Admin';
import HistoriaPage from './components/HistoriaPage';
import { Project, News, Video, SecuritySegment } from './types';

// Mock Data

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<HistoriaPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/seguranca/:id" element={<SecuritySegmentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [securitySegments, setSecuritySegments] = useState<SecuritySegment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [driveLinks, setDriveLinks] = useState<Record<string, string>>({});

  const { scrollYProgress } = useScroll();
  const opacity = useScroll(); // Placeholder for scroll logic if needed

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // News
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      // Videos
      const { data: videosData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (videosData) setVideos(videosData);

      // Drive Links
      const { data: linksData } = await supabase.from('drive_links').select('*');
      if (linksData) {
        const links: Record<string, string> = {};
        linksData.forEach(d => { links[d.key] = d.url; });
        setDriveLinks(links);
      }

      // Security Segments
      const { data: segmentsData } = await supabase.from('security_segments').select('*');
      if (segmentsData) setSecuritySegments(segmentsData);

      // Projects
      const { data: projectsData } = await supabase.from('projects').select('*').order('year', { ascending: false });
      if (projectsData) setProjects(projectsData);
    };

    fetchData();

    // Subscriptions for real-time updates
    const newsSub = supabase.channel('news-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchData).subscribe();
    const videosSub = supabase.channel('videos-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, fetchData).subscribe();
    const linksSub = supabase.channel('links-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'drive_links' }, fetchData).subscribe();
    const segmentsSub = supabase.channel('segments-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'security_segments' }, fetchData).subscribe();
    const projectsSub = supabase.channel('projects-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(newsSub);
      supabase.removeChannel(videosSub);
      supabase.removeChannel(linksSub);
      supabase.removeChannel(segmentsSub);
      supabase.removeChannel(projectsSub);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const defaultDriveLinks: Record<string, string> = {
    artes: 'https://drive.google.com/drive/folders/1e7G0uY712o1cZkH1TZ1E7MC0rxRJ44wQ?usp=sharing',
    informativos: 'https://drive.google.com/drive/folders/192oDLOEbIsaUQlnxAtDDM2YFBufW7MG2?usp=drive_link',
    panfletos: 'https://drive.google.com/drive/folders/1BN7G53mMWVYPI310Cqn7NgvwJ4PL2G8C?usp=drive_link',
  };
  const getDriveLink = (key: string, defaultUrl: string = '#') => driveLinks[key] || defaultDriveLinks[key] || defaultUrl;

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <PatrioticBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => scrollToSection('início')} className="hover:opacity-80 transition-opacity">
              <img
                src="/logo diego castro verde.png"
                alt="Diego Castro"
                className="h-20 w-auto"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Início', 'Quem é', 'Mandato', 'Bahia', 'Segurança', 'Notícias', 'Bolsonaro', 'Imprensa', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-[10px] font-bold text-slate-600 hover:text-[#002776] transition-colors uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contato')}
              className="bg-[#005a1a] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#004a15] transition-all shadow-lg shadow-emerald-200"
            >
              Fale Conosco
            </button>
          </div>

          <button className="lg:hidden text-[#002776]" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center">
                <img
                  src="/logo diego castro verde.png"
                  alt="Diego Castro"
                  className="h-16 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-900">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {['Início', 'Quem é', 'Mandato', 'Bahia', 'Segurança', 'Notícias', 'Bolsonaro', 'Imprensa', 'Contato'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-2xl font-heading font-black text-[#002776] text-left uppercase"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-12 border-t border-slate-100 flex gap-6">
              <a href="https://www.instagram.com/diegocastroba/" target="_blank" rel="noopener noreferrer"><Instagram className="text-[#002776]" /></a>
              <a href="https://x.com/diegocastroba" target="_blank" rel="noopener noreferrer"><Twitter className="text-[#002776]" /></a>
              <a href="https://www.facebook.com/DiegoCastroBA/" target="_blank" rel="noopener noreferrer"><Facebook className="text-[#002776]" /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="início" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffdf00]/20 rounded-full mb-6">
              <TrendingUp size={16} className="text-[#002776]" />
              <span className="text-xs font-bold text-[#002776] uppercase tracking-widest">Compromisso com a Bahia</span>
            </div>
            <h1 className="text-5xl lg:text-8xl font-heading font-black text-[#002776] leading-[0.9] mb-8">
              DEFESA DA <span className="text-[#005a1a]">BAHIA</span>, VALORES DA <span className="text-[#002776]">FAMÍLIA</span>.
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
              Recordista de Projetos de Lei e o deputado que mais investe na Segurança Pública da Bahia. Diego Castro é o guardião dos valores conservadores na ALBA.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#002776] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#001a4d] transition-all shadow-xl shadow-blue-200 flex items-center gap-2">
                Conheça o Mandato <ArrowRight size={20} />
              </button>
              <button className="bg-white text-[#002776] border-2 border-[#002776] px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Ver Projetos
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#005a1a] to-[#002776] rounded-3xl rotate-6 opacity-10" />
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden -rotate-3 border-4 border-white">
                <img
                  src="/fotos-diego/diego-1.jpeg"
                  alt="Diego Castro"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#ffdf00] p-6 rounded-2xl shadow-xl border-4 border-white rotate-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#002776]">100%</div>
                  <div className="text-[10px] font-bold text-[#002776] uppercase tracking-tighter">Fiel aos Valores</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="bg-[#002776] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Projetos de Lei', value: 'Recordista' },
            { label: 'Cidades Visitadas', value: '200+' },
            { label: 'Emendas Segurança', value: 'R$ 2,5M' },
            { label: 'Fiscalizações', value: '80+' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl lg:text-5xl font-heading font-black text-[#ffdf00] mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm font-bold text-white/60 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUEM É DIEGO */}
      <section id="quem-é" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <ImpactText text="QUEM É DIEGO CASTRO" color="blue" className="text-4xl lg:text-6xl mb-8" />
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Conservador baiano, advogado e cristão, Diego Castro é o atual Presidente da Comissão de Direitos Humanos e Segurança Pública da Assembleia Legislativa da Bahia.
                </p>
                <p>
                  Fiel defensor das bandeiras do ex-presidente Jair Bolsonaro, Diego pauta seu mandato na defesa intransigente da vida, da família e da liberdade religiosa, sendo a voz da direita na Bahia.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {[
                    { icon: <Shield size={20} />, text: 'Segurança Pública' },
                    { icon: <Heart size={20} />, text: 'Família e Vida' },
                    { icon: <Users size={20} />, text: 'Fé e Liberdade' },
                    { icon: <Flag size={20} />, text: 'Agro e Propriedade' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="text-[#005a1a]">{item.icon}</div>
                      <span className="font-bold text-slate-700 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/historia"
                  className="inline-flex items-center gap-2 bg-[#002776] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#001a4d] transition-all shadow-xl shadow-blue-200 mt-8"
                >
                  Conheça minha história <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <img
                src="/fotos-diego/diego-2.jpeg"
                className="rounded-3xl shadow-2xl"
                alt="Trajetória"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brazil-green/10 rounded-full blur-3xl" />

              {/* Timeline Overlay */}
              <div className="mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h4 className="text-[#002776] font-black text-xl mb-6 uppercase tracking-tight">TRAJETÓRIA</h4>
                <div className="space-y-6">
                  {[
                    { year: '2018', event: 'Fundação do Movimento Conservador na Bahia' },
                    { year: '2020', event: 'Destaque na defesa da liberdade durante a pandemia' },
                    { year: '2022', event: 'Eleito Deputado Estadual com votação expressiva' },
                    { year: '2023', event: 'Presidente da Comissão de Segurança Pública' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="font-black text-[#005a1a] text-sm shrink-0">{item.year}</div>
                      <div className="text-slate-600 text-sm font-medium">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANDATO - PROJETOS */}
      <section id="mandato" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-[#005a1a] font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Ações Legislativas</span>
              <ImpactText text="MANDATO PELA BAHIA" color="blue" className="text-4xl lg:text-6xl" />
              <p className="mt-4 text-slate-600 max-w-2xl">
                Recordista de Projetos de Lei na Assembleia Legislativa da Bahia. Atuamos com transparência e coragem em defesa dos interesses do povo baiano.
              </p>
            </div>
            <button
              onClick={() => setIsProjectsModalOpen(true)}
              className="flex items-center gap-2 text-[#002776] font-bold hover:gap-4 transition-all"
            >
              Ver todos os projetos <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.slice(0, 4).map((project) => (
              <MandateCard key={project.id} item={project} type="project" onProjectClick={setSelectedProject} />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 font-medium">Nenhum projeto cadastrado.</div>
            )}
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#005a1a]/10 rounded-2xl flex items-center justify-center text-[#005a1a] shrink-0">
                <Flag size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3 uppercase tracking-tight">CPI do MST e Invasão Zero</h3>
                <p className="text-slate-600 leading-relaxed">
                  Único deputado estadual presente nas diligências da CPI do MST na Bahia. Alinhado ao movimento Invasão Zero em defesa intransigente da propriedade privada e do agronegócio baiano.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#002776]/10 rounded-2xl flex items-center justify-center text-[#002776] shrink-0">
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3 uppercase tracking-tight">Liberdade Econômica</h3>
                <p className="text-slate-600 leading-relaxed">
                  Autor do Marco Estadual da Liberdade Econômica. Defensor da redução do ICMS e da desburocratização para quem produz e gera empregos na nossa Bahia.
                </p>
              </div>
            </div>
          </div>

          {/* EMENDAS E FISCALIZAÇÃO */}
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <div className="bg-[#002776] p-10 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-3xl font-heading font-black mb-6 uppercase">Emendas Parlamentares</h3>
                <div className="space-y-4 mb-8">
                  {[
                    { area: 'Segurança Pública', val: 'R$ 2.450.000' },
                    { area: 'Saúde', val: 'R$ 1.200.000' },
                    { area: 'Educação', val: 'R$ 850.000' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-white/60 font-bold uppercase text-xs tracking-widest">{item.area}</span>
                      <span className="text-[#ffdf00] font-black text-xl">{item.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  Recursos destinados diretamente para as cidades baianas, com foco em viaturas, equipamentos médicos e melhorias em escolas.
                </p>
                <button className="bg-white text-[#002776] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#ffdf00] transition-all">
                  Ver Mapa de Ações
                </button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-heading font-black text-[#002776] mb-6 uppercase">Fiscalização e Denúncias</h3>
                <div className="space-y-6 mb-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                      <Search size={20} />
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Fiscalização rigorosa em hospitais regionais e obras paralisadas pelo governo estadual.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                      <Info size={20} />
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Denúncia de irregularidades na gestão de recursos da segurança pública e sistema prisional.</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-red-600 mb-8">
                  <p className="text-slate-900 font-bold italic">"O deputado que não fiscaliza, não representa. Meu compromisso é com a verdade e com o dinheiro do povo."</p>
                </div>
                <button className="bg-[#002776] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#001a4d] transition-all">
                  Relatório de Fiscalização
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEGURANÇA PÚBLICA - DESTAQUE */}
      <section id="segurança" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#002776] z-0">
          <img
            src="/fotos-diego/diego-3.jpeg"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Segurança"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-6xl font-heading font-black text-white mb-8 leading-tight">
              SEGURANÇA PÚBLICA É A NOSSA <span className="text-[#ffdf00]">PRIORIDADE</span>.
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Como Presidente da Comissão de Segurança, Diego destinou quase R$ 2,5 milhões para viaturas, armamentos e tecnologia. Luta pela blindagem da frota e pelo Sistema de Apoio à Vítima (SAV).
            </p>

            <div className="mt-8">
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="bg-[#ffdf00] text-[#002776] px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                Saiba Mais <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DEFESA DA FAMÍLIA E DA FÉ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="/fotos-diego/diego-4.jpeg"
                className="rounded-3xl shadow-2xl"
                alt="Família e Fé"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffdf00]/10 rounded-full blur-3xl" />
            </div>
            <div>
              <ImpactText text="FAMÍLIA E FÉ" color="blue" className="text-4xl lg:text-6xl mb-8" />
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#005a1a]/10 rounded-xl flex items-center justify-center text-[#005a1a] shrink-0">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">Defesa da Vida</h3>
                    <p className="text-slate-600">Autor do PL 25.250/2025, que institui o Dia Estadual Contra o Aborto. Atuamos contra a ideologia de gênero e pela proteção da infância nas escolas.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#002776]/10 rounded-xl flex items-center justify-center text-[#002776] shrink-0">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">Estatuto da Liberdade Cristã</h3>
                    <p className="text-slate-600">Garantia de liberdade de culto e proteção aos templos. Diego Castro é o anteparo contra projetos que ferem a liberdade religiosa na Bahia.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#ffdf00]/10 rounded-xl flex items-center justify-center text-[#002776] shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">Proteção da Juventude</h3>
                    <p className="text-slate-600">Lei n° 14.862/2025: Seminários antidrogas em escolas estaduais. Proibição de músicas com apologia ao crime em ambiente escolar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEFESA DO AGRO E PROPRIEDADE */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <ImpactText text="AGRO E PROPRIEDADE" color="blue" className="text-4xl lg:text-6xl mb-8" />
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#005a1a]/10 rounded-xl flex items-center justify-center text-[#005a1a] shrink-0">
                    <Flag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">Invasão Zero</h3>
                    <p className="text-slate-600">Alinhado ao movimento Invasão Zero, Diego Castro defende o direito sagrado à propriedade privada e combate as invasões de terra na Bahia.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#002776]/10 rounded-xl flex items-center justify-center text-[#002776] shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">CPI do MST</h3>
                    <p className="text-slate-600">Único deputado estadual da Bahia a participar ativamente das diligências da CPI do MST, fiscalizando e denunciando abusos no campo.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#ffdf00]/10 rounded-xl flex items-center justify-center text-[#002776] shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002776] mb-2">Liberdade Econômica</h3>
                    <p className="text-slate-600">Autor do Marco Estadual da Liberdade Econômica. Trabalhamos pela redução do ICMS e pelo fim da burocracia estatal.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <img
                src="/fotos-diego/diego-5.jpeg"
                className="rounded-3xl shadow-2xl"
                alt="Agronegócio"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIEGO E BOLSONARO */}
      <section id="bolsonaro" className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <img
            src="/fotos-diego/bolsonaro.jpg"
            className="w-full h-full object-cover"
            alt="Bolsonaro"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffdf00]/20 rounded-full mb-6">
              <Flag size={16} className="text-[#ffdf00]" />
              <span className="text-xs font-bold text-[#ffdf00] uppercase tracking-widest">Alinhamento Total</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-heading font-black text-white mb-8 leading-tight">
              DIEGO CASTRO E <span className="text-[#ffdf00]">BOLSONARO</span>
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              O representante oficial das pautas conservadoras de Jair Bolsonaro na Bahia. Defesa da liberdade, da pátria e dos valores cristãos em cada ação do mandato.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[#ffdf00] font-black text-2xl mb-2">100%</div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Lealdade às Pautas</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[#ffdf00] font-black text-2xl mb-2">BAHIA</div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Voz da Direita</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* DIEGO PELA BAHIA */}
      <section id="bahia" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ImpactText text="DIEGO PELA BAHIA" color="blue" className="text-4xl lg:text-6xl mb-4" />
            <p className="text-slate-500 font-medium">Presença constante em todas as regiões do nosso estado</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-8">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-[#002776] font-black text-xl mb-4 uppercase">Agenda no Interior</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Mais de 200 cidades visitadas. Diego Castro não fica apenas no gabinete; ele percorre a Bahia para ouvir as demandas reais da população.
                </p>
                <div className="flex items-center gap-3 text-[#005a1a] font-bold text-sm">
                  <MapPin size={18} /> <span>Oeste, Norte, Sul e Recôncavo</span>
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-[#002776] font-black text-xl mb-4 uppercase">Encontro com Lideranças</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Fortalecimento da base conservadora em cada município, unindo forças para transformar a realidade da Bahia.
                </p>
                <div className="flex items-center gap-3 text-[#005a1a] font-bold text-sm">
                  <Users size={18} /> <span>União e Propósito</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 relative aspect-[4/3] bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
              <img
                src="/fotos-diego/diego-6.jpeg"
                className="w-full h-full object-cover opacity-80"
                alt="Mapa Bahia"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002776]/80 to-transparent flex items-end p-12">
                <div className="text-white">
                  <div className="text-5xl font-black mb-2">200+</div>
                  <div className="text-sm font-bold uppercase tracking-[0.3em]">Cidades Atendidas</div>
                </div>
              </div>
              {/* Interactive Map Placeholder */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-[#ffdf00] rounded-full animate-ping" />
                <div className="w-4 h-4 bg-[#ffdf00] rounded-full absolute top-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section id="notícias" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <ImpactText text="ÚLTIMAS NOTÍCIAS" color="blue" className="text-4xl lg:text-6xl mb-4" />
              <p className="text-slate-500 font-medium">Acompanhe o dia a dia do deputado Diego Castro</p>
            </div>
            {news.length > 3 && (
              <button
                onClick={() => {
                  const el = document.getElementById('notícias');
                  if (el) {
                    const allNews = [...news];
                    setNews(allNews);
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 text-[#002776] font-bold hover:gap-4 transition-all whitespace-nowrap"
              >
                Ver todas as notícias <ArrowRight size={20} />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.length > 0 ? news.slice(0, 6).map((item) => (
              <MandateCard key={item.id} item={item} type="news" onNewsClick={setSelectedNews} />
            )) : (
              <div className="col-span-3 text-center py-12 text-slate-400 font-medium">Nenhuma notícia cadastrada.</div>
            )}
          </div>
        </div>
      </section>

      {/* VÍDEOS */}
      <section id="vídeos" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black">VÍDEOS RECENTES</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {videos.length > 0 ? videos.map((video) => (
              <div key={video.id} className="group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-[#ffdf00] rounded-full flex items-center justify-center text-[#002776]">
                      <Play fill="currentColor" size={24} />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-[#ffdf00] transition-colors">
                  {video.title}
                </h3>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-white/40 font-medium">Nenhum vídeo cadastrado.</div>
            )}
          </div>
        </div>
      </section>


      {/* IMPRENSA E ARQUIVOS */}
      <section id="imprensa" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ImpactText text="ÁREA DA IMPRENSA" color="blue" className="text-4xl lg:text-5xl mb-8" />
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Espaço dedicado a jornalistas e veículos de comunicação. Aqui você encontra releases, fotos oficiais em alta resolução e contatos da assessoria.
                </p>
                <div className="space-y-4">
                  <a href={getDriveLink('releases')} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                    <span className="font-bold text-slate-700">Releases Oficiais</span>
                    <Download size={20} className="text-[#002776] group-hover:translate-y-1 transition-transform" />
                  </a>
                  <a href={getDriveLink('fotos_alta')} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                    <span className="font-bold text-slate-700">Fotos em Alta Resolução</span>
                    <Download size={20} className="text-[#002776] group-hover:translate-y-1 transition-transform" />
                  </a>
                  <a href={getDriveLink('biografia')} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                    <span className="font-bold text-slate-700">Biografia para Imprensa</span>
                    <Download size={20} className="text-[#002776] group-hover:translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <ImpactText text="ARQUIVOS E DISCURSOS" color="blue" className="text-4xl lg:text-5xl mb-8" />
              <div className="bg-[#005a1a] p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-white/80 mb-8 leading-relaxed">
                    Biblioteca digital do mandato. Acesse relatórios de atividades, discursos na íntegra e documentos legislativos importantes.
                  </p>
                  <a href={getDriveLink('biblioteca')} target="_blank" rel="noopener noreferrer" className="mt-8 block text-center w-full bg-[#ffdf00] text-[#002776] py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all">
                    Acessar Biblioteca
                  </a>
                </div>
                <BookOpen className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOADS - BAIXE E COMPARTILHE */}
      <section className="py-24 px-6 bg-[#005a1a]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-white mb-8">
            BAIXE E <span className="text-[#ffdf00]">COMPARTILHE</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Seja um multiplicador da nossa mensagem. Baixe materiais oficiais para suas redes sociais e ajude a espalhar a verdade.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FileText />, label: 'Panfletos', key: 'panfletos' },
              { icon: <Download />, label: 'Artes Sociais', key: 'artes' },
              { icon: <Play />, label: 'Denúncias', key: 'videos_curtos' },
              { icon: <Newspaper />, label: 'Informativos', key: 'informativos' },
            ].map((item, i) => (
              <a key={i} href={getDriveLink(item.key)} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/30 p-8 rounded-2xl flex flex-col items-center gap-4 transition-all group">
                <div className="text-[#ffdf00] group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-white font-bold uppercase tracking-widest text-xs">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <ImpactText text="FALE CONOSCO" color="blue" className="text-4xl lg:text-6xl mb-8" />
            <p className="text-slate-600 text-lg mb-12">
              Sua opinião é fundamental para o nosso mandato. Entre em contato para enviar sugestões, denúncias ou tirar dúvidas.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">Endereço</div>
                  <div className="text-sm font-bold text-slate-900">Prédio Anexo, Gabinete 102, Wilson Lins</div>
                  <div className="text-sm text-slate-500">Assembleia Legislativa da Bahia (CAB)</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">E-mail</div>
                  <a href="mailto:dep.drdiegocastro@alba.ba.gov.br" className="text-lg font-bold text-slate-900 hover:text-[#002776] transition-colors">dep.drdiegocastro@alba.ba.gov.br</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">Telefones</div>
                  <a href="tel:+557131157253" className="text-lg font-bold text-slate-900 hover:text-[#002776] transition-colors">71 3115-7253</a>
                  <span className="text-slate-400 mx-2">/</span>
                  <a href="tel:+5571999832548" className="text-lg font-bold text-slate-900 hover:text-[#002776] transition-colors">71 9 9983-2548</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">WhatsApp</div>
                  <a href="https://wa.me/5571999832548" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-slate-900 hover:text-[#005a1a] transition-colors">+55 71 99983-2548</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 lg:p-12 rounded-3xl border border-slate-100">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002776] transition-colors" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">E-mail</label>
                  <input type="email" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002776] transition-colors" placeholder="seu@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assunto</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002776] transition-colors">
                  <option>Sugestão</option>
                  <option>Denúncia</option>
                  <option>Dúvida</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mensagem</label>
                <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002776] transition-colors" placeholder="Como podemos ajudar?" />
              </div>
              <button className="w-full bg-[#002776] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#001a4d] transition-all shadow-xl shadow-blue-200">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center">
                <img
                  src="/logo diego castro.png"
                  alt="Diego Castro"
                  className="h-24 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Deputado Estadual Diego Castro. Recordista de Projetos de Lei e defensor dos valores conservadores na Assembleia Legislativa da Bahia.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/diegocastroba/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Instagram size={18} /></a>
                <a href="https://x.com/diegocastroba" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Twitter size={18} /></a>
                <a href="https://www.facebook.com/DiegoCastroBA/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Facebook size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-[#ffdf00]">Navegação</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><button onClick={() => scrollToSection('início')} className="hover:text-white transition-colors">Início</button></li>
                <li><button onClick={() => scrollToSection('quem-é')} className="hover:text-white transition-colors">Quem é Diego</button></li>
                <li><button onClick={() => scrollToSection('mandato')} className="hover:text-white transition-colors">O Mandato</button></li>
                <li><button onClick={() => scrollToSection('notícias')} className="hover:text-white transition-colors">Notícias</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-[#ffdf00]">Temas</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Segurança Pública</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Família e Infância</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liberdade Religiosa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Educação</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-[#ffdf00]">Newsletter</h4>
              <p className="text-white/50 text-sm mb-6">Receba as atualizações do mandato direto no seu e-mail.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Seu e-mail" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffdf00] flex-grow" />
                <button className="bg-[#ffdf00] text-[#002776] px-4 py-2 rounded-lg font-bold text-sm">OK</button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            <span>© 2026 Diego Castro. Todos os direitos reservados | Desenvolvido por <a href="https://www.sa2marketing.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Agência SA2 Marketing</a></span>
            <div className="flex gap-8">
              <Link to="/admin" className="hover:text-white transition-colors">Painel Admin</Link>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Security Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002776]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#002776] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl md:text-3xl font-black text-[#002776] mb-2 uppercase">Segmentações</h2>
            <p className="text-slate-500 mb-8 text-base">Clique em uma área para ver detalhes.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securitySegments.length > 0 ? securitySegments.map((segment) => (
                <Link
                  key={segment.id}
                  to={`/seguranca/${segment.id}`}
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="group bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#005a1a] hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#002776] group-hover:text-[#005a1a] transition-colors line-clamp-1">{segment.name}</h3>
                    <p className="text-slate-400 text-xs line-clamp-1">{segment.description}</p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-[#005a1a] group-hover:text-white transition-all ml-3 shrink-0">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              )) : (
                <p className="text-slate-400 italic text-sm">Nenhuma segmentação cadastrada ainda.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Projects Modal */}
      {isProjectsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002776]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsProjectsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-[#002776] transition-colors"
            >
              <X size={32} />
            </button>

            <div className="mb-12">
              <span className="text-[#005a1a] font-bold uppercase tracking-[0.3em] text-xs mb-2 block">Acervo Legislativo</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#002776] uppercase">Todos os Projetos</h2>
              <p className="text-slate-500 mt-2 font-medium">Confira o histórico completo de ações do mandato.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? projects.map((project) => (
                <MandateCard key={project.id} item={project} type="project" onProjectClick={(p) => { setSelectedProject(p); setIsProjectsModalOpen(false); }} />
              )) : (
                <p className="col-span-full py-20 text-center text-slate-400 italic">Nenhum projeto encontrado.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002776]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full text-slate-400 hover:text-[#002776] transition-colors shadow-lg"
            >
              <X size={24} />
            </button>

            {selectedNews.image && (
              <div className="relative h-64 lg:h-80 overflow-hidden rounded-t-[2.5rem]">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-[#ffdf00] text-[#002776] text-xs font-bold rounded-full uppercase tracking-wider">
                    {selectedNews.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Calendar size={14} />
                <span>{selectedNews.date}</span>
              </div>

              <h2 className="text-2xl lg:text-4xl font-black text-[#002776] mb-6 leading-tight">
                {selectedNews.title}
              </h2>

              <div className="prose prose-lg prose-slate max-w-none">
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedNews.full_content || selectedNews.excerpt}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="flex items-center gap-2 text-[#002776] font-bold hover:gap-3 transition-all"
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.url)}`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#002776]">{selectedVideo.title}</h3>
              {selectedVideo.category && (
                <span className="text-sm text-slate-400 font-medium">{selectedVideo.category}</span>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002776]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-10 bg-slate-100 p-3 rounded-full text-slate-400 hover:text-[#002776] hover:bg-slate-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProject.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' :
                    selectedProject.status === 'Arquivado' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {selectedProject.status}
                </span>
                <span className="text-slate-400 text-sm font-medium">Ano: {selectedProject.year}</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black text-[#002776] mb-6 leading-tight">
                {selectedProject.title}
              </h2>

              <div className="prose prose-lg prose-slate max-w-none">
                <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                  {selectedProject.summary}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2 text-[#002776] font-bold hover:gap-3 transition-all"
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SecuritySegmentPage = () => {
  const { id } = useParams();
  const [segment, setSegment] = useState<SecuritySegment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegment = async () => {
      const { data, error } = await supabase.from('security_segments').select('*').eq('id', id).single();
      if (!error && data) setSegment(data);
      setLoading(false);
    };
    fetchSegment();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!segment) return <div className="min-h-screen flex items-center justify-center">Segmentação não encontrada.</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[#005a1a] font-bold mb-8 hover:gap-3 transition-all">
          <ArrowLeft size={20} /> Voltar ao Início
        </Link>

        <img
          src={segment.image || '/fotos-diego/diego-3.jpeg'}
          className="w-full h-84 object-cover rounded-[2.5rem] shadow-2xl mb-12"
          alt={segment.name}
        />

        <h1 className="text-4xl md:text-6xl font-black text-[#002776] mb-6 uppercase tracking-tight">
          {segment.name}
        </h1>

        <div className="prose prose-lg prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
            {segment.description}
          </p>
          <div className="text-slate-700 leading-relaxed space-y-6 whitespace-pre-line">
            {segment.full_content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
