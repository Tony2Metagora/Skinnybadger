'use client';

import { useState } from 'react';
import Image from 'next/image';
import WorkoutTab from '@/components/WorkoutTab';
import TrackingTab from '@/components/TrackingTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'workout' | 'tracking'>('workout');

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
          <Image
            src="/Skinnybadger/Honeybadger logo.png"
            alt="SkinnyBadger Logo"
            width={40}
            height={40}
            className="mr-2 sm:mr-3 w-10 h-10 sm:w-12 sm:h-12"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SkinnyBadger</h1>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-[66px] sm:top-[82px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 py-3 sm:py-4 text-center text-sm sm:text-base font-semibold transition-colors ${
                activeTab === 'workout'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">💪 Entraînement</span>
              <span className="sm:hidden">💪 Entraînement</span>
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 py-3 sm:py-4 text-center text-sm sm:text-base font-semibold transition-colors ${
                activeTab === 'tracking'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">📊 Suivi</span>
              <span className="sm:hidden">📊 Suivi</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'workout' && <WorkoutTab />}
        {activeTab === 'tracking' && <TrackingTab />}
      </div>
    </main>
  );
}
