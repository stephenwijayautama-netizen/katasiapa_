'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../AppContext';
import { CardItem } from '../store';
import {
  X,
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
  RotateCcw,
  Plus,
  Flame,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PasanganCard from './PasanganCard';
import NongkeeCard from './NongkeeCard';
import KidsCard from './KidsCard';
import CustomCard from './CustomCard';
import { soundEngine } from '../lib/soundEngine';

export interface CustomCardCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultThemeSlug?: string;
  initialEditCard?: CardItem | null;
}

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
      'Momen kecil apa dari kita yang paling sering bikin kamu senyum-senyum sendiri kalau lagi keinget?',
      'Kapan terakhir kali kamu merasa paling dicintai dan dihargai saat bersamaku?',
      'Apa satu hal tentang diriku yang awalnya bikin kamu penasaran waktu pertama kenal?',
      'Kalau kita bisa rencanain satu hari sempurna berdua tanpa gadget, apa yang mau kita lakuin?',
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
      'Kalau kamu bisa ngasih satu saran ke dirimu sendiri 5 tahun yang lalu, apa yang bakal kamu omongin?',
      'Apa satu rahasia kecil yang belum pernah kamu ceritakan ke siapapun di ruangan ini?',
      'Hal apa yang saat ini paling bikin kamu bersemangat untuk bangun di pagi hari?',
    ],
  },
];

