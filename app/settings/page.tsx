'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import ProfileClient from '../profile/ProfileClient';

function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Memastikan tab settings aktif jika dibuka lewat /settings
    router.replace('/profile?tab=settings');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center text-xs text-zinc-500">
      Membuka pengaturan...
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Loading...</div>}>
        <SettingsRedirect />
      </Suspense>
    </AppProvider>
  );
}

