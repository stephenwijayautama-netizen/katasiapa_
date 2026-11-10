'use client';

import React from 'react';

export interface PassionCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function PassionCard({
  question = 'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?',
  level = 'Berani',
  cardNumber = '03',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: PassionCardProps) {
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
        shadow-[0_20px_50px_rgba(200,16,46,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,122,69,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#FF7A45]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #C8102E, #6E0A1E)',
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
          50% {
            transform: scale(1.006, 1.016);
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
        .fk {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: fk 1.4s ease-in-out infinite;
        }
        @keyframes fk {
          35% {
            transform: scale(0.96, 1.05) rotate(-1.5deg);
          }
          70% {
            transform: scale(1.02, 0.98) rotate(1.5deg);
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
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#FF7A45_0%,#FF7A4500_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[11%] w-[84%] h-[60%] rounded-full border-2 border-white/15 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none m-0" suppressHydrationWarning>
          Passion
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          {'Fire & Drive'}
        </p>
      </div>

      {/* Top Right Badges */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#FF7A45] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/95 text-[11px] font-semibold border border-white/10 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span suppressHydrationWarning>For Two</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <svg
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[18%] w-[88%] h-[56%] pointer-events-none"
        viewBox="0 0 300 300"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        <defs>
          <linearGradient id="passion_fo" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#FFC23D" />
            <stop offset="1" stopColor="#FF4B1F" />
          </linearGradient>
          <linearGradient id="passion_fi" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#FFF4B0" />
            <stop offset="1" stopColor="#FFC53A" />
          </linearGradient>
        </defs>

        {/* Outer Flame (.fk) */}
        <g className="fk">
          <path
            transform="translate(-30 -35) scale(15)"
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="url(#passion_fo)"
          />
        </g>

        {/* Inner Flame (.fk with delay) */}
        <g className="fk" style={{ animationDelay: '0.3s' }}>
          <path
            transform="translate(30 75) scale(10)"
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="url(#passion_fi)"
          />
        </g>

        {/* Character */}
        <g transform="translate(150 170) scale(1.5)">
          <g className="br" style={{ animationDelay: '0s' }}>
            <g transform="rotate(0 0 44)">
              <path d="M-34 0C-40 -50 -10 -58 4 -58C34 -58 44 -28 38 14L46 110L-48 110Z" fill="#1A1118" />
            </g>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#BF855A" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#17151C" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-14 49L0 82L14 49Z" fill="#D9A073" />
            <path d="M-30 6C-38 40 -40 70 -46 100L-24 100C-22 62 -24 30 -26 10Z" fill="#1A1118" />
            <path d="M30 6C38 40 40 70 46 100L24 100C22 62 24 30 26 10Z" fill="#1A1118" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                <ellipse rx="26" ry="33" fill="#D9A073" />
                <g className="bl">
                  <ellipse cx="-11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                  <ellipse cx="11" cy="2" rx="2.7" ry="3.6" fill="#2A1A1F" />
                </g>
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#1A1118" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#BF855A" strokeWidth="2" strokeLinecap="round" />
                <path d="M-9 21Q-4 17.5 0 19.5Q4 17.5 9 21Q0 29 -9 21Z" fill="#C2263F" />
                <path d="M-27 -4C-30 -34 -12 -42 2 -42C20 -42 30 -30 27 -4C20 -22 6 -28 -4 -26C-14 -22 -22 -14 -27 -4Z" fill="#1A1118" />
                <g fill="none" stroke="#F2C14E" strokeWidth="2.4">
                  <circle cx="-26" cy="16" r="6" />
                  <circle cx="26" cy="16" r="6" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* Rising Golden Embers (.rs) */}
        <g className="rs" style={{ animationDelay: '0s' }}>
          <circle cx="58" cy="170" r="4" fill="#FFD166" />
        </g>
        <g className="rs" style={{ animationDelay: '0.9s' }}>
          <circle cx="246" cy="150" r="5" fill="#FFD166" />
        </g>
        <g className="rs" style={{ animationDelay: '1.8s' }}>
          <circle cx="84" cy="80" r="3" fill="#FFD166" />
        </g>
        <g className="rs" style={{ animationDelay: '2.5s' }}>
          <circle cx="222" cy="60" r="4" fill="#FFD166" />
        </g>
      </svg>

      {/* Bottom Question Box - Dynamic Auto Fit, No Cutoff */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-[rgba(0,0,0,0.38)] backdrop-blur-md border border-white/20 shadow-xl text-white overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span className="text-[#FF7A45]" suppressHydrationWarning>{levelLabel}</span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#FF7A45] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FF7A45] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FF7A45] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-white m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

