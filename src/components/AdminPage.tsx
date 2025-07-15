// src/components/AdminPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { adminAPI, announcementsAPI } from '@/services/api';
import { 
  ArrowLeft, Send, Trash2, AlertCircle, CheckCircle, 
  Sparkles, Settings, Zap, Plus, X, Bell, Home, Users, 
  Trophy, Download, LogOut, Star, Shield, Clock, TrendingUp,
  ChevronRight, ArrowRight, Activity, Eye, EyeOff, Lock
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

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements');
  const [scrolled, setScrolled] = useState(false);
  
  // User management states
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // User data
  const [userData, setUserData] = useState({
    username: "Admin",
    level: 200,
    job: "Game Master",
    nx: 999999,
    votePoints: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'event' as 'event' | 'update' | 'maintenance',
    title: '',
    description: '',
    priority: 0
  });

  // Menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      if (response.ok) {
        const data = response.data;
        setUsers(data.users);
        setTotalUsers(data.total);
        // Calculate online users (loggedin === 2)
        const onlineCount = data.users.filter((user: any) => user.loggedin === 2).length;
        setOnlineUsers(onlineCount);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Update user password
  const updateUserPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsUpdatingUser(true);
    try {
      const response = await adminAPI.updateUserPassword(editingUser.id, newPassword);

      if (response.ok) {
        alert('Password updated successfully!');
        setShowPasswordModal(false);
        setEditingUser(null);
        setNewPassword('');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Update password error:', error);
      alert('Failed to update password');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Delete user account
  const deleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete the account "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(userId);

      if (response.ok) {
        alert('Account deleted successfully!');
        fetchUsers(); // Refresh the list
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete account');
    }
  };

  // Check admin access
  const checkAdminAccess = async () => {
    try {
      const response = await adminAPI.checkAccess();
      if (response.ok) {
        const data = response.data;
        setIsAdmin(data.isAdmin);
        if (data.isAdmin) {
          setUserData(prev => ({
            ...prev,
            username: data.username
          }));
        } else {
          // Redirect to dashboard if not admin
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
      } else {
        setIsAdmin(false);
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      if (response.ok) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  // Create announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await announcementsAPI.create(formData);

      if (response.ok) {
        // Reset form
        setFormData({
          type: 'event',
          title: '',
          description: '',
          priority: 0
        });
        setShowCreateForm(false);
        
        // Refresh announcements
        fetchAnnouncements();
        
        // Show success message
        alert('Announcement created successfully!');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete announcement
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await announcementsAPI.delete(id);

      if (response.ok) {
        fetchAnnouncements();
        alert('Announcement deleted successfully!');
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete announcement');
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAnnouncements();
      if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'overview') {
        fetchUsers(); // Add this to load user count for overview
      }
    }
  }, [isAdmin, activeTab]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as UserDashboard */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-orange-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-8 lg:gap-12">
              <div className="text-2xl lg:text-3xl font-bold">
                <span className="text-gray-800">Maple</span>
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-transparent bg-clip-text">Kaede</span>
                <span className="ml-2 text-sm text-red-600 font-normal">Admin</span>
              </div>
              
              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex items-center gap-2 xl:gap-3 px-3 xl:px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === item.id
                        ? 'text-white bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/25'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:scale-105'
                    }`}
                  >
                    <item.icon className={`w-4 xl:w-5 h-4 xl:h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-red-500'}`} />
                    <span className="text-sm xl:text-base">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              {/* Back to Dashboard Button */}
              <div className="hidden xl:flex items-center">
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 lg:gap-4 p-2 rounded-2xl hover:bg-red-50 transition-all duration-300 group"
                >
                  <div className="text-right hidden lg:block">
                    <div className="text-xs lg:text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors whitespace-nowrap">{userData.username}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">Administrator</div>
                  </div>
                  <div className="relative">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-red-500 to-red-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {userData.username[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 bg-red-500 rounded-full border-2 lg:border-3 border-white flex items-center justify-center">
                      <div className="w-1 lg:w-2 h-1 lg:h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden backdrop-blur-xl">
                    <div className="p-6 bg-gradient-to-r from-red-500 to-red-400 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                      <div className="relative">
                        <p className="font-bold text-white text-lg">{userData.username}</p>
                        <p className="text-white/90 text-sm">Game Master • Admin Panel</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                      >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">User Dashboard</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('user');
                          window.location.href = '/auth';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your MapleKaede server from one place</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">LIVE</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  <p className="text-gray-600 text-sm">Total Users</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{onlineUsers}</p>
                  <p className="text-gray-600 text-sm">Online Now</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                  <p className="text-gray-600 text-sm">Announcements</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-gray-600 text-sm">Uptime</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setShowCreateForm(true);
                    }}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all group"
                  >
                    <Bell className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                    <p className="text-gray-600 group-hover:text-orange-600 font-medium">Create Announcement</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600 group-hover:text-blue-600 font-medium">Manage Users</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group">
                    <Settings className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                    <p className="text-gray-600 group-hover:text-purple-600 font-medium">Server Settings</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
                  <p className="text-gray-600">Manage server announcements and notifications</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-500 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  New Announcement
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {announcements.filter(a => a.type === 'event').length}
                      </p>
                      <p className="text-gray-600">Active Events</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {announcements.filter(a => a.type === 'update').length}
                      </p>
                      <p className="text-gray-600">Updates</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {announcements.filter(a => a.type === 'maintenance').length}
                      </p>
                      <p className="text-gray-600">Maintenance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcements List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-orange-500" />
                    Current Announcements
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {announcements.length === 0 ? (
                    <div className="p-12 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No announcements yet</p>
                      <p className="text-sm text-gray-400">Create your first announcement to notify players</p>
                    </div>
                  ) : (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${announcement.gradient}`}>
                                {announcement.type.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">{announcement.date}</span>
                              <span className="text-sm text-gray-400">by {announcement.createdBy}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {announcement.title}
                            </h3>
                            <p className="text-gray-600">{announcement.description}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                  <p className="text-gray-600">Manage player accounts and permissions</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NX</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users
                          .filter(user => 
                            user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user.name[0].toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">{user.name}</span>
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.banned === 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.banned === 0 ? 'Active' : 'Banned'}
                              </span>
                            </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setEditingUser(user);
                                    setShowPasswordModal(true);
                                  }}
                                  className="text-orange-600 hover:text-orange-900 mr-3"
                                >
                                  <Lock className="w-4 h-4 inline" />
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id, user.name)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Announcement Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Announcement</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Announcement Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Announcement Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'event', label: 'Event', icon: Sparkles, color: 'purple' },
                    { value: 'update', label: 'Update', icon: Zap, color: 'blue' },
                    { value: 'maintenance', label: 'Maintenance', icon: Settings, color: 'orange' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.type === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                        formData.type === type.value ? `text-${type.color}-600` : 'text-gray-400'
                      }`} />
                      <p className={`font-medium ${
                        formData.type === type.value ? `text-${type.color}-700` : 'text-gray-700'
                      }`}>
                        {type.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g., Double EXP Weekend Event!"
                  maxLength={255}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="Provide details about the announcement..."
                  rows={4}
                  required
                />
              </div>

              {/* Priority */}
              <div className="mb-6">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority (Optional)
                </label>
                <input
                  type="number"
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="0"
                  min="0"
                  max="999"
                />
                <p className="text-xs text-gray-500 mt-1">Higher priority announcements appear first</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Create Announcement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowPasswordModal(false);
              setEditingUser(null);
              setNewPassword('');
            }}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Update Password</h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setEditingUser(null);
                    setNewPassword('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Updating password for: <span className="font-semibold text-gray-900">{editingUser.name}</span>
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setEditingUser(null);
                    setNewPassword('');
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateUserPassword}
                  disabled={isUpdatingUser || newPassword.length < 6}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingUser ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminPage;