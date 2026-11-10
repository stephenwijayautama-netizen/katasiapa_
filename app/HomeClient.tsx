'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from './AppContext';
import ThemeCard from './ThemeCard';
import { ThemeItem } from './store';
import { soundEngine } from './lib/soundEngine';
import {
  Play,
  Sparkles,
  Shuffle,
  MessageCircle,
  Flame,
  Coffee,
  Moon,
  Heart,
  Users,
  HelpCircle,
  ShieldCheck,
  Ban,
  PhoneOff,
  Ear,
  X,
  ChevronDown,
} from 'lucide-react';

export default function HomeClient() {
  const { t, themes, cards, themeMode, isMounted } = useApp();
  const [infoThemeModal, setInfoThemeModal] = useState<ThemeItem | null>(null);

  const currentTheme = isMounted ? themeMode : 'dark';
  const logoSrc = currentTheme === 'light' ? '/logo.png' : '/logo_dark.png';

  // Ambil tema resmi termasuk edisi Dunia Si Kecil & Kustom
  const validThemes = themes.filter((th) =>
    ['family', 'love', 'passion', 'friendship', 'dreams', 'gratitude', 'kids', 'custom'].includes(th.slug)
  );

  const handleCardClick = (th: ThemeItem) => {
    soundEngine.playFlip();
    setInfoThemeModal(th);
  };

  // 5 Tema terfavorit untuk kipas kartu hero (Friendship, Dreams, Kids, Gratitude, Love)
  const featuredFanSlugs = ['friendship', 'dreams', 'kids', 'gratitude', 'love'];
  const fanThemes = featuredFanSlugs
    .map((slug) => validThemes.find((th) => th.slug === slug))
    .filter(Boolean) as ThemeItem[];

  // Posisi simetris 5 kartu di dalam kanvas tetap 720px (diskalasi otomatis sesuai lebar layar)
  const fixedFanCards = [
    {
      slug: 'friendship',
      left: '0px',
      top: '28px',
      rotate: '-14deg',
      scale: '0.88',
      zIndex: 10,
      opacity: 0.92,
    },
    {
      slug: 'dreams',
      left: '122px',
      top: '12px',
      rotate: '-7deg',
      scale: '0.94',
      zIndex: 20,
      opacity: 0.96,
    },
    {
      slug: 'kids',
      left: '245px',
      top: '0px',
      rotate: '0deg',
      scale: '1.05',
      zIndex: 30,
      opacity: 1,
    },
    {
      slug: 'gratitude',
      left: '368px',
      top: '12px',
      rotate: '7deg',
      scale: '0.94',
      zIndex: 20,
      opacity: 0.96,
    },
    {
      slug: 'love',
      left: '490px',
      top: '28px',
      rotate: '14deg',
      scale: '0.88',
      zIndex: 10,
      opacity: 0.92,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Pilih Vibe & Temamu',
      tag: 'Step 1 · Pilih Topik',
      badgeColor: 'from-pink-500 to-rose-500',
      icon: Flame,
      desc: 'Tentukan tema obrolan yang paling pas sama suasana nongkrong hari ini. Mau nostalgia hangat di Family, deep talk berdua di Love, bakar ambisi di Passion, atau curhat jujur bareng geng di Friendship.',
      highlight: '6 Tema Relate & Seru',
    },
    {
      num: '02',
      title: 'Kocok atau Spin Kartu',
      tag: 'Step 2 · Acak Pertanyaan',
      badgeColor: 'from-purple-500 to-indigo-500',
      icon: Shuffle,
      desc: 'Giliran pemain menekan tombol Kocok atau Spin untuk menarik kartu pertanyaan yang tak terduga. Kartu akan terkunci sesuai tema yang kamu pilih tanpa ada intervensi topik lain.',
      highlight: 'Animasi 3D & Efek Interaktif',
    },
    {
      num: '03',
      title: 'Jawab Jujur & Dengerin',
      tag: 'Step 3 · Ngobrol Lepas',
      badgeColor: 'from-emerald-500 to-teal-500',
      icon: MessageCircle,
      desc: 'Pemain yang dapat giliran wajib menjawab pertanyaannya sejujur mungkin. Yang lain bertugas mendengarkan dengan penuh tanpa memotong atau nge-judge. Dijamin obrolan makin dalam dan berkesan!',
      highlight: 'No Judgement Safe Zone',
    },
  ];

  const rules = [
    {
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      title: 'Safe Space & Rahasia Aman',
      desc: 'Apa pun rahasia, unek-unek, atau cerita yang diobrolkan saat main, tetap tinggal di meja ini. Gak boleh bocor ke luar!',
    },
    {
      icon: Ban,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      title: 'Boleh Pakai 1x Hak Skip',
      desc: 'Kalau pertanyaannya dirasa terlalu privat atau belum siap dijawab, kamu berhak bilang "Skip" 1x tanpa paksaan.',
    },
    {
      icon: Ear,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: 'Dengerin Sampai Tuntas',
      desc: 'Saat seseorang bercerita, jangan buru-buru dipotong atau dihakimi. Hargai keberanian dan kejujuran mereka.',
    },
    {
      icon: PhoneOff,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: 'Simpan Dulu Gadget Sebentar',
      desc: 'Taro HP dengan layar menghadap ke bawah. Nikmati momen tatap muka dan tatap mata yang langka di zaman sekarang.',
    },
  ];

  const vibes = [
    { label: 'Nongkrong Kafe Santai', icon: Coffee, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { label: 'Midnight Deep Talk 02:00', icon: Moon, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { label: 'Quality Time Pasangan', icon: Heart, color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
    { label: 'Geng Bestie & Sahabat', icon: Users, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { label: 'Momen Hangat Keluarga', icon: Sparkles, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col selection:bg-pink-500 selection:text-white w-full max-w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO SECTION (MIN 100DVH DI HP, FULLY RESPONSIVE & CENTERED)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100dvh-64px)] w-full max-w-full flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-16 overflow-hidden">
        {/* Glow ambient background dekoratif (terisolasi dalam container relative overflow-hidden) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(380px,90vw)] sm:w-[580px] h-[320px] bg-gradient-to-tr from-pink-600/25 via-purple-600/20 to-blue-600/20 blur-[130px] pointer-events-none rounded-full" />

        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          
          {/* Logo & Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6 backdrop-blur-sm">
            <Image
              src={logoSrc}
              alt="Kata Siapa"
              width={100}
              height={26}
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <span className="text-zinc-500">&bull;</span>
            <span className="text-[11px] sm:text-xs font-semibold text-pink-300 tracking-wide">
              ruang untuk berbagi cerita
            </span>
          </div>

          {/* Headline Singkat Menarik */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl mb-4 sm:mb-6 break-words px-2">
            Kocok Kartu. <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Mulai Obrolan Nyata.
            </span>
          </h1>

          {/* Deskripsi 1-2 Kalimat */}
          <p className="text-xs sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-3" suppressHydrationWarning>
            Gak ada lagi momen hening atau canggung saat nongkrong bareng teman, gebetan, atau keluarga. Pilih tema, kocok kartunya, dan temukan cerita tak terduga yang bikin makin dekat.
          </p>

          {/* CTA Buttons: Main Sekarang (Gradient Pink) & Rules & Cara Main (Sekunder) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md justify-center mb-8 sm:mb-10 px-2">
            <Link
              href="/play"
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span suppressHydrationWarning>{t.startPlaying || 'Mulai Main Sekarang'}</span>
            </Link>

            <a
              href="#rules-and-play"
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition flex items-center justify-center gap-2 text-zinc-300 hover:text-white cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-pink-400" />
              Rules & Cara Main
            </a>
          </div>

          {/* ── Kipas Kartu (5 kartu tema asli, responsif penuh di HP & Laptop) ── */}
          <div className="w-full max-w-full flex flex-col items-center justify-center py-2 select-none overflow-hidden">
            {/* Kontainer Kanvas Responsif Berdimensi Terkontrol & Clip Overflow */}
            <div className="relative w-[336px] min-[390px]:w-[360px] sm:w-[540px] md:w-[640px] lg:w-[720px] h-[185px] min-[390px]:h-[198px] sm:h-[295px] md:h-[350px] lg:h-[395px] mx-auto flex items-center justify-center overflow-hidden">
              {/* Kanvas 720px yang diskalasi secara presisi */}
              <div className="absolute top-0 left-0 w-[720px] h-[390px] origin-top-left scale-[0.466] min-[390px]:scale-[0.50] sm:scale-[0.75] md:scale-[0.888] lg:scale-100">
                {fanThemes.map((th, i) => {
                  const cfg = fixedFanCards[i];
                  if (!th || !cfg) return null;
                  return (
                    <div
                      key={th.slug}
                      className="absolute cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                      style={{
                        left: cfg.left,
                        top: cfg.top,
                        transform: `rotate(${cfg.rotate}) scale(${cfg.scale})`,
                        zIndex: cfg.zIndex,
                        opacity: cfg.opacity,
                      }}
                      onClick={() => handleCardClick(th)}
                      title={`Lihat detail kartu ${th.titleEn}`}
                    >
                      <ThemeCard
                        title={th.titleEn}
                        slug={th.slug}
                        active={i === 2}
                        size="compact"
                        className="!w-[230px] aspect-[5/7] shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.35)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chips Pemilih Tema Interaktif di Bawah Kipas */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-3 mt-4 max-w-xl">
              {fanThemes.map((th, i) => (
                <button
                  key={th.slug}
                  onClick={() => handleCardClick(th)}
                  className="px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 hover:border-pink-500/40 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        i === 0 ? '#10B981' : i === 1 ? '#8B5CF6' : i === 2 ? '#2DD4C4' : i === 3 ? '#3B82F6' : '#EC4899',
                    }}
                  />
                  <span>{th.titleEn}</span>
                </button>
              ))}
            </div>

            {/* Label Petunjuk Interaktif */}
            <div className="mt-3 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-zinc-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span>5 Tema Terfavorit &middot; Ketuk kartu untuk intip pertanyaan</span>
            </div>
          </div>

          {/* ── Petunjuk Scroll ke Bawah Menuju Section Pilihan Kategori ── */}
          <div className="mt-6 sm:mt-10 pt-2">
            <a
              href="#pilihan-kategori"
              className="inline-flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition group cursor-pointer"
            >
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                Gulir ke bawah untuk pilih kategori
              </span>
              <ChevronDown className="w-4 h-4 text-pink-400 animate-bounce group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. SECTION PILIHAN KATEGORI KARTU (MOBILE 1 KOLOM, TABLET 2, DESKTOP 3-4)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section id="pilihan-kategori" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi Kartu Resmi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-white">
            Pilihan Kategori
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-base leading-relaxed px-2">
            Temukan tema obrolan yang paling relate dengan suasana nongkrongmu hari ini. Setiap kategori menyimpan puluhan pertanyaan tak terduga.
          </p>
        </div>

        {/* Grid Kartu Responsif: Mobile 1 Kolom, Tablet 2 Kolom, Desktop 3-4 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {validThemes.map((th) => (
            <div key={th.slug} className="w-full flex justify-center">
              <div
                onClick={() => handleCardClick(th)}
                className="w-full max-w-[340px] sm:max-w-[360px] mx-auto cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              >
                <ThemeCard
                  title={th.titleEn}
                  slug={th.slug}
                  gradient={th.gradient}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. HOW TO PLAY & RULES SECTION (GAYA ANAK MUDA, ESTETIK & RELATABLE)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section id="rules-and-play" className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative overflow-hidden">
        {/* Glow aksen di background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-pink-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Heading Section */}
        <div className="text-center mb-14 sm:mb-16 relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white">
            Gak Perlu Canggung, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
              Ini Cara Main & Aturannya!
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed px-2">
            Hanya 3 langkah simpel buat ngubah nongkrong yang tadinya sibuk scroll HP jadi obrolan seru yang bikin ketawa lepas atau malah terharu bareng.
          </p>
        </div>

        {/* ── 3 Langkah Bermain (How to Play) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 mb-16">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="relative p-6 sm:p-8 rounded-3xl bg-[#14141C] border border-white/10 hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                      {st.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/10 group-hover:border-pink-500/30 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-3">
                    {st.tag}
                  </span>

                  <h3 className="text-lg sm:text-xl font-black text-white mb-2.5">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>{st.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Vibe Suasana Rekomendasi ── */}
        <div className="relative z-10 mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/30 via-pink-950/20 to-black border border-white/10">
          <div className="max-w-2xl mb-6">
            <h4 className="text-base sm:text-lg font-black text-white mb-1.5">
              Cocok Buat Vibe Nongkrong Apa Aja?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400">
              KataSiapa fleksibel dimainkan di momen mana pun bareng circle terdekatmu:
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {vibes.map((v) => {
              const VIcon = v.icon;
              return (
                <div
                  key={v.label}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold ${v.color} shadow-sm`}
                >
                  <VIcon className="w-4 h-4" />
                  <span>{v.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4 Aturan Main (Rules of the Game) ── */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold tracking-widest text-pink-400 uppercase">
              Kode Etik Pemain
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white mt-1">
              4 Aturan Main Agar Tetap Asik & Nyaman
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rules.map((rl) => {
              const RIcon = rl.icon;
              return (
                <div
                  key={rl.title}
                  className="p-5 sm:p-6 rounded-2xl bg-[#14141C] border border-white/10 flex items-start gap-4 hover:border-white/20 transition shadow-lg"
                >
                  <div className={`p-3 rounded-2xl border flex-shrink-0 ${rl.color}`}>
                    <RIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                      {rl.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {rl.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto py-12 px-6 border-t border-white/10 flex flex-col items-center justify-center space-y-4 text-center text-xs text-zinc-500">
        <Image
          src={logoSrc}
          alt="Kata Siapa - Ruang Untuk Berbagi Cerita"
          width={140}
          height={36}
          className="h-7 w-auto object-contain opacity-85 hover:opacity-100 transition"
        />
        <p suppressHydrationWarning>{t.footerText}</p>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL INFORMASI & PREVIEW ZOOM-OUT KARTU
          ══════════════════════════════════════════════════════════════════════════ */}
      {infoThemeModal && (() => {
        const infoThemeCards = (cards || []).filter(
          (c) =>
            c.themeSlug === infoThemeModal.slug ||
            (infoThemeModal.slug === 'love' && (c.themeSlug === 'pasangan' || c.themeSlug === 'love')) ||
            (infoThemeModal.slug === 'friendship' && (c.themeSlug === 'nongkee' || c.themeSlug === 'friendship'))
        );
        const sampleQuestions = infoThemeCards.slice(0, 3);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setInfoThemeModal(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-[#14141C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-zoom-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tombol Tutup */}
              <button
                onClick={() => setInfoThemeModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition z-20 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Sisi Kiri: Tampilan Kartu Visual Asli */}
                <div className="flex justify-center">
                  <ThemeCard
                    title={infoThemeModal.titleEn}
                    slug={infoThemeModal.slug}
                    gradient={infoThemeModal.gradient}
                    size="default"
                  />
                </div>

                {/* Sisi Kanan: Penjelasan & Informasi Kartu */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                        {infoThemeModal.editionLabel || 'Edisi KataSiapa'}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold">
                        {infoThemeCards.length} Kartu Siap
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      {infoThemeModal.titleEn}
                    </h3>
                    <p className="text-sm font-bold text-pink-400">
                      {infoThemeModal.subtitleEn || infoThemeModal.subtitleId}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cuplikan Topik Pertanyaan:</span>
                    </div>
                    {sampleQuestions.length > 0 ? (
                      <div className="space-y-2">
                        {sampleQuestions.map((q, idx) => (
                          <p key={idx} className="text-xs text-zinc-300 italic line-clamp-2">
                            &bull; &ldquo;{q.contentId}&rdquo;
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        Tema ini memuat pertanyaan yang dirancang untuk membuka obrolan hangat dan bermakna.
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                    <em>Kartu ini ditampilkan dalam mode preview informasi (zoom-out). Klik tutup untuk kembali ke beranda.</em>
                  </div>

                  <Link
                    href={`/play?theme=${infoThemeModal.slug}`}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Mulai Main Tema {infoThemeModal.titleEn}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
