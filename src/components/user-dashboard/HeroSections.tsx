// src/components/user-dashboard/HeroSections.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Home, User, Trophy, Download, Shield, Crown, Star, 
  Gamepad2, Heart, Settings
} from 'lucide-react';

interface HeroSectionProps {
  activeTab: string;
  userData: {
    username: string;
    level: number;
    job: string;
    guild: string;
    nx: number;
    votePoints: number;
  };
  characters: any[];
  rankings: any[];
  userRanking: any;
  onTabChange: (tab: string) => void;
  onShowVoteModal: () => void;
}

const HeroSections: React.FC<HeroSectionProps> = ({
  activeTab,
  userData,
  characters,
  rankings,
  userRanking,
  onTabChange,
  onShowVoteModal
}) => {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

  return (
    <>
      {/* Hero Section for Characters */}
      {activeTab === 'characters' && (
        <div className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/testt.jpg"
              alt="Background"
              fill
              className="object-cover scale-105 transition-transform duration-[15s] ease-out"
              priority
              quality={100}
            />
          </div>
          
          {/* Orange/Red/Pink Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-red-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.3),transparent_70%)]" />
          
          {/* Character-themed Particle System */}
          <div className="absolute inset-0">
            <div className="absolute top-24 right-28 w-12 h-12 border-2 border-purple-300/30 rounded-full animate-spin-slow" />
            <div className="absolute bottom-28 left-20 w-8 h-8 bg-indigo-400/20 rotate-45 animate-pulse" />
            <div className="absolute top-32 left-1/3 w-6 h-6 bg-blue-400/30 rounded-full animate-ping animation-delay-1000" />
            
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-gradient-to-br from-purple-400/20 to-indigo-400/15 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-gradient-to-br from-blue-400/15 to-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-3000" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Choose Your Hero
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Select your character and continue your <span className="text-yellow-300 font-black">legendary adventure</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <User className="w-5 h-5" />
                      {characters.length} Characters
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Crown className="w-5 h-5" />
                      Highest: Level {characters.length > 0 ? Math.max(...characters.map(char => char.level)) : 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <User className="absolute top-16 right-20 w-7 h-7 text-orange-300/40 animate-pulse animation-delay-500" />
            <Crown className="absolute bottom-20 left-16 w-9 h-9 text-yellow-400/30 animate-float animation-delay-2000" />
            <Shield className="absolute top-28 left-20 w-6 h-6 text-pink-300/40 animate-bounce-slow animation-delay-1500" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}

      {/* Hero Section for Rankings */}
      {activeTab === 'rankings' && (
        <div className="relative h-72 overflow-hidden">
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
          
          {/* Orange/Red/Pink Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-red-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.3),transparent_70%)]" />
          
          {/* Rankings-themed Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-22 right-30 w-12 h-12 border border-orange-300/30 rounded-lg rotate-12 animate-spin-slow" />
            <div className="absolute bottom-26 left-22 w-10 h-10 bg-red-400/20 rounded-full animate-pulse animation-delay-1000" />
            <div className="absolute top-28 left-1/4 w-6 h-6 bg-pink-400/30 rotate-45 animate-bounce-slow animation-delay-500" />
            
            <div className="absolute -top-8 -right-8 w-38 h-38 bg-gradient-to-br from-orange-400/20 to-red-400/15 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-42 h-42 bg-gradient-to-br from-pink-400/15 to-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-3500" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Server Rankings
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Compete with the <span className="text-yellow-300 font-black">best players</span> in {serverName}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Trophy className="w-5 h-5" />
                      Your Rank: #{userRanking ? userRanking.rank : 'Unranked'}
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Crown className="w-5 h-5" />
                      Top Player: Level {rankings.length > 0 ? rankings[0].level : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <Trophy className="absolute top-16 right-22 w-7 h-7 text-orange-300/40 animate-pulse animation-delay-600" />
            <Crown className="absolute bottom-20 left-20 w-9 h-9 text-yellow-400/30 animate-float animation-delay-1800" />
            <Star className="absolute top-30 left-18 w-6 h-6 text-pink-300/40 animate-spin-slow animation-delay-1200" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}

      {/* Hero Section for Download */}
      {activeTab === 'download' && (
        <div className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/testt.jpg"
              alt="Background"
              fill
              className="object-cover scale-105 transition-transform duration-[18s] ease-out"
              priority
              quality={100}
            />
          </div>
          
          {/* Orange/Red/Pink Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-red-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.3),transparent_70%)]" />
          
          {/* Download-themed Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-22 right-30 w-12 h-12 border border-emerald-300/30 rounded-lg rotate-12 animate-spin-slow" />
            <div className="absolute bottom-26 left-22 w-10 h-10 bg-teal-400/20 rounded-full animate-pulse animation-delay-1000" />
            <div className="absolute top-28 left-1/4 w-6 h-6 bg-cyan-400/30 rotate-45 animate-bounce-slow animation-delay-500" />
            
            <div className="absolute -top-8 -right-8 w-38 h-38 bg-gradient-to-br from-emerald-400/20 to-teal-400/15 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-42 h-42 bg-gradient-to-br from-cyan-400/15 to-emerald-400/20 rounded-full blur-3xl animate-blob animation-delay-3500" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Download {serverName}
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Get started in just a <span className="text-yellow-300 font-black">few minutes</span>!
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Download className="w-5 h-5" />
                      Version 83
                    </div>
                    <div className="px-6 py-3 bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5" />
                      1.2GB Download
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <Download className="absolute top-16 right-22 w-7 h-7 text-orange-300/40 animate-pulse animation-delay-600" />
            <Gamepad2 className="absolute bottom-20 left-20 w-9 h-9 text-yellow-400/30 animate-float animation-delay-1800" />
            <Settings className="absolute top-30 left-18 w-6 h-6 text-pink-300/40 animate-spin-slow animation-delay-1200" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}

      {/* Hero Section for Overview */}
      {activeTab === 'overview' && (
        <div className="relative h-72 overflow-hidden">
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
          
          {/* Orange/Red/Pink Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-red-500/40 to-pink-500/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.3),transparent_70%)]" />
          
          {/* Overview-themed Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-22 right-30 w-12 h-12 border border-orange-300/30 rounded-lg rotate-12 animate-spin-slow" />
            <div className="absolute bottom-26 left-22 w-10 h-10 bg-red-400/20 rounded-full animate-pulse animation-delay-1000" />
            <div className="absolute top-28 left-1/4 w-6 h-6 bg-pink-400/30 rotate-45 animate-bounce-slow animation-delay-500" />
            
            <div className="absolute -top-8 -right-8 w-38 h-38 bg-gradient-to-br from-orange-400/20 to-red-400/15 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-42 h-42 bg-gradient-to-br from-pink-400/15 to-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-3500" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl -m-6" />
                <div className="relative z-10 p-6">
                  <h1 className="text-5xl font-black mb-3 drop-shadow-2xl">
                    <span className="text-white animate-fadeInUp">
                      Welcome Back
                    </span>
                  </h1>
                  <p className="text-xl text-white font-bold mb-6 animate-fadeInUp animation-delay-500 drop-shadow-lg">
                    Ready for your next <span className="text-yellow-300 font-black">epic adventure</span>, {userData.username}?
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-fadeInUp animation-delay-1000">
                    <button 
                      onClick={() => onTabChange('download')}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Play Now
                    </button>
                    <button 
                      onClick={onShowVoteModal}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white rounded-2xl font-bold flex items-center gap-3 border border-white/30 hover:scale-105 transition-transform"
                    >
                      <Heart className="w-5 h-5" />
                      Vote for {serverName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <Home className="absolute top-16 right-22 w-7 h-7 text-orange-300/40 animate-pulse animation-delay-600" />
            <Star className="absolute bottom-20 left-20 w-9 h-9 text-yellow-400/30 animate-float animation-delay-1800" />
            <Trophy className="absolute top-30 left-18 w-6 h-6 text-pink-300/40 animate-spin-slow animation-delay-1200" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>
      )}
    </>
  );
};

export default HeroSections;