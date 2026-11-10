'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../AppContext';
import { CardItem, DeckItem } from '../store';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Users,
  Baby,
  PenSquare,
  Search,
  Filter,
  Plus,
  Play,
  Edit3,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Settings,
  X,
  Check,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PasanganCard from '../components/PasanganCard';
import NongkeeCard from '../components/NongkeeCard';
import KidsCard from '../components/KidsCard';
import CustomCard from '../components/CustomCard';
import DreamsCard from '../components/DreamsCard';
import GratitudeCard from '../components/GratitudeCard';
import FamilyCard from '../components/FamilyCard';
import PassionCard from '../components/PassionCard';
import { soundEngine } from '../lib/soundEngine';

export default function CollectionClient() {
  const router = useRouter();
  const { decks, cards, deleteDeck } = useApp();

  // ── FILTER & SEARCH STATE ──
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pasangan' | 'friendship' | 'kids' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ── PASSWORD UNLOCK STATE (PER KOLEKSI / DEK) ──
  // Simpan ID dek yang sudah dibuka di sesi ini
  const [unlockedDeckIds, setUnlockedDeckIds] = useState<Set<string>>(new Set());

  // Modal Verifikasi Password untuk Dek Tertentu
  const [targetLockDeck, setTargetLockDeck] = useState<DeckItem | null>(null);
  const [deckPasswordInput, setDeckPasswordInput] = useState<string>('');
  const [showDeckPassword, setShowDeckPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isShake, setIsShake] = useState<boolean>(false);

  // Modal Master Unlock (Membuka semua dek terkunci)
  const [isMasterModalOpen, setIsMasterModalOpen] = useState<boolean>(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState<string>('');
  const [masterError, setMasterError] = useState<string | null>(null);

  // Modal Penampil Kartu di dalam Dek yang sudah terbuka
  const [viewingDeck, setViewingDeck] = useState<DeckItem | null>(null);
  const [viewerCardIndex, setViewerCardIndex] = useState<number>(0);

  // Load unlocked decks dari sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('unlocked_deck_ids');
        if (stored) {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setUnlockedDeckIds(new Set(ids));
          }
        }
      } catch (e) {
        console.error('Gagal membaca unlocked_deck_ids:', e);
      }
    }
  }, []);

  const saveUnlockedDeck = (deckId: string) => {
    setUnlockedDeckIds((prev) => {
      const next = new Set(prev);
      next.add(deckId);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('unlocked_deck_ids', JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  // Kaitkan kartu-kartu dengan masing-masing dek
  const enrichedDecks: DeckItem[] = (decks || []).map((deck) => {
    const deckCards = (cards || []).filter(
      (c) => c.deckId === deck.id || (deck.cardIds && deck.cardIds.includes(c.id))
    );
    return {
      ...deck,
      cardCount: deckCards.length > 0 ? deckCards.length : deck.cardCount || 0,
      cards: deckCards,
    };
  });

  // Filter berdasarkan kategori & pencarian
  const filteredDecks = enrichedDecks.filter((deck) => {
    // Kategori Filter
    if (selectedFilter !== 'all') {
      const slug = deck.themeSlug;
      if (selectedFilter === 'pasangan' && slug !== 'pasangan' && slug !== 'love') return false;
      if (selectedFilter === 'friendship' && slug !== 'friendship' && slug !== 'nongkee') return false;
      if (selectedFilter === 'kids' && slug !== 'kids') return false;
      if (selectedFilter === 'custom' && slug !== 'custom') return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = deck.title.toLowerCase().includes(q);
      const inDesc = (deck.description || '').toLowerCase().includes(q);
      const inCards = (deck.cards || []).some(
        (c) => c.contentId.toLowerCase().includes(q) || (c.contentEn || '').toLowerCase().includes(q)
      );
      if (!inTitle && !inDesc && !inCards) return false;
    }

    return true;
  });

  // Hitung jumlah per kategori
  const countPasangan = enrichedDecks.filter((d) => d.themeSlug === 'pasangan' || d.themeSlug === 'love').length;
  const countNongkee = enrichedDecks.filter((d) => d.themeSlug === 'friendship' || d.themeSlug === 'nongkee').length;
  const countKids = enrichedDecks.filter((d) => d.themeSlug === 'kids').length;
  const countCustom = enrichedDecks.filter((d) => d.themeSlug === 'custom').length;

  // Cek apakah suatu dek terkunci
  const isDeckLocked = (deck: DeckItem) => {
    if (unlockedDeckIds.has(deck.id)) return false;
    return !!deck.isLocked || !!deck.passwordHash;
  };

  // Buka dialog masukkan password untuk dek
  const handleRequestAccess = (deck: DeckItem) => {
    if (!isDeckLocked(deck)) {
      // Jika dek tidak terkunci, langsung buka viewer kartu di dalam dek
      setViewingDeck(deck);
      setViewerCardIndex(0);
      soundEngine.playFlip();
      return;
    }

    // Buka modal password khusus dek ini
    setTargetLockDeck(deck);
    setDeckPasswordInput('');
    setPasswordError(null);
    setShowDeckPassword(false);
    soundEngine.playFlip();
  };

  // Verifikasi Password Dek (Memeriksa Hash SHA-256 di Database)
  const handleVerifyDeckPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLockDeck || !deckPasswordInput.trim()) return;

    setIsVerifying(true);
    setPasswordError(null);

    try {
      const res = await fetch('/api/decks/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: targetLockDeck.id,
          password: deckPasswordInput.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.verified) {
        // Berhasil! Buka dek
        saveUnlockedDeck(targetLockDeck.id);
        const openedDeck = {
          ...targetLockDeck,
          cards: data.deck?.cards || targetLockDeck.cards,
        };
        setTargetLockDeck(null);
        setDeckPasswordInput('');
        soundEngine.playCelebration();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
        // Buka langsung penampil kartu dek
        setViewingDeck(openedDeck);
        setViewerCardIndex(0);
      } else {
        // Password salah
        setPasswordError(data.error || 'Password salah! Cek kembali password koleksi.');
        setIsShake(true);
        soundEngine.playFlip();
        setTimeout(() => setIsShake(false), 500);
      }
    } catch (err: any) {
      setPasswordError('Terjadi kesalahan verifikasi: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Master Unlock (Membuka semua dek terkunci sekaligus)
  const handleMasterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      masterPasswordInput === 'katasiapa' ||
      masterPasswordInput === 'admin123' ||
      masterPasswordInput === 'buka'
    ) {
      const allIds = (decks || []).map((d) => d.id);
      allIds.forEach((id) => saveUnlockedDeck(id));
      setIsMasterModalOpen(false);
      setMasterPasswordInput('');
      setMasterError(null);
      soundEngine.playCelebration();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      alert('Berhasil! Seluruh koleksi dek di vault berhasil dibuka.');
    } else {
      setMasterError('Master password salah! Password bawaan: katasiapa');
      soundEngine.playFlip();
    }
  };

  const handleLockDeckAgain = (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnlockedDeckIds((prev) => {
      const next = new Set(prev);
      next.delete(deckId);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('unlocked_deck_ids', JSON.stringify(Array.from(next)));
      }
      return next;
    });
    soundEngine.playFlip();
  };

  const handleDeleteDeck = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah kamu yakin ingin menghapus koleksi dek ini beserta seluruh kartunya?')) {
      await deleteDeck(id);
      soundEngine.playFlip();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* ── TOP SUB-BAR ── */}
      <div className="border-b border-white/10 bg-[#121218]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Koleksi &amp; Dek Kartu</span>
          </div>
          <span className="text-sm font-extrabold text-white hidden md:block">
            Pusat Koleksi Kartu Terproteksi Password Enkripsi
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tombol Master Unlock */}
          <button
            onClick={() => setIsMasterModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Buka Kunci Semua Dek dengan Master Password"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Kunci Master</span>
          </button>

          {/* Tombol Buat Koleksi Baru */}
          <Link
            href="/custom"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Koleksi Baru</span>
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-violet-600/20 via-pink-500/20 to-amber-500/20 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Pilihan Koleksi &amp; Dek Kartu
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1 leading-relaxed">
              Setiap koleksi berisi kumpulan beberapa kartu pertanyaan pilihan. Untuk membuka koleksi yang dilindungi, masukkan password terenkripsinya.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap relative z-10">
            <Link
              href="/custom"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-500/25 flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Koleksi Kartu Baru</span>
            </Link>

            <Link
              href="/play"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mainkan Game</span>
            </Link>
          </div>
        </div>

        {/* ── STATISTIK KATEGORI KOLEKSI ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setSelectedFilter('pasangan')}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedFilter === 'pasangan'
                ? 'bg-[#1D1220] border-[#D63B78] ring-2 ring-[#D63B78]/30'
                : 'bg-[#14141C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between text-[#D63B78] mb-2">
              <Heart className="w-5 h-5" />
              <span className="text-lg font-black">{countPasangan}</span>
            </div>
            <div className="text-xs font-bold text-white">Koleksi Pasangan</div>
            <div className="text-[10px] text-zinc-400">Romantis &amp; Deep Talk</div>
          </button>

          <button
            onClick={() => setSelectedFilter('friendship')}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedFilter === 'friendship'
                ? 'bg-[#0E1D19] border-[#0B8A5F] ring-2 ring-[#0B8A5F]/30'
                : 'bg-[#14141C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between text-[#5EEAB0] mb-2">
              <Users className="w-5 h-5" />
              <span className="text-lg font-black">{countNongkee}</span>
            </div>
            <div className="text-xs font-bold text-white">Koleksi Nongkee</div>
            <div className="text-[10px] text-zinc-400">Teman &amp; Sahabat</div>
          </button>

          <button
            onClick={() => setSelectedFilter('kids')}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedFilter === 'kids'
                ? 'bg-[#101D21] border-[#2DD4C4] ring-2 ring-[#2DD4C4]/30'
                : 'bg-[#14141C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between text-[#2DD4C4] mb-2">
              <Baby className="w-5 h-5" />
              <span className="text-lg font-black">{countKids}</span>
            </div>
            <div className="text-xs font-bold text-white">Dunia Si Kecil</div>
            <div className="text-[10px] text-zinc-400">Anak &amp; Keluarga</div>
          </button>

          <button
            onClick={() => setSelectedFilter('custom')}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedFilter === 'custom'
                ? 'bg-[#201B11] border-[#E8870E] ring-2 ring-[#E8870E]/30'
                : 'bg-[#14141C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between text-[#FFC83D] mb-2">
              <PenSquare className="w-5 h-5" />
              <span className="text-lg font-black">{countCustom}</span>
            </div>
            <div className="text-xs font-bold text-white">Kustom Bebas</div>
            <div className="text-[10px] text-zinc-400">Kreasi Sendiri</div>
          </button>
        </div>

        {/* ── TOOLBAR FILTER & SEARCH ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#14141C] border border-white/10 p-4 rounded-2xl shadow-lg">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all', label: `Semua Koleksi (${enrichedDecks.length})` },
              { id: 'pasangan', label: `Pasangan (${countPasangan})` },
              { id: 'friendship', label: `Nongkee (${countNongkee})` },
              { id: 'kids', label: `Anak (${countKids})` },
              { id: 'custom', label: `Kustom (${countCustom})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-pink-500 text-white shadow'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari koleksi atau pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── GRID DAFTAR KOLEKSI DEK ── */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-20 bg-[#14141C] border border-dashed border-white/15 rounded-3xl p-8">
            <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Tidak ada koleksi dek yang ditemukan</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
              {searchQuery
                ? `Tidak ada koleksi yang cocok dengan kata kunci "${searchQuery}".`
                : 'Belum ada koleksi di kategori ini. Buat koleksi pertamamu dengan beberapa kartu sekarang!'}
            </p>
            <Link
              href="/custom"
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Koleksi Dek Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck, idx) => {
              const isPasangan = deck.themeSlug === 'pasangan' || deck.themeSlug === 'love';
              const isNongkee = deck.themeSlug === 'friendship' || deck.themeSlug === 'nongkee';
              const isKids = deck.themeSlug === 'kids';

              const themeColor = isPasangan
                ? '#D63B78'
                : isNongkee
                ? '#0B8A5F'
                : isKids
                ? '#2DD4C4'
                : '#E8870E';

              const themeBadgeLabel = isPasangan
                ? 'Pasangan'
                : isNongkee
                ? 'Nongkee'
                : isKids
                ? 'Dunia Anak'
                : 'Kustom';

              const locked = isDeckLocked(deck);
              const wasUnlocked = !locked && (deck.isLocked || deck.passwordHash);

              return (
                <div
                  key={deck.id || idx}
                  onClick={() => handleRequestAccess(deck)}
                  className={`bg-[#14141C] border rounded-3xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${
                    locked
                      ? 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-b from-[#181512] to-[#14141C]'
                      : 'border-white/10 hover:border-pink-500/40'
                  }`}
                >
                  {/* Top Color Accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: locked ? '#F59E0B' : themeColor }}
                  />

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider"
                          style={{ backgroundColor: themeColor }}
                        >
                          {themeBadgeLabel}
                        </span>

                        {locked && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                            <Lock className="w-3 h-3" />
                            <span>Terkunci</span>
                          </span>
                        )}

                        {wasUnlocked && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                            <Unlock className="w-3 h-3" />
                            <span>Terbuka</span>
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-extrabold text-zinc-400 px-2.5 py-0.5 rounded-lg bg-white/5">
                        {deck.cardCount} Kartu
                      </span>
                    </div>

                    {/* Judul & Deskripsi Koleksi */}
                    <h3 className="text-lg font-black text-white group-hover:text-pink-300 transition leading-snug">
                      {deck.title}
                    </h3>

                    {deck.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {deck.description}
                      </p>
                    )}

                    {deck.creatorName && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-pink-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Dibuat oleh: <b className="text-zinc-200">{deck.creatorName}</b></span>
                      </div>
                    )}

                    {/* Preview Cuplikan Kartu di Dalam Koleksi */}
                    {locked ? (
                      <div className="relative my-4 rounded-2xl bg-black/40 border border-amber-500/20 p-4 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-1.5 shadow-lg shadow-amber-500/15">
                            <Lock className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-black text-white">
                            Koleksi Dilindungi Password
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Klik untuk memasukkan password terenkripsi
                          </p>
                        </div>

                        {/* Dummy Blurred Items */}
                        <div className="space-y-1.5 blur-sm select-none py-1">
                          <div className="h-4 bg-zinc-700/50 rounded w-5/6 mx-auto"></div>
                          <div className="h-4 bg-zinc-700/40 rounded w-4/6 mx-auto"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="my-4 p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Cuplikan Kartu:</span>
                          <span className="text-pink-400">{deck.cards?.length || deck.cardCount} kartu siap</span>
                        </div>
                        {deck.cards && deck.cards.length > 0 ? (
                          <div className="space-y-1.5">
                            {deck.cards.slice(0, 2).map((c, i) => (
                              <p key={i} className="text-xs text-zinc-300 line-clamp-1 italic">
                                &bull; &ldquo;{c.contentId}&rdquo;
                              </p>
                            ))}
                            {deck.cards.length > 2 && (
                              <p className="text-[10px] text-zinc-500 font-bold">
                                + {deck.cards.length - 2} kartu lainnya di dalam dek...
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400 italic">Siap dimainkan dalam game.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-2 pt-4 border-t border-white/5 flex items-center justify-between">
                    {locked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestAccess(deck);
                        }}
                        className="text-xs font-extrabold text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Buka Akses Koleksi →</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDeck(deck);
                            setViewerCardIndex(0);
                          }}
                          className="text-xs font-bold text-pink-400 hover:text-pink-300 transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Kartu</span>
                        </button>

                        <Link
                          href={`/play?theme=${deck.themeSlug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-emerald-400" />
                          <span>Mainkan</span>
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      {wasUnlocked && (
                        <button
                          type="button"
                          onClick={(e) => handleLockDeckAgain(deck.id, e)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition"
                          title="Kunci Kembali Koleksi Ini"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <Link
                        href={`/custom?deckId=${deck.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-pink-500 text-zinc-300 hover:text-white transition"
                        title="Edit Koleksi di Studio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white transition"
                        title="Hapus Koleksi Dek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: VERIFIKASI PASSWORD DEK (ENKRIPSI SHA-256)
          ══════════════════════════════════════════════════════════════════════════ */}
      {targetLockDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-md bg-[#14141C] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-transform ${
              isShake ? 'animate-shake' : ''
            }`}
          >
            {/* Glow BG */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => {
                setTargetLockDeck(null);
                setDeckPasswordInput('');
                setPasswordError(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Dialog */}
            <div className="text-center space-y-2 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-white">
                Buka Akses Koleksi
              </h2>
              <p className="text-xs font-bold text-amber-300">
                &ldquo;{targetLockDeck.title}&rdquo; ({targetLockDeck.cardCount} Kartu)
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Enkripsi Hash SHA-256</span>
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed pt-1">
                Koleksi ini dilindungi password. Masukkan password untuk membuka seluruh kartu di dalamnya.
              </p>
            </div>

            {/* Form Verifikasi */}
            <form onSubmit={handleVerifyDeckPassword} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Password Koleksi:
                </label>
                <div className="relative">
                  <input
                    type={showDeckPassword ? 'text' : 'password'}
                    placeholder="Ketik password koleksi..."
                    value={deckPasswordInput}
                    onChange={(e) => {
                      setDeckPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    autoFocus
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-black/50 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeckPassword(!showDeckPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                  >
                    {showDeckPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-xs font-bold text-rose-400 mt-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setTargetLockDeck(null);
                    setDeckPasswordInput('');
                    setPasswordError(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-300 font-extrabold text-xs transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isVerifying || !deckPasswordInput.trim()}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isVerifying ? 'Memverifikasi...' : 'Buka Akses Koleksi'}</span>
                </button>
              </div>
            </form>

            {/* Hint Password Bawaan */}
            <div className="mt-5 pt-3.5 border-t border-white/10 text-center relative z-10">
              <span className="text-[11px] text-zinc-500 block">
                Master Pass Alternatif: <code className="bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-bold">katasiapa</code>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: MASTER UNLOCK (BUKA SEMUA DEK TERKUNCI)
          ══════════════════════════════════════════════════════════════════════════ */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#14141C] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsMasterModalOpen(false);
                setMasterPasswordInput('');
                setMasterError(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Master Unlock Vault</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Buka seluruh koleksi dek terkunci di vault sekaligus dengan Master Password.
              </p>
            </div>

            <form onSubmit={handleMasterUnlock} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                  Master Password:
                </label>
                <input
                  type="password"
                  placeholder="Ketik master password..."
                  value={masterPasswordInput}
                  onChange={(e) => {
                    setMasterPasswordInput(e.target.value);
                    if (masterError) setMasterError(null);
                  }}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-500"
                />
                {masterError && (
                  <p className="text-xs font-bold text-rose-400 mt-1.5">{masterError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMasterModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Buka Semua
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-zinc-500">
                  Password Master Bawaan: <code className="text-zinc-300 font-mono">katasiapa</code>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 3: PENAMPIL SELURUH KARTU DI DALAM KOLEKSI DEK
          ══════════════════════════════════════════════════════════════════════════ */}
      {viewingDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative flex flex-col items-center max-w-xl w-full">
            <button
              onClick={() => setViewingDeck(null)}
              className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header info dek */}
            <div className="text-center mb-4 space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                {viewingDeck.title}
              </span>
              {viewingDeck.creatorName && (
                <div className="text-[11px] font-bold text-zinc-300 flex items-center justify-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span>Dibuat oleh: <span className="text-pink-300 font-extrabold">{viewingDeck.creatorName}</span></span>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span>Kartu {viewerCardIndex + 1} dari {viewingDeck.cards?.length || 1}</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Akses Terverifikasi
                </span>
              </div>
            </div>

            {/* Render Authentic Card Component */}
            {viewingDeck.cards && viewingDeck.cards.length > 0 ? (
              (() => {
                const currentCard = viewingDeck.cards[viewerCardIndex % viewingDeck.cards.length];
                const isPasangan = viewingDeck.themeSlug === 'pasangan' || viewingDeck.themeSlug === 'love';
                const isNongkee = viewingDeck.themeSlug === 'friendship' || viewingDeck.themeSlug === 'nongkee';
                const isKids = viewingDeck.themeSlug === 'kids';
                const isDreams = viewingDeck.themeSlug === 'dreams';
                const isGratitude = viewingDeck.themeSlug === 'gratitude';
                const isFamily = viewingDeck.themeSlug === 'family' || viewingDeck.themeSlug === 'keluarga';
                const isPassion = viewingDeck.themeSlug === 'passion';

                if (isPasangan) {
                  return (
                    <PasanganCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isNongkee) {
                  return (
                    <NongkeeCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isKids) {
                  return (
                    <KidsCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Hati ke Hati' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isDreams) {
                  return (
                    <DreamsCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isGratitude) {
                  return (
                    <GratitudeCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isFamily) {
                  return (
                    <FamilyCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else if (isPassion) {
                  return (
                    <PassionCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      size="large"
                    />
                  );
                } else {
                  return (
                    <CustomCard
                      question={currentCard.contentId}
                      level={currentCard.level === 'brave' ? 'Berani' : currentCard.level === 'deep' ? 'Mendalam' : 'Santai'}
                      cardNumber={String(viewerCardIndex + 1).padStart(2, '0')}
                      creatorName={currentCard.creatorName || viewingDeck.creatorName}
                      size="large"
                    />
                  );
                }
              })()
            ) : (
              <div className="p-8 rounded-3xl bg-[#14141C] border border-white/10 text-center">
                <p className="text-sm font-bold text-zinc-300">Belum ada kartu di dalam koleksi ini.</p>
              </div>
            )}

            {/* Navigasi Antar Kartu */}
            {viewingDeck.cards && viewingDeck.cards.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setViewerCardIndex((prev) =>
                      prev === 0 ? (viewingDeck.cards?.length || 1) - 1 : prev - 1
                    );
                    soundEngine.playFlip();
                  }}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Kartu Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-3">
                  {viewingDeck.cards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setViewerCardIndex(i);
                        soundEngine.playFlip();
                      }}
                      className={`h-2 rounded-full transition-all ${
                        viewerCardIndex === i ? 'w-6 bg-pink-500' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setViewerCardIndex((prev) =>
                      (prev + 1) % (viewingDeck.cards?.length || 1)
                    );
                    soundEngine.playFlip();
                  }}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Kartu Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
              <Link
                href={`/play?theme=${viewingDeck.themeSlug}`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mainkan Koleksi Ini di Game</span>
              </Link>
              <Link
                href={`/custom?deckId=${viewingDeck.id}`}
                className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Koleksi di Studio</span>
              </Link>
              <button
                onClick={() => setViewingDeck(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
