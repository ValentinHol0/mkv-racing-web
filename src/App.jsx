import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './features/auth/AuthModal';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ServersPage } from './features/servers/ServersPage';
import { GaragePage } from './features/garage/GaragePage';
import { StatisticsPage } from './features/statistics/StatisticsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { LogsPage } from './features/logs/LogsPage';

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-cyber-slate text-slate-100 font-sans selection:bg-racing-red selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default App;
