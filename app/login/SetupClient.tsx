'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../AppContext';
import {
  Play,
  Check,
  Heart,
  Flame,
  Smile,
  Zap,
  Home,
  Sun,
  Star,
  Coffee,
  Ghost,
  HelpCircle,
  Users,
  ChevronDown,
  Layers,
  Sparkles,
  Settings,
  PenSquare,
} from 'lucide-react';
import ThemeCard from '../ThemeCard';

type FilterCategory = 'all' | 'grup' | 'berdua';
type VibeType = 'comedy' | 'romantic' | 'family' | 'horror';

interface DeckConfig {
  slug: string;
  title: string;
  badge?: string;
  badgeType?: 'popular' | 'new' | 'custom' | 'event';
  desc: string;
  category: 'all' | 'grup' | 'berdua';
  iconEmoji: string;
  iconBg?: string;
  levelVibe: VibeType;
  playerTag: string;
  isCustom?: boolean;
}

const DECK_CATALOG: DeckConfig[] = [
  {
    slug: 'custom',
    title: 'Pertanyaan Kustom',
    badge: 'NEW CARD',
    badgeType: 'new',
    desc: 'Buat dan mainkan dek pertanyaanmu sendiri.',
    category: 'all',
    iconEmoji: '',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    levelVibe: 'comedy',
    playerTag: 'Kustom',
    isCustom: true,
  },
  {
    slug: 'friendship',
    title: 'Kartu Nongkee',
    badge: '★ Populer',
    badgeType: 'popular',
    desc: 'Kartu obrolan seru untuk berbagai suasana nongkrong santai.',
    category: 'grup',
    iconEmoji: '',
    iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    levelVibe: 'comedy',
    playerTag: ' Grup',
  },
  {
    slug: 'love',
    title: 'Pasangan',
    badge: '★ Populer',
    badgeType: 'popular',
    desc: 'Bangun kedekatan dan kenali pasangan lebih dalam.',
    category: 'berdua',
    iconEmoji: '',
    iconBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    levelVibe: 'romantic',
    playerTag: '️ Berdua',
  },
  {
    slug: 'family',
    title: 'Keluarga Hangat',
    desc: 'Kenangan masa kecil dan kehangatan kumpul keluarga tercinta.',
    category: 'grup',
    iconEmoji: '',
    iconBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    levelVibe: 'family',
    playerTag: ' Grup',
  },
  {
    slug: 'dreams',
    title: 'Mimpi & Harapan',
    badge: 'Inspirasi',
    badgeType: 'event',
    desc: 'Bicara tentang cita-cita, masa depan, dan impian terbesar dalam hidup.',
    category: 'grup',
    iconEmoji: '️',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    levelVibe: 'comedy',
    playerTag: ' Grup',
  },
  {
    slug: 'passion',
    title: 'Passion & Ambisi',
    desc: 'Apa yang bisa membuatmu lupa waktu dan berapi-api saat melakukannya.',
    category: 'berdua',
    iconEmoji: '',
    iconBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    levelVibe: 'romantic',
    playerTag: '️ Berdua',
  },
  {
    slug: 'gratitude',
    title: 'Rasa Syukur',
    desc: 'Hal-hal kecil sehari-hari yang membuatmu merasa sangat bersyukur.',
    category: 'berdua',
    iconEmoji: '',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    levelVibe: 'family',
    playerTag: '️ Berdua',
  },
];

