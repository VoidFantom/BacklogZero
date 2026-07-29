import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakBadge({ currentStreak }) {
  const isHot = currentStreak > 0;
  
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${isHot ? 'bg-orange-50' : 'bg-gray-50'}`} style={{ backgroundColor: isHot ? '#FFF7ED' : '#F1F5F9', border: `1px solid ${isHot ? '#FFEDD5' : '#E2E8F0'}` }}>
      <div className={`p-2.5 rounded-full ${isHot ? 'bg-orange-100' : 'bg-gray-200'}`} style={{ backgroundColor: isHot ? '#FFEDD5' : '#E2E8F0' }}>
        <Flame size={24} color={isHot ? '#F97316' : '#94A3B8'} fill={isHot ? '#F97316' : 'none'} />
      </div>
      <div>
        <div className="text-lg font-semibold" style={{ color: isHot ? '#C2410C' : '#64748B' }}>
          {currentStreak} Day Streak
        </div>
        <div className="text-sm font-medium" style={{ color: isHot ? '#EA580C' : '#94A3B8' }}>
          {isHot ? "You're on fire! Keep it up." : "Start your catch-up streak today!"}
        </div>
      </div>
    </div>
  );
}
