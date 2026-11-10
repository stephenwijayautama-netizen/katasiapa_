'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '../AppContext';
import {
  User,
  Settings,
  Flame,
  Award,
  Heart,
  Volume2,
  VolumeX,
  Smartphone,
  Clock,
  Shield,
  Palette,
  RotateCcw,
  Check,
  Edit3,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronRight,
  Info,
  Trash2,
  Play,
  Sun,
  Moon,
  Camera,
  Upload,
  Image as ImageIcon,
  Loader2,
  History,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export default function ProfileClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  const {
    lang,
    setLang,
    profile,
    updateProfile,
    uploadAvatarPhoto,
    settings,
    updateSettings,
    cards,
    favoriteCardIds,
    toggleFavoriteCard,
    resetAllData,
    themeMode,
    setThemeMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    tabParam === 'settings' ? 'settings' : 'profile'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editFavoriteVibe, setEditFavoriteVibe] = useState(profile.favoriteVibe);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Helper untuk cek apakah avatar adalah foto URL atau emoji
  const isPhotoAvatar = (avatarStr: string) => {
    return avatarStr?.startsWith('/') || avatarStr?.startsWith('http');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Upload foto avatar langsung ke database server
  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal adalah 5MB');
      return;
    }

    setIsUploading(true);
    const res = await uploadAvatarPhoto(file);
    setIsUploading(false);

    if (res.success && res.avatarUrl) {
      setEditAvatar(res.avatarUrl);
      showToast('Foto profil berhasil diunggah dan disimpan ke database!');
    } else {
      showToast(res.error || 'Gagal mengunggah foto profil');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      username: editUsername,
      bio: editBio,
      avatar: editAvatar,
      favoriteVibe: editFavoriteVibe,
    });
    setIsEditingProfile(false);
    showToast('Profil berhasil disimpan ke database!');
  };

  const handleResetData = () => {
    resetAllData();
    setShowResetConfirm(false);
    showToast('Semua data berhasil di-reset ke setelan awal.');
  };

  // Kartu favorit pengguna
  const favoriteCards = cards.filter((c) => favoriteCardIds.includes(c.id));

  // Dummy recent sessions history
  const recentSessions = [
    {
      id: 'sess-1',
      title: 'Nongkrong Santai di Kafe',
      theme: 'Friendship',
      cardsCount: 14,
      date: 'Hari ini, 20:30 WIB',
      tag: 'Geng Bestie',
    },
    {
      id: 'sess-2',
      title: 'Deep Talk Berdua',
      theme: 'Love & Romance',
      cardsCount: 9,
      date: 'Kemarin, 22:15 WIB',
      tag: 'Pasangan',
    },
    {
      id: 'sess-3',
      title: 'Kumpul Keluarga Hangat',
      theme: 'Family',
      cardsCount: 11,
      date: '2 hari lalu',
      tag: 'Keluarga',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-pink-500 selection:text-white py-8 px-4 sm:px-8 flex flex-col items-center">
      {/* Input File Tersembunyi untuk Upload Foto Cepat */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file);
        }}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs sm:text-sm shadow-2xl animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Tab Navigation Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil Saya</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 1: PROFIL & STATISTIK PENGGUNA (DENGAN UPLOAD FOTO & DATABASE)
           ══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fadeIn">
            {/* ── Kartu Hero Profil ── */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-[#181822] to-black border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* Avatar / Foto Profil Interaktif */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-2 border-pink-500/40 flex items-center justify-center text-5xl sm:text-6xl shadow-xl shadow-pink-500/20 relative">
                    {isPhotoAvatar(profile.avatar) ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-black text-pink-400">
                        {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'KS'}
                      </span>
                    )}

                    {/* Loading Overlay saat mengunggah foto */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-pink-400 gap-1">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-[9px] font-bold text-white">Menyimpan...</span>
                      </div>
                    )}
                  </div>

                  {/* Tombol Kamera untuk Upload Foto Langsung */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/btn"
                    title="Unggah Foto Profil Baru (Tersimpan ke Database)"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Profil */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {profile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 self-center sm:self-start px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-[11px] font-bold text-pink-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Deep Talk Master</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-zinc-400">
                    @{profile.username} · Bergabung sejak {profile.joinedDate}
                  </p>

                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed pt-1">
                    "{profile.bio}"
                  </p>

                  <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                      <span>Vibe:</span>
                      <strong className="text-pink-400">{profile.favoriteVibe}</strong>
                    </span>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-pink-400" />
                      <span>Unggah Foto</span>
                    </button>

                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-95 text-xs font-bold text-white transition shadow-md shadow-pink-500/20 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profil</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Grid Statistik Permainan ── */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Statistik & Pencapaian Permainan
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Kartu Ditarik</span>
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {profile.totalCardsDrawn}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Kartu dieksplorasi</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Sesi Bermain</span>
                    <Play className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {profile.totalSessionsPlayed}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Sesi selesai</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Streak Nongkrong</span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {profile.dayStreak} Hari
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Konsistensi obrolan</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold">Kartu Disukai</span>
                    <Bookmark className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400">
                    {favoriteCardIds.length}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Pertanyaan tersimpan</span>
                </div>
              </div>
            </div>

            {/* ── Koleksi Pertanyaan Favorit Tersimpan ── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-pink-400" />
                  <span>Pertanyaan Favorit Tersimpan ({favoriteCards.length})</span>
                </h2>
                <Link
                  href="/login"
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 transition"
                >
                  <span>Mulai Main Lagi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {favoriteCards.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                  <p className="text-zinc-400 text-sm">Belum ada pertanyaan yang disimpan.</p>
                  <p className="text-zinc-500 text-xs">
                    Tandai kartu saat bermain untuk menyimpannya ke koleksi pribadimu.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteCards.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl bg-[#15151E] border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-pink-400 uppercase tracking-wider">
                            {c.category} · Level {c.level}
                          </span>
                          <button
                            onClick={() => toggleFavoriteCard(c.id)}
                            className="p-1 rounded-md text-pink-500 hover:scale-110 transition"
                            title="Hapus dari favorit"
                          >
                            <Bookmark className="w-4 h-4 fill-pink-500" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white leading-relaxed">
                          "{c.contentId}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 italic">
                          "{c.contentEn}"
                        </span>
                        <Link
                          href={`/play?theme=${c.themeSlug}&level=${c.level}`}
                          className="text-[11px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                        >
                          <span>Mainkan</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Riwayat Sesi Permainan Terakhir ── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  <span>Riwayat Sesi Permainan</span>
                </h2>
                <span className="text-xs text-zinc-500">Tersimpan di database</span>
              </div>

              <div className="space-y-3">
                {recentSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl bg-[#14141C] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {sess.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span>Tema: {sess.theme}</span>
                          <span>·</span>
                          <span>{sess.cardsCount} kartu ditarik</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-zinc-400 block">{sess.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-pink-400">
                        {sess.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 2: PENGATURAN LENGKAP (SETTINGS)
           ══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Pengaturan */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Pengaturan Permainan & Aplikasi
              </h1>
              <p className="text-sm text-zinc-400">
                Atur kenyamanan bermain, efek suara, batas waktu, dan preferensi privasi Anda.
              </p>
            </div>

            {/* 1. Preferensi Audio & Haptic */}
            <div className="p-6 rounded-3xl bg-[#14141C] border border-white/10 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>Audio & Getaran Interaktif</span>
              </h3>

              <div className="space-y-4">
                {/* Efek Suara */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Efek Suara (Sound Effects)</h4>
                    <p className="text-xs text-zinc-400">
                      Putar suara saat kartu dikocok, diputar (spin), dan dibalik.
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                      settings.soundEffects ? 'bg-pink-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.soundEffects ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Haptic / Getar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Getaran Perangkat (Haptic Feedback)</h4>
                    <p className="text-xs text-zinc-400">
                      Sensasi getar halus saat menekan tombol kartu di HP atau tablet.
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                      settings.hapticFeedback ? 'bg-pink-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Pengaturan Waktu & Konten */}
            <div className="p-6 rounded-3xl bg-[#14141C] border border-white/10 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Timer Giliran & Filter Konten</span>
              </h3>

              <div className="space-y-4">
                {/* Timer Giliran */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Timer Giliran Menjawab</h4>
                  <p className="text-xs text-zinc-400 mb-3">
                    Berikan batas waktu menjawab agar permainan lebih menantang dan dinamis.
                  </p>
                  <div className="flex items-center gap-2">
                    {[
                      { val: 0, label: 'Tanpa Batas' },
                      { val: 30, label: '30 Detik' },
                      { val: 60, label: '60 Detik' },
                      { val: 90, label: '90 Detik' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => updateSettings({ timerSeconds: opt.val })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          settings.timerSeconds === opt.val
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Konten Dewasa */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Filter Konten Dewasa (Safe Mode)</h4>
                    <p className="text-xs text-zinc-400">
                      Sembunyikan pertanyaan yang terlalu intim/khusus 18+ saat bermain bersama keluarga.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSettings({ adultContentFilter: !settings.adultContentFilter })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                      settings.adultContentFilter ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.adultContentFilter ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Bahasa & Tampilan */}
            <div className="p-6 rounded-3xl bg-[#14141C] border border-white/10 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Bahasa & Aksesibilitas</span>
              </h3>

              <div className="space-y-4">
                {/* Tema Tampilan: Dark vs Light */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Tema Tampilan (Theme Mode)</h4>
                    <p className="text-xs text-zinc-400">
                      Pilih antara tampilan gelap yang sinematik atau terang yang bersih.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setThemeMode('dark')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        themeMode === 'dark'
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Mode</span>
                    </button>
                    <button
                      onClick={() => setThemeMode('light')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        themeMode === 'light'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Mode</span>
                    </button>
                  </div>
                </div>

                {/* Pilihan Bahasa */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Bahasa Aplikasi</h4>
                    <p className="text-xs text-zinc-400">
                      Ganti bahasa antarmuka dan pertanyaan kartu.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLang('id')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        lang === 'id'
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}
                    >
                      Indonesia
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        lang === 'en'
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Kurangi Gerakan */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Kurangi Gerakan (Reduced Motion)</h4>
                    <p className="text-xs text-zinc-400">
                      Nonaktifkan efek rotasi 3D dan animasi intens untuk kenyamanan mata.
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                      settings.reducedMotion ? 'bg-pink-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Data & Reset */}
            <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Zona Data & Privasi</span>
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Reset Semua Data & Cache Lokal</h4>
                  <p className="text-xs text-zinc-400">
                    Menghapus data kartu tersimpan, statistik sesi, dan mengembalikan semua setelan ke bawaan.
                  </p>
                </div>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-2 transition whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Data Sekarang</span>
                </button>
              </div>
            </div>

            {/* 5. Info Versi & Dashboard */}
            <div className="text-center text-xs text-zinc-500 space-y-2 pt-4">
              <p>Kata Siapa Web App · Versi 1.2 (Anak Muda Edition)</p>
              <div className="flex items-center justify-center gap-4 text-zinc-400">
                <Link href="/admin" className="hover:text-pink-400 transition underline">
                  Admin Dashboard
                </Link>
                <span>·</span>
                <Link href="/themes" className="hover:text-pink-400 transition underline">
                  Lihat Semua Tema
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL: EDIT PROFIL & UPLOAD FOTO KE DATABASE
         ══════════════════════════════════════════════════════════════════════════ */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <input
            type="file"
            ref={modalFileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          <div className="bg-[#14141C] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-pink-400" />
                <span>Edit Profil & Foto Pengguna</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Bagian Foto Profil & Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-pink-400 block">
                  Foto Profil (Tersimpan ke Database)
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview Avatar */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center text-3xl relative flex-shrink-0">
                    {isPhotoAvatar(editAvatar) ? (
                      <Image
                        src={editAvatar}
                        alt="Preview Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-pink-400">
                        {editName ? editName.slice(0, 2).toUpperCase() : 'KS'}
                      </span>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-pink-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Tombol Aksi Upload */}
                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih Foto dari Galeri / File'}</span>
                    </button>
                    <p className="text-[11px] text-zinc-400">
                      Mendukung format JPG, PNG, atau WebP (Maks. 5MB)
                    </p>
                  </div>
                </div>

                {isPhotoAvatar(editAvatar) && (
                  <button
                    type="button"
                    onClick={() => setEditAvatar('')}
                    className="text-[11px] text-zinc-400 hover:text-red-400 transition flex items-center gap-1 pt-1"
                  >
                    <span>Hapus Foto &amp; Gunakan Inisial</span>
                  </button>
                )}
              </div>

              {/* Nama */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Username
                </label>
                <div className="flex items-center rounded-xl bg-white/5 border border-white/10 px-3">
                  <span className="text-zinc-500 text-sm">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-2 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Status / Bio Singkat
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              {/* Vibe Favorit */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Vibe Obrolan Favorit
                </label>
                <select
                  value={editFavoriteVibe}
                  onChange={(e) => setEditFavoriteVibe(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C26] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="Romantic & Deep Talk">Romantic & Deep Talk</option>
                  <option value="Comedy & Ketawa Santai">Comedy & Ketawa Santai</option>
                  <option value="Keluarga & Nostalgia">Keluarga & Nostalgia</option>
                  <option value="Passion & Ambisi">Passion & Ambisi</option>
                  <option value="Midnight 02:00 AM">Midnight 02:00 AM</option>
                </select>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL: KONFIRMASI RESET DATA
         ══════════════════════════════════════════════════════════════════════════ */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141C] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-white">Yakin Ingin Reset Data?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tindakan ini akan menghapus semua kartu favorit, statistik sesi, dan foto profil pribadi Anda.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/25 hover:bg-red-600 transition"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
