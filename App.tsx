/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, Users, Heart, Flag, BookOpen, Briefcase, 
  MapPin, Calendar, Play, ChevronRight, Menu, X, 
  Instagram, Youtube, Twitter, Facebook, MessageCircle,
  FileText, Download, Newspaper, Info, Phone, Mail,
  ArrowRight, CheckCircle2, Search, TrendingUp
} from 'lucide-react';
import PatrioticBackground from './components/PatrioticBackground';
import ImpactText from './components/ImpactText';
import CustomCursor from './components/CustomCursor';
import MandateCard from './components/MandateCard';
import { Project, News, Video } from './types';

// Mock Data
const PROJECTS: Project[] = [
  { id: '1', title: 'Valorização da Polícia Militar', category: 'Segurança', summary: 'Projeto que visa o reajuste salarial e melhores condições de trabalho para os heróis da nossa PM.', status: 'Em Tramitação', year: 2024 },
  { id: '2', title: 'Proteção da Infância nas Escolas', category: 'Família', summary: 'Garantia de que conteúdos ideológicos não entrem nas salas de aula dos nossos filhos.', status: 'Aprovado', year: 2023 },
  { id: '3', title: 'Liberdade Religiosa Plena', category: 'Liberdade', summary: 'Proteção de templos e igrejas contra qualquer tipo de perseguição ou fechamento arbitrário.', status: 'Aprovado', year: 2023 },
  { id: '4', title: 'Combate ao Crime Organizado', category: 'Segurança', summary: 'Endurecimento de penas para líderes de facções criminosas que atuam na Bahia.', status: 'Em Tramitação', year: 2024 },
];

