// src/components/admin-dashboard/UsersTab.tsx
'use client';

import React, { useState } from 'react';
import { 
  Users, Activity, Shield, X, Lock, Trash2
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  createdat: string;
  lastlogin: string;
  nxCredit?: number;
  banned: number;
  loggedin: number;
}

interface UsersTabProps {
  users: User[];
  totalUsers: number;
  onlineUsers: number;
  onUpdatePassword: (userId: number, username: string) => void;
  onDeleteUser: (userId: number, username: string) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  totalUsers,
  onlineUsers,
  onUpdatePassword,
  onDeleteUser
}) => {
  const [userSearchTerm, setUserSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-500/20 px-2 py-1 rounded-full">TOTAL</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{totalUsers}</h3>
            <p className="text-blue-700 font-semibold text-sm">Total Users</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-50 via-green-50 to-green-100 rounded-3xl p-6 border border-green-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700">LIVE</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{onlineUsers}</h3>
            <p className="text-green-700 font-semibold text-sm">Online Now</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-500/20 px-2 py-1 rounded-full">ACTIVE</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {users.filter(u => u.banned === 0).length}
            </h3>
            <p className="text-purple-700 font-semibold text-sm">Active Accounts</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-3xl p-6 border border-red-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <X className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-500/20 px-2 py-1 rounded-full">BANNED</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {users.filter(u => u.banned === 1).length}
            </h3>
            <p className="text-red-700 font-semibold text-sm">Banned Users</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-32">
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-600">Manage player accounts and permissions</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">NX</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">User accounts will appear here</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users
                  .filter(user => 
                    user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{user.name}</span>
                              {user.loggedin === 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                                  Online
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdat).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.lastlogin ? new Date(user.lastlogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.nxCredit?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.banned === 0 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {user.banned === 0 ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => onUpdatePassword(user.id, user.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Change password"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.id, user.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;