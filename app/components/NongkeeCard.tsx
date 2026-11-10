'use client';

import React from 'react';

export interface NongkeeCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function NongkeeCard({
  question = 'Siapa yang selalu ada saat kamu sedang tidak baik-baik saja?',
  level = 'Mendalam',
  cardNumber = '02',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: NongkeeCardProps) {
  // Dot level indicator: LIGHT / DEEP / BRAVE
  const isBrave = level.toLowerCase().includes('berani') || level.toLowerCase().includes('brave');
  const isDeep = level.toLowerCase().includes('dalam') || level.toLowerCase().includes('deep');
  const dotLevel = isBrave ? 3 : isDeep ? 2 : 1;
  const levelLabel = dotLevel === 3 ? 'BRAVE' : dotLevel === 2 ? 'DEEP' : 'LIGHT';

  const textLength = question.length;
  const questionFontSize =
    textLength > 120
      ? 'text-xs sm:text-sm md:text-[15px] leading-snug'
      : textLength > 75
      ? 'text-sm sm:text-base md:text-[17px] leading-snug'
      : 'text-base sm:text-lg md:text-xl leading-snug';

  // Size scaling with 100% fluid mobile responsiveness
  const scaleClass =
    size === 'large'
      ? 'w-[min(340px,calc(100vw-32px))] sm:w-[410px] aspect-[5/7]'
      : size === 'compact'
      ? 'w-[min(260px,calc(100vw-48px))] sm:w-[290px] aspect-[5/7]'
      : 'w-[min(300px,calc(100vw-36px))] sm:w-[350px] aspect-[5/7]';

  return (
    <div
      onClick={onClick}
      className={`relative ${scaleClass} rounded-[32px] sm:rounded-[36px] overflow-hidden cursor-pointer select-none
        border-2 border-white/20
        shadow-[0_20px_50px_rgba(10,94,85,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(94,234,176,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#5EEAB0]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #0B8A5F, #0A5E55)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#fff',
      }}
    >
      <style jsx>{`
        .hd {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: hd 5.5s ease-in-out infinite;
        }
        @keyframes hd {
          0%, 100% { transform: rotate(-1.8deg); }
          50% { transform: rotate(1.8deg); }
        }
        .bn {
          animation: bn 2.2s ease-in-out infinite;
        }
        @keyframes bn {
          50% { transform: translateY(-4px); }
        }
        .bl {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: bl 4.4s infinite;
        }
        @keyframes bl {
          92% { transform: scaleY(1); }
          96% { transform: scaleY(0.08); }
        }
        .tw {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: tw 2.4s ease-in-out infinite;
        }
        @keyframes tw {
          50% { opacity: 0.25; transform: scale(0.5); }
        }
      `}</style>

      {/* Dotted Radial Glow Rings */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#5EEAB0_0%,#5EEAB000_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[85%] h-[58%] box-border rounded-full border-2 border-white/15 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none m-0" suppressHydrationWarning>
          Friendship
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          True Friends
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#5EEAB0] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/95 text-[11px] font-semibold border border-white/10 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <circle cx="17.5" cy="9" r="2.8" />
            <path d="M18 14.5a5.5 5.5 0 0 1 3.5 5.5" />
          </svg>
          <span suppressHydrationWarning>Group</span>
        </div>
      </div>

      {/* Characters Illustration SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        className="absolute left-1/2 -translate-x-1/2 top-[12%] sm:top-[13%] w-[88%] h-[48%] sm:h-[50%] pointer-events-none"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        {/* Left Friend (Yellow Shirt & Cap) */}
        <g transform="translate(70 152) scale(1)">
          <g className="bn" style={{ animationDelay: '0s' }}>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#8E5A3A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#F2C14E" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#A9704B" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                <ellipse rx="26" ry="33" fill="#A9704B" />
                <path d="M-15 4Q-11 -1 -7 4M7 4Q11 -1 15 4" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#3A2418" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#8E5A3A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-10 19Q0 33 10 19Z" fill="#fff" stroke="#7B2535" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M-28 -2C-32 -36 -14 -46 2 -46C22 -46 32 -32 28 -2C26 -16 20 -26 6 -28C-6 -22 -20 -22 -28 -2Z" fill="#3A2418" />
                <path d="M-30 0C-36 -56 36 -56 30 0" fill="none" stroke="#1F1F26" strokeWidth="5" />
                <rect x="-36" y="-8" width="10" height="22" rx="5" fill="#1F1F26" />
                <rect x="26" y="-8" width="10" height="22" rx="5" fill="#1F1F26" />
              </g>
            </g>
          </g>
        </g>

        {/* Right Friend (Navy Jacket & Glasses) */}
        <g transform="translate(232 154) scale(1)">
          <g className="bn" style={{ animationDelay: '1.6s' }}>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#E6BC9C" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#1F2A44" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#F7D9C0" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#F7D9C0" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#F7D9C0" />
                <ellipse rx="26" ry="33" fill="#F7D9C0" />
                <g className="bl">
                  <ellipse cx="-11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                  <ellipse cx="11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                </g>
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#D9B46A" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#E6BC9C" strokeWidth="2" strokeLinecap="round" />
                <path d="M-10 19Q0 33 10 19Z" fill="#fff" stroke="#7B2535" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M-28 -2C-32 -36 -14 -46 2 -46C22 -46 32 -32 28 -2C26 -16 20 -26 6 -28C-6 -22 -20 -22 -28 -2Z" fill="#D9B46A" />
                <g fill="#fff" fillOpacity=".15" stroke="#1F1F26" strokeWidth="2.2">
                  <circle cx="-11" cy="2" r="9" />
                  <circle cx="11" cy="2" r="9" />
                </g>
                <path d="M-2 2h4" stroke="#1F1F26" strokeWidth="2.2" />
              </g>
            </g>
          </g>
        </g>

        {/* Center Friend (Afro Hair & Coral Shirt) */}
        <g transform="translate(150 130) scale(1.12)">
          <g className="bn" style={{ animationDelay: '0.8s' }}>
            <g transform="rotate(0 0 44)">
              <ellipse cy="-10" rx="34" ry="32" fill="#2A1A14" />
              <circle cx="-31.9" cy="4.3" r="15" fill="#2A1A14" />
              <circle cx="-33.9" cy="-10.5" r="15" fill="#2A1A14" />
              <circle cx="-30.0" cy="-24.9" r="15" fill="#2A1A14" />
              <circle cx="-20.9" cy="-36.4" r="15" fill="#2A1A14" />
              <circle cx="-8.2" cy="-42.9" r="15" fill="#2A1A14" />
              <circle cx="5.9" cy="-43.5" r="15" fill="#2A1A14" />
              <circle cx="19.0" cy="-37.8" r="15" fill="#2A1A14" />
              <circle cx="28.8" cy="-27.1" r="15" fill="#2A1A14" />
              <circle cx="33.7" cy="-13.0" r="15" fill="#2A1A14" />
              <circle cx="32.7" cy="1.9" r="15" fill="#2A1A14" />
            </g>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#63392A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#E8604F" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#7A4B33" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#7A4B33" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#7A4B33" />
                <ellipse rx="26" ry="33" fill="#7A4B33" />
                <path d="M-15 4Q-11 -1 -7 4M7 4Q11 -1 15 4" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#2A1A14" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#63392A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-10 19Q0 33 10 19Z" fill="#fff" stroke="#7B2535" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="-14" cy="-30" r="10" fill="#2A1A14" />
                <circle cx="0" cy="-34" r="10" fill="#2A1A14" />
                <circle cx="14" cy="-30" r="10" fill="#2A1A14" />
                <g fill="none" stroke="#F2C14E" strokeWidth="2.4">
                  <circle cx="-26" cy="16" r="6" />
                  <circle cx="26" cy="16" r="6" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* Twinkling Stars */}
        <g className="tw" style={{ animationDelay: '0s' }}>
          <path transform="translate(150 40) scale(0.9)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
        </g>
        <g className="tw" style={{ animationDelay: '0.7s' }}>
          <path transform="translate(36 90) scale(0.7)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
        </g>
        <g className="tw" style={{ animationDelay: '1.4s' }}>
          <path transform="translate(266 92) scale(0.8)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
        </g>
      </svg>

      {/* Bottom Question Box - Dynamic Auto Fit, No Cutoff */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-[rgba(0,0,0,0.38)] backdrop-blur-md border border-white/20 shadow-xl text-white overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span className="text-[#5EEAB0]" suppressHydrationWarning>{levelLabel}</span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#5EEAB0] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#5EEAB0] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#5EEAB0] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-white m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

