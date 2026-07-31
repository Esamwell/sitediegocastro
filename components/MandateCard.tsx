import React from 'react';
import { motion } from 'framer-motion';
import { Project, News } from '../types';
import { ArrowRight, Calendar, Share2 } from 'lucide-react';

interface CardProps {
  item: Project | News;
  type: 'project' | 'news';
  onNewsClick?: (news: News) => void;
  onProjectClick?: (project: Project) => void;
}

const MandateCard: React.FC<CardProps> = ({ item, type, onNewsClick, onProjectClick }) => {
  if (type === 'project') {
    const project = item as Project;
    return (
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full"
      >
        <div className="p-6 flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider leading-tight">
              {project.category}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full leading-tight ${
              project.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' : 
              project.status === 'Arquivado' ? 'bg-rose-100 text-rose-700' :
              project.status === 'Selo Diego Castro' ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {project.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#002776] mb-3 leading-tight line-clamp-3">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-3 mb-4">
            {project.summary}
          </p>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">Ano: {project.year}</span>
          <button 
            onClick={() => onProjectClick?.(project)}
            className="text-[#002776] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver detalhes <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  const news = item as News;
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#ffdf00] text-[#002776] text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
          <Calendar size={12} />
          <span>{news.date}</span>
        </div>
        <h3 className="text-lg font-bold text-[#002776] mb-3 leading-tight line-clamp-2">
          {news.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2">
          {news.excerpt}
        </p>
      </div>
      <div className="p-4 border-t border-slate-50 flex justify-between items-center">
        <button 
          onClick={() => onNewsClick?.(news)}
          className="text-[#005a1a] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ler mais <ArrowRight size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const url = window.location.href;
            const text = `${news.title} - Diego Castro`;
            if (navigator.share) {
              navigator.share({ title: news.title, text: text, url: url }).catch(() => {});
            } else {
              navigator.clipboard.writeText(`${text}\n${url}`);
              alert('Link copiado para a área de transferência!');
            }
          }}
          className="text-slate-400 hover:text-[#005a1a] transition-colors p-1"
          title="Compartilhar"
        >
          <Share2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default MandateCard;
