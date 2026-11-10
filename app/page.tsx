'use client';

import React from 'react';
import { AppProvider } from './AppContext';
import Navbar from './Navbar';
import HomeClient from './HomeClient';

export default function Page() {
  return (
    <AppProvider>
      <Navbar />
      <HomeClient />
    </AppProvider>
  );
}
