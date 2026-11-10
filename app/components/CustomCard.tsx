'use client';

import React from 'react';

export interface CustomCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Berani' | string;
  cardNumber?: string;
  creatorName?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function CustomCard({
  question = 'Tulis pertanyaanmu sendiri, lalu kocok bersama teman-temanmu.',
  level = 'Santai',
  cardNumber = '01',
  creatorName,
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: CustomCardProps) {
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
        border-2 border-white/30
        shadow-[0_20px_50px_rgba(232,135,14,0.35)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,200,61,0.45)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#FFC83D]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background: 'linear-gradient(155deg, #FFC83D, #E8870E)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#2B1B00',
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
        .fl {
          animation: fl 3.8s ease-in-out infinite;
        }
        @keyframes fl {
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Dotted Radial Glow Rings */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#FFF3C4_0%,#FFF3C400_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[85%] h-[58%] box-border rounded-full border-2 border-[rgba(43,27,0,0.14)] pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B1B00] tracking-tight leading-none m-0" suppressHydrationWarning>
          Custom
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#2B1B00]/85 mt-1.5 m-0 truncate" suppressHydrationWarning>
          {creatorName ? `Created by ${creatorName}` : 'Make Your Own Deck'}
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B1B00] text-white text-xs sm:text-sm font-bold shadow-md">
          <span className="w-4 h-4 rounded-full bg-[#FFF3C4] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2B1B00] text-white text-[11px] font-semibold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span suppressHydrationWarning>Custom</span>
        </div>
      </div>

      {/* Character Illustration SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        className="absolute left-1/2 -translate-x-1/2 top-[12%] sm:top-[13%] w-[88%] h-[48%] sm:h-[50%] pointer-events-none"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        {/* Floating Left Card with ? */}
        <g className="fl" style={{ animationDelay: '0.4s' }}>
          <g transform="translate(20 96) rotate(-14)">
            <rect width="74" height="104" rx="12" fill="#fff" />
            <rect x="6" y="6" width="62" height="92" rx="8" fill="none" stroke="#E8870E" strokeOpacity=".35" strokeWidth="1.5" />
            <text x="37" y="66" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="44" fill="#E8870E">?</text>
          </g>
        </g>

        {/* Floating Right Card with ? */}
        <g className="fl" style={{ animationDelay: '1.2s' }}>
          <g transform="translate(206 72) rotate(12)">
            <rect width="74" height="104" rx="12" fill="#fff" />
            <rect x="6" y="6" width="62" height="92" rx="8" fill="none" stroke="#6C4CF1" strokeOpacity=".35" strokeWidth="1.5" />
            <text x="37" y="66" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="44" fill="#6C4CF1">?</text>
          </g>
        </g>

        {/* Center Character with Headphones */}
        <g transform="translate(150 170) scale(1.45)">
          <g className="bn" style={{ animationDelay: '0s' }}>
            <path d="M-10 20V52Q0 60 10 52V20Z" fill="#DDA67F" />
            <path d="M-58 220V92C-58 62 -34 49 0 49C34 49 58 62 58 92V220Z" fill="#6C4CF1" />
            <path d="M0 49C34 49 58 62 58 92V220H0Z" fill="#000" opacity=".12" />
            <path d="M-13 49Q0 68 13 49Z" fill="#F2C9A5" />
            <g transform="rotate(0 0 44)">
              <g className="hd">
                <ellipse cx="-26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse cx="26" cy="4" rx="4.5" ry="7" fill="#F2C9A5" />
                <ellipse rx="26" ry="33" fill="#F2C9A5" />
                <path d="M-15 4Q-11 -1 -7 4M7 4Q11 -1 15 4" fill="none" stroke="#2A1A1F" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M-17 -7Q-11 -11 -5 -8M5 -8Q11 -11 17 -7" fill="none" stroke="#1E1620" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M0 6Q-3 13 2 14" fill="none" stroke="#DDA67F" strokeWidth="2" strokeLinecap="round" />
                <path d="M-10 19Q0 33 10 19Z" fill="#fff" stroke="#7B2535" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M-28 -2C-32 -36 -14 -46 2 -46C22 -46 32 -32 28 -2C26 -16 20 -26 6 -28C-6 -22 -20 -22 -28 -2Z" fill="#1E1620" />
                <path d="M-30 0C-36 -56 36 -56 30 0" fill="none" stroke="#1F1F26" strokeWidth="5" />
                <rect x="-36" y="-8" width="10" height="22" rx="5" fill="#1F1F26" />
                <rect x="26" y="-8" width="10" height="22" rx="5" fill="#1F1F26" />
              </g>
            </g>
          </g>
        </g>

        {/* Top Floating Plus Icon */}
        <g>
          <circle cx="150" cy="40" r="24" fill="#2B1B00" />
          <path d="M150 28v24M138 40h24" stroke="#FFC83D" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Twinkling Stars */}
        <g className="tw" style={{ animationDelay: '0s' }}>
          <path transform="translate(52 70) scale(0.9)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#6C4CF1" />
        </g>
        <g className="tw" style={{ animationDelay: '0.8s' }}>
          <path transform="translate(262 150) scale(0.8)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" />
        </g>
        <g className="tw" style={{ animationDelay: '1.4s' }}>
          <path transform="translate(40 230) scale(0.6)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#6C4CF1" />
        </g>
      </svg>

      {/* Bottom Question Box */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-[rgba(43,27,0,0.92)] border border-white/20 shadow-xl text-white overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span className="text-[#FFC83D] flex items-center gap-1.5">
            <span suppressHydrationWarning>{levelLabel}</span>
            {creatorName && (
              <span className="opacity-80 font-normal lowercase tracking-normal text-[9px] sm:text-[10px]" suppressHydrationWarning>
                · by {creatorName}
              </span>
            )}
          </span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#FFC83D] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FFC83D] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#FFC83D] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-white m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

