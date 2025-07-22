// src/components/user-dashboard/DownloadTab.tsx
'use client';

import React from 'react';
import { 
  Download, Shield, Settings, Gamepad2, ArrowRight, Star, CheckCircle,
  Users, Clock
} from 'lucide-react';

const DownloadTab: React.FC = () => {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

  const downloadSteps = [
    { step: 1, title: 'Download Client', description: `Download the ${serverName} game client (1.2GB)`, icon: Download },
    { step: 2, title: 'Extract Files', description: 'Extract the ZIP file to your desired location', icon: Shield },
    { step: 3, title: 'Run Setup', description: `Run ${serverName}.exe as administrator`, icon: Settings },
    { step: 4, title: 'Start Playing!', description: 'Launch the game and login with your account', icon: Gamepad2 }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Download {serverName}</h1>
        <p className="text-gray-600">Get started in just a few minutes!</p>
        <p className="text-sm text-gray-500 mt-2">Latest version with enhanced security and performance</p>
      </div>

      {/* Enhanced Download Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-center shadow-2xl">
        {/* Background Effects */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <Download className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">{serverName} Client v83</h2>
          <div className="flex items-center justify-center gap-6 mb-6 text-white/90">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>1.2GB Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>Windows Compatible</span>
            </div>
          </div>
          
          <button className="group px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto">
            <Download className="w-6 h-6 group-hover:animate-bounce" />
            Download Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-white/80 text-sm mt-4">Free to play • No subscription required</p>
        </div>
      </div>

      {/* Installation Steps - Redesigned */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            Installation Guide
          </h2>
          <p className="text-gray-600">Follow these simple steps to start playing</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloadSteps.map((step, index) => (
            <div key={step.step} className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              {/* Background Effect */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-400/10 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <step.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mt-4">
                  {downloadSteps.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                      i <= index ? 'bg-orange-500 w-8' : 'bg-gray-200 w-4'
                    }`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Requirements - Enhanced */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            System Requirements
          </h2>
          <p className="text-gray-600">Make sure your system meets these requirements</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Minimum Requirements */}
          <div className="group relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-300/30 rounded-full blur-lg" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Minimum</h3>
                  <p className="text-blue-700 font-semibold text-sm">Basic Requirements</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: '🖥️', label: 'Windows 7 or higher' },
                  { icon: '💾', label: '2GB RAM' },
                  { icon: '⚡', label: 'Intel Core 2 Duo' },
                  { icon: '💿', label: '2GB free disk space' },
                  { icon: '🎮', label: 'DirectX 9.0c' }
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-blue-200/50">
                    <span className="text-xl">{req.icon}</span>
                    <span className="text-gray-700 font-medium">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Requirements */}
          <div className="group relative bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300/30 rounded-full blur-lg" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Recommended</h3>
                  <p className="text-orange-700 font-semibold text-sm">Optimal Experience</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: '🖥️', label: 'Windows 10/11' },
                  { icon: '💾', label: '4GB RAM or more' },
                  { icon: '⚡', label: 'Intel i3 or better' },
                  { icon: '💿', label: '4GB free disk space' },
                  { icon: '🎮', label: 'DirectX 11' }
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-orange-200/50">
                    <span className="text-xl">{req.icon}</span>
                    <span className="text-gray-700 font-medium">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-gray-600 mb-6">Join thousands of players in the world of {serverName}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span>Active Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              <span>Secure Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-500" />
              <span>Regular Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadTab;