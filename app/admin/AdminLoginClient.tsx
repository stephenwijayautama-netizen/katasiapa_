'use client';

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Shield, KeyRound, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminLoginClient() {
  const { t } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      window.location.href = '/admin/dashboard';
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/25">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black">Admin CMS Protected</h1>
          <p className="text-xs text-zinc-400 mt-1">Masukkan password khusus untuk mengakses Admin CMS.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1 block">Password Admin (Default: admin123)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {error && <p className="text-red-400 text-xs mt-1">Password salah! Gunakan: admin123</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            Masuk CMS
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
