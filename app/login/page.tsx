'use client';

import React, { Suspense } from 'react';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <AppProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Loading...</div>}>
        <LoginClient />
      </Suspense>
    </AppProvider>
  );
}