export default function CustomCardCreatorModal({
  isOpen,
  onClose,
  defaultThemeSlug = 'custom',
  initialEditCard = null,
}: CustomCardCreatorModalProps) {
  const router = useRouter();
  const { cards, addCard, updateCard, deleteCard, profile } = useApp();

  // Tab State: 'editor' | 'my-cards'
  const [activeTab, setActiveTab] = useState<'editor' | 'my-cards'>('editor');

  // Form State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [selectedThemeSlug, setSelectedThemeSlug] = useState<string>(defaultThemeSlug);
  const [selectedLevel, setSelectedLevel] = useState<'light' | 'deep' | 'brave'>('light');
  const [selectedCategory, setSelectedCategory] = useState<string>('Umum');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [questionId, setQuestionId] = useState<string>('');
  const [questionEn, setQuestionEn] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dengan prop initialEditCard saat dibuka
  useEffect(() => {
    if (initialEditCard) {
      setEditingCardId(initialEditCard.id);
      setSelectedThemeSlug(
        initialEditCard.themeSlug === 'love'
          ? 'pasangan'
          : initialEditCard.themeSlug === 'nongkee'
          ? 'friendship'
          : initialEditCard.themeSlug
      );
      setSelectedLevel((initialEditCard.level as any) || 'light');
      setSelectedCategory(initialEditCard.category || 'Umum');
      setQuestionId(initialEditCard.contentId || '');
      setQuestionEn(initialEditCard.contentEn || '');
      setActiveTab('editor');
    } else {
      resetForm();
      if (defaultThemeSlug) {
        setSelectedThemeSlug(
          defaultThemeSlug === 'love'
            ? 'pasangan'
            : defaultThemeSlug === 'nongkee'
            ? 'friendship'
            : defaultThemeSlug
        );
      }
    }
  }, [initialEditCard, defaultThemeSlug, isOpen]);

  const currentTheme = THEME_OPTIONS.find((t) => t.slug === selectedThemeSlug) || THEME_OPTIONS[3];

  const resetForm = () => {
    setEditingCardId(null);
    setQuestionId('');
    setQuestionEn('');
    setSelectedCategory('Umum');
    setCustomCategoryInput('');
    setSelectedLevel('light');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter daftar kartu buatan user (theme custom atau id yang diawali card- atau cust-)
  const myCustomCards = cards.filter(
    (c) =>
      c.id.startsWith('card-') ||
      c.id.startsWith('cust-') ||
      c.themeSlug === 'custom' ||
      c.category === 'Kustom'
  );

  const handleSelectTheme = (slug: string) => {
    setSelectedThemeSlug(slug);
    const theme = THEME_OPTIONS.find((t) => t.slug === slug);
    if (theme && theme.categories.length > 0) {
      setSelectedCategory(theme.categories[0]);
    }
    soundEngine.playFlip();
  };

  const handleApplySample = (sample: string) => {
    setQuestionId(sample);
    soundEngine.playFlip();
  };

  const handleSaveCard = async (andPlay = false) => {
    if (!questionId.trim()) {
      showToast('Silakan tulis pertanyaan terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    soundEngine.playFlip();

    const categoryFinal = customCategoryInput.trim() || selectedCategory || 'Umum';

    // Normalisasi slug untuk penyimpanan (pasangan -> pasangan / love, friendship -> friendship)
    const targetSlug =
      selectedThemeSlug === 'pasangan'
        ? 'pasangan'
        : selectedThemeSlug === 'friendship'
        ? 'friendship'
        : selectedThemeSlug;

    try {
      if (editingCardId) {
        // Update kartu yang ada
        const updatedCardItem: CardItem = {
          id: editingCardId,
          themeSlug: targetSlug,
          level: selectedLevel,
          category: categoryFinal,
          contentId: questionId.trim(),
          contentEn: questionEn.trim() || '',
          number: editingCardId,
          creatorName: profile?.name || undefined,
          creatorUsername: profile?.username || undefined,
        };
        await updateCard(updatedCardItem);
        showToast('Pertanyaan berhasil diperbarui!');
      } else {
        // Buat kartu baru
        const newCardData: Omit<CardItem, 'id'> = {
          themeSlug: targetSlug,
          level: selectedLevel,
          category: categoryFinal,
          contentId: questionId.trim(),
          contentEn: questionEn.trim() || '',
          number: String(myCustomCards.length + 1).padStart(2, '0'),
          creatorName: profile?.name || undefined,
          creatorUsername: profile?.username || undefined,
        };
        await addCard(newCardData);
        showToast('Kartu kustom baru berhasil dibuat dan disimpan!');
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      if (andPlay) {
        soundEngine.playCelebration();
        onClose();
        // Redirect ke arena game sesuai tema yang baru dibuat
        const playSlug = targetSlug === 'pasangan' ? 'love' : targetSlug;
        router.push(`/play?theme=${playSlug}`);
      } else {
        // Tetap di modal, reset form
        resetForm();
      }
    } catch (e: any) {
      showToast('Terjadi kesalahan saat menyimpan: ' + (e.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExisting = (card: CardItem) => {
    setEditingCardId(card.id);
    setSelectedThemeSlug(
      card.themeSlug === 'love'
        ? 'pasangan'
        : card.themeSlug === 'nongkee'
        ? 'friendship'
        : card.themeSlug
    );
    setSelectedLevel((card.level as any) || 'light');
    setSelectedCategory(card.category || 'Umum');
    setQuestionId(card.contentId || '');
    setQuestionEn(card.contentEn || '');
    setActiveTab('editor');
    soundEngine.playFlip();
  };

  const handleDeleteExisting = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah kamu yakin ingin menghapus pertanyaan ini?')) {
      await deleteCard(id);
      showToast('Kartu berhasil dihapus.');
      soundEngine.playFlip();
      if (editingCardId === id) {
        resetForm();
      }
    }
  };

  if (!isOpen) return null;

  // Level string label untuk card component
  const levelDisplay =
    selectedThemeSlug === 'kids'
      ? selectedLevel === 'brave'
        ? 'Hati ke Hati'
        : selectedLevel === 'deep'
        ? 'Mendalam'
        : 'Santai'
      : selectedLevel === 'brave'
      ? 'Berani'
      : selectedLevel === 'deep'
      ? 'Mendalam'
      : 'Santai';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#14141C] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Toast Notifikasi */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-zinc-900/95 border border-pink-500/50 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── HEADER MODAL ── */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Studio Pembuat Kartu Kustom
                {editingCardId && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    Mode Edit Kartu
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Pilih model kartu, tentukan suasana, lalu tulis pertanyaanmu sendiri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'editor'
                    ? 'bg-pink-500 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('my-cards')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'my-cards'
                    ? 'bg-pink-500 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Daftar Kartu Saya</span>
                {myCustomCards.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">
                    {myCustomCards.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── BODY MODAL ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'editor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ── KOLOM KIRI: FORM KONTROL & INPUT (7 Cols) ── */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Pilih Bagian / Model Kartu */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black tracking-wider uppercase text-zinc-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">
                        1
                      </span>
                      Pilih Bagian / Model Kartu yang Mau Dibuat:
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Aktif: <strong className="text-pink-400">{currentTheme.label}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {THEME_OPTIONS.map((theme) => {
                      const Icon = theme.icon;
                      const isSelected = selectedThemeSlug === theme.slug;
                      return (
                        <button
                          key={theme.slug}
                          type="button"
                          onClick={() => handleSelectTheme(theme.slug)}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white/10 border-pink-500 shadow-md ring-2 ring-pink-500/30 -translate-y-0.5'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                              style={{ backgroundColor: theme.color }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-pink-400 fill-pink-500/20" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-black text-white truncate">
                              {theme.label.split(' (')[0]}
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">
                              {theme.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Bebaskan Dia untuk Memilih (Level & Kategori) */}
                <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-4">
                  <div>
                    <label className="text-xs font-black tracking-wider uppercase text-zinc-300 flex items-center gap-1.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">
                        2
                      </span>
                      Pilih Suasana &amp; Tingkat Kedalaman Obrolan:
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: 'light',
                          label: 'Santai',
                          desc: 'Ringan & Icebreaker',
                        },
                        {
                          id: 'deep',
                          label: 'Mendalam',
                          desc: 'Deep Talk & Cerita',
                        },
                        {
                          id: 'brave',
                          label: selectedThemeSlug === 'kids' ? 'Hati ke Hati' : 'Berani',
                          desc: 'Kejujuran & Rahasia',
                        },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => {
                            setSelectedLevel(lvl.id as any);
                            soundEngine.playFlip();
                          }}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            selectedLevel === lvl.id
                              ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{lvl.label}</div>
                          <div className="text-[10px] opacity-75">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kategori Kartu (Preset Chips + Custom Input) */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Pilihan Topik / Kategori Kartu:
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {currentTheme.categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCustomCategoryInput('');
                            soundEngine.playFlip();
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                            selectedCategory === cat && !customCategoryInput
                              ? 'bg-pink-500 text-white border-pink-400'
                              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Atau ketik kategori kustom sendiri (opsional)..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>
                </div>

                {/* 3. Menulis Tulisan + Masukin Pertanyaan */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black tracking-wider uppercase text-zinc-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">
                        3
                      </span>
                      Tulis Pertanyaan Obrolan:
                    </label>
                    <span className="text-[11px] text-zinc-500">
                      {questionId.length} Karakter · Font Otomatis Menyesuaikan
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder={`Tulis pertanyaan obrolan untuk kartu ${currentTheme.label}... (Misal: "Kapan terakhir kali kamu...")`}
                    value={questionId}
                    onChange={(e) => setQuestionId(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-black/50 border border-white/15 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition resize-none leading-relaxed"
                  />

                  {/* Input Terjemahan Sub-teks (Opsional) */}
                  <input
                    type="text"
                    placeholder="Terjemahan bahasa Inggris / sub-teks (opsional)..."
                    value={questionEn}
                    onChange={(e) => setQuestionEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
                  />

                  {/* Contoh Ide Cepat Sesuai Tema */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Butuh Inspirasi? Klik salah satu contoh pertanyaan di bawah:</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentTheme.sampleQuestions.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplySample(sample)}
                          className="w-full text-left text-xs text-zinc-300 hover:text-white p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition border border-white/5 truncate block"
                          title="Klik untuk gunakan pertanyaan ini"
                        >
                          &ldquo;{sample}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Aksi Simpan / Update & Selesaikan */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveCard(false)}
                    disabled={isSubmitting || !questionId.trim()}
                    className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{editingCardId ? 'Update Pertanyaan' : 'Simpan ke Dek'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveCard(true)}
                    disabled={isSubmitting || !questionId.trim()}
                    className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 hover:scale-[1.01] active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-xl shadow-pink-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Selesaikan &amp; Mainkan!</span>
                  </button>
                </div>
              </div>

              {/* ── KOLOM KANAN: LIVE INTERACTIVE PREVIEW (5 Cols) ── */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-3xl p-6 relative">
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                    LIVE PREVIEW KARTU
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400">
                    Model: {currentTheme.label.split(' (')[0]}
                  </span>
                </div>

                {/* Render Kartu Otentik Sesuai Model Terpilih */}
                <div className="py-2 flex justify-center w-full">
                  {selectedThemeSlug === 'pasangan' ? (
                    <PasanganCard
                      question={
                        questionId.trim() ||
                        'Tulis pertanyaanmu di form samping, dan kartu ini akan langsung mencerminkannya secara real-time.'
                      }
                      level={levelDisplay}
                      cardNumber="03"
                      size="default"
                    />
                  ) : selectedThemeSlug === 'friendship' ? (
                    <NongkeeCard
                      question={
                        questionId.trim() ||
                        'Tulis pertanyaanmu di form samping, dan kartu ini akan langsung mencerminkannya secara real-time.'
                      }
                      level={levelDisplay}
                      cardNumber="02"
                      size="default"
                    />
                  ) : selectedThemeSlug === 'kids' ? (
                    <KidsCard
                      question={
                        questionId.trim() ||
                        'Tulis pertanyaanmu di form samping, dan kartu ini akan langsung mencerminkannya secara real-time.'
                      }
                      level={levelDisplay}
                      cardNumber="04"
                      size="default"
                    />
                  ) : (
                    <CustomCard
                      question={
                        questionId.trim() ||
                        'Tulis pertanyaanmu di form samping, dan kartu ini akan langsung mencerminkannya secara real-time.'
                      }
                      level={levelDisplay}
                      cardNumber="01"
                      size="default"
                    />
                  )}
                </div>

                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  Kartu ini langsung tersambung dengan database KataSiapa dan siap dimainkan bersama teman, pasangan, atau keluarga.
                </p>
              </div>
            </div>
          ) : (
            /* ── TAB DAFTAR KARTU SAYA (BISA DI-UPDATE & DIHAPUS) ── */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Daftar Pertanyaan Kustom Kamu</h3>
                  <p className="text-xs text-zinc-400">
                    Pilih pertanyaan yang ingin diubah atau dihapus dari koleksi pribadimu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('editor');
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Baru</span>
                </button>
              </div>

              {myCustomCards.length === 0 ? (
                <div className="text-center py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                  <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-zinc-400">Belum ada pertanyaan kustom tersimpan.</p>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">
                    Mulai buat pertanyaan pertamamu untuk pasangan, teman nongkrong, atau anak tercinta!
                  </p>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  >
                    Buka Editor Sekarang →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myCustomCards.map((card, idx) => {
                    const theme =
                      THEME_OPTIONS.find((t) => t.slug === card.themeSlug) || THEME_OPTIONS[3];
                    return (
                      <div
                        key={card.id || idx}
                        onClick={() => handleEditExisting(card)}
                        className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-pink-500/40 transition cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: theme.color }}
                            >
                              {theme.label.split(' (')[0]}
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-400">
                              {card.category || 'Umum'} · {card.level || 'Santai'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed line-clamp-3">
                            &ldquo;{card.contentId}&rdquo;
                          </p>
                          {card.contentEn && (
                            <p className="text-[11px] text-zinc-400 italic mt-1 truncate">
                              {card.contentEn}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                          <span className="text-[10px] text-zinc-500">ID: {card.id}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditExisting(card);
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-pink-500 text-zinc-300 hover:text-white text-xs transition"
                              title="Edit Pertanyaan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteExisting(card.id, e)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white text-xs transition"
                              title="Hapus Pertanyaan"
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
          )}
        </div>
      </div>
    </div>
  );
}
