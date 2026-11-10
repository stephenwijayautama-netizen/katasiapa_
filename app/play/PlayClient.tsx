'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '../AppContext';
import { CardItem, ThemeItem } from '../store';
import {
  Shuffle,
  RotateCw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Check,
  Sparkles,
  Users,
  HeartHandshake,
  Flame,
  Home,
  Sun,
  Star,
  Coffee,
  Play,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  PenSquare,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Baby,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ThemeCard from '../ThemeCard';
import KidsCard from '../components/KidsCard';
import CustomCard from '../components/CustomCard';
import NongkeeCard from '../components/NongkeeCard';
import PasanganCard from '../components/PasanganCard';
import DreamsCard from '../components/DreamsCard';
import GratitudeCard from '../components/GratitudeCard';
import FamilyCard from '../components/FamilyCard';
import PassionCard from '../components/PassionCard';
import GoogleSignInModal, { GoogleLogo } from '../components/GoogleSignInModal';
import { soundEngine } from '../lib/soundEngine';

type CategoryFilter = 'all' | 'grup' | 'berdua';
type LevelFilter = 'all' | 'light' | 'deep' | 'brave';

interface DeckCatalogItem {
  slug: string;
  title: string;
  desc: string;
  badge?: string;
  badgeType?: 'popular' | 'new' | 'kids';
  category: 'all' | 'grup' | 'berdua';
  iconBg: string;
  playerTag: string;
}

const DECK_CATALOG: DeckCatalogItem[] = [
  {
    slug: 'custom',
    title: 'Pertanyaan Kustom',
    badge: 'NEW CARD',
    badgeType: 'new',
    desc: 'Buat dan mainkan dek pertanyaan kreasimu sendiri tanpa batas.',
    category: 'all',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    playerTag: 'Semua Suasana',
  },
  {
    slug: 'kids',
    title: 'Dunia Si Kecil',
    badge: '★ Spesial Anak',
    badgeType: 'kids',
    desc: 'Ngobrol terbuka bareng anak agar merasa aman, didengar, dan bebas bercerita.',
    category: 'grup',
    iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    playerTag: 'Keluarga & Anak',
  },
  {
    slug: 'friendship',
    title: 'Kartu Nongkee (Friendship)',
    badge: '★ Populer',
    badgeType: 'popular',
    desc: 'Kartu obrolan seru untuk berbagai suasana nongkrong bareng bestie.',
    category: 'grup',
    iconBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    playerTag: 'Nongkrong Bareng',
  },
  {
    slug: 'love',
    title: 'Pasangan (Love)',
    badge: '★ Populer',
    badgeType: 'popular',
    desc: 'Bangun kedekatan intim, rasa aman, dan kenali pasangan lebih dalam.',
    category: 'berdua',
    iconBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    playerTag: 'Berdua Intim',
  },
  {
    slug: 'family',
    title: 'Keluarga Hangat',
    desc: 'Kenangan masa kecil dan kehangatan kumpul keluarga tercinta.',
    category: 'grup',
    iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    playerTag: 'Kumpul Keluarga',
  },
  {
    slug: 'passion',
    title: 'Passion & Ambisi',
    desc: 'Bicara tentang mimpi besar, api semangat berkarya, dan tujuan hidup.',
    category: 'berdua',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    playerTag: 'Ambisi & Visi',
  },
  {
    slug: 'dreams',
    title: 'Mimpi & Harapan',
    desc: 'Cita-cita masa depan, eksplorasi hal baru, dan imajinasi tanpa batas.',
    category: 'grup',
    iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    playerTag: 'Deep Talk',
  },
  {
    slug: 'gratitude',
    title: 'Rasa Syukur',
    desc: 'Refleksi hal-hal kecil bermakna yang sering terlewatkan sehari-hari.',
    category: 'berdua',
    iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    playerTag: 'Mindfulness',
  },
];

const renderCatalogIcon = (slug: string) => {
  switch (slug) {
    case 'custom':
      return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />;
    case 'kids':
      return <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" />;
    case 'friendship':
      return <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />;
    case 'love':
      return <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" />;
    case 'family':
      return <Home className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />;
    case 'passion':
      return <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />;
    case 'dreams':
      return <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-300" />;
    case 'gratitude':
      return <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />;
    default:
      return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300" />;
  }
};

export default function PlayClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeParam = searchParams.get('theme');
  const levelParam = searchParams.get('level') as LevelFilter | null;

  const { themes, cards, settings, favoriteCardIds, toggleFavoriteCard, deleteCard, isLoggedIn, isMounted, login, profile } = useApp();

  // Login Gate State
  const [loginNameInput, setLoginNameInput] = useState<string>('');
  const [loginEmailInput, setLoginEmailInput] = useState<string>('');
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);

  // State Seleksi Deck
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedThemeSlug, setSelectedThemeSlug] = useState<string | null>(themeParam || null);
  const [previewThemeSlug, setPreviewThemeSlug] = useState<string>('friendship');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>(levelParam || 'all');

  // State Gameplay
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animType, setAnimType] = useState<'flip' | 'spin' | 'bounce' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dengan URL query param jika ada perubahan
  useEffect(() => {
    if (themeParam && themes.some((th) => th.slug === themeParam)) {
      setSelectedThemeSlug(themeParam);
    } else if (!themeParam) {
      setSelectedThemeSlug(null);
    }
  }, [themeParam, themes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Data Theme & Cards yang Sedang Aktif Dimainkan
  const activeTheme = themes.find((th) => th.slug === selectedThemeSlug) || null;

  // Kartu kustom buatan pengguna
  const myCustomCards = (cards || []).filter(
    (c) =>
      c.themeSlug === 'custom' ||
      c.id.startsWith('card-') ||
      c.id.startsWith('cust-') ||
      c.category === 'Kustom'
  );

  // Filter kartu berdasarkan tema dan level
  const activeDeckCards = (cards || []).filter((c) => {
    if (selectedThemeSlug === 'custom') {
      const isCustomCard =
        c.themeSlug === 'custom' ||
        c.id.startsWith('card-') ||
        c.id.startsWith('cust-') ||
        c.category === 'Kustom';
      if (!isCustomCard) return false;
    } else {
      if (c.themeSlug !== selectedThemeSlug) return false;
    }
    if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
    return true;
  });

  // Ambil kartu aktif saat ini
  const currentCard: CardItem | null =
    activeDeckCards.length > 0
      ? activeDeckCards[currentCardIndex % activeDeckCards.length]
      : null;

  // Cek apakah kartu saat ini difavoritkan
  const isCardFavorited = currentCard ? favoriteCardIds.includes(currentCard.id) : false;

  // ── Handler Gameplay ──
  const handleSelectDeck = (slug: string) => {
    if (slug === 'custom') {
      router.push('/custom');
      return;
    }
    setSelectedThemeSlug(slug);
    setCurrentCardIndex(0);
    router.replace(`/play?theme=${slug}${selectedLevel !== 'all' ? `&level=${selectedLevel}` : ''}`);

    if (settings?.soundEffects) {
      soundEngine.playCelebration();
    }
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleBackToDecks = () => {
    setSelectedThemeSlug(null);
    router.replace('/play');
  };

  const handleShuffle = () => {
    if (isAnimating || activeDeckCards.length === 0) return;
    setIsAnimating(true);
    setAnimType('flip');

    if (settings?.soundEffects) {
      soundEngine.playShuffle();
    }

    confetti({
      particleCount: 35,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#EC4899', '#8B5CF6', '#2DD4C4', '#3B82F6'],
    });

    setTimeout(() => {
      // Pilih kartu acak yang berbeda dari kartu saat ini
      if (activeDeckCards.length > 1) {
        let nextIdx = Math.floor(Math.random() * activeDeckCards.length);
        while (nextIdx === currentCardIndex % activeDeckCards.length) {
          nextIdx = Math.floor(Math.random() * activeDeckCards.length);
        }
        setCurrentCardIndex(nextIdx);
      }
      setIsAnimating(false);
      setAnimType(null);
    }, 400);
  };

  const handleSpin = () => {
    if (isAnimating || activeDeckCards.length === 0) return;
    setIsAnimating(true);
    setAnimType('spin');

    if (settings?.soundEffects) {
      soundEngine.playSpin();
    }

    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.6 },
      });
      const nextIdx = Math.floor(Math.random() * activeDeckCards.length);
      setCurrentCardIndex(nextIdx);
      setIsAnimating(false);
      setAnimType(null);
    }, 550);
  };

  const handleNextCard = () => {
    if (activeDeckCards.length === 0) return;
    setCurrentCardIndex((prev) => (prev + 1) % activeDeckCards.length);
    if (settings?.soundEffects) soundEngine.playFlip();
  };

  const handlePrevCard = () => {
    if (activeDeckCards.length === 0) return;
    setCurrentCardIndex((prev) => (prev - 1 + activeDeckCards.length) % activeDeckCards.length);
    if (settings?.soundEffects) soundEngine.playFlip();
  };

  const handleToggleFavorite = () => {
    if (!currentCard) return;
    toggleFavoriteCard(currentCard.id);
    if (settings?.soundEffects) soundEngine.playFlip();
    showToast(isCardFavorited ? 'Dihapus dari favorit' : 'Disimpan ke Favorit!');
  };

  const handleShareCard = () => {
    if (!currentCard) return;
    const shareText = `"${currentCard.contentId}" — dari game kartu KataSiapa (${activeTheme?.titleEn || 'Main Game'})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast('Teks pertanyaan disalin ke clipboard!');
    }
  };

  // Filter Catalog Berdasarkan Kategori
  const filteredCatalog = DECK_CATALOG.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter || item.category === 'all';
  });

  const previewThemeObj = themes.find((th) => th.slug === previewThemeSlug) || themes[0];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center p-3 sm:p-6 pb-24 selection:bg-pink-500 selection:text-white transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 z-50 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAMPILAN 1: PILIH DEK OBROLAN (DESKTOP 2-KOLOM & MOBILE ADAPTIF)
         ══════════════════════════════════════════════════════════════════════════ */}
      {!activeTheme && (
        <div className="w-full max-w-6xl mx-auto flex flex-col py-2 sm:py-6">
          {/* Header Nongkee Ref */}
          <div className="text-center max-w-2xl mx-auto mb-8 px-4">
            <span className="text-xs font-black uppercase tracking-widest text-pink-400 block mb-1">
              KATA SIAPA · CARD DECKS
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Cobain semua jenis kartu dan rasain serunya!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Pilih tema yang paling pas sama suasana kumpul kamu sekarang. Kocok kartunya dan mulai obrolan seru tanpa momen hening.
            </p>

            {/* Filter Pills [ Semua ] [ Grup ] [ Berdua ] */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'grup', label: 'Grup' },
                { id: 'berdua', label: 'Berdua' },
              ].map((pill) => {
                const isActive = categoryFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setCategoryFilter(pill.id as CategoryFilter)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Split View: Kiri List Kartu, Kanan Preview Live Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* ── KOLOM KIRI: DAFTAR KARTU GAYA NONGKEE ── */}
            <div className="lg:col-span-7 space-y-3">
              {filteredCatalog.map((item) => {
                const isSelected = previewThemeSlug === item.slug;
                const isKids = item.slug === 'kids';

                return (
                  <div
                    key={item.slug}
                    onClick={() => {
                      setPreviewThemeSlug(item.slug);
                    }}
                    onDoubleClick={() => handleSelectDeck(item.slug)}
                    className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? isKids
                          ? 'bg-[#0E2A32] border-[#2DD4C4] shadow-lg shadow-[#2DD4C4]/15 ring-2 ring-[#2DD4C4]/40 scale-[1.01]'
                          : 'bg-[#181822] border-pink-500 shadow-lg shadow-pink-500/15 ring-2 ring-pink-500/40 scale-[1.01]'
                        : 'bg-[#121218] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Icon & Detail */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 border ${
                          isKids
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                            : item.iconBg
                        }`}
                      >
                        {renderCatalogIcon(item.slug)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-sm sm:text-base font-black text-white truncate">
                            {item.title}
                          </h3>

                          {/* Badge Ref */}
                          {(item.badge || item.slug === 'custom') && (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                item.slug === 'custom'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : item.badgeType === 'popular'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : item.badgeType === 'kids'
                                  ? 'bg-teal-500/25 text-teal-300 border border-teal-500/40'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              }`}
                            >
                              {item.slug === 'custom' ? `${myCustomCards.length} Kartu` : item.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-1 leading-snug">
                          {item.desc}
                        </p>
                        <span className="text-[10px] font-semibold text-zinc-400 mt-1 inline-block">
                          {item.playerTag}
                        </span>
                      </div>
                    </div>

                    {/* Quick Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDeck(item.slug);
                      }}
                      className="flex-shrink-0 px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-pink-500 hover:text-white border border-white/15 text-xs font-bold text-zinc-200 transition-all shadow-sm"
                    >
                      Pilih →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── KOLOM KANAN: PREVIEW DILENGKAPI TOMBOL MULAI MAIN (DESKTOP STICKY) ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#14141C] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 self-start mb-1">
                PREVIEW DEK TERPILIH
              </span>
              <h2 className="text-lg font-black text-white self-start mb-4 truncate w-full">
                {previewThemeObj?.titleEn || 'Deck Kartu'}
              </h2>

              {/* Preview Kartu Terpilih */}
              <div className="py-2 flex justify-center w-full">
                <ThemeCard
                  title={previewThemeObj?.titleEn}
                  slug={previewThemeSlug}
                  gradient={previewThemeObj?.gradient}
                  size="default"
                />
              </div>

              {previewThemeSlug === 'custom' ? (
                <div className="w-full mt-6 space-y-3">
                  <div className="text-center py-2 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{myCustomCards.length} Pertanyaan Kustom Tersimpan</span>
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Pilih model (Pasangan/Nongkee/Anak), tulis pertanyaan, dan kelola kartu di halaman studio.
                    </p>
                  </div>

                  {/* Tombol Utama: Diarahkan ke Page Kustomisasi */}
                  <button
                    onClick={() => router.push('/custom')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-violet-600 text-white font-black text-sm sm:text-base shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>Buka Halaman Kustomisasi Kartu →</span>
                  </button>

                  {/* Tombol Opsi: Langsung Mainkan */}
                  <button
                    onClick={() => {
                      setSelectedThemeSlug('custom');
                      setCurrentCardIndex(0);
                      router.replace('/play?theme=custom');
                    }}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-white/10"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Langsung Mainkan ({myCustomCards.length} Kartu)</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Filter Level Obrolan Sebelum Mulai */}
                  <div className="w-full mt-4 space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Tingkat Kedalaman Obrolan:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'all', label: 'Campur' },
                        { id: 'light', label: 'Santai' },
                        { id: 'deep', label: 'Deep Talk' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => setSelectedLevel(lvl.id as LevelFilter)}
                          className={`py-2 rounded-xl text-xs font-bold transition border ${
                            selectedLevel === lvl.id
                              ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Big CTA Mulai Mainkan Deck Ini */}
                  <button
                    onClick={() => handleSelectDeck(previewThemeSlug)}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mulai Mainkan Deck Ini →</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAMPILAN 2: ARENA PERMAINAN RESMI (GAME TABLE & LIVE CARDS)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTheme && (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center pt-3 sm:pt-6 pb-6">
          {/* Header Bar Permainan */}
          <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-2">
            {/* Tombol Ganti Deck (Kembali ke Daftar Tanpa Reload) */}
            <button
              onClick={handleBackToDecks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-300 hover:text-white transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ganti Dek</span>
            </button>

            {/* Nama Dek & Indikator Kartu */}
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider block text-pink-400">
                {activeTheme.editionLabel || 'KataSiapa'}
              </span>
              <h2 className="text-xs sm:text-sm font-black text-white">
                {activeTheme.titleEn || activeTheme.titleId} · #{currentCardIndex + 1}
                <span className="text-zinc-500 font-normal"> / {activeDeckCards.length || 1}</span>
              </h2>
            </div>

            {/* Tombol Aksi: Favorit & Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl border transition shadow-sm ${
                  isCardFavorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-zinc-300 hover:text-rose-400'
                }`}
                title={isCardFavorited ? 'Hapus dari Favorit' : 'Tandai Suka (Love)'}
              >
                <Heart className={`w-4 h-4 ${isCardFavorited ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>

              <button
                onClick={handleShareCard}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-300 hover:text-pink-400 transition shadow-sm"
                title="Salin Pertanyaan"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (currentCard) {
                    router.push(`/custom?edit=${currentCard.id}`);
                  } else {
                    router.push('/custom');
                  }
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-300 hover:text-amber-400 transition shadow-sm"
                title="Buka Halaman Kustomisasi Kartu"
              >
                <PenSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Level di Arena Main */}
          <div className="flex items-center gap-2 mb-4 bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: 'all', label: 'Semua Level' },
              { id: 'light', label: 'Santai' },
              { id: 'deep', label: 'Deep Talk' },
              { id: 'brave', label: 'Berani' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id as LevelFilter);
                  setCurrentCardIndex(0);
                }}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                  selectedLevel === lvl.id
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* ── KARTU GAME UTAMA (INTERAKTIF & BISA DIKLIK) ── */}
          <div className="w-full flex justify-center py-2 relative px-2">
            {activeTheme.slug === 'kids' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <KidsCard
                  question={
                    currentCard?.contentId ||
                    'Kalau kamu bisa jadi hewan apa saja di dunia, kamu mau jadi apa? Kenapa?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Hati ke Hati'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'custom' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <CustomCard
                  question={
                    currentCard?.contentId ||
                    'Tulis pertanyaanmu sendiri, lalu kocok bersama teman-temanmu.'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  creatorName={currentCard?.creatorName}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'friendship' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <NongkeeCard
                  question={
                    currentCard?.contentId ||
                    'Siapa yang selalu ada saat kamu sedang tidak baik-baik saja?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'love' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <PasanganCard
                  question={
                    currentCard?.contentId ||
                    'Kapan terakhir kali kamu merasa benar-benar dicintai?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'dreams' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <DreamsCard
                  question={
                    currentCard?.contentId ||
                    'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'gratitude' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <GratitudeCard
                  question={
                    currentCard?.contentId ||
                    'Hal kecil apa hari ini yang membuatmu merasa bersyukur?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'family' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <FamilyCard
                  question={
                    currentCard?.contentId ||
                    'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : activeTheme.slug === 'passion' ? (
              <div
                onClick={handleShuffle}
                className={`transition-all duration-300 cursor-pointer ${
                  animType === 'flip' ? 'scale-95 rotate-1 duration-200' : ''
                } ${animType === 'spin' ? 'scale-95 rotate-6 duration-300' : ''}`}
              >
                <PassionCard
                  question={
                    currentCard?.contentId ||
                    'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?'
                  }
                  level={
                    currentCard?.level === 'brave'
                      ? 'Berani'
                      : currentCard?.level === 'deep'
                      ? 'Mendalam'
                      : 'Santai'
                  }
                  cardNumber={String(currentCardIndex + 1).padStart(2, '0')}
                  isAnimating={isAnimating}
                  size="large"
                />
              </div>
            ) : (
              <div
                onClick={handleShuffle}
                className={`relative w-[320px] sm:w-[380px] md:w-[410px] h-[448px] sm:h-[532px] md:h-[574px] rounded-[32px] sm:rounded-[36px] overflow-hidden cursor-pointer select-none
                  border border-white/25
                  shadow-[0_25px_60px_rgba(0,0,0,0.9)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-[1.02]
                  ${animType === 'flip' ? 'scale-95 rotate-y-180 duration-300 ring-4 ring-pink-500' : ''}
                  ${animType === 'spin' ? 'scale-95 rotate-180 duration-400 ring-4 ring-violet-500' : ''}
                `}
                style={{
                  aspectRatio: '5 / 7',
                  perspective: '1000px',
                }}
              >
                {/* Background Image Otentik Sesuai Tema */}
                <Image
                  src={activeTheme.bgImage || `/family_card_bg.jpg`}
                  alt={`${activeTheme.titleEn} card`}
                  fill
                  sizes="(max-width: 640px) 320px, 410px"
                  className="object-cover object-center pointer-events-none"
                  priority
                />

                {/* Shimmer Overlay saat Animasi */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    isAnimating
                      ? 'opacity-100 bg-gradient-to-tr from-pink-500/25 via-white/20 to-transparent'
                      : 'opacity-0 hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-transparent'
                  }`}
                />

                {/* Surface Pertanyaan Kartu Modern & Elegan - Zero Truncation */}
                <div className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-3.5 sm:bottom-5 min-h-[140px] sm:min-h-[165px] max-h-[220px] p-4 sm:p-5 rounded-[26px] bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col justify-between text-white overflow-y-auto no-scrollbar">
                  {/* Top Badge: Level & Index */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 flex-shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full ${
                        currentCard?.level === 'brave'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : currentCard?.level === 'deep'
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {currentCard?.level === 'brave'
                        ? 'Berani'
                        : currentCard?.level === 'deep'
                        ? 'Deep Talk'
                        : 'Santai'}
                    </span>
                    <span className="text-zinc-400 font-bold">
                      #{String(currentCardIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Pertanyaan Utama Bahasa Indonesia */}
                  <p
                    className={`${
                      (currentCard?.contentId || '').length > 110
                        ? 'text-xs sm:text-sm md:text-[15px]'
                        : (currentCard?.contentId || '').length > 70
                        ? 'text-sm sm:text-base md:text-lg'
                        : 'text-base sm:text-lg md:text-xl'
                    } font-bold text-white leading-snug my-1 break-words`}
                  >
                    {currentCard?.contentId || 'Kocok kartu untuk menarik pertanyaan obrolan!'}
                  </p>

                  {/* Terjemahan Bahasa Inggris (Subtle) */}
                  {currentCard?.contentEn && (
                    <p className="text-[11px] sm:text-xs text-zinc-400 italic mt-1 break-words">
                      {currentCard.contentEn}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── ACTION CONTROLS TOOLBAR: NAVIGASI, KOCOK & SPIN ── */}
          <div className="flex items-center gap-2 sm:gap-4 mt-6 w-full justify-center max-w-md px-3">
            {/* Tombol Sebelumnya */}
            <button
              onClick={handlePrevCard}
              disabled={isAnimating || activeDeckCards.length <= 1}
              className="p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition disabled:opacity-40"
              title="Kartu Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Tombol Kocok Utama */}
            <button
              onClick={handleShuffle}
              disabled={isAnimating}
              className="flex-1 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 text-pink-200" />
              <span>Kocok Kartu</span>
            </button>

            {/* Tombol Spin */}
            <button
              onClick={handleSpin}
              disabled={isAnimating}
              className={`p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-violet-400 hover:text-white transition disabled:opacity-40 ${
                animType === 'spin' ? 'animate-spin' : ''
              }`}
              title="Spin Acak"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Tombol Selanjutnya */}
            <button
              onClick={handleNextCard}
              disabled={isAnimating || activeDeckCards.length <= 1}
              className="p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition disabled:opacity-40"
              title="Kartu Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Guide / Help */}
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-4 text-center">
            Tips: Tekan <span className="text-zinc-300 font-bold">Kocok Kartu</span> atau klik langsung pada kartu untuk berganti pertanyaan.
          </p>
        </div>
      )}

      {/* ── MODAL WAJIB LOGIN UNTUK BERMAIN ── */}
      {isMounted && !isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#14141C] border border-pink-500/40 shadow-2xl relative overflow-hidden space-y-5 animate-zoom-out">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Masuk Terlebih Dahulu Untuk Bermain
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
                Silakan masuk dengan akun Google kamu agar sesi bermain dan seluruh koleksi tersimpan rapi.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {/* TOMBOL UTAMA: GOOGLE SIGN-IN */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-sm shadow-xl shadow-white/10 flex items-center justify-center gap-3 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <GoogleLogo className="w-5 h-5" />
                <span>Lanjutkan dengan Akun Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#14141C] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  atau masuk manual
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!loginNameInput.trim()) return;
                  login({
                    name: loginNameInput.trim(),
                    email:
                      loginEmailInput.trim() ||
                      `${loginNameInput.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
                  });
                  soundEngine.playCelebration();
                  confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                }}
                className="space-y-3"
              >
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Kamu..."
                    value={loginNameInput}
                    onChange={(e) => setLoginNameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!loginNameInput.trim()}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition disabled:opacity-40"
                >
                  Masuk dengan Nama ({loginNameInput.trim() || 'Nama Kamu'})
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Google Sign-in Dialog Modal */}
      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={(user) => {
          login(user);
          soundEngine.playCelebration();
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        }}
      />
    </div>
  );
}
