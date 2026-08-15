import React from 'react';

type AdVariant = 'leaderboard' | 'sidebar';
type AdTheme = 'light' | 'dark';

interface AdBannerProps {
  /** URL da imagem (vinda de getSetting). Se vazia, o bloco não é renderizado. */
  image: string;
  /** URL de destino do clique. */
  link?: string;
  /**
   * leaderboard: faixa horizontal ocupando a largura da coluna de conteúdo.
   * sidebar: retângulo ocupando a largura da coluna lateral.
   */
  variant?: AdVariant;
  /** light: seções claras. dark: seções escuras (ex: Segurança). */
  theme?: AdTheme;
  className?: string;
}

/**
 * Slot de publicidade.
 *
 * Regra do layout (mesma dos portais de notícia): o banner preenche a largura
 * da coluna em que está — nunca fica pequeno e centralizado com sobra dos
 * lados. O que muda entre as variantes é como a altura é resolvida:
 *
 * - leaderboard: o slot tem proporção fixa (~3.85:1, o formato de faixa dos
 *   portais). A arte preenche esse retângulo, então a altura é previsível e
 *   nunca estoura a página, independente do arquivo enviado no painel.
 * - sidebar: a largura manda e a altura acompanha a proporção da arte. Como a
 *   coluna tem no máximo 300px, uma arte vertical 300x600 cai exata e uma
 *   horizontal fica apenas baixa — em nenhum caso fica grande demais.
 */
const AdBanner: React.FC<AdBannerProps> = ({
  image,
  link = '#',
  variant = 'leaderboard',
  theme = 'light',
  className = '',
}) => {
  if (!image) return null;

  const isExternal = link.startsWith('http');
  const labelClass =
    theme === 'dark'
      ? 'text-[9px] font-semibold text-slate-500 uppercase tracking-[0.2em]'
      : 'text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em]';
  const frameClass =
    theme === 'dark'
      ? 'border-gray-700 hover:border-gray-500'
      : 'border-slate-200 hover:border-slate-300';

  const anchor = (imgClass: string) => (
    <a
      href={link}
      target={isExternal ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className={`block w-full overflow-hidden rounded-lg border ${frameClass} shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <img
        src={image}
        alt="Publicidade"
        loading="lazy"
        className={imgClass}
        referrerPolicy="no-referrer"
      />
    </a>
  );

  if (variant === 'sidebar') {
    return (
      <div className={`flex w-full flex-col items-center gap-1.5 lg:items-stretch ${className}`}>
        <span className={labelClass}>Publicidade</span>
        <div className="w-full max-w-[300px] self-center">
          {anchor('block h-auto w-full')}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full px-6 py-10 ${className}`}>
      <div className="mx-auto flex w-full max-w-[970px] flex-col gap-1.5">
        <span className={labelClass}>Publicidade</span>
        {anchor('block aspect-[1182/307] w-full object-cover')}
      </div>
    </div>
  );
};

export default AdBanner;
