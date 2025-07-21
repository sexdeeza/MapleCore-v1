// src/components/user-dashboard/VoteModal.tsx
'use client';

import React from 'react';
import { 
  X, Heart, Star, Trophy, CheckCircle, Clock, ExternalLink
} from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  voteData: {
    sites: any[];
    voteStatus: any;
    todayRewards: number;
    username: string;
    currentNX: number;
    totalVotes: number;
  };
  handleVote: (site: any) => void;
  canVote: (siteName: string) => boolean;
  getRemainingCooldown: (siteName: string) => number;
  formatTimeRemaining: (milliseconds: number) => string;
}

const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  voteData,
  handleVote,
  canVote,
  getRemainingCooldown,
  formatTimeRemaining
}) => {
  if (!isOpen) return null;

  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME || 'MapleKaede';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
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
                <h2 className="text-3xl font-bold text-gray-900">Vote for {serverName}</h2>
                <p className="text-gray-600">Support {serverName} and earn NX rewards!</p>
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
              <p>• Voting helps boost {serverName}'s ranking</p>
              <p>• NX is added automatically after voting</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;