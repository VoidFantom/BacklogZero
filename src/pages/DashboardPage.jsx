import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StreakBadge from '../components/StreakBadge';
import BacklogCard from '../components/BacklogCard';
import AddBacklogModal from '../components/AddBacklogModal';
import { Plus, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { logout } = useAuth();
  const { userData, activeBacklogs, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading || !userData) {
    return <div className="app-container flex items-center justify-center h-screen"><div className="text-muted font-medium">Loading...</div></div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-xl font-bold">Backlog<span className="text-primary">Zero</span></h1>
        <button onClick={logout} className="p-2 text-muted hover:text-main transition-colors" title="Log out">
          <LogOut size={20} />
        </button>
      </header>

      <main className="p-4 flex-1">
        <StreakBadge currentStreak={userData.currentStreak || 0} />
        
        <div className="flex justify-between items-end mb-4 mt-8">
          <h2 className="text-lg font-semibold">Active Catch-ups</h2>
        </div>

        {activeBacklogs.length === 0 ? (
          <div className="text-center p-8 bg-surface rounded-xl border border-gray-100 mt-4 shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-semibold text-lg mb-2">You're all clear!</h3>
            <p className="text-sm text-muted mb-6">No active backlogs. Add one to start catching up.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary px-6 mx-auto flex items-center justify-center">
              <Plus size={18} className="mr-1" /> Add Backlog
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeBacklogs.map(backlog => (
              <BacklogCard key={backlog.id} backlog={backlog} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-all z-40"
        style={{ backgroundColor: 'var(--primary)', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}
      >
        <Plus size={28} />
      </button>

      <AddBacklogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
