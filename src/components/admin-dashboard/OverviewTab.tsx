// src/components/admin-dashboard/OverviewTab.tsx
'use client';

import React from 'react';
import { 
  Users, Activity, Bell, Clock, Zap, Settings
} from 'lucide-react';

interface OverviewTabProps {
  totalUsers: number;
  onlineUsers: number;
  announcements: any[];
  onTabChange: (tab: string) => void;
  onShowCreateForm: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  totalUsers,
  onlineUsers,
  announcements,
  onTabChange,
  onShowCreateForm
}) => {
  return (
    <div className="space-y-8">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-3xl p-6 border border-red-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-500/20 px-2 py-1 rounded-full">TOTAL</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{totalUsers}</h3>
            <p className="text-red-700 font-semibold text-sm">Total Users</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-3xl p-6 border border-red-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-500/20 px-2 py-1 rounded-full">LIVE</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{onlineUsers}</h3>
            <p className="text-red-700 font-semibold text-sm">Online Now</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-3xl p-6 border border-red-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-500/20 px-2 py-1 rounded-full">ACTIVE</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{announcements.length}</h3>
            <p className="text-red-700 font-semibold text-sm">Announcements</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-3xl p-6 border border-red-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">99.9%</h3>
            <p className="text-red-700 font-semibold text-sm">Server Uptime</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-32">
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600">Manage your server efficiently</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => {
                onTabChange('announcements');
                onShowCreateForm();
              }}
              className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-red-400 hover:bg-red-50 transition-all duration-300"
            >
              <Bell className="w-12 h-12 text-gray-400 group-hover:text-red-500 mx-auto mb-4 group-hover:scale-110 transition-all duration-300" />
              <h3 className="text-lg font-bold text-gray-600 group-hover:text-red-600 mb-2">Create Announcement</h3>
              <p className="text-sm text-gray-500 group-hover:text-red-500">Notify players about events and updates</p>
            </button>
            
            <button 
              onClick={() => onTabChange('users')}
              className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
            >
              <Users className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-all duration-300" />
              <h3 className="text-lg font-bold text-gray-600 group-hover:text-blue-600 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-500 group-hover:text-blue-500">View and modify player accounts</p>
            </button>
            
            <button className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300">
              <Settings className="w-12 h-12 text-gray-400 group-hover:text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-all duration-300" />
              <h3 className="text-lg font-bold text-gray-600 group-hover:text-purple-600 mb-2">Server Settings</h3>
              <p className="text-sm text-gray-500 group-hover:text-purple-500">Configure server parameters</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;