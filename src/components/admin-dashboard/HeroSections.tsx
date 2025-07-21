// src/components/admin-dashboard/HeroSections.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Settings, Shield, Users, Bell, Plus, Activity
} from 'lucide-react';

interface HeroSectionProps {
  activeTab: string;
  totalUsers: number;
  onlineUsers: number;
  announcements: any[];
  onShowCreateForm: () => void;
}

const HeroSections: React.FC<HeroSectionProps> = ({
  activeTab,
  totalUsers,
  onlineUsers,
  announcements,
  onShowCreateForm
}) => {
  return (
    <>
      {activeTab === 'overview' && (
        <div className="relative h-72 overflow-hidden mt-16">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/testt.jpg"
              alt="Background"
              fill
              className="object-cover scale-105 transition-transform duration-[20s] ease-out"
              priority
              quality={100}
            />
          </div>
          
          {/* Red/Orange/Pink Theme for Admin */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-orange-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.3),transparent_70%)]" />
          
          {/* Admin-themed Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-22 right-30 w-12 h-12 border border-red-300/30 rounded-lg rotate-12 animate-spin-slow" />
            <div className="absolute bottom-26 left-22 w-10 h-10 bg-orange-400/20 rounded-full animate-pulse animation-delay-1000" />
            <div className="absolute top-28 left-1/4 w-6 h-6 bg-pink-400/30 rotate-45 animate-bounce-slow animation-delay-500" />
            
            <div className="absolute -top-8 -right-8 w-38 h-38 bg-gradient-to-br from-red-400/20 to-orange-400/15 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-42 h-42 bg-gradient-to-br from-pink-400/15 to-red-400/20 rounded-full blur-3xl animate-blob animation-delay-3500" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Admin Dashboard
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Manage your <span className="text-yellow-300 font-black">MapleKaede server</span> with power and precision
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                      {totalUsers} Total Users
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5" />
                      Administrator Access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <Settings className="absolute top-16 right-22 w-7 h-7 text-red-300/40 animate-pulse animation-delay-600" />
            <Shield className="absolute bottom-20 left-20 w-9 h-9 text-yellow-400/30 animate-float animation-delay-1800" />
            <Users className="absolute top-30 left-18 w-6 h-6 text-pink-300/40 animate-spin-slow animation-delay-1200" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="relative h-72 overflow-hidden mt-16">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/testt.jpg"
              alt="Background"
              fill
              className="object-cover scale-105 transition-transform duration-[22s] ease-out"
              priority
              quality={100}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-orange-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Announcements
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Keep your <span className="text-yellow-300 font-black">community informed</span> and engaged
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <button
                      onClick={onShowCreateForm}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform"
                    >
                      <Plus className="w-5 h-5" />
                      Create Announcement
                    </button>
                    <div className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Bell className="w-5 h-5" />
                      {announcements.length} Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="relative h-72 overflow-hidden mt-16">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/testt.jpg"
              alt="Background"
              fill
              className="object-cover scale-105 transition-transform duration-[25s] ease-out"
              priority
              quality={100}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-orange-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      User Management
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Manage <span className="text-yellow-300 font-black">player accounts</span> and permissions
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                      {totalUsers} Users
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Activity className="w-5 h-5" />
                      {onlineUsers} Online
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}
    </>
  );
};

export default HeroSections;