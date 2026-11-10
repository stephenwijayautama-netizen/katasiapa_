'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import KidsCard from './components/KidsCard';
import CustomCard from './components/CustomCard';
import NongkeeCard from './components/NongkeeCard';
import PasanganCard from './components/PasanganCard';
import DreamsCard from './components/DreamsCard';
import GratitudeCard from './components/GratitudeCard';
import FamilyCard from './components/FamilyCard';
import PassionCard from './components/PassionCard';

const CARD_BG_IMAGES: Record<string, string> = {
  family: '/family_card_bg.jpg',
  love: '/love_card_bg.jpg',
  passion: '/passion_card_bg.jpg',
  friendship: '/friendship_card_bg.jpg',
  dreams: '/dreams_card_bg.jpg',
  gratitude: '/gratitude_card_bg.jpg',
};

const FALLBACK_GRADIENTS: Record<string, string> = {
  family: 'from-blue-600 to-indigo-950',
  love: 'from-pink-600 to-rose-950',
  passion: 'from-red-600 to-amber-950',
  friendship: 'from-emerald-600 to-teal-950',
  dreams: 'from-purple-600 to-violet-950',
  gratitude: 'from-amber-600 to-yellow-950',
};

export default function ThemeCard({
  title,
  slug,
  gradient,
  bgImage: bgImageProp,
  onClick,
  active = false,
  size = 'default',
  category,
  number,
  question,
  creatorName,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  category?: string;
  number?: string;
  question?: string;
  creatorName?: string;
  slug?: string;
  gradient?: string;
  bgImage?: string;
  onClick?: () => void;
  active?: boolean;
  size?: 'default' | 'large' | 'compact';
  className?: string;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const themeKey = slug || (title ? title.toLowerCase() : 'family');
  const bgImage = bgImageProp || CARD_BG_IMAGES[themeKey] || CARD_BG_IMAGES[themeKey.replace('event-', '')];

  // Ukuran proporsional rasio kartu asli (5:7) dengan dukungan penuh layar mobile
  const sizeClasses = size === 'large'
    ? 'w-[min(340px,calc(100vw-32px))] sm:w-[375px] aspect-[5/7]'
    : size === 'compact'
    ? 'w-[min(260px,calc(100vw-48px))] sm:w-[290px] aspect-[5/7]'
    : 'w-[min(280px,calc(100vw-36px))] sm:w-[320px] aspect-[5/7]';

  const handleClick = (e: React.MouseEvent) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    if (onClick) onClick();
  };

  if (themeKey === 'kids' || themeKey === 'dunia-si-kecil') {
    return (
      <KidsCard
        question={question || 'Kalau kamu bisa jadi hewan apa saja, kamu mau jadi apa? Kenapa?'}
        level={category || 'LIGHT'}
        cardNumber={number || '04'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#2DD4C4] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'custom' || themeKey === 'pertanyaan-kustom' || themeKey === 'kustom') {
    return (
      <CustomCard
        question={question || 'Tulis pertanyaanmu sendiri, lalu kocok bersama teman-temanmu.'}
        level={category || 'LIGHT'}
        cardNumber={number || '01'}
        creatorName={creatorName}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#FFC83D] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'friendship' || themeKey === 'nongkee' || themeKey === 'kartu-nongkee') {
    return (
      <NongkeeCard
        question={question || 'Siapa yang selalu ada saat kamu sedang tidak baik-baik saja?'}
        level={category || 'DEEP'}
        cardNumber={number || '02'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#5EEAB0] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'love' || themeKey === 'pasangan') {
    return (
      <PasanganCard
        question={question || 'Kapan terakhir kali kamu merasa benar-benar dicintai?'}
        level={category || 'DEEP'}
        cardNumber={number || '03'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#FF8FBF] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'dreams' || themeKey === 'mimpi') {
    return (
      <DreamsCard
        question={question || 'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?'}
        level={category || 'LIGHT'}
        cardNumber={number || '05'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#A99BFF] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'gratitude' || themeKey === 'rasa-syukur' || themeKey === 'syukur') {
    return (
      <GratitudeCard
        question={question || 'Hal kecil apa hari ini yang membuatmu merasa bersyukur?'}
        level={category || 'DEEP'}
        cardNumber={number || '06'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#7AD0FF] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'family' || themeKey === 'keluarga' || themeKey === 'cerita-keluarga') {
    return (
      <FamilyCard
        question={question || 'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?'}
        level={category || 'LIGHT'}
        cardNumber={number || '01'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#FFB067] scale-[1.03]' : ''}`}
      />
    );
  }

  if (themeKey === 'passion' || themeKey === 'api-semangat' || themeKey === 'semangat') {
    return (
      <PassionCard
        question={question || 'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?'}
        level={category || 'BRAVE'}
        cardNumber={number || '03'}
        onClick={onClick}
        size={size}
        className={`${className} ${active ? 'ring-4 ring-[#FF7A45] scale-[1.03]' : ''}`}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`relative ${sizeClasses} rounded-[32px] sm:rounded-[36px] overflow-hidden cursor-pointer select-none
        border border-white/20
        shadow-[0_20px_50px_rgba(0,0,0,0.85)]
        transition-all duration-300 ease-out
        hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(236,72,153,0.35)]
        ${active ? 'ring-4 ring-pink-500 scale-[1.03] shadow-[0_0_35px_rgba(236,72,153,0.5)]' : ''}
        ${isClicked ? 'scale-95 rotate-1 duration-150' : ''}
        ${className}`}
      style={{
        aspectRatio: '5 / 7',
      }}
    >
      {/* ── Gambar Kartu Asli (Desain Lengkap dari PDF tanpa teks tambahan) ── */}
      {bgImage ? (
        <Image
          src={bgImage}
          alt={title || 'Kartu Game'}
          fill
          sizes="(max-width: 640px) 320px, 375px"
          className="object-cover object-center pointer-events-none transition-transform duration-500 hover:scale-105"
          priority
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-b ${gradient || FALLBACK_GRADIENTS[themeKey] || 'from-blue-600 to-indigo-950'}`} />
      )}

      {/* ── Efek Kilau Interaktif saat Diklik atau Hover ── */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isClicked
            ? 'opacity-100 bg-gradient-to-tr from-pink-500/25 via-white/20 to-transparent'
            : 'opacity-0 hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-transparent'
        }`}
      />

      {/* ── Efek Pulse Ripple saat Kartu Diklik ── */}
      {isClicked && (
        <div
          className="absolute inset-0 rounded-[32px] sm:rounded-[36px] pointer-events-none border-2 border-pink-400 animate-ping"
          style={{ animationDuration: '0.4s' }}
        />
      )}
    </div>
  );
}
