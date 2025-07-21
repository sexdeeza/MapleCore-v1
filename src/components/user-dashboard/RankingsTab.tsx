// src/components/user-dashboard/RankingsTab.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import CharacterRenderer from '@/components/Character-render/CharacterRenderer';
import { 
  RankingFilters, 
  RankingsResponse, 
  PaginationInfo, 
  JobCategory 
} from '@/types/api';
import { 
  Trophy, Crown, Users, Star, TrendingUp, Heart, User,
  Search, ChevronLeft, ChevronRight
} from 'lucide-react';

interface RankingsTabProps {
  rankings: any[];
  userRanking: any;
  isLoadingRankings: boolean;
  rankingFilters: RankingFilters;
  rankingPagination: PaginationInfo | null;
  availableJobs: JobCategory[];
  updateRankingFilters: (filters: Partial<RankingFilters>) => void;
  fetchRankings: () => void;
}

const RankingsTab: React.FC<RankingsTabProps> = ({
  rankings,
  userRanking,
  isLoadingRankings,
  rankingFilters,
  rankingPagination,
  availableJobs,
  updateRankingFilters,
  fetchRankings
}) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleJobFilter = (job: string) => {
    updateRankingFilters({ job, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRankingFilters({ search: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateRankingFilters({ search: '', page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateRankingFilters({ page });
  };

  const getJobIcon = (jobCategory: string) => {
    const iconMap: { [key: string]: string } = {
      'all': '⚔️',
      'beginner': '👶',
      'noblesse': '👶',
      'warrior': '🛡️',
      'dawn-warrior': '🛡️',
      'magician': '🔮',
      'blaze-wizard': '🔮',
      'thief': '🗡️',
      'night-walker': '🗡️',
      'bowman': '🏹',
      'wind-archer': '🏹',
      'pirate': '⚓',
      'thunder-breaker': '⚓',
      'aran': '❄️'
    };
    return iconMap[jobCategory] || '❓';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipRef.current && hoveredPlayer) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = e.clientX + 15;
      let top = e.clientY - tooltipRect.height / 2;
      
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = e.clientX - tooltipRect.width - 15;
      }
      
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10;
      }
      
      if (top < 10) {
        top = 10;
      }
      
      if (left < 10) {
        left = 10;
      }
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  };

  const handleMouseEnter = (player: any) => {
    setHoveredPlayer(player);
    if (tooltipRef.current) {
      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
        }
      }, 10);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPlayer(null);
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">TOP</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Champion</h3>
            <p className="text-orange-700 font-semibold text-sm mb-2">Top Player</p>
            {rankings.length > 0 ? (
              <div>
                <p className="text-lg font-bold text-gray-900">{rankings[0].name}</p>
                <p className="text-orange-600 text-sm">Level {rankings[0].level}</p>
              </div>
            ) : (
              <p className="text-orange-600 text-sm">No data</p>
            )}
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">YOU</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Your Rank</h3>
            <p className="text-orange-700 font-semibold text-sm mb-2">Current Position</p>
            {userRanking ? (
              <div>
                <p className="text-lg font-bold text-gray-900">#{userRanking.rank}</p>
                <p className="text-orange-600 text-sm">Level {userRanking.level}</p>
              </div>
            ) : rankings.find(r => r.isCurrentUser) ? (
              <div>
                <p className="text-lg font-bold text-orange-600">Top {rankingPagination?.itemsPerPage || 15}!</p>
                <p className="text-orange-600 text-sm">In current view</p>
              </div>
            ) : (
              <p className="text-orange-600 text-sm">Not ranked</p>
            )}
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">TOTAL</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">{rankingPagination?.totalItems || rankings.length}</h3>
            <p className="text-orange-700 font-semibold text-sm mb-2">Total Players</p>
            {rankings.length > 0 && (
              <p className="text-orange-600 text-sm">
                Avg: Lv.{Math.round(rankings.reduce((sum, r) => sum + r.level, 0) / rankings.length)}
              </p>
            )}
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-500/20 px-2 py-1 rounded-full">MAX</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">
              {rankings.length > 0 ? rankings[0].level : 'N/A'}
            </h3>
            <p className="text-orange-700 font-semibold text-sm mb-2">Highest Level</p>
            {rankings.length > 0 && (
              <p className="text-orange-600 text-sm">
                {Math.round((rankings[0].level / 200) * 100)}% to cap
              </p>
            )}
          </div>
        </div>
      </div>

      {/* User's Ranking Highlight */}
      {userRanking && !rankings.some(r => r.isCurrentUser) && rankingFilters.job === 'all' && !rankingFilters.search && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Your Best Character
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <CharacterRenderer 
                character={{
                  id: userRanking.id,
                  name: userRanking.name,
                  level: userRanking.level,
                  job: userRanking.jobId.toString(),
                  skincolor: userRanking.skincolor || 0,
                  gender: userRanking.gender || 0,
                  hair: userRanking.hair || 30000,
                  face: userRanking.face || 20000,
                  equipment: userRanking.equipment || {},
                  stats: userRanking.stats || { str: 4, dex: 4, int: 4, luk: 4 },
                  exp: userRanking.exp || 0,
                  meso: userRanking.meso || 0
                }}
                scale={0.8}
              />
            </div>
            <div>
              <div className="text-2xl font-bold">#{userRanking.rank}</div>
              <div className="text-lg">{userRanking.name}</div>
              <div className="text-blue-100">Level {userRanking.level} {userRanking.job}</div>
              {userRanking.guild && (
                <div className="text-blue-200 text-sm">[{userRanking.guild}]</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rankings Table with integrated search and filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        {/* Table Header with Search */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {rankingFilters.job !== 'all' ? `${rankingFilters.job.charAt(0).toUpperCase() + rankingFilters.job.slice(1)} Rankings` : 'Top Players'}
                </h2>
                <p className="text-sm text-gray-600">Search players and filter by job class</p>
              </div>
            </div>
            {userRanking && (
              <span className="text-sm text-orange-600 bg-orange-100 px-4 py-2 rounded-full font-medium">
                Your Rank: #{userRanking.rank}
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search character name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              {rankingFilters.search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Job Filter Buttons */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Filter by Job Class</h3>
            <div className="flex flex-wrap gap-2">
              {availableJobs.map(job => {
                const getIconName = (jobValue: string) => {
                  switch(jobValue) {
                    case 'all': return 'all';
                    case 'beginner': 
                    case 'noblesse': return 'beginner';
                    case 'warrior': 
                    case 'dawn-warrior': return 'warrior';
                    case 'magician': 
                    case 'blaze-wizard': return 'magician';
                    case 'thief': 
                    case 'night-walker': return 'thief';
                    case 'bowman': 
                    case 'wind-archer': return 'bowman';
                    case 'pirate': 
                    case 'thunder-breaker': return 'pirate';
                    case 'aran': return 'aran';
                    default: return 'all';
                  }
                };

                return (
                  <button
                    key={job.value}
                    onClick={() => handleJobFilter(job.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      rankingFilters.job === job.value
                        ? 'bg-orange-500 text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img 
                      src={`/assets/job-icons/${getIconName(job.value)}.png`} 
                      alt={job.label}
                      className="w-4 h-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'inline';
                      }}
                    />
                    <span className="hidden">{getJobIcon(job.value)}</span>
                    {job.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isLoadingRankings ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading rankings...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-20 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="w-56 px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Player</th>
                  <th className="w-20 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Level</th>
                  <th className="w-32 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Job</th>
                  <th className="w-32 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Guild</th>
                  <th className="w-24 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Fame</th>
                  <th className="w-24 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">EXP</th>
                  <th className="w-28 px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Character</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rankings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-4">
                        <Trophy className="w-12 h-12 text-gray-300" />
                        <div>
                          <p className="text-lg font-medium">No ranking data found</p>
                          <p className="text-sm">
                            {rankingFilters.search 
                              ? `No players found matching "${rankingFilters.search}"`
                              : rankingFilters.job !== 'all'
                              ? `No ${rankingFilters.job} players found`
                              : 'Rankings will appear here once characters are created'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rankings.map((player, index) => (
                    <tr 
                      key={player.id} 
                      className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200 cursor-pointer ${
                        player.isCurrentUser ? 'bg-gradient-to-r from-orange-50 to-orange-25 border-l-4 border-orange-400' : ''
                      }`}
                      onMouseEnter={() => handleMouseEnter(player)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      {/* Rank */}
                      <td className="w-20 px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {player.rank <= 3 && (
                            <Crown className={`w-4 h-4 ${
                              player.rank === 1 ? 'text-yellow-500' :
                              player.rank === 2 ? 'text-gray-400' :
                              'text-orange-600'
                            }`} />
                          )}
                          <span className={`font-bold ${
                            player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            #{player.rank}
                          </span>
                        </div>
                      </td>

                      {/* Player */}
                      <td className="w-56 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            player.isCurrentUser 
                              ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                              : player.rank <= 3
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            {player.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-bold truncate ${
                              player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {player.name}
                            </p>
                            {player.isCurrentUser && (
                              <p className="text-xs text-orange-600 font-medium">(You)</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="w-20 px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-lg font-bold ${
                            player.isCurrentUser ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {player.level}
                          </span>
                          {player.level >= 200 && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </td>

                      {/* Job */}
                      <td className="w-32 px-4 py-4 text-center">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 truncate max-w-full">
                          {player.job}
                        </span>
                      </td>

                      {/* Guild */}
                      <td className="w-32 px-4 py-4 text-center">
                        {player.guild ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 truncate max-w-full">
                            {player.guild}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">No Guild</span>
                        )}
                      </td>

                      {/* Fame */}
                      <td className="w-24 px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3 text-pink-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">{player.fame.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* EXP */}
                      <td className="w-24 px-4 py-4 text-center">
                        <span className="text-xs font-mono text-gray-600 truncate block">
                          {player.exp.toLocaleString()}
                        </span>
                      </td>

                      {/* Character */}
                      <td className="w-28 px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-xs text-gray-500">Hover</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {rankingPagination && rankingPagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {rankingPagination.startItem}-{rankingPagination.endItem} of {rankingPagination.totalItems} players
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(rankingFilters.page - 1)}
                disabled={!rankingPagination.hasPrevPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  rankingPagination.hasPrevPage
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, rankingPagination.totalPages) }, (_, i) => {
                  const startPage = Math.max(1, rankingPagination.currentPage - 2);
                  const pageNum = startPage + i;
                  
                  if (pageNum > rankingPagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pageNum === rankingPagination.currentPage
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(rankingFilters.page + 1)}
                disabled={!rankingPagination.hasNextPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  rankingPagination.hasNextPage
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Hover Tooltip */}
      <div 
        ref={tooltipRef}
        className="fixed opacity-0 transition-opacity duration-300 pointer-events-none z-[9999]"
        style={{
          left: '0px',
          top: '0px',
          transform: 'none'
        }}>
        {hoveredPlayer && (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 p-4 min-w-[280px]">
            <div className="flex items-center gap-4">
              {/* Character Renderer with Background */}
              <div className="flex-shrink-0 relative overflow-hidden rounded-xl border border-orange-200" 
                style={{
                  width: '200px',
                  height: '250px',
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'url("/assets/character-bg.jpg")',
                    backgroundSize: '350%',
                    backgroundPosition: 'center calc(62% - 70px)',
                    backgroundRepeat: 'no-repeat',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                  }}
                />
                
                {/* Character Renderer */}
                <div 
                  className="absolute bottom-0 left-0 right-0 flex justify-center"
                  style={{
                    paddingBottom: '30px',
                  }}
                >
                  <CharacterRenderer 
                    character={{
                      id: hoveredPlayer.id,
                      name: hoveredPlayer.name,
                      level: hoveredPlayer.level,
                      job: hoveredPlayer.jobId.toString(),
                      skincolor: hoveredPlayer.skincolor || 0,
                      gender: hoveredPlayer.gender || 0,
                      hair: hoveredPlayer.hair || 30000,
                      face: hoveredPlayer.face || 20000,
                      equipment: hoveredPlayer.equipment || {},
                      stats: hoveredPlayer.stats || { str: 4, dex: 4, int: 4, luk: 4 },
                      exp: hoveredPlayer.exp || 0,
                      meso: hoveredPlayer.meso || 0
                    }}
                    scale={1.2}
                  />
                </div>
              </div>
              
              {/* Character Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {hoveredPlayer.rank <= 3 && (
                    <Crown className={`w-5 h-5 ${
                      hoveredPlayer.rank === 1 ? 'text-yellow-500' :
                      hoveredPlayer.rank === 2 ? 'text-gray-400' :
                      'text-orange-600'
                    }`} />
                  )}
                  <h3 className="font-bold text-gray-900 text-lg">{hoveredPlayer.name}</h3>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-gray-500">Level:</span>
                    <span className="font-semibold text-orange-600">{hoveredPlayer.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-gray-500">Job:</span>
                    <span className="font-medium text-gray-700">{hoveredPlayer.job}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-gray-500">Guild:</span>
                    {hoveredPlayer.guild ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {hoveredPlayer.guild}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No Guild</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-gray-500">Fame:</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-500" />
                      <span className="font-medium text-gray-700">{hoveredPlayer.fame.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingsTab;