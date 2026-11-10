'use client';

import React from 'react';
import { AppProvider } from '../AppContext';
import Navbar from '../Navbar';
import AdminLoginClient from './AdminLoginClient';

export default function AdminPage() {
  return (
    <AppProvider>
      <Navbar />
      <AdminLoginClient />
    </AppProvider>
  );
}