const NEWS: News[] = [
  { id: '1', title: 'Diego Castro fiscaliza hospital no interior da Bahia', date: '15 Mar 2024', excerpt: 'O deputado encontrou irregularidades na gestão de recursos e cobrou providências imediatas do governo.', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80', category: 'Fiscalização' },
  { id: '2', title: 'Grande encontro com lideranças em Feira de Santana', date: '12 Mar 2024', excerpt: 'Milhares de pessoas se reuniram para ouvir as propostas de Diego Castro para a região.', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80', category: 'Agenda' },
  { id: '3', title: 'Aprovado projeto de apoio ao produtor rural', date: '10 Mar 2024', excerpt: 'Nova lei garante menos burocracia para quem produz e gera empregos no campo.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80', category: 'Mandato' },
];

const VIDEOS: Video[] = [
  { id: '1', title: 'Discurso na Assembleia sobre Segurança', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80', category: 'Discurso', url: '#', duration: '12:45' },
  { id: '2', title: 'Denúncia: O descaso com as estradas baianas', thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80', category: 'Denúncia', url: '#', duration: '08:20' },
  { id: '3', title: 'Entrevista exclusiva para a TV Bahia', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80', category: 'Entrevista', url: '#', duration: '25:15' },
];

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

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

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <PatrioticBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => scrollToSection('início')} className="hover:opacity-80 transition-opacity">
              <img 
                src="/logo diego castro verde.png" 
                alt="Diego Castro" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Início', 'Quem é', 'Mandato', 'Bahia', 'Notícias', 'Contato'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-sm font-bold text-slate-600 hover:text-[#002776] transition-colors uppercase tracking-wider"
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
                  className="h-10 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-900">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {['Início', 'Quem é', 'Mandato', 'Bahia', 'Notícias', 'Contato'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-3xl font-heading font-black text-[#002776] text-left uppercase"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-12 border-t border-slate-100 flex gap-6">
              <Instagram className="text-[#002776]" />
              <Twitter className="text-[#002776]" />
              <Youtube className="text-[#002776]" />
              <Facebook className="text-[#002776]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="início" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
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
              Trabalhando incansavelmente por uma Bahia mais segura, livre e próspera. Diego Castro é a voz da direita na Assembleia Legislativa.
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
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" 
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
            { label: 'Projetos de Lei', value: '150+' },
            { label: 'Cidades Visitadas', value: '200+' },
            { label: 'Emendas Destinadas', value: 'R$ 15M' },
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
                  Advogado, pai de família e cristão, Diego Castro iniciou sua trajetória política movido pelo desejo de ver uma Bahia livre da corrupção e do descaso com a segurança pública.
                </p>
                <p>
                  Com uma carreira sólida no direito, Diego sempre defendeu as liberdades individuais e o direito à propriedade. Sua entrada na política foi uma resposta ao clamor de milhares de baianos que não se sentiam representados.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {[
                    { icon: <Shield size={20} />, text: 'Defesa da Segurança' },
                    { icon: <Heart size={20} />, text: 'Valores Cristãos' },
                    { icon: <Users size={20} />, text: 'Apoio à Família' },
                    { icon: <Flag size={20} />, text: 'Liberdade Econômica' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="text-[#005a1a]">{item.icon}</div>
                      <span className="font-bold text-slate-700 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <img 
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80" 
                className="rounded-3xl shadow-2xl"
                alt="Trajetória"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brazil-green/10 rounded-full blur-3xl" />
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
              <ImpactText text="O NOSSO MANDATO" color="blue" className="text-4xl lg:text-6xl" />
            </div>
            <button className="flex items-center gap-2 text-[#002776] font-bold hover:gap-4 transition-all">
              Ver todos os projetos <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROJECTS.map((project) => (
              <MandateCard key={project.id} item={project} type="project" />
            ))}
          </div>
        </div>
      </section>

      {/* SEGURANÇA PÚBLICA - DESTAQUE */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#002776] z-0">
          <img 
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80" 
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
              Não descansaremos enquanto a Bahia não for um lugar seguro para se viver. Defendemos nossas polícias e combatemos o crime com rigor.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <CheckCircle2 className="text-[#ffdf00]" size={32} />
                <div>
                  <div className="text-white font-bold">Apoio à PM</div>
                  <div className="text-white/60 text-sm">Equipamentos e salários</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <CheckCircle2 className="text-[#ffdf00]" size={32} />
                <div>
                  <div className="text-white font-bold">Polícia Penal</div>
                  <div className="text-white/60 text-sm">Reconhecimento e valorização</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section id="notícias" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ImpactText text="ÚLTIMAS NOTÍCIAS" color="blue" className="text-4xl lg:text-6xl mb-4" />
            <p className="text-slate-500 font-medium">Acompanhe o dia a dia do deputado Diego Castro</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {NEWS.map((item) => (
              <MandateCard key={item.id} item={item} type="news" />
            ))}
          </div>
        </div>
      </section>

      {/* VÍDEOS */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black">VÍDEOS RECENTES</h2>
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all">
              <Youtube size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VIDEOS.map((video) => (
              <div key={video.id} className="group cursor-pointer">
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
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#002776] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {video.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-[#ffdf00] transition-colors">
                  {video.title}
                </h3>
              </div>
            ))}
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
              { icon: <FileText />, label: 'Panfletos' },
              { icon: <Download />, label: 'Artes Sociais' },
              { icon: <Play />, label: 'Vídeos Curtos' },
              { icon: <Newspaper />, label: 'Informativos' },
            ].map((item, i) => (
              <button key={i} className="bg-white/10 hover:bg-white/20 border border-white/30 p-8 rounded-2xl flex flex-col items-center gap-4 transition-all group">
                <div className="text-[#ffdf00] group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-white font-bold uppercase tracking-widest text-xs">{item.label}</span>
              </button>
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
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">Telefone</div>
                  <div className="text-lg font-bold text-slate-900">(71) 3115-7000</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">E-mail</div>
                  <div className="text-lg font-bold text-slate-900">contato@diegocastro.com.br</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#002776]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase">WhatsApp</div>
                  <div className="text-lg font-bold text-slate-900">(71) 99999-9999</div>
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
                  className="h-14 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Um mandato a serviço da Bahia, pautado na ética, na transparência e na defesa intransigente dos valores conservadores.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Youtube size={18} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#002776] transition-all"><Facebook size={18} /></a>
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
            <span>© 2024 Diego Castro. Todos os direitos reservados.</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
