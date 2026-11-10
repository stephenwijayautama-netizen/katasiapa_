'use client';

import React from 'react';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import ThemesClient from './ThemesClient';

export default function ThemesPage() {
  return (
    <AppProvider>
      <Navbar />
      <ThemesClient />
    </AppProvider>
  );
}
