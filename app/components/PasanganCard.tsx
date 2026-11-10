'use client';

import React from 'react';

export interface PasanganCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function PasanganCard({
  question = 'Kapan terakhir kali kamu merasa benar-benar dicintai?',
  level = 'Mendalam',
  cardNumber = '03',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: PasanganCardProps) {
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
        shadow-[0_20px_50px_rgba(158,31,90,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,143,191,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#FF8FBF]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #D63B78, #9E1F5A)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#fff',
      }}
    >
      <style jsx>{`
        .br {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: br 4.2s ease-in-out infinite;
        }
        @keyframes br {
          50% { transform: scale(1.006, 1.016); }
        }
        .hd {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: hd 5.5s ease-in-out infinite;
        }
        @keyframes hd {
          0%, 100% { transform: rotate(-1.8deg); }
          50% { transform: rotate(1.8deg); }
        }
        .hb {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: hb 1.8s ease-in-out infinite;
        }
        @keyframes hb {
          14% { transform: scale(1.06); }
          28% { transform: scale(1); }
          42% { transform: scale(1.04); }
        }
        .rs {
          animation: rs 4s ease-in infinite;
        }
        @keyframes rs {
          to { transform: translateY(-70px); opacity: 0; }
        }
      `}</style>

      {/* Dotted Radial Glow Rings */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#FF8FBF_0%,#FF8FBF00_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[85%] h-[58%] box-border rounded-full border-2 border-white/15 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none m-0" suppressHydrationWarning>
          Love
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          Love Stories
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#FF8FBF] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/95 text-[11px] font-semibold border border-white/10 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span suppressHydrationWarning>For Two</span>
        </div>
      </div>

      {/* Characters Illustration SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        className="absolute left-1/2 -translate-x-1/2 top-[12%] sm:top-[13%] w-[88%] h-[48%] sm:h-[50%] pointer-events-none"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        {/* Pulsing Big Heart in Background */}
        <g className="hb">
          <path
            transform="translate(102 8) scale(4)"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="#fff"
            opacity=".2"
          />
        </g>

        {/* Boy Character (Right) */}
        <g transform="translate(192 138) scale(1.3)">
          <g className="br" style={{ animationDelay: '0s' }}>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#BF855A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#2B2F3A" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#D9A073" />
            <g transform="rotate(-8 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse rx="26" ry="33" fill="#D9A073" />
                <path d="M-15 3Q-11 7 -7 3M7 3Q11 7 15 3" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#4A2A1A" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#BF855A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-28 -2C-32 -36 -14 -46 2 -46C22 -46 32 -32 28 -2C26 -16 20 -26 6 -28C-6 -22 -20 -22 -28 -2Z" fill="#4A2A1A" />
              </g>
            </g>
          </g>
        </g>

        {/* Girl Character (Left) */}
        <g transform="translate(108 134) scale(1.3)">
          <g className="br" style={{ animationDelay: '0s' }}>
            <g transform="rotate(8 0 44)">
              <path d="M-34 0C-40 -50 -10 -58 4 -58C34 -58 44 -28 38 14L46 110L-48 110Z" fill="#1E1620" />
            </g>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#DDA67F" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#FFF3EA" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-14 49L0 82L14 49Z" fill="#F2C9A5" />
            <path d="M-30 6C-38 40 -40 70 -46 100L-24 100C-22 62 -24 30 -26 10Z" fill="#1E1620" />
            <path d="M30 6C38 40 40 70 46 100L24 100C22 62 24 30 26 10Z" fill="#1E1620" />
            <g transform="rotate(8 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse rx="26" ry="33" fill="#F2C9A5" />
                <path d="M-15 3Q-11 7 -7 3M7 3Q11 7 15 3" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#1E1620" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#DDA67F" strokeWidth="2" strokeLinecap="round" />
                <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-27 -4C-30 -34 -12 -42 2 -42C20 -42 30 -30 27 -4C20 -22 6 -28 -4 -26C-14 -22 -22 -14 -27 -4Z" fill="#1E1620" />
              </g>
            </g>
          </g>
        </g>

        {/* Floating Rising Hearts */}
        <g className="rs" style={{ animationDelay: '0s' }}>
          <path
            transform="translate(54 60) scale(1)"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="#fff"
          />
        </g>
        <g className="rs" style={{ animationDelay: '1.3s' }}>
          <path
            transform="translate(226.4 54.4) scale(0.8)"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="#FFD1E1"
          />
        </g>
        <g className="rs" style={{ animationDelay: '2.4s' }}>
          <path
            transform="translate(141.6 21.6) scale(0.7)"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="#fff"
          />
        </g>
      </svg>

      {/* Bottom Question Box - Dynamic Auto Fit, No Cutoff */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-[rgba(0,0,0,0.38)] backdrop-blur-md border border-white/20 shadow-xl text-white overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span className="text-[#FF8FBF]" suppressHydrationWarning>{levelLabel}</span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#FF8FBF] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FF8FBF] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FF8FBF] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-white m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

