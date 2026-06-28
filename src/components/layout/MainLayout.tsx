import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '../../store/ui.store';

export function MainLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main
        className="pt-16 min-h-screen transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '5rem' : '16rem',
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
