import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-industrial-950 flex transition-colors duration-300 relative overflow-hidden">
      {/* Subtle top-right background accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-b from-primary-500/5 dark:from-primary-500/2 to-transparent pointer-events-none z-0" />
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
