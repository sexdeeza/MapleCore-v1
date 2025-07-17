// src/components/UserDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { dashboardAPI, voteAPI, announcementsAPI, adminAPI } from '@/services/api';
import { CharacterEquipment } from '@/types/api';
import CharacterRenderer from './CharacterRenderer';
import { 
  Home, Users, Trophy, LogOut, Bell, ChevronRight, Calendar, 
  AlertCircle, Zap, Star, Sword, Shield, Crown, User, Download,
  TrendingUp, Clock, MessageCircle, Settings, Sparkles, Heart,
  CheckCircle, ArrowRight, ExternalLink, Gamepad2, X
} from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  
  // Updated vote state structure
  const [voteData, setVoteData] = useState<{
    sites: any[];
    voteStatus: any;
    todayRewards: number;
    username: string;
    currentNX: number;
    totalVotes: number;
  }>({
    sites: [],
    voteStatus: {},
    todayRewards: 0,
    username: '',
    currentNX: 0,
    totalVotes: 0
  });

  const [userData, setUserData] = useState({
    username: "Loading...",
    level: 0,
    job: "Loading...",
    guild: "Legends",
    nx: 0,
    votePoints: 0
  });
  const [onlineCount, setOnlineCount] = useState(0);
  const [characters, setCharacters] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [userRanking, setUserRanking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch stats (user info + online count)
      const statsResponse = await dashboardAPI.getStats();
      if (statsResponse.ok) {
        const statsData = statsResponse.data;
        setUserData({
          username: statsData.user.username,
          level: statsData.mainCharacter?.level || 1,
          job: statsData.mainCharacter?.job || "Beginner",
          guild: "Legends",
          nx: (statsData.user.nx || 0),
          votePoints: statsData.user.votePoints || 0
        });
        setOnlineCount(statsData.onlineCount);
      }

      // Check if user is admin
      const adminResponse = await adminAPI.checkAccess();
      if (adminResponse.ok) {
        setIsAdmin(adminResponse.data.isAdmin);
      }

      // Fetch characters
      const charactersResponse = await dashboardAPI.getCharacters();
      if (charactersResponse.ok) {
        setCharacters(charactersResponse.data.characters || []);
      }

      // Fetch rankings
      const rankingsResponse = await dashboardAPI.getRankings();
      if (rankingsResponse.ok) {
        setRankings(rankingsResponse.data.rankings || []);
        setUserRanking(rankingsResponse.data.userRanking);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vote status
  const fetchVoteStatus = async () => {
    try {
      const response = await voteAPI.getStatus();
      if (response.ok) {
        setVoteData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch vote status:', error);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      if (response.ok) {
        setAnnouncements(response.data.announcements || []);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  // Manual refresh function
  const refreshData = () => {
    fetchDashboardData();
    fetchVoteStatus();
    fetchAnnouncements();
  };

  // Check if user can vote for a specific site
  const canVote = (siteName: string) => {
    const siteKey = siteName.toLowerCase().replace(/\s+/g, '');
    const status = voteData.voteStatus[siteKey];
    if (!status) return true;
    
    if (status.canVoteAt) {
      return Date.now() >= status.canVoteAt;
    }
    
    return !status.voted;
  };

  // Get remaining cooldown time for a site
  const getRemainingCooldown = (siteName: string) => {
    const siteKey = siteName.toLowerCase().replace(/\s+/g, '');
    const status = voteData.voteStatus[siteKey];
    if (!status || !status.canVoteAt) return 0;
    
    return Math.max(0, status.canVoteAt - Date.now());
  };

  // Handle vote click - opens site with proper pingUsername format
  const handleVote = async (site: any) => {
    const siteKey = site.name.toLowerCase().replace(/\s+/g, '');
    
    if (!canVote(site.name)) return;

    // Set pending status
    setVoteData(prev => ({
      ...prev,
      voteStatus: {
        ...prev.voteStatus,
        [siteKey]: { ...prev.voteStatus[siteKey], pending: true }
      }
    }));

    // Construct vote URL with pingUsername for Gtop100
    let voteUrl = site.url;
    if (site.name === 'Gtop100') {
      // For Gtop100, append the username to the pingUsername parameter
      voteUrl = `${site.url}${voteData.username}`;
    } else {
      // For other sites, use the old format
      voteUrl = `${site.url}?username=${voteData.username}&ref=dashboard`;
    }
    
    // Open vote site in new tab
    const voteWindow = window.open(voteUrl, '_blank');
    
    // Optional: Check if vote window is closed (user completed vote)
    const checkClosed = setInterval(() => {
      if (voteWindow?.closed) {
        clearInterval(checkClosed);
        // Refresh vote status after user closes vote window
        setTimeout(() => {
          fetchVoteStatus();
          fetchDashboardData(); // Refresh NX balance too
        }, 3000); // Wait 3 seconds for webhook to process
      }
    }, 1000);

    // Remove pending status after 30 seconds regardless
    setTimeout(() => {
      setVoteData(prev => ({
        ...prev,
        voteStatus: {
          ...prev.voteStatus,
          [siteKey]: { ...prev.voteStatus[siteKey], pending: false }
        }
      }));
      // Also refresh status in case webhook already processed
      fetchVoteStatus();
      fetchDashboardData();
    }, 30000);
  };

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Check if user is logged in and get username
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.isLoggedIn) {
        // Fetch real data from database
        fetchDashboardData();
        fetchAnnouncements();
      } else {
        window.location.href = '/auth';
      }
    } else {
      window.location.href = '/auth';
    }
  }, []);

  // Fetch vote status when userData changes
  useEffect(() => {
    if (userData.username !== "Loading...") {
      fetchVoteStatus();
    }
  }, [userData.username]);

  // Refresh data when tab changes to characters or rankings (if no data)
  useEffect(() => {
    if ((activeTab === 'characters' && characters.length === 0) || 
        (activeTab === 'rankings' && rankings.length === 0)) {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Auto-refresh navigation stats every 30 seconds
  useEffect(() => {
    let navigationStatsInterval: NodeJS.Timeout;

    if (userData.username !== "Loading...") {
      navigationStatsInterval = setInterval(async () => {
        // Just update navigation stats without loading states
        const response = await dashboardAPI.getStats();
        if (response.ok) {
          const data = response.data;
          setUserData(prev => ({
            ...prev,
            nx: data.user.nx,
            votePoints: data.user.votePoints,
            level: data.mainCharacter?.level || prev.level,
            job: data.mainCharacter?.job || prev.job
          }));
          setOnlineCount(data.onlineCount);
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (navigationStatsInterval) {
        clearInterval(navigationStatsInterval);
      }
    };
  }, [userData.username]);

  // Auto-refresh data when window becomes visible (user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userData.username !== "Loading...") {
        fetchDashboardData();
        fetchVoteStatus();
        fetchAnnouncements();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userData.username]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'characters', label: 'My Characters', icon: User },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'download', label: 'Download', icon: Download }
  ];

  const downloadSteps = [
    { step: 1, title: 'Download Client', description: 'Download the MapleKaede game client (1.2GB)', icon: Download },
    { step: 2, title: 'Extract Files', description: 'Extract the ZIP file to your desired location', icon: Shield },
    { step: 3, title: 'Run Setup', description: 'Run MapleKaede.exe as administrator', icon: Settings },
    { step: 4, title: 'Start Playing!', description: 'Launch the game and login with your account', icon: Gamepad2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-orange-100 fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-8 lg:gap-12">
                <div className="text-2xl lg:text-3xl font-bold group-hover:scale-105 transition-transform duration-300">
                  <span className="text-gray-800">Maple</span>
                  <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-transparent bg-clip-text">Kaede</span>
                </div>
              
              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex items-center gap-2 xl:gap-3 px-3 xl:px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === item.id
                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/25'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 hover:scale-105'
                    }`}
                  >
                    <item.icon className={`w-4 xl:w-5 h-4 xl:h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'}`} />
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
              {/* Stats */}
              <div className="hidden xl:flex items-center gap-6 ml-8 lg:ml-12">
                <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-2 lg:w-3 h-2 lg:h-3 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-orange-700 font-semibold text-xs lg:text-sm whitespace-nowrap">{onlineCount} Online</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
                  <Star className="w-4 lg:w-5 h-4 lg:h-5 text-orange-500" />
                  <span className="text-orange-700 font-semibold text-xs lg:text-sm whitespace-nowrap">{userData.nx.toLocaleString()} NX</span>
                </div>
                {/* Manual refresh button */}
                <button
                  onClick={refreshData}
                  className="p-2 lg:p-3 rounded-xl hover:bg-orange-50 transition-colors group"
                  title="Refresh Data"
                >
                  <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 text-gray-600 group-hover:text-orange-500 transition-colors transform group-hover:rotate-90" />
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 lg:gap-4 p-2 rounded-2xl hover:bg-orange-50 transition-all duration-300 group"
                >
                  <div className="text-right hidden lg:block">
                    <div className="text-xs lg:text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors whitespace-nowrap">{userData.username}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">Lv.{userData.level} • {userData.job}</div>
                  </div>
                  <div className="relative">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {userData.username[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 bg-orange-500 rounded-full border-2 lg:border-3 border-white flex items-center justify-center">
                      <div className="w-1 lg:w-2 h-1 lg:h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden backdrop-blur-xl">
                    <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-400 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                      <div className="relative">
                        <p className="font-bold text-white text-lg">{userData.username}</p>
                        <p className="text-white/90 text-sm">{userData.guild} • {userRanking ? `Rank #${userRanking.rank}` : 'Unranked'}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">{userData.level}</div>
                            <div className="text-white/70 text-xs">Level</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">{userData.nx.toLocaleString()}</div>
                            <div className="text-white/70 text-xs">NX Cash</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">{userData.votePoints}</div>
                            <div className="text-white/70 text-xs">Votes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      {isAdmin && (
                        <button 
                          onClick={() => window.location.href = '/admin'}
                          className="w-full flex items-center gap-3 px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 group"
                        >
                          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="font-medium">Admin Panel</span>
                        </button>
                      )}
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
      <main className="pt-16">
        {/* Hero Section for Characters */}
        {activeTab === 'characters' && (
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-500/30 to-amber-500/30">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/testt.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl font-bold text-white mb-2">Choose Your Hero</h1>
                <p className="text-xl text-white/90 mb-6">Select your character and continue your adventure</p>
                <div className="flex gap-4">
                  <div className="px-6 py-2 bg-white/90 text-orange-600 rounded-lg font-medium flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {characters.length} Characters
                  </div>
                  <div className="px-6 py-2 bg-orange-600/80 text-white rounded-lg font-medium flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Highest: Level {characters.length > 0 ? Math.max(...characters.map(char => char.level)) : 1}
                  </div>
                </div>
              </div>
            </div>
            <Sparkles className="absolute top-10 right-20 w-8 h-8 text-white/20 animate-pulse" />
            <Star className="absolute bottom-10 left-20 w-12 h-12 text-white/10 animate-float" />
          </div>
        )}

        {/* Hero Section for Rankings */}
        {activeTab === 'rankings' && (
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-500/30 to-amber-500/30">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/testt.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl font-bold text-white mb-2">Server Rankings</h1>
                <p className="text-xl text-white/90 mb-6">Compete with the best players in MapleKaede</p>
                <div className="flex gap-4">
                  <div className="px-6 py-2 bg-white/90 text-orange-600 rounded-lg font-medium flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Your Rank: #{userRanking ? userRanking.rank : 'Unranked'}
                  </div>
                  <div className="px-6 py-2 bg-orange-600/80 text-white rounded-lg font-medium flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Top Player: Level {rankings.length > 0 ? rankings[0].level : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <Sparkles className="absolute top-10 right-20 w-8 h-8 text-white/20 animate-pulse" />
            <Star className="absolute bottom-10 left-20 w-12 h-12 text-white/10 animate-float" />
          </div>
        )}

        {/* Hero Section for Download */}
        {activeTab === 'download' && (
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-500/30 to-amber-500/30">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/testt.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl font-bold text-white mb-2">Download MapleKaede</h1>
                <p className="text-xl text-white/90 mb-6">Get started in just a few minutes!</p>
                <div className="flex gap-4">
                  <div className="px-6 py-2 bg-white/90 text-orange-600 rounded-lg font-medium flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Version 83
                  </div>
                  <div className="px-6 py-2 bg-orange-600/80 text-white rounded-lg font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    1.2GB Download
                  </div>
                </div>
              </div>
            </div>
            <Sparkles className="absolute top-10 right-20 w-8 h-8 text-white/20 animate-pulse" />
            <Star className="absolute bottom-10 left-20 w-12 h-12 text-white/10 animate-float" />
          </div>
        )}

        {/* Hero Section for Overview */}
        {activeTab === 'overview' && (
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-500 to-amber-500">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/testt.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {userData.username}!</h1>
                <p className="text-xl text-white/90 mb-6">Ready for your next adventure?</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('download')}
                    className="px-6 py-2 bg-white/90 text-orange-600 rounded-lg font-medium hover:bg-white transition-all flex items-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Play Now
                  </button>
                  <button 
                    onClick={() => setShowVoteModal(true)}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Vote for NX
                  </button>
                </div>
              </div>
            </div>
            <Sparkles className="absolute top-10 right-20 w-8 h-8 text-white/20 animate-pulse" />
            <Star className="absolute bottom-10 left-20 w-12 h-12 text-white/10 animate-float" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-xs text-orange-600 font-semibold">LIVE</span>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{onlineCount}</p>
                    <p className="text-gray-600 font-medium">Players Online</p>
                  </div>
                </div>
                
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full border border-orange-200">ACTIVE</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{announcements.filter(a => a.type === 'event').length}</p>
                    <p className="text-gray-600 font-medium">Active Events</p>
                  </div>
                </div>
                
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-7 h-7 text-white" />
                      </div>
                      <Crown className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">#{userRanking ? userRanking.rank : 'N/A'}</p>
                    <p className="text-gray-600 font-medium">Your Ranking</p>
                  </div>
                </div>
                
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">99.9%</p>
                    <p className="text-gray-600 font-medium">Server Uptime</p>
                  </div>
                </div>
              </div>

              {/* News & Events */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    Latest News & Events
                  </h2>
                  <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 group">
                    View All 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="space-y-6">
                  {announcements.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No announcements at the moment</p>
                      <p className="text-sm text-gray-400">Check back later for updates!</p>
                    </div>
                  ) : (
                    announcements.map((item) => (
                      <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {/* Orange accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-400" />
                        
                        {/* Subtle background glow */}
                        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-orange-500/5 to-orange-400/5 rounded-full blur-3xl -translate-y-8 translate-x-16" />
                        
                        <div className="relative p-8">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-6">
                              {/* Event type badge */}
                              <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                                  {item.type.toUpperCase()}
                                </span>
                                <span className="text-sm text-gray-500">{item.date}</span>
                              </div>
                              
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                              
                              {item.time && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200 mb-4">
                                  <Clock className="w-4 h-4 text-orange-600" />
                                  <span className="text-orange-700 font-medium text-sm">{item.time}</span>
                                </div>
                              )}
                              
                              <button className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium group-hover:gap-3 transition-all">
                                Read More 
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Event icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {item.type === 'event' && <Sparkles className="w-8 h-8 text-white" />}
                              {item.type === 'maintenance' && <Settings className="w-8 h-8 text-white" />}
                              {item.type === 'update' && <Star className="w-8 h-8 text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                  My Characters
                  <button
                    onClick={refreshData}
                    className="p-2 rounded-xl hover:bg-orange-50 transition-colors group"
                    title="Refresh Characters"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors transform group-hover:rotate-90" />
                  </button>
                </h1>
                <p className="text-gray-600">Choose your hero and continue your adventure</p>
                <p className="text-sm text-gray-500 mt-2">Data refreshes when you reload the page or switch tabs</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading characters...</span>
                </div>
              ) : characters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No characters found</p>
                  <p className="text-gray-500">Create your first character in-game to see it here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {characters.map((char, index) => (
                  <div key={char.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-100 relative flex items-center justify-center">
                      {/* Character Sprite */}
                      <CharacterRenderer 
                        character={{
                          id: char.id,
                          name: char.name,
                          level: char.level,
                          job: char.job,
                          skincolor: char.skincolor || 0,
                          gender: char.gender || 0,
                          hair: char.hair || 30000,
                          face: char.face || 20000,
                          equipment: char.equipment || {},
                          stats: char.stats,
                          exp: char.exp,
                          meso: char.meso
                        }}
                        scale={1.5}
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                        Lv. {char.level}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{char.name}</h3>
                      <p className="text-orange-600 font-medium mb-4">{char.job}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">EXP Progress</span>
                          <span className="text-gray-900 font-medium">{char.exp}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                            style={{ width: `${char.exp}%` }}
                          />
                        </div>
                      </div>

                     {/* Equipment Preview */}
                      {char.equipment && Object.keys(char.equipment).length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-2 font-semibold">Equipment</p>
                          <div className="grid grid-cols-4 gap-2">
                            {(Object.entries(char.equipment) as [keyof CharacterEquipment, number][]).map(([type, itemId]) => {
                              // Equipment slot mapping
                              const equipmentInfo: { [key: string]: { folder: string; label: string } } = {
                                cap: { folder: 'Cap', label: 'Hat' },
                                coat: { folder: itemId >= 1050000 ? 'Longcoat' : 'Coat', label: 'Top' },
                                pants: { folder: 'Pants', label: 'Bottom' },
                                shoes: { folder: 'Shoes', label: 'Shoes' },
                                glove: { folder: 'Glove', label: 'Gloves' },
                                cape: { folder: 'Cape', label: 'Cape' },
                                shield: { folder: 'Shield', label: 'Shield' },
                                weapon: { folder: 'Weapon', label: 'Weapon' },
                                mask: { folder: 'Accessory', label: 'Face' },
                                eyes: { folder: 'Accessory', label: 'Eyes' },
                                ears: { folder: 'Accessory', label: 'Earring' }
                              };
                              
                              const info = equipmentInfo[type];
                              if (!info || !itemId) return null;

                              // Format item ID with proper padding
                              const formattedId = itemId.toString().padStart(8, '0');
                              const iconPath = `/assets/maplestory/${info.folder}/${formattedId}.img/info.icon.png`;
                              
                              return (
                                <div key={type} className="relative group">
                                  {/* Item slot container */}
                                  <div className="relative w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg border-2 border-gray-400 overflow-hidden transition-all hover:border-orange-400 hover:shadow-lg">
                                    {/* Item icon */}
                                    <img 
                                      src={iconPath}
                                      alt={info.label}
                                      className="absolute inset-0 w-full h-full object-contain p-1"
                                      onError={(e) => {
                                        // Fallback to text if icon doesn't exist
                                        const img = e.currentTarget as HTMLImageElement;
                                        img.style.display = 'none';
                                        const nextElement = img.nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                          nextElement.classList.remove('hidden');
                                        }
                                      }}
                                    />
                                    {/* Fallback text */}
                                    <div className="hidden absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">
                                      {type.substring(0, 3).toUpperCase()}
                                    </div>
                                    
                                    {/* Equipped indicator */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    <div className="font-semibold">{info.label}</div>
                                    <div className="text-gray-300 text-xs">ID: {itemId}</div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                      <div className="border-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Meso Display */}
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700 font-medium text-sm">Meso</span>
                          <span className="text-yellow-800 font-bold">{char.meso.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-500 text-xs">STR</p>
                          <p className="text-gray-900 font-bold">{char.stats.str}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-500 text-xs">DEX</p>
                          <p className="text-gray-900 font-bold">{char.stats.dex}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-500 text-xs">INT</p>
                          <p className="text-gray-900 font-bold">{char.stats.int}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-500 text-xs">LUK</p>
                          <p className="text-gray-900 font-bold">{char.stats.luk}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}

          {/* Rankings Tab */}
          {activeTab === 'rankings' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                  Server Rankings
                  <button
                    onClick={refreshData}
                    className="p-2 rounded-xl hover:bg-orange-50 transition-colors group"
                    title="Refresh Rankings"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors transform group-hover:rotate-90" />
                  </button>
                </h1>
                <p className="text-gray-600">Compete with the best players in MapleKaede</p>
                <p className="text-sm text-gray-500 mt-2">Ranked by Level, then by EXP • Refreshes on page reload</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading rankings...</span>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-orange-500" />
                      Top Players
                      {userRanking && (
                        <span className="ml-4 text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          Your Rank: #{userRanking.rank}
                        </span>
                      )}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guild</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fame</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rankings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              No ranking data available
                            </td>
                          </tr>
                        ) : (
                          rankings.map((player) => (
                            <tr 
                              key={player.id} 
                              className={`hover:bg-gray-50 transition-colors ${
                                player.isCurrentUser ? 'bg-orange-50 border border-orange-200' : ''
                              }`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {player.rank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
                                  {player.rank === 2 && <Crown className="w-5 h-5 text-gray-400" />}
                                  {player.rank === 3 && <Crown className="w-5 h-5 text-orange-600" />}
                                  <span className={`font-bold ${player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'}`}>
                                    #{player.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                    player.isCurrentUser 
                                      ? 'bg-gradient-to-br from-orange-500 to-orange-400' 
                                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                  }`}>
                                    {player.name[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className={`font-medium ${player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'}`}>
                                      {player.name}
                                    </p>
                                    {player.isCurrentUser && (
                                      <p className="text-xs text-orange-600">(You)</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`font-bold ${player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'}`}>
                                  {player.level}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-700 font-medium">{player.job}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {player.guild ? (
                                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                    {player.guild}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">No Guild</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4 text-pink-500" />
                                  <span className="text-gray-900">{player.fame.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-600 text-sm font-mono">
                                  {player.exp.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                        
                        {/* Show user's ranking separately if not in top 100 */}
                        {userRanking && userRanking.rank > 100 && (
                          <>
                            <tr>
                              <td colSpan={7} className="px-6 py-2 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                  <span className="text-xs">...</span>
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-orange-50 border border-orange-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-bold text-orange-600">#{userRanking.rank}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {userRanking.name[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-orange-600">{userRanking.name}</p>
                                    <p className="text-xs text-orange-600">(You)</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-bold text-orange-600">{userRanking.level}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-700 font-medium">{userRanking.job}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {userRanking.guild ? (
                                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                    {userRanking.guild}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">No Guild</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4 text-pink-500" />
                                  <span className="text-gray-900">{userRanking.fame.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-600 text-sm font-mono">
                                  {userRanking.exp.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Ranking Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-8 h-8 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Player</h3>
                  </div>
                  {rankings.length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{rankings[0].name}</p>
                      <p className="text-gray-600">Level {rankings[0].level} {rankings[0].job}</p>
                      {rankings[0].guild && (
                        <p className="text-sm text-blue-600 mt-1">{rankings[0].guild}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                  </div>
                  {userRanking ? (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Rank #{userRanking.rank}</p>
                      <p className="text-gray-600">Level {userRanking.level} {userRanking.job}</p>
                      <p className="text-sm text-orange-600 mt-1">Keep climbing!</p>
                    </div>
                  ) : rankings.find(r => r.isCurrentUser) ? (
                    <div>
                      <p className="text-2xl font-bold text-orange-600">Top 100!</p>
                      <p className="text-gray-600">You're in the leaderboard</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Character not found</p>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Competition</h3>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{rankings.length}</p>
                    <p className="text-gray-600">Total ranked players</p>
                    {rankings.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Avg level: {Math.round(rankings.reduce((sum, r) => sum + r.level, 0) / rankings.length)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Tab */}
          {activeTab === 'download' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Download MapleKaede</h1>
                <p className="text-gray-600">Get started in just a few minutes!</p>
              </div>

              {/* Download Button */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-8 text-center shadow-lg">
                <Download className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">MapleKaede Client v83</h2>
                <p className="text-white/90 mb-6">Size: 1.2GB • Windows 7/8/10/11</p>
                <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
                  <Download className="w-6 h-6" />
                  Download Now
                </button>
              </div>

              {/* Installation Steps */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Installation Guide</h2>
                <div className="space-y-4">
                  {downloadSteps.map((step) => (
                    <div key={step.step} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{step.step}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                         <p className="text-gray-600">{step.description}</p>
                       </div>
                       <step.icon className="w-6 h-6 text-gray-400" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* System Requirements */}
             <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-green-500" />
                   Minimum Requirements
                 </h3>
                 <ul className="space-y-2 text-gray-600">
                   <li>• Windows 7 or higher</li>
                   <li>• 2GB RAM</li>
                   <li>• Intel Core 2 Duo</li>
                   <li>• 2GB free disk space</li>
                   <li>• DirectX 9.0c</li>
                 </ul>
               </div>
               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                   <Star className="w-5 h-5 text-orange-500" />
                   Recommended Requirements
                 </h3>
                 <ul className="space-y-2 text-gray-600">
                   <li>• Windows 10/11</li>
                   <li>• 4GB RAM or more</li>
                   <li>• Intel i3 or better</li>
                   <li>• 4GB free disk space</li>
                   <li>• DirectX 11</li>
                 </ul>
               </div>
             </div>
           </div>
         )}
       </div>
     </main>

     {/* Vote Modal */}
     {showVoteModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* Background overlay */}
         <div 
           className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
           onClick={() => setShowVoteModal(false)}
         />

         {/* Modal */}
         <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all">
           {/* Close button */}
           <button
             onClick={() => setShowVoteModal(false)}
             className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
           >
             <X className="w-6 h-6" />
           </button>

           <div className="p-6">
             {/* Header */}
             <div className="mb-8">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center">
                   <Heart className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-bold text-gray-900">Vote for NX</h2>
                   <p className="text-gray-600">Support MapleKaede and earn NX rewards!</p>
                 </div>
               </div>

               {/* Current NX and Vote Count */}
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                   <div className="flex items-center gap-3">
                     <Star className="w-5 h-5 text-orange-600" />
                     <div>
                       <p className="font-semibold text-orange-800">Current NX</p>
                       <p className="text-orange-700 text-lg font-bold">{voteData.currentNX.toLocaleString()}</p>
                     </div>
                   </div>
                 </div>
                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                   <div className="flex items-center gap-3">
                     <Trophy className="w-5 h-5 text-blue-600" />
                     <div>
                       <p className="font-semibold text-blue-800">Total Votes</p>
                       <p className="text-blue-700 text-lg font-bold">{voteData.totalVotes}</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Today's rewards summary */}
               {voteData.todayRewards > 0 && (
                 <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                   <div className="flex items-center gap-3">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                     <div>
                       <p className="font-semibold text-green-800">Today's Rewards!</p>
                       <p className="text-green-700 text-sm">
                         You've earned {voteData.todayRewards.toLocaleString()} NX from voting today
                       </p>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             {/* Vote sites */}
             <div className="space-y-4 mb-8">
               {voteData.sites.map((site) => {
                 const siteKey = site.name.toLowerCase().replace(/\s+/g, '');
                 const status = voteData.voteStatus[siteKey] || { voted: false, pending: false };
                 const isDisabled = !canVote(site.name) || status.pending;
                 const cooldownRemaining = getRemainingCooldown(site.name);
                 
                 return (
                   <div
                     key={site.id}
                     className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                       status.voted 
                         ? 'border-green-200 bg-green-50' 
                         : status.pending
                         ? 'border-orange-200 bg-orange-50'
                         : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg'
                     }`}
                   >
                     {/* Background gradient */}
                     <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-5" />
                     
                     <div className="relative p-6">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="text-3xl">{site.icon}</div>
                           <div>
                             <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                             <p className="text-gray-600">
                               Reward: <span className="font-semibold text-orange-600">{site.nx_reward.toLocaleString()} NX</span>
                             </p>
                             {cooldownRemaining > 0 && (
                               <p className="text-sm text-orange-600">
                                 Next vote in: {formatTimeRemaining(cooldownRemaining)}
                               </p>
                             )}
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-3">
                           {status.voted && (
                             <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                               <CheckCircle className="w-4 h-4" />
                               Completed
                             </div>
                           )}
                           
                           {status.pending && (
                             <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                               <Clock className="w-4 h-4 animate-spin" />
                               Voting...
                             </div>
                           )}
                           
                           <div className="flex flex-col gap-2">
                             <button
                               onClick={() => handleVote(site)}
                               disabled={isDisabled}
                               className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                isDisabled
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:scale-105 shadow-lg'
                              }`}
                             >
                               <ExternalLink className="w-4 h-4" />
                               {status.voted ? 'Voted' : status.pending ? 'Voting...' : 'Vote Now'}
                             </button>
                             
                             {/* Manual verify removed */}

                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>

             {/* Footer */}
             <div className="flex items-center justify-between pt-6 border-t border-gray-200">
               <div className="text-sm text-gray-500">
                 <p>• Vote every 12 hours for maximum rewards</p>
                 <p>• Voting helps boost our server ranking</p>
                 <p>• NX is added automatically after voting</p>
               </div>
               
               <div className="flex gap-3">
                 <button
                   onClick={() => setShowVoteModal(false)}
                   className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                 >
                   Close
                 </button>
               </div>
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
       .animation-delay-2000 { animation-delay: 2s; }
       .animation-delay-4000 { animation-delay: 4s; }
     `}</style>
   </div>
 );
};

export default UserDashboard;