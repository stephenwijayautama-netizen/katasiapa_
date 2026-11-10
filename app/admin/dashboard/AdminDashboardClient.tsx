'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../AppContext';
import { Shield, Plus, Trash2, Edit3, Check, X, LogOut } from 'lucide-react';

export default function AdminDashboardClient() {
  const { lang, t, themes, cards, addCard, deleteCard, updateCard, addTheme, deleteTheme } = useApp();
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<'cards' | 'themes' | 'bulk'>('cards');

  const [themeSlug, setThemeSlug] = useState(themes[0]?.slug || 'family');
  const [level, setLevel] = useState<'light' | 'deep' | 'brave'>('light');
  const [contentEn, setContentEn] = useState('');
  const [contentId, setContentId] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editId, setEditId] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setAuthorized(true);
    } else {
      window.location.href = '/admin';
    }
  }, []);

  if (!authorized) {
    return <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Checking authorization...</div>;
  }

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
      addCard({ themeSlug, level, contentEn: line, contentId: line, number: String(idx + 1).padStart(2, '0'), category: 'Bulk' });
    });
    setBulkText('');
    alert(`${lines.length} kartu berhasil ditambahkan secara massal!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" />
              {t.adminTitle} (Dashboard)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">{t.adminSubtitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
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
              <button
                onClick={() => setTab('themes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${tab === 'themes' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-zinc-400 hover:text-white'}`}
              >
                {t.manageThemes} ({themes.length})
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center gap-2 text-xs font-bold"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {tab === 'cards' && (
          <div className="space-y-8">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs font-semibold text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-xs text-white"
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

            <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 font-bold text-sm">
                Existing Cards Database ({cards.length})
              </div>
              <div className="divide-y divide-white/10">
                {cards.map(card => (
                  <div key={card.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCardId(null)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400"
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
                            className="p-2 rounded-xl bg-white/10 text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400"
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

        {tab === 'bulk' && (
          <form onSubmit={handleBulkSubmit} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold">Tambah Massal Kartu Percakapan</h3>
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
                placeholder="What is your biggest fear?&#10;What makes you truly happy?"
                className="w-full p-4 rounded-xl bg-black border border-white/20 text-xs text-white font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25"
            >
              Simpan Semua Kartu
            </button>
          </form>
        )}

        {tab === 'themes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map(th => (
              <div key={th.slug} className={`p-6 rounded-3xl bg-gradient-to-b ${th.gradient} border border-white/20 flex flex-col justify-between h-[300px]`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{th.emoji}</span>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-black/40 text-white">{th.slug}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{th.titleEn} / {th.titleId}</h3>
                  <p className="text-xs text-white/70 mt-1">{th.subtitleEn}</p>
                </div>
                <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                  Total Kartu: {cards.filter(c => c.themeSlug === th.slug).length}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
