'use client';

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Shield, Plus, Trash2, Edit3, Check, X, Layers, Database, Sparkles, Image as ImageIcon } from 'lucide-react';
import ThemeCard from '../ThemeCard';

export default function AdminClient() {
  const { lang, t, themes, cards, addCard, deleteCard, updateCard, addTheme, deleteTheme } = useApp();
  const [tab, setTab] = useState<'cards' | 'themes' | 'bulk'>('themes');

  // New Card State
  const [themeSlug, setThemeSlug] = useState(themes[0]?.slug || 'family');
  const [level, setLevel] = useState<'light' | 'deep' | 'brave'>('light');
  const [contentEn, setContentEn] = useState('');
  const [contentId, setContentId] = useState('');

  // Bulk Add State
  const [bulkText, setBulkText] = useState('');

  // Edit Card State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editId, setEditId] = useState('');

  // ── NEW THEME / EDITION STATE (No hardcoding) ──
  const [newThemeTitle, setNewThemeTitle] = useState('');
  const [newThemeSlug, setNewThemeSlug] = useState('');
  const [newThemeCategory, setNewThemeCategory] = useState('');
  const [newThemeEdition, setNewThemeEdition] = useState<'normal' | 'casual' | 'love' | 'event'>('normal');
  const [newThemeBgImage, setNewThemeBgImage] = useState('/family_card_bg.jpg');
  const [newThemeBadge, setNewThemeBadge] = useState('');
  const [newThemeGradient, setNewThemeGradient] = useState('from-indigo-600 to-slate-950');
  const [newThemeEmoji, setNewThemeEmoji] = useState('');
  const [showAddThemeForm, setShowAddThemeForm] = useState(false);

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentEn || !contentId) return;
    addCard({ themeSlug, level, contentEn, contentId, number: '01', category: 'General' });
    setContentEn('');
    setContentId('');
    alert('Kartu berhasil ditambahkan!');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
    lines.forEach((line, idx) => {
      addCard({
        themeSlug,
        level,
        contentEn: line,
        contentId: line,
        number: String(idx + 1).padStart(2, '0'),
        category: 'Bulk'
      });
    });
    setBulkText('');
    alert(`${lines.length} kartu berhasil ditambahkan secara massal!`);
  };

  const handleAddThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeTitle.trim()) return;

    const slug = (newThemeSlug.trim() || newThemeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    
    // Validasi duplikasi slug
    if (themes.some(th => th.slug === slug)) {
      alert(`Tema dengan slug "${slug}" sudah ada! Mohon gunakan slug atau judul yang berbeda.`);
      return;
    }

    addTheme({
      slug,
      titleEn: newThemeTitle.trim(),
      titleId: newThemeTitle.trim(),
      subtitleEn: newThemeCategory.trim() || 'Percakapan Seru',
      subtitleId: newThemeCategory.trim() || 'Percakapan Seru',
      color: '#EC4899',
      gradient: newThemeGradient,
      iconName: 'Sparkles',
      emoji: newThemeEmoji || '',
      edition: newThemeEdition,
      editionLabel: newThemeEdition === 'event' ? 'Event Edition' : newThemeEdition === 'love' ? 'Love' : newThemeEdition === 'casual' ? 'Casual' : 'Normal / Classic',
      bgImage: newThemeBgImage,
      isEvent: newThemeEdition === 'event',
      eventBadge: newThemeBadge.trim() || (newThemeEdition === 'event' ? 'LIMITED EDITION' : undefined),
      tag: newThemeEdition === 'event' ? 'Special Event' : undefined,
    });

    setNewThemeTitle('');
    setNewThemeSlug('');
    setNewThemeCategory('');
    setNewThemeBadge('');
    setShowAddThemeForm(false);
    alert('Tema baru berhasil ditambahkan dan langsung aktif di permainan!');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" />
              {t.adminTitle}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">{t.adminSubtitle}</h1>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setTab('themes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'themes' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-zinc-400 hover:text-white'}`}
            >
              Kelola Tema & Edisi ({themes.length})
            </button>
            <button
              onClick={() => setTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'cards' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-zinc-400 hover:text-white'}`}
            >
              {t.manageCards} ({cards.length})
            </button>
            <button
              onClick={() => setTab('bulk')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'bulk' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-zinc-400 hover:text-white'}`}
            >
              {t.bulkAdd}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 1: KELOLA TEMA & EDISI (Tanpa Hardcoding, Bebas Tambah Kapan Saja)
           ══════════════════════════════════════════════════════════════════════════ */}
        {tab === 'themes' && (
          <div className="space-y-8">
            {/* Header Tombol Tambah */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Daftar Tema & Edisi Aktif</h2>
                <p className="text-xs text-zinc-400">Semua tema yang ada di sini otomatis muncul di halaman permainan dan alur carousel menyamping.</p>
              </div>
              <button
                onClick={() => setShowAddThemeForm(!showAddThemeForm)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddThemeForm ? 'Tutup Form' : 'Tambah Tema / Event Baru'}</span>
              </button>
            </div>

            {/* FORM TAMBAH TEMA BARU */}
            {showAddThemeForm && (
              <form onSubmit={handleAddThemeSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-pink-500/30 space-y-6 shadow-2xl">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Buat Tema / Edisi Baru (Dynamic & Live)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Tema yang kamu buat langsung muncul di alur game menyamping tanpa perlu koding ulang.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Judul Tema / Deck *</label>
                    <input
                      type="text"
                      required
                      value={newThemeTitle}
                      onChange={(e) => setNewThemeTitle(e.target.value)}
                      placeholder="Misal: Ramadhan Edition / Deep Midnight / Kantor"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Slug ID (URL) — opsional</label>
                    <input
                      type="text"
                      value={newThemeSlug}
                      onChange={(e) => setNewThemeSlug(e.target.value)}
                      placeholder="Otomatis dari judul jika dikosongkan"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Kategori / Subtitle</label>
                    <input
                      type="text"
                      value={newThemeCategory}
                      onChange={(e) => setNewThemeCategory(e.target.value)}
                      placeholder="Misal: Edisi Spesial Malam / Cerita Seru"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Pilih Edisi (Kategori Menyamping)</label>
                    <select
                      value={newThemeEdition}
                      onChange={(e) => setNewThemeEdition(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="normal">Normal / Classic</option>
                      <option value="casual">Casual &amp; Nongkrong</option>
                      <option value="love">Love &amp; Romance</option>
                      <option value="event">Event Edition (Khusus / Terbatas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Badge Edisi Khusus</label>
                    <input
                      type="text"
                      value={newThemeBadge}
                      onChange={(e) => setNewThemeBadge(e.target.value)}
                      placeholder="Misal: LIMITED EVENT / HOT"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Pilih Desain Kartu (Background Image)</label>
                    <select
                      value={newThemeBgImage}
                      onChange={(e) => setNewThemeBgImage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="/family_card_bg.jpg">Template Kartu 01 (Family / Biru)</option>
                      <option value="/love_card_bg.jpg">Template Kartu 02 (Love / Pink)</option>
                      <option value="/passion_card_bg.jpg">Template Kartu 03 (Passion / Merah)</option>
                      <option value="/friendship_card_bg.jpg">Template Kartu 04 (Friendship / Hijau)</option>
                      <option value="/dreams_card_bg.jpg">Template Kartu 05 (Dreams / Ungu)</option>
                      <option value="/gratitude_card_bg.jpg">Template Kartu 06 (Gratitude / Amber Emas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Ikon Label</label>
                    <input
                      type="text"
                      value={newThemeEmoji}
                      onChange={(e) => setNewThemeEmoji(e.target.value)}
                      placeholder="Misal: Bintang, Api, Kopi"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
                >
                  Simpan &amp; Luncurkan Tema
                </button>
              </form>
            )}

            {/* Grid List Tema Aktif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map(th => (
                <div
                  key={th.slug}
                  className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-white/20 transition shadow-lg relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-pink-400">{th.titleEn?.charAt(0) || 'K'}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        th.edition === 'event' || th.isEvent
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : th.edition === 'love'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                          : th.edition === 'casual'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {th.isEvent ? 'Event Edition' : th.edition || 'Normal'}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus tema "${th.titleEn || th.slug}"?`)) {
                            deleteTheme(th.slug);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        title="Hapus tema"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-black text-white">{th.titleEn || th.titleId}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{th.subtitleEn || th.subtitleId}</p>
                    {th.eventBadge && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300">
                        {th.eventBadge}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <span>Slug: <code className="text-pink-400 font-mono text-[11px]">{th.slug}</code></span>
                    <span>{cards.filter(c => c.themeSlug === th.slug).length} kartu</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 2: KELOLA KARTU PERTANYAAN
           ══════════════════════════════════════════════════════════════════════════ */}
        {tab === 'cards' && (
          <div className="space-y-8">
            {/* Add Card Form */}
            <form onSubmit={handleAddCardSubmit} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                {t.addNewCard}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1 block">{t.themeTitle}</label>
                  <select
                    value={themeSlug}
                    onChange={(e) => setThemeSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {themes.map(th => (
                      <option key={th.slug} value={th.slug}>{th.emoji} {th.titleEn} / {th.titleId}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1 block">{t.level}</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="light">Light & Fun</option>
                    <option value="deep">Deep & Meaningful</option>
                    <option value="brave">Brave & Passionate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1 block">Prompt (English)</label>
                  <input
                    type="text"
                    required
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="e.g. What is your favorite memory..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 mb-1 block">Pertanyaan (Indonesia)</label>
                  <input
                    type="text"
                    required
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    placeholder="misal. Apa kenangan favoritmu..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
              >
                {t.save}
              </button>
            </form>

            {/* Cards Table */}
            <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 font-bold text-sm">
                Existing Cards Database ({cards.length})
              </div>
              <div className="divide-y divide-white/10">
                {cards.map(card => (
                  <div key={card.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase">{card.themeSlug}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase">{card.level}</span>
                      </div>
                      {editingCardId === card.id ? (
                        <div className="space-y-2 pt-2">
                          <input
                            type="text"
                            value={editEn}
                            onChange={(e) => setEditEn(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={editId}
                            onChange={(e) => setEditId(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <div className="text-xs space-y-1 pt-1">
                          <p className="text-zinc-200">EN: {card.contentEn}</p>
                          <p className="text-zinc-400">ID: {card.contentId}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editingCardId === card.id ? (
                        <>
                          <button
                            onClick={() => {
                              updateCard({ ...card, contentEn: editEn, contentId: editId });
                              setEditingCardId(null);
                            }}
                            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCardId(null)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingCardId(card.id);
                              setEditEn(card.contentEn);
                              setEditId(card.contentId);
                            }}
                            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 3: TAMBAH MASSAL (BULK ADD)
           ══════════════════════════════════════════════════════════════════════════ */}
        {tab === 'bulk' && (
          <form onSubmit={handleBulkSubmit} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold">Tambah Massal Kartu Percakapan</h3>
            <p className="text-xs text-zinc-400">Masukkan satu pertanyaan per baris. Pertanyaan akan otomatis diterapkan untuk EN dan ID (bisa diedit kemudian).</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-1 block">{t.themeTitle}</label>
                <select
                  value={themeSlug}
                  onChange={(e) => setThemeSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white"
                >
                  {themes.map(th => (
                    <option key={th.slug} value={th.slug}>{th.emoji} {th.titleEn}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-1 block">{t.level}</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white"
                >
                  <option value="light">Light & Fun</option>
                  <option value="deep">Deep & Meaningful</option>
                  <option value="brave">Brave & Passionate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1 block">Daftar Pertanyaan (Satu per baris)</label>
              <textarea
                rows={8}
                required
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="What is your biggest fear?&#10;What makes you truly happy?&#10;What is your favorite childhood memory?"
                className="w-full p-4 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
            >
              Simpan Semua Kartu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
