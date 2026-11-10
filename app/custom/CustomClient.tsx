'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../AppContext';
import { CardItem, DeckItem } from '../store';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Users,
  Baby,
  PenSquare,
  Check,
  Edit3,
  Trash2,
  Lightbulb,
  Play,
  Plus,
  CheckCircle2,
  Layers,
  HelpCircle,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  Flame,
  Home,
  ArrowRight,
  Sun,
  Star,
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

interface ThemeOption {
  slug: string;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  gradient: string;
  badge: string;
  categories: string[];
  sampleQuestions: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    slug: 'pasangan',
    label: 'Pasangan (Love)',
    subtitle: 'Makin Dekat, Makin Kenal',
    icon: Heart,
    color: '#D63B78',
    gradient: 'from-[#D63B78] to-[#9E1F5A]',
    badge: 'Berdua',
    categories: ['Romantis', 'Kejujuran', 'Apresiasi', 'Deep Talk', 'Impian Berdua'],
    sampleQuestions: [
      'Momen kecil apa dari kita yang paling sering bikin kamu senyum-senyum sendiri kalau lagi diingat?',
      'Kapan terakhir kali kamu merasa paling dicintai dan dihargai saat bersamaku?',
      'Apa satu hal tentang diriku yang awalnya bikin kamu penasaran waktu pertama kenal?',
      'Kalau kita bisa rencanain satu hari sempurna berdua tanpa gadget, apa yang mau kita lakuin?',
      'Apa ketakutan terbesarmu dalam sebuah hubungan yang jarang kamu ceritakan?',
    ],
  },
  {
    slug: 'friendship',
    label: 'Kartu Nongkee',
    subtitle: 'Nongkrong & Seru Bareng',
    icon: Users,
    color: '#0B8A5F',
    gradient: 'from-[#0B8A5F] to-[#0A5E55]',
    badge: 'Grup',
    categories: ['Nostalgia', 'Curhat', 'Hal Konyol', 'Debat Seru', 'Rahasia Tongkrongan'],
    sampleQuestions: [
      'Siapa orang di tongkrongan ini yang menurutmu paling gampang panik kalau ada masalah?',
      'Ceritakan momen paling kocak atau memalukan yang pernah kamu alami waktu sekolah/kuliah!',
      'Apa first impression kamu tentang orang di sebelah kananmu waktu pertama kali kenal?',
      'Hal apa yang orang lain anggap biasa saja, tapi bisa bikin kamu langsung auto ilfeel?',
      'Kalau tongkrongan kita bikin podcast atau usaha bareng, kita bakal bikin apa?',
    ],
  },
  {
    slug: 'kids',
    label: 'Dunia Si Kecil',
    subtitle: 'Ngobrol Seru Bareng Anak',
    icon: Baby,
    color: '#2DD4C4',
    gradient: 'from-[#2DD4C4] to-[#0E9AA7]',
    badge: 'Anak',
    categories: ['Imajinasi', 'Ceria', 'Cita-Cita', 'Perasaan', 'Hati ke Hati'],
    sampleQuestions: [
      'Kalau kamu bisa jadi superhero atau tokoh kartun seharian, kamu mau jadi siapa dan kenapa?',
      'Apa hal paling menyenangkan yang terjadi di sekolah atau di rumah hari ini?',
      'Kalau kamu punya pintu ajaib yang bisa bawa kamu ke mana saja, kamu mau pergi ke mana sekarang?',
      'Apa yang bisa ayah/ibu lakukan saat kamu lagi merasa sedih atau kesal?',
      'Apa cita-cita atau impian terbesarmu saat kamu sudah dewasa nanti?',
    ],
  },
  {
    slug: 'custom',
    label: 'Pertanyaan Kustom Bebas',
    subtitle: 'Buat Dekmu Sendiri',
    icon: PenSquare,
    color: '#E8870E',
    gradient: 'from-[#FFC83D] to-[#E8870E]',
    badge: 'Kustom',
    categories: ['Kustom', 'Tantangan', 'Refleksi Diri', 'Unik', 'Rahasia Kecil'],
    sampleQuestions: [
      'Apa pelajaran terbesar yang kamu dapatkan dalam 6 bulan terakhir hidupmu?',
      'Kalau kamu bisa ngasih satu saran ke dirimu sendiri 5 tahun yang lalu, apa yang bakal kamu sampaikan?',
      'Apa satu rahasia kecil yang belum pernah kamu ceritakan ke siapapun di ruangan ini?',
      'Hal apa yang saat ini paling bikin kamu bersemangat untuk bangun di pagi hari?',
    ],
  },
  {
    slug: 'dreams',
    label: 'Mimpi (Dreams)',
    subtitle: 'Hopes & Wishes',
    icon: Sun,
    color: '#8B5CF6',
    gradient: 'from-[#6D5AE6] to-[#35258F]',
    badge: 'Mimpi',
    categories: ['Cita-cita', 'Masa Depan', 'Eksplorasi', 'Harapan', 'Petualangan'],
    sampleQuestions: [
      'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?',
      'Tempat mana di dunia ini yang paling ingin kamu kunjungi suatu hari nanti?',
      'Hal baru apa yang selama ini ingin kamu coba tapi masih ragu memulainya?',
      'Bagaimana kamu membayangkan kehidupan idealmu dalam 5 tahun ke depan?',
    ],
  },
  {
    slug: 'gratitude',
    label: 'Rasa Syukur',
    subtitle: 'Grateful Hearts',
    icon: Star,
    color: '#0E7BC4',
    gradient: 'from-[#0E7BC4] to-[#0B4F9C]',
    badge: 'Syukur',
    categories: ['Apresiasi', 'Momen Kecil', 'Kebaikan', 'Kedamaian', 'Keluarga'],
    sampleQuestions: [
      'Hal kecil apa hari ini yang membuatmu merasa bersyukur?',
      'Siapa orang yang paling banyak memberikan pengaruh positif dalam hidupmu belakangan ini?',
      'Pelajaran berharga apa dari masa sulit yang kini kamu syukuri pernah terjadi?',
      'Kebaikan sederhana apa yang orang lain pernah lakukan untukmu dan tak pernah kamu lupakan?',
    ],
  },
  {
    slug: 'family',
    label: 'Keluarga (Family)',
    subtitle: 'Family Stories',
    icon: Home,
    color: '#D9500B',
    gradient: 'from-[#D9500B] to-[#A8330A]',
    badge: 'Keluarga',
    categories: ['Kenangan', 'Keluarga', 'Masa Kecil', 'Kebiasaan', 'Hangat'],
    sampleQuestions: [
      'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?',
      'Apa tradisi atau kebiasaan keluarga yang ingin terus kamu lestarikan?',
      'Nasihat terbaik apa dari orang tua yang paling membekas hingga hari ini?',
      'Kapan terakhir kali kamu merasa sangat bangga dengan keluargamu?',
    ],
  },
  {
    slug: 'passion',
    label: 'Passion (Fire & Drive)',
    subtitle: 'Fire & Ambition',
    icon: Flame,
    color: '#C8102E',
    gradient: 'from-[#C8102E] to-[#6E0A1E]',
    badge: 'Berdua',
    categories: ['Ambisi', 'Mimpi Besar', 'Api Semangat', 'Tantangan', 'Keberanian'],
    sampleQuestions: [
      'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?',
      'Hal apa yang membuat energimu langsung membara ketika membicarakannya?',
      'Resiko terbesar apa yang bersedia kamu ambil demi mencapai impianmu?',
      'Siapa sosok yang paling memicu api semangatmu untuk terus maju?',
    ],
  },
];

