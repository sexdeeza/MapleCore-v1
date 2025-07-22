// src/components/user-dashboard/OverviewTab.tsx
'use client';

import React from 'react';
import { 
  Users, Trophy, Calendar, Clock, Zap, ArrowRight, Bell, 
  Sparkles, Settings, Star, Gamepad2, Heart, Crown, TrendingUp
} from 'lucide-react';

interface OverviewTabProps {
  onlineCount: number;
  announcements: any[];
  userRanking: any;
  userData: {
    username: string;
    level: number;
    job: string;
    guild: string;
    nx: number;
    votePoints: number;
  };
  onTabChange: (tab: string) => void;
  onShowVoteModal: () => void;
  refreshData: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  onlineCount,
  announcements,
  userRanking,
  userData,
  onTabChange,
  onShowVoteModal,
  refreshData
}) => {
  return (
    <div className="space-y-8">
      {/* Quick Stats - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Players Online */}
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-orange-700">LIVE</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{onlineCount}</h3>
            <p className="text-orange-700 font-semibold text-sm">Players Online</p>
          </div>
        </div>

        {/* Active Events */}
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">ACTIVE</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{announcements.filter(a => a.type === 'event').length}</h3>
            <p className="text-orange-700 font-semibold text-sm">Active Events</p>
          </div>
        </div>

        {/* Your Ranking */}
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <Crown className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">#{userRanking ? userRanking.rank : 'N/A'}</h3>
            <p className="text-orange-700 font-semibold text-sm">Your Ranking</p>
          </div>
        </div>

        {/* Server Uptime */}
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-md" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">99.9%</h3>
            <p className="text-orange-700 font-semibold text-sm">Server Uptime</p>
          </div>
        </div>
      </div>

      {/* News & Events - Redesigned */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">Latest News & Events</h2>
              <p className="text-gray-600 text-sm">Stay updated with the latest happenings</p>
            </div>
          </div>
          <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            View All 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-6">
          {announcements.length === 0 ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-12 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No announcements at the moment</h3>
                <p className="text-gray-500">Check back later for exciting updates and events!</p>
              </div>
            </div>
          ) : (
            announcements.map((item, index) => (
              <div key={item.id} className="group relative overflow-hidden bg-white rounded-3xl border border-gray-200 hover:border-orange-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Orange accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-orange-400" />
                
                {/* Animated background effects */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-10 bg-orange-500" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-xl opacity-10 bg-orange-400" />
                
                <div className="relative p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      {/* Enhanced type badge and date */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border-2 bg-orange-50 text-orange-700 border-orange-200">
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">{item.date}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">{item.description}</p>
                      
                      {item.time && (
                        <div className="inline-flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-2xl border-2 border-orange-200 mb-6">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <span className="text-orange-700 font-bold">{item.time}</span>
                        </div>
                      )}
                      
                      <button className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Read More 
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    
                    {/* Enhanced event icon */}
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 bg-gradient-to-br from-orange-500 to-orange-400">
                      {item.type === 'event' && <Sparkles className="w-10 h-10 text-white" />}
                      {item.type === 'maintenance' && <Settings className="w-10 h-10 text-white" />}
                      {item.type === 'update' && <Star className="w-10 h-10 text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;