'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../AppContext';
import ThemeCard from '../ThemeCard';

export default function ThemesClient() {
  const { lang, t, themes } = useApp();

  const pdfCardsMap: Record<string, string> = {
    family: 'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?',
    love: 'Kapan terakhir kali kamu merasa benar-benar dicintai?',
    passion: 'Apa yang bisa membuatmu lupa waktu saat kamu melakukannya?',
    friendship: 'Siapa yang selalu ada saat kamu sedang tidak baik-baik saja?',
    dreams: 'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?',
    gratitude: 'Hal kecil apa hari ini yang membuatmu merasa bersyukur?',
    kids: 'Kalau kamu bisa jadi hewan apa saja, kamu mau jadi apa? Kenapa?',
    custom: 'Tulis pertanyaanmu sendiri, lalu kocok bersama teman-temanmu.'
  };

  const pdfCategoryMap: Record<string, string> = {
    family: 'Cerita Keluarga',
    love: 'Mendalam',
    passion: 'Api Semangat',
    friendship: 'Mendalam',
    dreams: 'Mimpi & Harapan',
    gratitude: 'Rasa Syukur',
    kids: 'Santai',
    custom: 'Santai'
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-6 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-black mb-4">{t.themesSectionTitle}</h1>
          <p className="text-zinc-400 text-sm sm:text-base">{t.themesSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {themes.map((th, index) => (
            <div key={th.slug} className="w-full flex justify-center">
              <Link href={th.slug === 'custom' ? '/custom' : `/play?theme=${th.slug}`}>
                <ThemeCard
                  title={th.titleEn}
                  category={pdfCategoryMap[th.slug]}
                  number={`0${index + 1}`}
                  question={pdfCardsMap[th.slug]}
                  slug={th.slug}
                  gradient={th.gradient}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
