'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '../AppContext';
import { Mail, KeyRound, ArrowRight, CheckCircle2, Loader2, Sparkles, User, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import GoogleSignInModal, { GoogleLogo } from '../components/GoogleSignInModal';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme');
  const redirectParam = searchParams.get('redirect') || (themeParam ? `/play?theme=${themeParam}` : '/play');

  const { login, profile } = useApp();

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Masukkan nama kamu terlebih dahulu!');
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Masukkan email yang valid!');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim kode');

      // Ambil kode aktif langsung dari backend store untuk kenyamanan instan tanpa delay SMTP
      const codeRes = await fetch('/api/auth/get-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const codeData = await codeRes.json();
      if (codeData.code) {
        setDevCode(codeData.code);
        setOtp(codeData.code); // auto-fill untuk kemudahan pengguna
      }

      setStep('otp');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim kode OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kode OTP salah');

      // Simpan autentikasi dan nama pembuat kartu
      login({
        email,
        name: name.trim() || email.split('@')[0],
      });

      setStep('success');
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => {
        window.location.href = redirectParam;
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Verifikasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Masukkan nama kamu untuk masuk!');
      return;
    }

    const fallbackEmail = email && email.includes('@') ? email : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@katasiapa.app`;

    login({
      email: fallbackEmail,
      name: name.trim(),
    });

    setStep('success');
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      window.location.href = redirectParam;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#14141C] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-pink-500/30">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Masuk ke KataSiapa
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Masuk untuk bermain game dan buat kartu kustom dengan namamu sebagai pembuat kartu.
          </p>
        </div>

        {step === 'form' && (
          <div className="space-y-4 relative z-10">
            {/* TOMBOL UTAMA: GOOGLE SIGN-IN */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <GoogleLogo className="w-5 h-5" />
              <span>Lanjutkan dengan Akun Google</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#14141C] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                atau masuk manual
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Input Nama Pembuat */}
            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Nama Lengkap / Panggilan</span>
                <span className="text-[10px] text-pink-400 font-normal">Wajib diisi</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bintang / Rian / Sarah"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 italic">
                Nama ini akan dicantumkan pada kartu dan koleksi yang kamu buat.
              </p>
            </div>

            {/* Input Email */}
            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1.5 block">
                Alamat Email / Gmail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namakamu@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>
            </div>

            {/* Tombol Kirim OTP */}
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || !name.trim() || !email.includes('@')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Kirim Kode OTP Verifikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Garis Pemisah */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#14141C] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                atau
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Tombol Masuk Cepat / Instant Guest */}
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Masuk Langsung dengan Nama ({name.trim() || 'Nama Kamu'})</span>
            </button>
          </div>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 relative z-10">
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300 text-center space-y-2">
              <p>
                Halo <b>{name}</b>, kode verifikasi dikirim ke <b>{email}</b>.
              </p>
              {devCode && (
                <div className="p-2.5 rounded-xl bg-black/80 border border-pink-500/40 text-white font-mono text-xs flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kode Verifikasi Instan:</span>
                  <b className="text-pink-400 text-sm tracking-widest">{devCode}</b>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1.5 block">
                Masukkan 6-Digit Kode OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verifikasi & Mulai'}
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-center text-xs text-zinc-400 hover:text-white transition pt-1"
            >
              ← Ubah Nama atau Email
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-3 relative z-10">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-white">Selamat Datang, {name}!</h3>
            <p className="text-xs text-zinc-400">Menghubungkan ke sesi Anda...</p>
          </div>
        )}

        {/* Google Sign-in Sandbox Modal */}
        <GoogleSignInModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSuccess={(userData) => {
            setName(userData.name);
            setEmail(userData.email);
            login({
              name: userData.name,
              email: userData.email,
            });
            setStep('success');
            setTimeout(() => {
              window.location.href = redirectParam;
            }, 800);
          }}
        />
      </div>
    </div>
  );
}
