'use client';

import React from 'react';

export interface GratitudeCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function GratitudeCard({
  question = 'Hal kecil apa hari ini yang membuatmu merasa bersyukur?',
  level = 'Mendalam',
  cardNumber = '06',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: GratitudeCardProps) {
  // Dot level indicator: 1 = Santai/LIGHT, 2 = Mendalam/DEEP, 3 = Berani/BRAVE
  const dotLevel = level.toLowerCase().includes('berani') || level.toLowerCase().includes('brave')
    ? 3
    : level.toLowerCase().includes('dalam') || level.toLowerCase().includes('deep')
    ? 2
    : 1;

  const levelLabel = dotLevel === 3 ? 'BRAVE' : dotLevel === 2 ? 'DEEP' : 'LIGHT';

  // Responsive font size based on text length to prevent text overflow
  const textLength = question.length;
  const questionFontSize =
    textLength > 120
      ? 'text-xs sm:text-sm md:text-[15px] leading-snug'
      : textLength > 75
      ? 'text-sm sm:text-base md:text-[17px] leading-snug'
      : 'text-base sm:text-lg md:text-xl leading-snug';

  // Scale classes with 100% fluid mobile responsiveness
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
        shadow-[0_20px_50px_rgba(11,79,156,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(122,208,255,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#7AD0FF]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #0E7BC4, #0B4F9C)',
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
        .tw {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: tw 2.4s ease-in-out infinite;
        }
        @keyframes tw {
          50% { opacity: 0.25; transform: scale(0.5); }
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
        .rt {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: rt 30s linear infinite;
        }
        @keyframes rt {
          to { transform: rotate(360deg); }
        }
        .rs {
          animation: rs 4s ease-in infinite;
        }
        @keyframes rs {
          to { transform: translateY(-70px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          svg * {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient background glow circle */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: '10%',
          top: '20%',
          width: '80%',
          height: '57%',
          background: 'radial-gradient(circle, #7AD0FF 0%, rgba(122,208,255,0) 68%)',
          opacity: 0.6,
        }}
      />

      {/* Orbit ring circle */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: '8%',
          top: '18%',
          width: '84%',
          height: '60%',
          border: '2px solid rgba(255,255,255,0.16)',
        }}
      />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none m-0" suppressHydrationWarning>
          Gratitude
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          Grateful Hearts
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#7AD0FF] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/95 text-[11px] font-semibold border border-white/10 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span suppressHydrationWarning>For Two</span>
        </div>
      </div>

      {/* Main Vector Artwork: Rotating Golden Rays, Warm Sun Heart, Grateful Person */}
      <div className="absolute inset-x-0 top-[17%] bottom-[24%] flex items-center justify-center pointer-events-none">
        <svg
          aria-hidden="true"
          viewBox="0 0 300 300"
          className="w-[90%] h-[90%] object-contain"
          style={{ clipPath: 'inset(0 0 16px 0)' }}
        >
          <defs>
            <linearGradient id="sn" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#FFE766" />
              <stop offset="1" stopColor="#FFA928" />
            </linearGradient>
          </defs>

          {/* Rotating Golden Sun Rays */}
          <g className="rt">
            <g transform="translate(150 138)">
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(0)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(30)" fill="#FFC83D" />
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(60)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(90)" fill="#FFC83D" />
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(120)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(150)" fill="#FFC83D" />
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(180)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(210)" fill="#FFC83D" />
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(240)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(270)" fill="#FFC83D" />
              <rect x="-9" y="-136" width="18" height="32" rx="9" transform="rotate(300)" fill="#FFC83D" />
              <rect x="-9" y="-126" width="18" height="22" rx="9" transform="rotate(330)" fill="#FFC83D" />
            </g>
          </g>

          {/* Pulsing Warm Glow Sun Circle */}
          <g className="hb">
            <circle cx="150" cy="138" r="84" fill="url(#sn)" />
          </g>

          {/* Grateful Character With Hands To Heart */}
          <g transform="translate(150 156) scale(1.4)">
            <g className="br" style={{ animationDelay: '0s' }}>
              {/* Hair bun back */}
              <g transform="rotate(0 0 44)">
                <circle cy="-52" r="13" fill="#4A2A1A" />
              </g>
              {/* Neck */}
              <path d="M-10 20V52Q0 60 10 52V20Z" fill="#8E5A3A" />
              {/* Warm Linen Top */}
              <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#FBF6EE" />
              <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity="0.12" />
              <path d="M-14 49L0 82L14 49Z" fill="#A9704B" />

              {/* Head with tilt */}
              <g transform="rotate(0 0 44)">
                <g className="hd">
                  {/* Ears */}
                  <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                  <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#A9704B" />
                  {/* Face */}
                  <ellipse rx="26" ry="33" fill="#A9704B" />
                  {/* Gentle Closed Eyes */}
                  <path d="M-15 3Q-11 7 -7 3M7 3Q11 7 15 3" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Eyebrows */}
                  <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#4A2A1A" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Nose */}
                  <path d="M0 6Q-3 13 2 14" fill="none" stroke="#8E5A3A" strokeWidth="2" strokeLinecap="round" />
                  {/* Serene Smile */}
                  <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                  {/* Bangs / Hair Front */}
                  <path d="M-27 -4C-30 -34 -12 -42 0 -42C12 -42 30 -34 27 -4C22 -20 8 -28 0 -28C-8 -28 -22 -20 -27 -4Z" fill="#4A2A1A" />
                </g>
              </g>
            </g>
          </g>

          {/* Hands Folded in Gratitude / Prayer */}
          <path d="M150 298C130 266 132 238 150 220C168 238 170 266 150 298Z" fill="#B27B56" stroke="#8E5A3A" strokeWidth="1.5" />
          <path d="M150 226V292" stroke="#8E5A3A" strokeWidth="1.5" />

          {/* Rising Golden Gratitude Sparkles */}
          <g className="rs" style={{ animationDelay: '0s' }}>
            <circle cx="60" cy="200" r="3" fill="#FFE9A0" />
          </g>
          <g className="rs" style={{ animationDelay: '1s' }}>
            <circle cx="246" cy="180" r="4" fill="#FFE9A0" />
          </g>
          <g className="rs" style={{ animationDelay: '2s' }}>
            <circle cx="90" cy="110" r="3" fill="#FFE9A0" />
          </g>
          <g className="rs" style={{ animationDelay: '2.7s' }}>
            <circle cx="222" cy="90" r="3" fill="#FFE9A0" />
          </g>

          {/* Twinkling Stars */}
          <g className="tw" style={{ animationDelay: '0s' }}>
            <path transform="translate(36 64) scale(0.8)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" />
          </g>
          <g className="tw" style={{ animationDelay: '0.9s' }}>
            <path transform="translate(266 60) scale(0.9)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" />
          </g>
        </svg>
      </div>

      {/* Bottom Question Card Box */}
      <div className="absolute left-[6%] right-[6%] bottom-[4%] min-h-[110px] sm:min-h-[128px] max-h-[148px] px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col justify-center gap-1.5 rounded-3xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xl z-20 overflow-hidden">
        {/* Level Tag & Dots */}
        <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-white/85">
          <span>{levelLabel}</span>
          <div className="flex gap-1.5 items-center">
            <span
              className={`w-2 h-2 rounded-full ${
                dotLevel >= 1 ? 'bg-white opacity-100' : 'bg-white opacity-30'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                dotLevel >= 2 ? 'bg-white opacity-100' : 'bg-white opacity-30'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                dotLevel >= 3 ? 'bg-white opacity-100' : 'bg-white opacity-30'
              }`}
            />
          </div>
        </div>

        {/* Question Text with Dynamic Responsive Scaling */}
        <p className={`${questionFontSize} font-semibold leading-snug line-clamp-3 text-white m-0`}>
          {question}
        </p>
      </div>
    </div>
  );
}

