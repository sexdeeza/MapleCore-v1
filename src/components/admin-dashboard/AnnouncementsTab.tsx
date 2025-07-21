// src/components/admin-dashboard/AnnouncementsTab.tsx
'use client';

import React from 'react';
import { 
  Bell, Plus, Trash2, Sparkles, Settings, Zap
} from 'lucide-react';

interface Announcement {
  id: number;
  type: 'event' | 'update' | 'maintenance';
  title: string;
  description: string;
  date: string;
  createdBy: string;
  gradient: string;
}

interface AnnouncementsTabProps {
  announcements: Announcement[];
  onShowCreateForm: () => void;
  onDelete: (id: number) => void;
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  announcements,
  onShowCreateForm,
  onDelete
}) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-500/20 px-2 py-1 rounded-full">EVENTS</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {announcements.filter(a => a.type === 'event').length}
            </h3>
            <p className="text-purple-700 font-semibold text-sm">Active Events</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-500/20 px-2 py-1 rounded-full">UPDATES</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {announcements.filter(a => a.type === 'update').length}
            </h3>
            <p className="text-blue-700 font-semibold text-sm">Game Updates</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">MAINT</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {announcements.filter(a => a.type === 'maintenance').length}
            </h3>
            <p className="text-orange-700 font-semibold text-sm">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-32">
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Current Announcements</h2>
                <p className="text-sm text-gray-600">Manage server-wide notifications</p>
              </div>
            </div>
            <button
              onClick={onShowCreateForm}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              New Announcement
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {announcements.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No announcements yet</h3>
              <p className="text-gray-500 mb-6">Create your first announcement to notify players about events, updates, or maintenance.</p>
              <button
                onClick={onShowCreateForm}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${announcement.gradient}`}>
                        {announcement.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{announcement.date}</span>
                      <span className="text-sm text-gray-400">by {announcement.createdBy}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{announcement.description}</p>
                  </div>
                  <button
                    onClick={() => onDelete(announcement.id)}
                    className="ml-6 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsTab;