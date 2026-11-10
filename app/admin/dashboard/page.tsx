'use client';

import React from 'react';
import { AppProvider } from '../../AppContext';
import Navbar from '../../Navbar';
import AdminDashboardClient from './AdminDashboardClient';

export default function AdminDashboardPage() {
  return (
    <AppProvider>
      <Navbar />
      <AdminDashboardClient />
    </AppProvider>
  );
}
