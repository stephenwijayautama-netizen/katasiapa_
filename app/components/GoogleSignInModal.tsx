'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Copy, Check, Loader2, Sparkles, LogIn, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../lib/soundEngine';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: { name: string; email: string; avatar?: string }) => void;
  redirectUrl?: string;
}

export function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.88c2.28-2.09 3.66-5.18 3.66-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.12C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.59H1.24C.45 8.18 0 9.99 0 12s.45 3.82 1.24 5.41l4.04-3.12z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.12c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

export default function GoogleSignInModal({
  isOpen,
  onClose,
  onSuccess,
  redirectUrl = '/',
}: GoogleSignInModalProps) {
  const [loading, setLoading] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSandbox, setShowSandbox] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      // Deteksi in-app browser: WhatsApp, Instagram, Facebook, Line, TikTok
      const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|musical_ly|BytedanceWebview/i.test(ua);
      setIsInAppBrowser(inApp);

      // Cek parameter error dari URL jika ada
      const params = new URLSearchParams(window.location.search);
      const authErr = params.get('auth_error');
      if (authErr) {
        if (authErr === 'google_not_configured') {
          setErrorMessage('Google OAuth belum dikonfigurasi di environment Vercel. Anda bisa menggunakan mode sandbox di bawah untuk uji coba.');
          setShowSandbox(true);
        } else if (authErr === 'cancelled') {
          setErrorMessage('Proses login Google dibatalkan.');
        } else {
          setErrorMessage(`Gagal login Google (${authErr}). Silakan coba lagi.`);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    setErrorMessage('');
    soundEngine.playFlip();

    // Arahkan ke endpoint OAuth Google resmi
    const targetUrl = `/api/auth/google?returnTo=${encodeURIComponent(redirectUrl || window.location.pathname)}`;
    window.location.href = targetUrl;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Sandbox Dev login jika Google Client ID belum diset di Vercel
  const handleSandboxLogin = (name: string, email: string) => {
    setLoading(true);
    soundEngine.playCelebration();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess({ name, email, avatar: '' });
      }
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] bg-[#14141C] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden animate-zoom-out text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background modal */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />

        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition z-10"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-3.5 shadow-inner">
            <GoogleLogo className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Masuk ke Kata Siapa
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xs mx-auto">
            Masuk dengan Akun Google untuk simpan pertanyaan favorit dan rekam obrolan serumu.
          </p>
        </div>

        {/* Peringatan jika terdeteksi di dalam In-App Browser (WhatsApp / Instagram) */}
        {isInAppBrowser && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs space-y-2 relative z-10">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>In-App Browser Terdeteksi</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/90">
              Google memblokir login dari aplikasi seperti WhatsApp atau Instagram. Silakan buka halaman ini di browser utama (Chrome atau Safari).
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Berhasil Disalin!' : 'Salin Link untuk Buka di Chrome/Safari'}</span>
            </button>
          </div>
        )}

        {/* Pesan Error */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 relative z-10">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Tombol Utama: Masuk dengan Google (Pedoman Resmi Google) */}
        <div className="space-y-3 relative z-10">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
                <span>Menghubungkan ke Google...</span>
              </>
            ) : (
              <>
                <GoogleLogo className="w-5 h-5 flex-shrink-0" />
                <span>Masuk dengan Google</span>
              </>
            )}
          </button>

          {/* Toggle Sandbox Mode untuk Developer / Uji Coba */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowSandbox(!showSandbox)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 transition underline underline-offset-2"
            >
              {showSandbox ? 'Sembunyikan mode uji coba sandbox' : 'Uji coba instan tanpa kunci Google (Mode Sandbox)'}
            </button>
          </div>

          {/* Panel Uji Coba Sandbox Instan */}
          {showSandbox && (
            <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-fadeIn text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilih Akun Uji Coba Cepat:</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Bintang Utama', email: 'bintang.utama@gmail.com', initial: 'B', color: 'bg-indigo-600' },
                  { name: 'Stephen Wijaya', email: 'stephenwijaya@gmail.com', initial: 'S', color: 'bg-emerald-600' },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSandboxLogin(acc.name, acc.email)}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2.5 text-left"
                  >
                    <div className={`w-7 h-7 rounded-full ${acc.color} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {acc.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Atau masukkan nama kustom */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customName.trim()) return;
                  const email = customEmail.trim() || `${customName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
                  handleSandboxLogin(customName.trim(), email);
                }}
                className="pt-2 border-t border-white/10 space-y-2"
              >
                <input
                  type="text"
                  placeholder="Ketik nama kamu..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  disabled={!customName.trim()}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs hover:opacity-90 disabled:opacity-50 transition"
                >
                  Masuk dengan Nama Ini
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info privasi */}
        <p className="mt-5 text-center text-[10px] text-zinc-400 leading-relaxed relative z-10">
          Dengan masuk, kamu menyetujui ruang berbagi cerita yang aman, saling menghargai, dan menjaga privasi teman bicaramu.
        </p>
      </div>
    </div>
  );
}