export default function SetupClient() {
  const { themes } = useApp();

  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('friendship');
  const [selectedLevel, setSelectedLevel] = useState<'light' | 'deep' | 'brave'>('light');

  // Gabungkan katalog template dengan tema dinamis dari dashboard jika ada
  const allDecks: DeckConfig[] = [
    ...DECK_CATALOG,
    ...themes
      .filter((th) => !DECK_CATALOG.some((d) => d.slug === th.slug))
      .map((th) => ({
        slug: th.slug,
        title: th.titleEn || th.titleId,
        badge: th.eventBadge || th.tag || 'Dashboard',
        badgeType: 'custom' as const,
        desc: th.subtitleEn || th.subtitleId || 'Dek kartu kustom dari dashboard',
        category: (th.edition === 'love' ? 'berdua' : 'grup') as 'grup' | 'berdua',
        iconEmoji: th.emoji || '',
        iconBg: 'bg-white/10 text-white border-white/20',
        levelVibe: (th.edition === 'love' ? 'romantic' : 'comedy') as VibeType,
        playerTag: th.edition === 'love' ? '️ Berdua' : ' Grup',
      })),
  ];

  // Filter deck sesuai filter category
  const filteredDecks = allDecks.filter((deck) => {
    if (activeCategory === 'all') return true;
    if (deck.category === 'all') return true;
    return deck.category === activeCategory;
  });

  const activeDeckConfig = allDecks.find((d) => d.slug === selectedTheme) || allDecks[1];
  const activeThemeObj = themes.find((th) => th.slug === selectedTheme) || themes[0];
  const currentVibe = activeDeckConfig.levelVibe;

  // ── KONFIGURASI TINGKAT KESULITAN DINAMIS SESUAI VIBE DEK ──
  const levelConfigs = {
    romantic: {
      accentColor: 'from-pink-500/20 via-rose-500/10 to-transparent',
      tag: ' Romantic & Love Talk',
      light: {
        badge: 'Level 1 · Sweet & Flirty ',
        title: 'Icebreaker Manis',
        desc: 'Obrolan santai, first impressions menggemaskan, dan kebiasaan manis sehari-hari.',
        icon: Heart,
        gradient: 'from-pink-950/60 via-rose-950/30 to-black',
        activeRing: 'border-pink-500 ring-2 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.35)]',
        accentText: 'text-pink-400',
      },
      deep: {
        badge: 'Level 2 · Deep Affection ',
        title: 'Bicara Dari Hati',
        desc: 'Perasaan cinta yang sebenarnya, momen paling dihargai, dan harapan bersama pasangan.',
        icon: Heart,
        gradient: 'from-rose-950/70 via-pink-950/40 to-black',
        activeRing: 'border-rose-500 ring-2 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)]',
        accentText: 'text-rose-400',
      },
      brave: {
        badge: 'Level 3 · Intimate & Bold ',
        title: 'Rahasia & Keberanian',
        desc: 'Pertanyaan intim dan berani yang belum pernah diungkapkan sebelumnya. Siap saling jujur?',
        icon: Flame,
        gradient: 'from-red-950/80 via-pink-950/40 to-black',
        activeRing: 'border-red-500 ring-2 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.45)]',
        accentText: 'text-red-400',
      },
    },
    comedy: {
      accentColor: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      tag: ' Nongkrong & Seru Bareng',
      light: {
        badge: 'Level 1 · Ketawa Santai ',
        title: 'Candaan Ringan',
        desc: 'Cerita konyol masa kecil, kebiasaan aneh sehari-hari, dan tawa pencair suasana.',
        icon: Coffee,
        gradient: 'from-amber-950/60 via-yellow-950/20 to-black',
        activeRing: 'border-amber-500 ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
        accentText: 'text-amber-400',
      },
      deep: {
        badge: 'Level 2 · Momen Absurd & Ghibah ',
        title: 'Aib Lucu Bareng',
        desc: 'Momen paling memalukan yang pernah terjadi, kekonyolan bareng teman, dan rahasia kocak.',
        icon: Smile,
        gradient: 'from-emerald-950/60 via-teal-950/30 to-black',
        activeRing: 'border-emerald-500 ring-2 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]',
        accentText: 'text-emerald-400',
      },
      brave: {
        badge: 'Level 3 · Truth Hard & No Baper ',
        title: 'Tantangan Absurd',
        desc: 'Pertanyaan paling blak-blakan yang bikin se-tongkrongan heboh tanpa baper!',
        icon: Zap,
        gradient: 'from-orange-950/80 via-amber-950/40 to-black',
        activeRing: 'border-orange-500 ring-2 ring-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.45)]',
        accentText: 'text-orange-400',
      },
    },
    family: {
      accentColor: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      tag: ' Warmth & Family Talk',
      light: {
        badge: 'Level 1 · Cerita Masa Kecil ',
        title: 'Nostalgia Hangat',
        desc: 'Kenangan masa kecil yang paling dirindukan dan kebiasaan unik yang bikin kangen rumah.',
        icon: Sun,
        gradient: 'from-blue-950/60 via-sky-950/20 to-black',
        activeRing: 'border-blue-500 ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)]',
        accentText: 'text-blue-400',
      },
      deep: {
        badge: 'Level 2 · Kasih & Syukur ',
        title: 'Terima Kasih Tulus',
        desc: 'Ungkapan rasa terima kasih dan apresiasi yang selama ini jarang sempat diucapkan.',
        icon: Star,
        gradient: 'from-indigo-950/70 via-blue-950/30 to-black',
        activeRing: 'border-indigo-500 ring-2 ring-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.4)]',
        accentText: 'text-indigo-400',
      },
      brave: {
        badge: 'Level 3 · Keterbukaan Hati ️',
        title: 'Jujur & Menyembuhkan',
        desc: 'Membuka obrolan penting yang sempat tertunda demi mempererat ikatan batin keluarga.',
        icon: Home,
        gradient: 'from-amber-950/80 via-indigo-950/40 to-black',
        activeRing: 'border-amber-500 ring-2 ring-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.45)]',
        accentText: 'text-amber-400',
      },
    },
    horror: {
      accentColor: 'from-orange-500/20 via-red-500/10 to-transparent',
      tag: ' Horror & Misteri Seram',
      light: {
        badge: 'Level 1 · Cerita Merinding ️',
        title: 'Sensasi Pertama',
        desc: 'Tempat angker yang pernah dikunjungi dan firasat janggal yang pernah dirasakan.',
        icon: Ghost,
        gradient: 'from-orange-950/70 via-stone-950/40 to-black',
        activeRing: 'border-orange-500 ring-2 ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.35)]',
        accentText: 'text-orange-400',
      },
      deep: {
        badge: 'Level 2 · Pengalaman Nyata ',
        title: 'Kisah Tak Masuk Akal',
        desc: 'Kejadian mistis nyata yang pernah dialami sendiri atau didengar dari orang terdekat.',
        icon: Ghost,
        gradient: 'from-red-950/80 via-orange-950/40 to-black',
        activeRing: 'border-red-500 ring-2 ring-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)]',
        accentText: 'text-red-400',
      },
      brave: {
        badge: 'Level 3 · Ketakutan Terdalam ',
        title: 'Tak Berani Sendiri',
        desc: 'Hal paling menakutkan yang bikin bulu kuduk berdiri jika dipikirkan tengah malam.',
        icon: Flame,
        gradient: 'from-stone-900 via-red-950 to-black',
        activeRing: 'border-red-600 ring-2 ring-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]',
        accentText: 'text-red-400',
      },
    },
  };

  const activeLevelConfig = levelConfigs[currentVibe];

  return (
    <div className="min-h-screen bg-[#0E0E12] text-white selection:bg-pink-500 selection:text-white py-8 px-4 sm:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* ══════════════════════════════════════════════════════════════════════════
            HEADER & BRANDING (DISESUAIKAN DENGAN SCREENSHOT NONGKEE & TAMPILAN DESKTOP)
           ══════════════════════════════════════════════════════════════════════════ */}
        <div className="text-center space-y-3 pt-2">
          {/* Logo / Brand & Flag Selector */}
          <div className="inline-flex items-center justify-center gap-3">
            <Image
              src="/logo_dark.png"
              alt="Kata Siapa - Ruang Untuk Berbagi Cerita"
              width={180}
              height={48}
              className="h-9 sm:h-11 w-auto object-contain"
              priority
            />
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
              <span></span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>
          </div>

          {/* Headline Utama */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Cobain semua jenis kartu dan rasain serunya!
          </h1>

          {/* ── FILTER PILLS: SEMUA | GRUP | BERDUA ── */}
          <div className="flex items-center justify-center gap-2.5 pt-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md ${
                activeCategory === 'all'
                  ? 'bg-[#5856D6] text-white shadow-indigo-500/30 scale-105'
                  : 'bg-white text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveCategory('grup')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md ${
                activeCategory === 'grup'
                  ? 'bg-[#5856D6] text-white shadow-indigo-500/30 scale-105'
                  : 'bg-white text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              Grup
            </button>
            <button
              onClick={() => setActiveCategory('berdua')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md ${
                activeCategory === 'berdua'
                  ? 'bg-[#5856D6] text-white shadow-indigo-500/30 scale-105'
                  : 'bg-white text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              Berdua
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            DESKTOP-OPTIMIZED LAYOUT:
            KIRI (Grid Kartu Gaya Nongkee) + KANAN (Pratinjau Kartu & Level Launcher)
           ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── KOLOM KIRI: DAFTAR KARTU / DECK (GRID 2 KOLOM DI DESKTOP) ── */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pilih Jenis Kartu ({filteredDecks.length} Dek Tersedia)
              </span>
              <Link
                href="/admin"
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Atur di Dashboard</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredDecks.map((deck) => {
                const isSelected = selectedTheme === deck.slug;

                return (
                  <div
                    key={deck.slug}
                    onClick={() => setSelectedTheme(deck.slug)}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-start gap-3.5 border ${
                      isSelected
                        ? 'bg-[#1E1E28] border-pink-500 ring-2 ring-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.25)] scale-[1.01]'
                        : 'bg-[#16161D] border-white/5 hover:border-white/20 hover:bg-[#1C1C24]'
                    }`}
                  >
                    {/* Icon di Sebelah Kiri */}
                    <div
                      className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl border ${
                        deck.iconBg || 'bg-white/5 text-white border-white/10'
                      }`}
                    >
                      {deck.iconEmoji}
                    </div>

                    {/* Deskripsi & Judul di Tengah */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                          {deck.title}
                        </h3>

                        {/* Badge Populer / New Card / Event */}
                        {deck.badge && (
                          <span
                            className={`text-[11px] font-black tracking-wide ${
                              deck.badgeType === 'new'
                                ? 'text-purple-400 font-bold'
                                : deck.badgeType === 'popular'
                                ? 'text-amber-400 font-bold'
                                : 'text-pink-400'
                            }`}
                          >
                            {deck.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {deck.desc}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-zinc-300">
                          {deck.playerTag}
                        </span>
                        {deck.isCustom && (
                          <span className="text-purple-400 font-semibold">User Custom</span>
                        )}
                      </div>
                    </div>

                    {/* Checkmark Indicator */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-pink-500 border-pink-400 text-white shadow-md'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── KOLOM KANAN: STUDIO LAUNCHER & DIFICULTY SELECTOR (STICKY DI DESKTOP) ── */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24 bg-[#14141B] p-6 rounded-3xl border border-white/10 shadow-2xl">
            {/* Header Dek Terpilih */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 block">
                  Dek Terpilih
                </span>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{activeDeckConfig.iconEmoji}</span>
                  <span>{activeDeckConfig.title}</span>
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-pink-300">
                {activeLevelConfig.tag}
              </span>
            </div>

            {/* Pratinjau Kartu Asli (PDF Authentic Card View) */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="transition-transform duration-300 hover:scale-105">
                <ThemeCard
                  title={activeThemeObj?.titleEn || activeDeckConfig.title}
                  slug={selectedTheme}
                  bgImage={activeThemeObj?.bgImage || '/family_card_bg.jpg'}
                  gradient={activeThemeObj?.gradient || 'from-pink-600 to-rose-950'}
                />
              </div>
            </div>

            {/* ── PILIH TINGKAT KESULITAN / KEDALAMAN DENGAN HIASAN DINAMIS ── */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>PILIH TINGKAT KEDALAMAN</span>
                <span className="text-[11px] text-pink-400 font-semibold capitalize">
                  Level: {selectedLevel}
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Level 1: Light */}
                {(() => {
                  const cfg = activeLevelConfig.light;
                  const Icon = cfg.icon;
                  const isSel = selectedLevel === 'light';
                  return (
                    <div
                      onClick={() => setSelectedLevel('light')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[90px] ${
                        isSel
                          ? `${cfg.activeRing} bg-white/10`
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-3.5 h-3.5 ${cfg.accentText}`} />
                        {isSel && <Check className="w-3 h-3 text-pink-400 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white leading-tight">
                          {cfg.title}
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-0.5 line-clamp-1">
                          Santai
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Level 2: Deep */}
                {(() => {
                  const cfg = activeLevelConfig.deep;
                  const Icon = cfg.icon;
                  const isSel = selectedLevel === 'deep';
                  return (
                    <div
                      onClick={() => setSelectedLevel('deep')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[90px] ${
                        isSel
                          ? `${cfg.activeRing} bg-white/10`
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-3.5 h-3.5 ${cfg.accentText}`} />
                        {isSel && <Check className="w-3 h-3 text-pink-400 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white leading-tight">
                          {cfg.title}
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-0.5 line-clamp-1">
                          Mendalam
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Level 3: Brave */}
                {(() => {
                  const cfg = activeLevelConfig.brave;
                  const Icon = cfg.icon;
                  const isSel = selectedLevel === 'brave';
                  return (
                    <div
                      onClick={() => setSelectedLevel('brave')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[90px] ${
                        isSel
                          ? `${cfg.activeRing} bg-white/10`
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-3.5 h-3.5 ${cfg.accentText}`} />
                        {isSel && <Check className="w-3 h-3 text-pink-400 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white leading-tight">
                          {cfg.title}
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-0.5 line-clamp-1">
                          Berani
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Tombol Aksi Mulai Bermain */}
            <div className="pt-2 space-y-2">
              <Link
                href={`/play?theme=${selectedTheme}&level=${selectedLevel}`}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-extrabold text-sm shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Sesi Permainan →</span>
              </Link>

              {activeDeckConfig.isCustom && (
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition"
                >
                  <PenSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tambah & Atur Pertanyaan Kustom</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}