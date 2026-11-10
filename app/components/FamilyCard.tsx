'use client';

import React from 'react';

export interface FamilyCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function FamilyCard({
  question = 'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?',
  level = 'Santai',
  cardNumber = '01',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: FamilyCardProps) {
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
        shadow-[0_20px_50px_rgba(168,51,10,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,176,103,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#FFB067]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #D9500B, #A8330A)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#fff',
      }}
    >
      <style jsx>{`
        .fa,
        .fb,
        .fc {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation-duration: 3.4s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .fa {
          animation-name: fa;
        }
        .fb {
          animation-name: fb;
        }
        .fc {
          animation-name: fc;
        }
        @keyframes fa {
          0%,
          100% {
            transform: rotate(-1.5deg);
          }
          50% {
            transform: rotate(3deg) translateY(-4px);
          }
        }
        @keyframes fb {
          0%,
          100% {
            transform: rotate(1.5deg);
          }
          50% {
            transform: rotate(-3deg) translateY(-4px);
          }
        }
        @keyframes fc {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        .hd {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: hd 5.5s ease-in-out infinite;
        }
        @keyframes hd {
          0%,
          100% {
            transform: rotate(-1.8deg);
          }
          50% {
            transform: rotate(1.8deg);
          }
        }
        .bl {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: bl 4.4s infinite;
        }
        @keyframes bl {
          92% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.08);
          }
        }
        .rs {
          animation: rs 4s ease-in infinite;
        }
        @keyframes rs {
          to {
            transform: translateY(-70px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          svg * {
            animation: none !important;
          }
        }
      `}</style>

      {/* Dotted Radial Glow Rings */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#FFB067_0%,#FFB06700_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[11%] w-[84%] h-[60%] rounded-full border-2 border-white/15 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none m-0" suppressHydrationWarning>
          Family
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          Family Stories
        </p>
      </div>

      {/* Top Right Badges */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#FFB067] block flex-shrink-0" />
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

      {/* SVG Canvas Area */}
      <svg
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[18%] w-[88%] h-[56%] pointer-events-none"
        viewBox="0 0 300 300"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        {/* Left Character (fa) */}
        <g transform="translate(72 152) scale(1)">
          <g className="fa" style={{ animationDelay: '0s' }}>
            <g transform="rotate(0 0 44)" />
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#BF855A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#22344E" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#D9A073" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse rx="26" ry="33" fill="#D9A073" />
                <g className="bl">
                  <ellipse cx="-11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                  <ellipse cx="11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                </g>
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#2B1D16" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#BF855A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-28 -2C-32 -36 -14 -46 2 -46C22 -46 32 -32 28 -2C26 -16 20 -26 6 -28C-6 -22 -20 -22 -28 -2Z" fill="#2B1D16" />
              </g>
            </g>
          </g>
        </g>

        {/* Right Character (fb) */}
        <g transform="translate(230 156) scale(0.98)">
          <g className="fb" style={{ animationDelay: '0s' }}>
            <g transform="rotate(0 0 44)">
              <ellipse cy="-10" rx="34" ry="32" fill="#1E1620" />
              <circle cx="-31.9" cy="4.3" r="15" fill="#1E1620" />
              <circle cx="-33.9" cy="-10.5" r="15" fill="#1E1620" />
              <circle cx="-30.0" cy="-24.9" r="15" fill="#1E1620" />
              <circle cx="-20.9" cy="-36.4" r="15" fill="#1E1620" />
              <circle cx="-8.2" cy="-42.9" r="15" fill="#1E1620" />
              <circle cx="5.9" cy="-43.5" r="15" fill="#1E1620" />
              <circle cx="19.0" cy="-37.8" r="15" fill="#1E1620" />
              <circle cx="28.8" cy="-27.1" r="15" fill="#1E1620" />
              <circle cx="33.7" cy="-13.0" r="15" fill="#1E1620" />
              <circle cx="32.7" cy="1.9" r="15" fill="#1E1620" />
            </g>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#8E5A3A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#2F8F83" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#A9704B" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                <ellipse rx="26" ry="33" fill="#A9704B" />
                <path d="M-15 4Q-11 -1 -7 4M7 4Q11 -1 15 4" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#1E1620" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#8E5A3A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-10 19Q0 33 10 19Z" fill="#fff" stroke="#7B2535" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="-14" cy="-30" r="10" fill="#1E1620" />
                <circle cx="0" cy="-34" r="10" fill="#1E1620" />
                <circle cx="14" cy="-30" r="10" fill="#1E1620" />
              </g>
            </g>
          </g>
        </g>

        {/* Center Character (fc) */}
        <g transform="translate(150 128) scale(1.15)">
          <g className="fc" style={{ animationDelay: '0s' }}>
            <g transform="rotate(0 0 44)">
              <path d="M-34 0C-40 -50 -10 -58 4 -58C34 -58 44 -28 38 14L46 110L-48 110Z" fill="#3A2418" />
            </g>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#DDA67F" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#F4E6D0" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-14 49L0 82L14 49Z" fill="#F2C9A5" />
            <path d="M-30 6C-38 40 -40 70 -46 100L-24 100C-22 62 -24 30 -26 10Z" fill="#3A2418" />
            <path d="M30 6C38 40 40 70 46 100L24 100C22 62 24 30 26 10Z" fill="#3A2418" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse rx="26" ry="33" fill="#F2C9A5" />
                <g className="bl">
                  <ellipse cx="-11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                  <ellipse cx="11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                </g>
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#3A2418" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#DDA67F" strokeWidth="2" strokeLinecap="round" />
                <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-27 -4C-30 -34 -12 -42 2 -42C20 -42 30 -30 27 -4C20 -22 6 -28 -4 -26C-14 -22 -22 -14 -27 -4Z" fill="#3A2418" />
              </g>
            </g>
          </g>
        </g>

        {/* Rising Hearts (.rs) */}
        <g className="rs" style={{ animationDelay: '0s' }}>
          <path transform="translate(94.4 48.4) scale(0.8)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#FFE2C8" />
        </g>
        <g className="rs" style={{ animationDelay: '1.4s' }}>
          <path transform="translate(191.6 55.6) scale(0.7)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#fff" />
        </g>
        <g className="rs" style={{ animationDelay: '0.7s' }}>
          <path transform="translate(139.2 33.2) scale(0.9)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#FFD9B0" />
        </g>
        <g className="rs" style={{ animationDelay: '2.1s' }}>
          <path transform="translate(252.4 90.4) scale(0.8)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#FFE2C8" />
        </g>
        <g className="rs" style={{ animationDelay: '2.8s' }}>
          <path transform="translate(31.6 101.6) scale(0.7)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Bottom Question Box - Dynamic Auto Fit, No Cutoff */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-[rgba(0,0,0,0.38)] backdrop-blur-md border border-white/20 shadow-xl text-white overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span className="text-[#FFB067]" suppressHydrationWarning>{levelLabel}</span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#FFB067] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FFB067] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FFB067] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-white m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

