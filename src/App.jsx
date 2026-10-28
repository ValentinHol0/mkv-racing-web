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
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.appWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
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
