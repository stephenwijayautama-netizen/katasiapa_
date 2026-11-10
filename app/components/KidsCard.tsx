'use client';

import React from 'react';

export interface KidsCardProps {
  question?: string;
  level?: 'Santai' | 'Mendalam' | 'Hati ke Hati' | string;
  cardNumber?: string;
  onClick?: () => void;
  isAnimating?: boolean;
  className?: string;
  size?: 'default' | 'large' | 'compact';
}

export default function KidsCard({
  question = 'Kalau kamu bisa jadi hewan apa saja, kamu mau jadi apa? Kenapa?',
  level = 'Santai',
  cardNumber = '04',
  onClick,
  isAnimating = false,
  className = '',
  size = 'default',
}: KidsCardProps) {
  // Dot level indicator: LIGHT / DEEP / BRAVE
  const isBrave = level.toLowerCase().includes('berani') || level.toLowerCase().includes('brave') || level.toLowerCase().includes('hati');
  const isDeep = level.toLowerCase().includes('dalam') || level.toLowerCase().includes('deep');
  const dotLevel = isBrave ? 3 : isDeep ? 2 : 1;
  const levelLabel = dotLevel === 3 ? 'BRAVE' : dotLevel === 2 ? 'DEEP' : 'LIGHT';

  // Responsive font size based on text length to prevent truncation
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
        border-2 border-white/40
        shadow-[0_20px_50px_rgba(14,154,167,0.35)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(45,212,196,0.45)]
        ${isAnimating ? 'scale-95 rotate-1 duration-150 ring-4 ring-[#2DD4C4]' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
        background: 'linear-gradient(155deg, #2DD4C4, #0E9AA7)',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#0B2B3A',
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
          animation: fl 3.4s ease-in-out infinite;
        }
        @keyframes fl {
          50% { transform: translateY(-8px); }
        }
        .wv {
          transform-box: fill-box;
          transform-origin: 70% 92%;
          animation: wv 1.7s ease-in-out infinite;
        }
        @keyframes wv {
          0%, 100% { transform: rotate(6deg); }
          50% { transform: rotate(-16deg); }
        }
        .dr {
          animation: dr 8s ease-in-out infinite;
        }
        @keyframes dr {
          50% { transform: translateX(14px); }
        }
        .ew {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: ew 2.4s ease-in-out infinite;
        }
        @keyframes ew {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .hp {
          animation: hp 2.2s ease-in-out infinite;
        }
        @keyframes hp {
          0%, 55%, 100% { transform: translateY(0); }
          25% { transform: translateY(-16px); }
        }
      `}</style>

      {/* Dotted Radial Glow Rings */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[80%] h-[55%] rounded-full bg-[radial-gradient(circle,#C8FFF6_0%,#C8FFF600_68%)] opacity-60 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[85%] h-[58%] box-border rounded-full border-[3px] border-dotted border-white/60 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute left-6 top-6 sm:left-7 sm:top-7 z-10 pointer-events-none max-w-[62%]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B3A] tracking-tight leading-none m-0" suppressHydrationWarning>
          Kids
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#0B2B3A]/85 mt-1.5 m-0 truncate" suppressHydrationWarning>
          Fun Talks for Little Ones
        </p>
      </div>

      {/* Badges Right Top */}
      <div className="absolute right-6 top-6 sm:right-7 sm:top-7 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2B3A] text-white text-xs sm:text-sm font-bold shadow-md">
          <span className="w-4 h-4 rounded-full bg-[#C8FFF6] block flex-shrink-0" />
          <span suppressHydrationWarning>{cardNumber}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0B2B3A] text-white text-[11px] font-semibold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z" />
          </svg>
          <span suppressHydrationWarning>Kids</span>
        </div>
      </div>

      {/* Character Illustration SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        className="absolute left-1/2 -translate-x-1/2 top-[12%] sm:top-[13%] w-[88%] h-[48%] sm:h-[50%] pointer-events-none"
        style={{ clipPath: 'inset(0 0 16px 0)' }}
      >
        <defs>
          <linearGradient id="fb_kids" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#D69A66" />
            <stop offset="1" stopColor="#A8693A" />
          </linearGradient>
          <linearGradient id="fw_kids" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EBDDEA" />
          </linearGradient>
          <linearGradient id="fc_kids" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#FFE766" />
            <stop offset="1" stopColor="#FFBE1A" />
          </linearGradient>
        </defs>

        {/* Rainbow Arcs */}
        <path d="M32 236A118 118 0 0 1 268 236" fill="none" stroke="#FF6B8B" strokeWidth="12" strokeLinecap="round" />
        <path d="M46 236A104 104 0 0 1 254 236" fill="none" stroke="#FFD23F" strokeWidth="12" strokeLinecap="round" />
        <path d="M60 236A90 90 0 0 1 240 236" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
        <path d="M74 236A76 76 0 0 1 226 236" fill="none" stroke="#B8A4FF" strokeWidth="12" strokeLinecap="round" />

        {/* Soft Clouds */}
        <g className="dr" style={{ animationDelay: '0s' }}>
          <g fill="#fff" transform="translate(20 238) scale(0.9)">
            <circle r="16" />
            <circle cx="24" cy="-8" r="20" />
            <circle cx="48" r="15" />
            <rect x="-14" y="-2" width="76" height="16" rx="8" />
          </g>
        </g>
        <g className="dr" style={{ animationDelay: '2.5s' }}>
          <g fill="#fff" transform="translate(212 238) scale(0.9)">
            <circle r="16" />
            <circle cx="24" cy="-8" r="20" />
            <circle cx="48" r="15" />
            <rect x="-14" y="-2" width="76" height="16" rx="8" />
          </g>
        </g>

        {/* Grassy Hills */}
        <ellipse cx="150" cy="306" rx="215" ry="58" fill="#6FC83A" />
        <ellipse cx="150" cy="298" rx="215" ry="58" fill="#8BE04E" />

        {/* Left Character: Cute Bunny */}
        <g className="fl" style={{ animationDelay: '.6s' }}>
          <g className="ew">
            <ellipse cx="44" cy="156" rx="11" ry="32" fill="url(#fw_kids)" />
            <ellipse cx="44" cy="160" rx="5.5" ry="21" fill="#FFB3C7" />
          </g>
          <g className="ew" style={{ animationDelay: '.5s' }}>
            <ellipse cx="72" cy="154" rx="11" ry="32" fill="url(#fw_kids)" />
            <ellipse cx="72" cy="158" rx="5.5" ry="21" fill="#FFB3C7" />
          </g>
          <ellipse cx="46" cy="274" rx="12" ry="7" fill="url(#fw_kids)" />
          <ellipse cx="70" cy="274" rx="12" ry="7" fill="url(#fw_kids)" />
          <ellipse cx="58" cy="248" rx="31" ry="28" fill="url(#fw_kids)" />
          <circle cx="58" cy="204" r="34" fill="url(#fw_kids)" />
          <g className="bl">
            <ellipse cx="46" cy="202" rx="6.2" ry="8" fill="#2B1B3F" />
            <circle cx="48.4" cy="198.8" r="2.9" fill="#fff" />
            <circle cx="43.6" cy="205.4" r="1.4" fill="#fff" opacity=".85" />
          </g>
          <g className="bl">
            <ellipse cx="70" cy="202" rx="6.2" ry="8" fill="#2B1B3F" />
            <circle cx="72.4" cy="198.8" r="2.9" fill="#fff" />
            <circle cx="67.6" cy="205.4" r="1.4" fill="#fff" opacity=".85" />
          </g>
          <ellipse cx="38" cy="216" rx="7" ry="4.5" fill="#FF8FA0" opacity=".6" />
          <ellipse cx="78" cy="216" rx="7" ry="4.5" fill="#FF8FA0" opacity=".6" />
          <ellipse cx="58" cy="211" rx="4" ry="3" fill="#FF7FA0" />
          <path d="M52 217Q58 223 64 217" fill="none" stroke="#B5546F" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Right Character: Cheerful Yellow Chick */}
        <g className="hp" style={{ animationDelay: '1.1s' }}>
          <ellipse cx="232" cy="258" rx="9" ry="4.5" fill="#FF8A1F" />
          <ellipse cx="254" cy="258" rx="9" ry="4.5" fill="#FF8A1F" />
          <circle cx="242" cy="214" r="40" fill="url(#fc_kids)" />
          <circle cx="234" cy="173" r="5" fill="#FFD43A" />
          <circle cx="242" cy="169" r="5.5" fill="#FFD43A" />
          <circle cx="250" cy="173" r="5" fill="#FFD43A" />
          <ellipse cx="206" cy="226" rx="9" ry="17" transform="rotate(18 206 226)" fill="#FFB400" />
          <g className="wv" style={{ transformOrigin: '30% 92%' }}>
            <ellipse cx="278" cy="226" rx="9" ry="17" transform="rotate(-18 278 226)" fill="#FFB400" />
          </g>
          <g className="bl">
            <ellipse cx="230" cy="208" rx="5.9" ry="7.5" fill="#2B1B3F" />
            <circle cx="232.2" cy="205.0" r="2.7" fill="#fff" />
            <circle cx="227.8" cy="211.2" r="1.3" fill="#fff" opacity=".85" />
          </g>
          <g className="bl">
            <ellipse cx="254" cy="208" rx="5.9" ry="7.5" fill="#2B1B3F" />
            <circle cx="256.2" cy="205.0" r="2.7" fill="#fff" />
            <circle cx="251.8" cy="211.2" r="1.3" fill="#fff" opacity=".85" />
          </g>
          <ellipse cx="222" cy="222" rx="7" ry="4.5" fill="#FF8A6B" opacity=".6" />
          <ellipse cx="262" cy="222" rx="7" ry="4.5" fill="#FF8A6B" opacity=".6" />
          <path d="M236 217L248 217L242 227Z" fill="#FF8A1F" stroke="#FF8A1F" strokeWidth="3" strokeLinejoin="round" />
        </g>

        {/* Center Character: Warm Brown Bear */}
        <g className="fl">
          <ellipse cx="120" cy="262" rx="22" ry="12" fill="url(#fb_kids)" />
          <ellipse cx="180" cy="262" rx="22" ry="12" fill="url(#fb_kids)" />
          <ellipse cx="150" cy="222" rx="48" ry="46" fill="url(#fb_kids)" />
          <ellipse cx="150" cy="232" rx="28" ry="28" fill="#F8E0BE" />
          <g className="wv">
            <ellipse cx="98" cy="212" rx="14" ry="28" transform="rotate(-25 98 212)" fill="url(#fb_kids)" />
          </g>
          <ellipse cx="202" cy="222" rx="14" ry="26" transform="rotate(25 202 222)" fill="url(#fb_kids)" />
          <circle cx="108" cy="104" r="19" fill="url(#fb_kids)" />
          <circle cx="108" cy="106" r="10" fill="#F5B7A8" />
          <circle cx="192" cy="104" r="19" fill="url(#fb_kids)" />
          <circle cx="192" cy="106" r="10" fill="#F5B7A8" />
          <circle cx="150" cy="148" r="54" fill="url(#fb_kids)" />
          <ellipse cx="150" cy="166" rx="24" ry="18" fill="#F8E0BE" />
          <ellipse cx="150" cy="158" rx="9" ry="6.5" fill="#4A2A1A" />
          <path d="M142 172Q150 181 158 172" fill="none" stroke="#4A2A1A" strokeWidth="3" strokeLinecap="round" />
          <g className="bl">
            <ellipse cx="128" cy="140" rx="8.6" ry="11" fill="#2B1B3F" />
            <circle cx="131.3" cy="135.6" r="4.0" fill="#fff" />
            <circle cx="124.7" cy="144.6" r="1.9" fill="#fff" opacity=".85" />
          </g>
          <g className="bl">
            <ellipse cx="172" cy="140" rx="8.6" ry="11" fill="#2B1B3F" />
            <circle cx="175.3" cy="135.6" r="4.0" fill="#fff" />
            <circle cx="168.7" cy="144.6" r="1.9" fill="#fff" opacity=".85" />
          </g>
          <ellipse cx="108" cy="160" rx="11" ry="7" fill="#FF8FA0" opacity=".6" />
          <ellipse cx="192" cy="160" rx="11" ry="7" fill="#FF8FA0" opacity=".6" />
        </g>

        {/* Twinkling Stars */}
        <g className="tw" style={{ animationDelay: '0s' }}>
          <path transform="translate(36 70) scale(1)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" />
        </g>
        <g className="tw" style={{ animationDelay: '0.8s' }}>
          <path transform="translate(268 64) scale(0.8)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFE45C" />
        </g>
        <g className="tw" style={{ animationDelay: '1.4s' }}>
          <path transform="translate(100 40) scale(0.7)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#FFE45C" />
        </g>
        <g className="tw" style={{ animationDelay: '0.4s' }}>
          <path transform="translate(204 30) scale(0.9)" d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" />
        </g>
      </svg>

      {/* Bottom Question Box (Exact Reference Design - Dynamic Auto Fit) */}
      <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[125px] sm:min-h-[142px] max-h-[185px] box-border p-3.5 sm:p-5 flex flex-col justify-center gap-1.5 rounded-[24px] sm:rounded-[30px] bg-white/95 border border-white/70 shadow-lg text-[#0B2B3A] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-widest uppercase opacity-85 flex-shrink-0">
          <span suppressHydrationWarning>{levelLabel}</span>
          <span className="flex gap-1.5">
            <i className={`w-2 h-2 rounded-full bg-[#0B2B3A] ${dotLevel >= 1 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#0B2B3A] ${dotLevel >= 2 ? 'opacity-100' : 'opacity-25'}`} />
            <i className={`w-2 h-2 rounded-full bg-[#0B2B3A] ${dotLevel >= 3 ? 'opacity-100' : 'opacity-25'}`} />
          </span>
        </div>
        <p className={`${questionFontSize} font-bold text-[#0B2B3A] m-0 break-words`} suppressHydrationWarning>
          {question}
        </p>
      </div>
    </div>
  );
}