interface DraftCard {
  id: string;
  contentId: string;
  contentEn?: string;
  level: 'light' | 'deep' | 'brave';
  category: string;
}

export default function CustomClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckIdParam = searchParams.get('deckId');

  const { decks, addDeck, updateDeck, isLoggedIn, isMounted, profile } = useApp();

  // ── FORM STATE KOLEKSI / DEK ──
  const [deckTitle, setDeckTitle] = useState<string>('');
  const [deckDescription, setDeckDescription] = useState<string>('');
  const [creatorName, setCreatorName] = useState<string>(profile?.name || '');
  const [selectedThemeSlug, setSelectedThemeSlug] = useState<string>('pasangan');

  useEffect(() => {
    if (profile?.name && !creatorName) {
      setCreatorName(profile.name);
    }
  }, [profile?.name, creatorName]);

  // ── DRAFT KARTU-KARTU DI DALAM KOLEKSI ──
  const [draftCards, setDraftCards] = useState<DraftCard[]>([]);

  // Input kartu saat ini
  const [cardQuestionId, setCardQuestionId] = useState<string>('');
  const [cardQuestionEn, setCardQuestionEn] = useState<string>('');
  const [cardLevel, setCardLevel] = useState<'light' | 'deep' | 'brave'>('light');
  const [cardCategory, setCardCategory] = useState<string>('Romantis');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [editingCardIdx, setEditingCardIdx] = useState<number | null>(null);

  // ── PROTEKSI PASSWORD ENKRIPSI ──
  const [enablePassword, setEnablePassword] = useState<boolean>(false);
  const [deckPassword, setDeckPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing deck jika edit mode
  useEffect(() => {
    if (deckIdParam && decks) {
      const found = decks.find((d) => d.id === deckIdParam);
      if (found) {
        setDeckTitle(found.title);
        setDeckDescription(found.description || '');
        setSelectedThemeSlug(found.themeSlug);
        setEnablePassword(found.isLocked || !!found.passwordHash);
        if (found.cards && found.cards.length > 0) {
          setDraftCards(
            found.cards.map((c, idx) => ({
              id: c.id || `card-${Date.now()}-${idx}`,
              contentId: c.contentId,
              contentEn: c.contentEn,
              level: c.level,
              category: c.category,
            }))
          );
        }
      }
    }
  }, [deckIdParam, decks]);

  const currentTheme = THEME_OPTIONS.find((t) => t.slug === selectedThemeSlug) || THEME_OPTIONS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTheme = (slug: string) => {
    setSelectedThemeSlug(slug);
    const theme = THEME_OPTIONS.find((t) => t.slug === slug);
    if (theme && theme.categories.length > 0) {
      setCardCategory(theme.categories[0]);
    }
    soundEngine.playFlip();
  };

  // Tambah / Update Kartu ke Daftar Koleksi
  const handleAddOrUpdateCard = () => {
    if (!cardQuestionId.trim()) {
      showToast('Silakan ketik pertanyaan kartu terlebih dahulu!');
      return;
    }

    const finalCategory = customCategoryInput.trim() || cardCategory || 'Umum';

    if (editingCardIdx !== null) {
      // Update kartu yang sedang diedit
      const updated = [...draftCards];
      updated[editingCardIdx] = {
        ...updated[editingCardIdx],
        contentId: cardQuestionId.trim(),
        contentEn: cardQuestionEn.trim() || undefined,
        level: cardLevel,
        category: finalCategory,
      };
      setDraftCards(updated);
      setEditingCardIdx(null);
      showToast('Kartu berhasil diperbarui!');
    } else {
      // Tambah kartu baru ke koleksi
      const newCard: DraftCard = {
        id: `card-${Date.now()}-${draftCards.length + 1}`,
        contentId: cardQuestionId.trim(),
        contentEn: cardQuestionEn.trim() || undefined,
        level: cardLevel,
        category: finalCategory,
      };
      setDraftCards([...draftCards, newCard]);
      showToast(`Kartu #${draftCards.length + 1} ditambahkan ke koleksi!`);
    }

    // Reset input kartu
    setCardQuestionId('');
    setCardQuestionEn('');
    setCustomCategoryInput('');
    soundEngine.playFlip();
  };

  const handleEditCardFromList = (idx: number) => {
    const card = draftCards[idx];
    setCardQuestionId(card.contentId);
    setCardQuestionEn(card.contentEn || '');
    setCardLevel(card.level);
    setCardCategory(card.category);
    setEditingCardIdx(idx);
    soundEngine.playFlip();
  };

  const handleRemoveCardFromList = (idx: number) => {
    const updated = draftCards.filter((_, i) => i !== idx);
    setDraftCards(updated);
    if (editingCardIdx === idx) {
      setEditingCardIdx(null);
      setCardQuestionId('');
      setCardQuestionEn('');
    }
    soundEngine.playFlip();
  };

  const handleApplySample = (sample: string) => {
    setCardQuestionId(sample);
    soundEngine.playFlip();
  };

  // ── SIMPAN KOLEKSI & SELURUH KARTU ──
  const handleSaveCollection = async (andPlay = false) => {
    if (!isLoggedIn) {
      showToast('Silakan masuk terlebih dahulu agar namamu tercatat sebagai pembuat kartu!');
      router.push('/login?redirect=/custom');
      return;
    }

    if (!deckTitle.trim()) {
      showToast('Beri nama koleksimu terlebih dahulu!');
      return;
    }

    if (draftCards.length === 0 && !cardQuestionId.trim()) {
      showToast('Tambahkan minimal 1 pertanyaan kartu ke dalam koleksi!');
      return;
    }

    const effectiveCreatorName = creatorName.trim() || profile?.name || 'Anonim';

    // Jika ada pertanyaan yang masih belum dimasukkan ke list, masukkan otomatis
    let finalCards = [...draftCards].map(c => ({
      ...c,
      creatorName: effectiveCreatorName,
    }));

    if (cardQuestionId.trim()) {
      finalCards.push({
        id: `card-${Date.now()}-${finalCards.length + 1}`,
        contentId: cardQuestionId.trim(),
        contentEn: cardQuestionEn.trim() || undefined,
        level: cardLevel,
        category: customCategoryInput.trim() || cardCategory || 'Umum',
        creatorName: effectiveCreatorName,
      } as any);
    }

    if (enablePassword && !deckPassword.trim() && !deckIdParam) {
      showToast('Masukkan password untuk mengunci koleksi ini!');
      return;
    }

    setIsSubmitting(true);
    soundEngine.playFlip();

    try {
      const payload: any = {
        id: deckIdParam || `deck-${Date.now()}`,
        title: deckTitle.trim(),
        description: deckDescription.trim(),
        themeSlug: selectedThemeSlug,
        cards: finalCards,
        creatorName: effectiveCreatorName,
        creatorUsername: profile?.username,
      };

      if (enablePassword && deckPassword.trim()) {
        payload.password = deckPassword.trim();
        payload.isLocked = true;
      }

      // POST ke API yang otomatis mengenkripsi password dengan SHA-256 + Salt
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.deck) {
        if (deckIdParam) {
          await updateDeck(data.deck);
        } else {
          await addDeck(data.deck);
        }

        soundEngine.playCelebration();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });

        showToast('Koleksi kartu berhasil disimpan dengan aman!');

        setTimeout(() => {
          if (andPlay) {
            router.push(`/play?deck=${data.deck.id}`);
          } else {
            router.push('/collection');
          }
        }, 1200);
      } else {
        showToast(data.error || 'Gagal menyimpan koleksi');
      }
    } catch (err: any) {
      showToast('Kesalahan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1B26] border border-pink-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP HEADER SUB-NAV ── */}
      <div className="border-b border-white/10 bg-[#121218]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/collection"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Koleksi</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-bold text-zinc-300">
            {deckIdParam ? 'Edit Koleksi Dek' : 'Studio Pembuatan Koleksi & Kartu'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveCollection(false)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Koleksi'}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN STUDIO CONTAINER ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Banner Penjelasan Alur */}
        <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-violet-600/20 via-pink-500/20 to-amber-500/20 border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 inline-block mb-2">
              Studio Pembuatan Koleksi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Buat Beberapa Kartu, Satukan dalam Koleksi, &amp; Kunci dengan Enkripsi
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1 leading-relaxed">
              Tulis beberapa pertanyaan yang ingin kamu diskusikan, satukan menjadi satu dek dengan nama pilihanmu, lalu lindungi dengan password terenkripsi SHA-256 di database.
            </p>
          </div>
        </div>

        {/* Notifikasi Wajib Login Jika Belum Masuk */}
        {isMounted && !isLoggedIn && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-[#14141C] border border-pink-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center flex-shrink-0 shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Masuk Akun Diperlukan Untuk Membuat Kartu
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  Silakan masuk terlebih dahulu agar namamu tercatat resmi sebagai pembuat kartu dan karyamu tersimpan ke database.
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/custom"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-extrabold text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-95 transition text-center whitespace-nowrap"
            >
              Masuk / Login Sekarang →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ════════════════════════════════════════════════════════════════
              KOLOM KIRI: FORM PENGATURAN KOLEKSI & KARTU (7 COLS)
              ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-8">
            {/* ── LANGKAH 1: IDENTITAS KOLEKSI & PILIH VIBE / TEMA ── */}
            <div className="bg-[#14141C] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-black text-white">Nama Koleksi, Pembuat, &amp; Desain Kartu</h2>
              </div>

              {/* Input Nama Koleksi */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Nama Koleksi / Dek: <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Deep Talk Rahasia Kami, Tongkrongan Malam Jumat..."
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm font-semibold transition"
                />
              </div>

              {/* Input Nama Pembuat Kartu */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Nama Pembuat Kartu:</span>
                  <span className="text-[10px] text-pink-400 font-semibold lowercase">tercantum di kartu &amp; koleksi</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama kamu (misal: Bintang / Rian / Sarah)..."
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm font-semibold transition"
                />
              </div>

              {/* Input Deskripsi (Opsional) */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Deskripsi Singkat (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Catatan kecil tentang siapa dan momen apa koleksi ini digunakan..."
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 text-xs transition"
                />
              </div>

              {/* Pilihan Tema / Vibe */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Pilih Desain &amp; Gaya Kartu:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {THEME_OPTIONS.map((theme) => {
                    const isSelected = selectedThemeSlug === theme.slug;
                    const IconComponent = theme.icon;
                    return (
                      <button
                        key={theme.slug}
                        type="button"
                        onClick={() => handleSelectTheme(theme.slug)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-pink-500 bg-pink-500/15 ring-2 ring-pink-500/30'
                            : 'border-white/10 bg-black/30 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className="w-4 h-4" style={{ color: theme.color }} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white">{theme.label}</div>
                          <div className="text-[10px] text-zinc-400 line-clamp-1">{theme.badge}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── LANGKAH 2: TAMBAH BEBERAPA KARTU KE DALAM KOLEKSI ── */}
            <div className="bg-[#14141C] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-black text-white">
                    {editingCardIdx !== null
                      ? `Edit Kartu #${editingCardIdx + 1}`
                      : 'Tambahkan Kartu ke Koleksi Ini'}
                  </h2>
                </div>

                <span className="text-xs font-bold text-pink-400 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
                  {draftCards.length} Kartu Terkumpul
                </span>
              </div>

              {/* Text Pertanyaan */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Teks Pertanyaan (Bahasa Indonesia): <span className="text-pink-400">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ketik topik atau pertanyaan seru yang ingin kamu ajukan..."
                  value={cardQuestionId}
                  onChange={(e) => setCardQuestionId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm leading-relaxed transition"
                />
              </div>

              {/* Pertanyaan Bahasa Inggris (Opsional) */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Terjemahan Inggris (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="English translation..."
                  value={cardQuestionEn}
                  onChange={(e) => setCardQuestionEn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 text-xs transition"
                />
              </div>

              {/* Level & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Level Kedalaman */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                    Tingkat Kedalaman:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'light', label: 'Santai' },
                      { id: 'deep', label: 'Mendalam' },
                      { id: 'brave', label: 'Berani' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setCardLevel(lvl.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          cardLevel === lvl.id
                            ? 'bg-pink-500 text-white border-pink-400 shadow'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kategori Topik */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                    Kategori Topik:
                  </label>
                  <select
                    value={cardCategory}
                    onChange={(e) => setCardCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500 transition"
                  >
                    {currentTheme.categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#14141C] text-white">
                        {cat}
                      </option>
                    ))}
                    <option value="Kustom Lainnya" className="bg-[#14141C] text-white">
                      + Ketik Kategori Kustom
                    </option>
                  </select>

                  {cardCategory === 'Kustom Lainnya' && (
                    <input
                      type="text"
                      placeholder="Nama kategori kustom..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-pink-500"
                    />
                  )}
                </div>
              </div>

              {/* Inspirasi Pertanyaan Cepat */}
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspirasi Pertanyaan Cepat (Klik untuk memilih):</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentTheme.sampleQuestions.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySample(sample)}
                      className="text-[11px] px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition text-left"
                    >
                      &ldquo;{sample.slice(0, 45)}...&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Tombol Tambahkan Kartu ke List */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddOrUpdateCard}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-pink-500/50 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4 text-pink-400" />
                  <span>
                    {editingCardIdx !== null
                      ? 'Simpan Perubahan Kartu Ini'
                      : 'Masukkan Kartu Ini ke Dalam Koleksi (+)'}
                  </span>
                </button>

                {editingCardIdx !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCardIdx(null);
                      setCardQuestionId('');
                      setCardQuestionEn('');
                    }}
                    className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </div>

            {/* ── LANGKAH 3: KUNCI KOLEKSI DENGAN ENKRIPSI PASSWORD ── */}
            <div className="bg-[#14141C] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-black text-white">Kunci Koleksi dengan Password</h2>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePassword}
                    onChange={(e) => setEnablePassword(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Jika diaktifkan, siapapun yang ingin membuka koleksi kartu ini di halaman Collection harus memasukkan password yang benar terlebih dahulu.
              </p>

              {enablePassword && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Password Koleksi: <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contoh: rahasia123, deeptalk2026..."
                        value={deckPassword}
                        onChange={(e) => setDeckPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-11 rounded-2xl bg-black/50 border border-amber-500/40 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Info Badge Enkripsi Database */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Enkripsi Database SHA-256:</strong> Password koleksi ini otomatis di-hash dengan enkripsi 256-bit dan salt rahasia sebelum disimpan ke database. Password asli tidak pernah tersimpan dalam bentuk teks biasa.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── LANGKAH 4: TOMBOL SIMPAN KOLEKSI ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveCollection(false)}
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'Menyimpan ke Database...'
                    : `Simpan Koleksi & Semua Kartu (${draftCards.length + (cardQuestionId.trim() ? 1 : 0)} Kartu)`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveCollection(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-sm transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simpan &amp; Mainkan</span>
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              KOLOM KANAN: DAFTAR KARTU DALAM DEK & LIVE PREVIEW (5 COLS)
              ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">
            {/* DAFTAR KARTU YANG SUDAH DIMASUKKAN KE KOLEKSI INI */}
            <div className="bg-[#14141C] border border-white/10 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-black text-white">
                    Kartu di Koleksi Ini ({draftCards.length})
                  </h3>
                </div>

                {enablePassword && (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                    <Lock className="w-3 h-3" />
                    <span>Terkunci</span>
                  </span>
                )}
              </div>

              {draftCards.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-white/10 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-300">Belum ada kartu di koleksi</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Ketik pertanyaan di sebelah kiri lalu klik &ldquo;Masukkan Kartu Ini ke Dalam Koleksi&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {draftCards.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-pink-500/30 flex items-start justify-between gap-3 group transition"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/10 text-white">
                            #{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">
                            {card.level === 'brave' ? 'Berani' : card.level === 'deep' ? 'Mendalam' : 'Santai'} · {card.category}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white leading-snug">
                          &ldquo;{card.contentId}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditCardFromList(idx)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500 text-zinc-400 hover:text-white transition"
                          title="Edit Kartu Ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCardFromList(idx)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 text-zinc-400 hover:text-white transition"
                          title="Hapus Kartu Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LIVE PREVIEW DESAIN KARTU */}
            <div className="bg-[#14141C] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Live Preview Kartu:
                </span>
                <span className="text-[10px] font-bold text-pink-400">
                  {currentTheme.label}
                </span>
              </div>

              {selectedThemeSlug === 'pasangan' ? (
                <PasanganCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'friendship' ? (
                <NongkeeCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'kids' ? (
                <KidsCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Hati ke Hati' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'dreams' ? (
                <DreamsCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'gratitude' ? (
                <GratitudeCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'family' ? (
                <FamilyCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : selectedThemeSlug === 'passion' ? (
                <PassionCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  size="default"
                />
              ) : (
                <CustomCard
                  question={cardQuestionId || draftCards[0]?.contentId || 'Tulis pertanyaanmu di form untuk melihat preview kartu...'}
                  level={cardLevel === 'brave' ? 'Berani' : cardLevel === 'deep' ? 'Mendalam' : 'Santai'}
                  cardNumber="01"
                  creatorName={creatorName || profile?.name}
                  size="default"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
