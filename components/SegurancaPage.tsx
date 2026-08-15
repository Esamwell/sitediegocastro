import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Shield, CheckCircle2,
  ExternalLink, FileText, ChevronRight
} from 'lucide-react';
import PatrioticBackground from './PatrioticBackground';
import ImpactText from './ImpactText';
import { segurancaData } from '../src/data/segurancaData';
import { supabase } from '../src/supabaseClient';

export default function SegurancaPage() {
  const [activeSegment, setActiveSegment] = useState(segurancaData[0].id);
  const [settings, setSettings] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = s.value; });
        setSettings(map);
      }
    };
    fetchSettings();
  }, []);

  const getSetting = (key: string, def: string) => settings[key] || def;

  const activeData = segurancaData.find(s => s.id === activeSegment);

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-[#ffdf00] selection:text-[#002776]">
      <PatrioticBackground opacity={0.15} />

      {/* Header */}
      <header className="relative z-20 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-[#ffdf00] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-3 text-[#ffdf00]">
            <Shield size={24} />
            <span className="font-bold text-xl tracking-wider uppercase">Segurança Pública</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Tabs Navigation */}
        <aside className="lg:w-1/4 flex-shrink-0">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 sticky top-28 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 px-4 uppercase tracking-wider flex items-center gap-2">
              <FileText size={20} className="text-[#ffdf00]" />
              Segmentações
            </h2>
            <nav className="flex flex-col gap-2">
              {segurancaData.map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setActiveSegment(segment.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                    activeSegment === segment.id
                      ? 'bg-[#002776] text-[#ffdf00] font-bold shadow-lg shadow-[#002776]/50'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span>{segment.title}</span>
                  <ChevronRight 
                    size={18} 
                    className={`transition-transform duration-300 ${activeSegment === segment.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* Banner lateral - abaixo do menu */}
          {getSetting('banner_4_image', '/banners/2.jpeg') && (
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.2em]">Publicidade</span>
              <a
                href={getSetting('banner_4_link', '#')}
                target={getSetting('banner_4_link', '#').startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-gray-700 hover:border-gray-500 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <img
                  src={getSetting('banner_4_image', '/banners/2.jpeg')}
                  alt="Publicidade"
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
          )}
        </aside>

        {/* Content Area */}
        <section className="lg:w-3/4">
          <AnimatePresence mode="wait">
            {activeData && (
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-6 lg:p-10 border border-gray-700/50 shadow-2xl"
              >
                <div className="mb-10">
                  <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 uppercase tracking-tight">
                    <ImpactText>{activeData.title}</ImpactText>
                  </h1>
                  {activeData.description && (
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {activeData.description}
                    </p>
                  )}
                </div>

                <div className="space-y-8">
                  {activeData.items.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#ffdf00]/30 transition-colors"
                    >
                      <h3 className="text-2xl font-bold text-[#ffdf00] mb-4 flex items-start gap-3">
                        <CheckCircle2 size={24} className="mt-1 flex-shrink-0" />
                        <span>{item.title}</span>
                      </h3>
                      {item.description && (
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                          {item.description}
                        </p>
                      )}
                      
                      {item.links && item.links.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-6">
                          {item.links.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-[#002776] text-gray-300 hover:text-[#ffdf00] rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-[#002776] shadow-sm"
                            >
                              <ExternalLink size={18} />
                              {link.label || 'Acessar fonte'}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>
    </div>
  );
}
