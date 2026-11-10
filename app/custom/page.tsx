'use client';

import React, { Suspense } from 'react';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import CustomClient from './CustomClient';

export default function CustomPage() {
  return (
    <AppProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Memuat Studio Kustomisasi...</div>}>
        <CustomClient />
      </Suspense>
    </AppProvider>
  );
}
