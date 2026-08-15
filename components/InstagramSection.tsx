import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import ImpactText from './ImpactText';
import { instagramEmbedUrl } from '../src/instagram';

export interface InstagramPost {
  id: string;
  post_url: string;
  shortcode?: string | null;
  caption?: string | null;
}

interface InstagramSectionProps {
  posts: InstagramPost[];
  title: string;
  subtitle: string;
  profileUrl: string;
}

/**
 * Seção do Instagram.
 *
 * Cada post é um iframe do embed oficial. Isso significa que a foto, a legenda
 * e a contagem de curtidas vêm direto do Instagram e ficam sempre atuais — se
 * o post for editado ou apagado, o embed acompanha. O que não é automático é a
 * entrada de posts novos, que depende de alguém colar a URL no painel.
 *
 * Quando não há post cadastrado, a seção não some: vira uma chamada para o
 * perfil, que é melhor do que um buraco na página.
 */
const InstagramSection: React.FC<InstagramSectionProps> = ({
  posts,
  title,
  subtitle,
  profileUrl,
}) => {
  const embeddable = posts.filter(p => p.shortcode);

  return (
    <section id="instagram" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#005a1a] font-bold uppercase tracking-[0.3em] text-xs mb-4 inline-flex items-center gap-2">
            <Instagram size={14} /> Redes Sociais
          </span>
          <ImpactText text={title} color="blue" className="text-4xl lg:text-6xl mb-4" />
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {embeddable.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {embeddable.map(post => (
              <div
                key={post.id}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <iframe
                  src={instagramEmbedUrl(post.shortcode as string)}
                  title={post.caption || 'Post do Instagram'}
                  loading="lazy"
                  scrolling="no"
                  frameBorder={0}
                  allowTransparency
                  className="w-full h-[520px] block"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#002776] to-[#005a1a] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-xl"
          >
            <Instagram size={22} />
            Seguir no Instagram
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
