import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import ImpactText from './ImpactText';

export interface GalleryPhoto {
  id: string;
  image_url: string;
  title?: string | null;
}

interface GaleriaSectionProps {
  photos: GalleryPhoto[];
  title: string;
  subtitle: string;
}

/**
 * Galeria de fotos com visualizador em tela cheia.
 *
 * A grade usa alturas variadas para não virar um tabuleiro monótono, mas cada
 * célula tem proporção fixa e object-cover: assim foto em pé e foto deitada
 * convivem sem furo no layout.
 */
const GaleriaSection: React.FC<GaleriaSectionProps> = ({ photos: allPhotos, title, subtitle }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  // Rede de segurança: foto que o navegador não conseguir abrir some da grade em
  // vez de virar ícone quebrado. Vale para o que já subiu em formato inválido
  // antes da conversão existir, e para arquivo removido do Storage.
  const [brokenIds, setBrokenIds] = useState<string[]>([]);

  const photos = allPhotos.filter(p => brokenIds.indexOf(p.id) === -1);

  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (delta: number) =>
      setOpenIndex(current => {
        if (current === null) return current;
        return (current + delta + photos.length) % photos.length;
      }),
    [photos.length]
  );

  // Navegação por teclado enquanto o visualizador está aberto.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    // Trava o scroll do fundo enquanto o lightbox está aberto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, go]);

  if (photos.length === 0) return null;

  const visible = showAll ? photos : photos.slice(0, 8);
  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <section id="galeria" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#005a1a] font-bold uppercase tracking-[0.3em] text-xs mb-4 inline-flex items-center gap-2">
            <Images size={14} /> Registros
          </span>
          <ImpactText text={title} color="blue" className="text-4xl lg:text-6xl mb-4" />
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setOpenIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus:ring-4 focus:ring-[#002776]/30"
            >
              <img
                src={photo.image_url}
                alt={photo.title || 'Foto da galeria'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={() => setBrokenIds(prev => prev.indexOf(photo.id) === -1 ? [...prev, photo.id] : prev)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {photo.title && (
                <span className="absolute bottom-0 inset-x-0 p-4 text-left text-white text-sm font-bold translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  {photo.title}
                </span>
              )}
            </button>
          ))}
        </div>

        {photos.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-2 text-[#002776] font-bold hover:gap-4 transition-all"
            >
              {showAll ? 'Ver menos' : `Ver todas as ${photos.length} fotos`}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Fechar"
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); go(-1); }}
                  aria-label="Foto anterior"
                  className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); go(1); }}
                  aria-label="Próxima foto"
                  className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <motion.div
              key={active.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={active.image_url}
                alt={active.title || 'Foto da galeria'}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
              {active.title && (
                <p className="text-white/90 font-medium text-center">{active.title}</p>
              )}
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                {(openIndex ?? 0) + 1} / {photos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GaleriaSection;
