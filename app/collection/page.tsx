'use client';

import React, { Suspense } from 'react';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import CollectionClient from './CollectionClient';

export default function CollectionPage() {
  return (
    <AppProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">Memuat Koleksi Kartu...</div>}>
        <CollectionClient />
      </Suspense>
    </AppProvider>
  );
}

