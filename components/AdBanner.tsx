import React from 'react';

type AdVariant = 'leaderboard' | 'sidebar';
type AdTheme = 'light' | 'dark';

interface AdBannerProps {
  /** URL da imagem (vinda de getSetting). Se vazia, o bloco não é renderizado. */
  image: string;
  /** URL de destino do clique. */
  link?: string;
  /**
   * leaderboard: peça horizontal no fluxo da página, centrada na coluna.
   * sidebar: peça na coluna lateral, ocupando a largura dela.
   */
  variant?: AdVariant;
  /** light: seções claras. dark: seções escuras (ex: Segurança). */
  theme?: AdTheme;
  /**
   * Exibe o selo "Publicidade". Deixe desligado para peças do próprio mandato
   * (evento, campanha) e ligue apenas para anúncio de terceiro.
   */
  label?: boolean;
  className?: string;
}

/**
 * Slot de banner.
 *
 * A arte NUNCA é recortada. As peças usadas aqui são de campanha e trazem
 * informação nas bordas (data, endereço, assinatura) — cortar para encaixar
 * numa proporção fixa destruiria justamente o conteúdo útil.
 *
 * Em vez de forçar proporção, o slot limita largura E altura e deixa a arte se
 * ajustar por dentro, preservando a proporção original. Uma regra atende os
 * três formatos que o painel pode receber:
 *
 * - faixa horizontal (~3.85:1) → preenche a largura da coluna, ~252px de altura
 * - quadrada (~1:1)           → aparece inteira, ~380px de altura, centrada
 * - story vertical (9:16)     → na lateral, 300px de largura, 600px de altura
 *
 * Nenhuma delas estoura o layout e nenhuma é cortada.
 */
const AdBanner: React.FC<AdBannerProps> = ({
  image,
  link = '#',
  variant = 'leaderboard',
  theme = 'light',
  label = false,
  className = '',
}) => {
  if (!image) return null;

  const isExternal = link.startsWith('http');
  const frameClass =
    theme === 'dark'
      ? 'border-gray-700 hover:border-gray-500'
      : 'border-slate-200 hover:border-slate-300';

  const seal = label ? (
    <span
      className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
      }`}
    >
      Publicidade
    </span>
  ) : null;

  const anchor = (imgClass: string) => (
    <a
      href={link}
      target={isExternal ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className={`block overflow-hidden rounded-lg border ${frameClass} shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <img
        src={image}
        alt="Banner"
        loading="lazy"
        className={imgClass}
        referrerPolicy="no-referrer"
      />
    </a>
  );

  if (variant === 'sidebar') {
    // A largura da coluna manda; a altura acompanha a proporção da arte.
    return (
      <div className={`flex w-full flex-col items-center gap-1.5 ${className}`}>
        {seal}
        <div className="w-full max-w-[300px]">{anchor('block h-auto w-full')}</div>
      </div>
    );
  }

  // Teto de largura (coluna) e de altura (para a arte quadrada não dominar a
  // tela). A âncora encolhe junto com a imagem, então a moldura sempre abraça
  // a arte, sem faixa vazia em volta.
  return (
    <div className={`flex w-full flex-col items-center gap-1.5 px-6 py-12 ${className}`}>
      {seal}
      <div className="flex w-full max-w-[970px] justify-center">
        {anchor(
          'block h-auto w-auto max-w-full object-contain max-h-[240px] sm:max-h-[300px] lg:max-h-[380px]'
        )}
      </div>
    </div>
  );
};

export default AdBanner;
