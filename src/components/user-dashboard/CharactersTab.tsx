// src/components/user-dashboard/CharactersTab.tsx
'use client';

import React from 'react';
import CharacterRenderer from '@/components/Character-render/CharacterRenderer';
import { CharacterEquipment } from '@/types/api';
import { 
  User, Shield, ArrowRight, Star
} from 'lucide-react';

interface CharactersTabProps {
  characters: any[];
  isLoading: boolean;
  refreshData: () => void;
}

const CharactersTab: React.FC<CharactersTabProps> = ({
  characters,
  isLoading,
  refreshData
}) => {
  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {characters.map((char, index) => {
            console.log(`Character ${char.name} data:`, {
              id: char.id,
              name: char.name,
              skincolor: char.skincolor,
              gender: char.gender,
              hair: char.hair,
              face: char.face,
              equipment: char.equipment
            });

            // Ensure character data is properly formatted with null-safe defaults
            const characterData = {
              id: char.id,
              name: char.name || 'Unknown',
              level: char.level || 1,
              job: char.job || 'Beginner',
              skincolor: char.skincolor ?? 0,  // Use nullish coalescing to handle 0 values
              gender: char.gender ?? 0,
              hair: char.hair || 30000,
              face: char.face || 20000,
              equipment: char.equipment || {},
              stats: char.stats || { str: 4, dex: 4, int: 4, luk: 4 },
              exp: char.exp || 0,
              meso: char.meso || 0
            };

            // Validate that we have minimum required data
            const hasRequiredData = (
              characterData.skincolor !== undefined && 
              characterData.skincolor !== null &&
              characterData.gender !== undefined && 
              characterData.gender !== null
            );

            return (
              <div key={char.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                {/* Character Display Area - Much Bigger */}
                <div className="h-64 relative flex items-center justify-center overflow-hidden">
                  {/* Main container with background image */}
                  <div 
                    className="relative overflow-hidden rounded-xl shadow-xl"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {/* Background Image with full controls */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'url("/assets/character-bg.jpg")',
                        backgroundSize: '300%',
                        backgroundPosition: 'center calc(80% + 40px)',
                        backgroundRepeat: 'no-repeat',
                        transform: 'scale(1)',
                        transformOrigin: 'center',
                        filter: 'none', 
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-transparent to-orange-100/10">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-16 h-16 bg-orange-200 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 right-4 w-20 h-20 bg-amber-200 rounded-full blur-xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-300 rounded-full blur-2xl opacity-30"></div>
                      </div>
                    </div>
                    
                    {/* Character Sprite - Larger */}
                    <div className="relative z-10 scale-110 flex items-center justify-center h-full">
                      {hasRequiredData ? (
                        <CharacterRenderer 
                          character={characterData}
                          scale={1.8}
                        />
                      ) : (
                        <div className="w-[360px] h-[360px] flex flex-col items-center justify-center text-gray-400">
                          <User className="w-16 h-16 mb-2" />
                          <span className="text-sm">Character loading...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Level Badge - Repositioned */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-white/20 z-20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-orange-600 font-bold text-sm">Lv. {characterData.level}</span>
                      </div>
                    </div>
                    
                    {/* Job Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-lg font-medium text-sm border border-orange-200 z-20">
                      {characterData.job}
                    </div>
                  </div>
                </div>

                {/* Character Info */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{characterData.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{characterData.job}</span>
                    </div>
                  </div>
                  
                  {/* EXP Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm font-medium">EXP Progress</span>
                      <span className="text-gray-900 font-bold">{characterData.exp}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${characterData.exp}%` }}
                      />
                    </div>
                  </div>

                  {/* Equipment Preview - Improved */}
                  {characterData.equipment && Object.keys(characterData.equipment).length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">Equipment</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {(Object.entries(characterData.equipment) as [keyof CharacterEquipment, number][])
                          .filter(([_, itemId]) => itemId && itemId > 0)
                          .map(([type, itemId]) => {
                            // Equipment slot mapping
                            const equipmentInfo: { [key: string]: { folder: string; label: string; prefix?: string } } = {
                              cap: { folder: 'Cap', label: 'Hat', prefix: '0' },
                              coat: { folder: itemId >= 1050000 ? 'Longcoat' : 'Coat', label: 'Top', prefix: '0' },
                              pants: { folder: 'Pants', label: 'Bottom', prefix: '0' },
                              shoes: { folder: 'Shoes', label: 'Shoes', prefix: '0' },
                              glove: { folder: 'Glove', label: 'Gloves', prefix: '0' },
                              cape: { folder: 'Cape', label: 'Cape', prefix: '0' },
                              shield: { folder: 'Shield', label: 'Shield', prefix: '0' },
                              weapon: { folder: 'Weapon', label: 'Weapon', prefix: '' },
                              mask: { folder: 'Accessory', label: 'Face', prefix: '0' },
                              eyes: { folder: 'Accessory', label: 'Eyes', prefix: '0' },
                              ears: { folder: 'Accessory', label: 'Earring', prefix: '0' }
                            };
                            
                            const info = equipmentInfo[type];
                            if (!info) return null;

                            // Format item ID with proper padding and prefix
                            let formattedId: string;
                            if (info.prefix) {
                              formattedId = `${info.prefix}${itemId.toString().padStart(7, '0')}`;
                            } else {
                              // For weapons (no prefix)
                              formattedId = itemId.toString().padStart(8, '0');
                            }
                            
                            const iconPath = `/assets/maplestory/${info.folder}/${formattedId}.img/info.icon.png`;
                            
                            return (
                              <div key={type} className="relative group">
                                {/* Item slot container - Larger */}
                                <div className="relative w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 overflow-hidden transition-all hover:border-orange-400 hover:shadow-lg hover:scale-105">
                                  {/* Item icon */}
                                  <img 
                                    src={iconPath}
                                    alt={info.label}
                                    className="absolute inset-0 w-full h-full object-contain p-1.5"
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
                                    {type.substring(0, 2).toUpperCase()}
                                  </div>
                                  
                                  {/* Equipped indicator */}
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Tooltip - Improved */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                  <div className="font-semibold">{info.label}</div>
                                  <div className="text-gray-300 text-xs">ID: {itemId}</div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                    <div className="border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Meso Display - Improved */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="text-yellow-800 font-semibold">Meso</span>
                      </div>
                      <span className="text-yellow-900 font-bold text-lg">{characterData.meso.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats Grid - Improved */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-red-600 text-xs font-semibold mb-1">STR</p>
                      <p className="text-red-800 font-bold text-lg">{characterData.stats.str}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-600 text-xs font-semibold mb-1">DEX</p>
                      <p className="text-green-800 font-bold text-lg">{characterData.stats.dex}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-blue-600 text-xs font-semibold mb-1">INT</p>
                      <p className="text-blue-800 font-bold text-lg">{characterData.stats.int}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <p className="text-purple-600 text-xs font-semibold mb-1">LUK</p>
                      <p className="text-purple-800 font-bold text-lg">{characterData.stats.luk}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CharactersTab;