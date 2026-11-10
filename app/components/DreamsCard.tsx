'use client';

import React from 'react';

export interface DreamsCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function DreamsCard({
  question = 'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?',
  level = 'Santai',
  cardNumber = '05',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: DreamsCardProps) {
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
        shadow-[0_20px_50px_rgba(53,37,143,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(169,155,255,0.4)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#A99BFF]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.26), rgba(0,0,0,0) 42%), linear-gradient(155deg, #6D5AE6, #35258F)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#fff',
      }}
    >
      <style jsx>{`
        .fl {
          animation: fl 3.8s ease-in-out infinite;
        }
        @keyframes fl {
          50% { transform: translateY(-8px); }
        }
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
        .dr {
          animation: dr 8s ease-in-out infinite;
        }
        @keyframes dr {
          50% { transform: translateX(14px); }
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
          background: 'radial-gradient(circle, #A99BFF 0%, rgba(169,155,255,0) 68%)',
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
          Dreams
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 m-0 truncate" suppressHydrationWarning>
          {'Hopes & Wishes'}
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-md border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#A99BFF] block flex-shrink-0" />
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

      {/* Main Vector Artwork: Crescent Moon, Drifting Clouds & Dreamer */}
      <div className="absolute inset-x-0 top-[17%] bottom-[24%] flex items-center justify-center pointer-events-none">
        <svg
          aria-hidden="true"
          viewBox="0 0 300 300"
          className="w-[90%] h-[90%] object-contain"
          style={{ clipPath: 'inset(0 0 16px 0)' }}
        >
          <defs>
            <linearGradient id="mn" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#FFF8D6" />
              <stop offset="1" stopColor="#F6D36E" />
            </linearGradient>
            <mask id="mk">
              <rect width="300" height="300" fill="#000" />
              <circle cx="196" cy="92" r="62" fill="#fff" />
              <circle cx="224" cy="78" r="54" fill="#000" />
            </mask>
          </defs>

          {/* Floating Crescent Moon */}
          <g className="fl">
            <circle cx="196" cy="92" r="62" fill="url(#mn)" mask="url(#mk)" />
          </g>

          {/* Drifting Cloud Left */}
          <g className="dr" style={{ animationDelay: '0s' }}>
            <g fill="#fff" opacity="0.9" transform="translate(8 250) scale(0.8)">
              <circle r="16" />
              <circle cx="24" cy="-8" r="20" />
              <circle cx="48" r="15" />
              <rect x="-14" y="-2" width="76" height="16" rx="8" />
            </g>
          </g>

          {/* Drifting Cloud Right */}
          <g className="dr" style={{ animationDelay: '2.5s' }}>
            <g fill="#fff" opacity="0.9" transform="translate(228 226) scale(0.7)">
              <circle r="16" />
              <circle cx="24" cy="-8" r="20" />
              <circle cx="48" r="15" />
              <rect x="-14" y="-2" width="76" height="16" rx="8" />
            </g>
          </g>

          {/* Dreamer Character Looking Up into the Night Sky */}
          <g transform="translate(132 172) scale(1.45)">
            <g className="br" style={{ animationDelay: '0s' }}>
              {/* Hair Back */}
              <g transform="rotate(-6 0 44)">
                <path d="M-34 0C-40 -50 -10 -58 4 -58C34 -58 44 -28 38 14L46 110L-48 110Z" fill="#241B3A" />
              </g>
              {/* Neck */}
              <path d="M-10 20V52Q0 60 10 52V20Z" fill="#BF855A" />
              {/* Shirt / Torso */}
              <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#EDE7FF" />
              <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity="0.12" />
              <path d="M-13 49Q0 68 13 49Z" fill="#D9A073" />
              {/* Hair Strands */}
              <path d="M-30 6C-38 40 -40 70 -46 100L-24 100C-22 62 -24 30 -26 10Z" fill="#241B3A" />
              <path d="M30 6C38 40 40 70 46 100L24 100C22 62 24 30 26 10Z" fill="#241B3A" />

              {/* Head with tilt */}
              <g transform="rotate(-6 0 44)">
                <g className="hd">
                  {/* Ears */}
                  <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                  <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#D9A073" />
                  {/* Face */}
                  <ellipse rx="26" ry="33" fill="#D9A073" />
                  {/* Peaceful Closed Eyes */}
                  <path d="M-15 3Q-11 7 -7 3M7 3Q11 7 15 3" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Eyebrows */}
                  <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#241B3A" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Nose */}
                  <path d="M0 6Q-3 13 2 14" fill="none" stroke="#BF855A" strokeWidth="2" strokeLinecap="round" />
                  {/* Gentle Smile */}
                  <path d="M-7 21Q0 27 7 21" fill="none" stroke="#B9475B" strokeWidth="2.8" strokeLinecap="round" />
                  {/* Front Bangs / Hair */}
                  <path d="M-27 -4C-30 -34 -12 -42 2 -42C20 -42 30 -30 27 -4C20 -22 6 -28 -4 -26C-14 -22 -22 -14 -27 -4Z" fill="#241B3A" />
                </g>
              </g>
            </g>
          </g>

          {/* Twinkling Golden Stars */}
          <g className="tw" style={{ animationDelay: '0s' }}>
            <path transform="translate(60 70) scale(1)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
          </g>
          <g className="tw" style={{ animationDelay: '0.8s' }}>
            <path transform="translate(262 170) scale(0.8)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
          </g>
          <g className="tw" style={{ animationDelay: '1.5s' }}>
            <path transform="translate(40 150) scale(0.6)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
          </g>
          <g className="tw" style={{ animationDelay: '0.4s' }}>
            <path transform="translate(110 30) scale(0.7)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
          </g>
          <g className="tw" style={{ animationDelay: '1.1s' }}>
            <path transform="translate(250 40) scale(0.7)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFF3B0" />
          </g>
        </svg>
      </div>

      {/* Bottom Question Card Box */}
      <div className="absolute left-[6%] right-[6%] bottom-[4%] min-h-[110px] sm:min-h-[128px] max-h-[148px] px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col justify-center gap-1.5 rounded-3xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xl z-20 overflow-hidden">
        {/* Level Tag & Dots */}
        <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-white/85">
          <span suppressHydrationWarning>{levelLabel}</span>
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
        <p className={`${questionFontSize} font-semibold leading-snug line-clamp-3 text-white m-0`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

