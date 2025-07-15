// src/components/MapleKaedeLanding.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { serverAPI, discordAPI } from '@/services/api';
import { Sparkles, Users, Trophy, Gamepad2, Download, Menu, X, Star, Sword, Shield, Heart, Crown, Zap, Gift, ChevronRight, Globe, MessageCircle, Youtube, ArrowRight, Clock, TrendingUp, Swords, Activity } from 'lucide-react';

const MapleKaedeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    online: true,
    players: 127,
    loading: true
  });
  const [discordData, setDiscordData] = useState({
    online: 0,
    members: 0,
    loading: true
  });
  const [mouseTrail, setMouseTrail] = useState<Array<{x: number, y: number, id: number}>>([]);
  const trailIdRef = useRef(0);

  // Generate particle data once
  const [particles] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 20
    }))
  );

  // Generate leaf data once to avoid hydration mismatch
  const [leafData] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: 0, // No delay - start immediately
      duration: 15 + Math.random() * 10,
      scale: 0.4 + Math.random() * 0.6,
      swayDuration: 3 + Math.random() * 2,
      leafType: (i % 4) + 1,
      startOffset: Math.random() * 100 // Random starting position in animation
    }))
  );

  // Mouse trail effect
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current++
      };

      setMouseTrail(prev => {
        const newTrail = [...prev, newTrailPoint];
        // Keep only last 5 trail points
        if (newTrail.length > 5) {
          return newTrail.slice(-5);
        }
        return newTrail;
      });

      // Remove trail point after animation
      setTimeout(() => {
        setMouseTrail(prev => prev.filter(point => point.id !== newTrailPoint.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 3);
    }, 3000);
    
    // Fetch Discord data
    const fetchDiscordData = async () => {
      try {
        const data = await discordAPI.getServerInfo();
        setDiscordData(data);
      } catch (error) {
        console.error('Failed to fetch Discord data:', error);
      }
    };
    
    // Fetch server status
    const fetchServerStatus = async () => {
      try {
        const response = await serverAPI.getStatus();
        if (response.ok) {
          setServerStatus({
            online: response.data.online,
            players: response.data.players,
            loading: false
          });
        }
      } catch (error) {
        // Fallback data
        setServerStatus({
          online: true,
          players: 127,
          loading: false
        });
      }
    };
    
    fetchDiscordData();
    fetchServerStatus();
    
    // Refresh data periodically
    const discordInterval = setInterval(fetchDiscordData, 60000); // Every minute
    const serverInterval = setInterval(fetchServerStatus, 30000); // Every 30 seconds
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(statInterval);
      clearInterval(discordInterval);
      clearInterval(serverInterval);
    };
  }, []);

  const stats = [
    { label: "Active Players", value: "2,847", icon: Users },
    { label: "Daily Events", value: "12+", icon: Trophy },
    { label: "Server Uptime", value: "99.9%", icon: TrendingUp }
  ];

  const features = [
    {
      icon: Swords,
      title: "Classic v83",
      description: "Pure nostalgic MapleStory experience",
      gradient: "from-orange-600 to-amber-600",
      image: "/features/classic.png"
    },
    {
      icon: Zap,
      title: "Zero Lag",
      description: "Premium servers with 10Gbps connection",
      gradient: "from-orange-500 to-amber-500",
      image: "/features/speed.png"
    },
    {
      icon: Gift,
      title: "Daily Events",
      description: "Original events and login rewards",
      gradient: "from-amber-600 to-orange-600",
      image: "/features/events.png"
    },
    {
      icon: Shield,
      title: "Secure & Fair",
      description: "Advanced anti-cheat protection",
      gradient: "from-amber-500 to-orange-500",
      image: "/features/secure.png"
    }
  ];

  const classes = [
    { 
      name: "Warrior", 
      image: "/classes/warrior.png", 
      color: "from-red-500 to-red-600",
      bgGradient: "from-red-100 to-red-50",
      description: "Master of close combat",
      stats: { HP: "High", MP: "Low", Damage: "High" }
    },
    { 
      name: "Magician", 
      image: "/classes/magician.png", 
      color: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-100 to-purple-50",
      description: "Wielder of magical powers",
      stats: { HP: "Low", MP: "High", Damage: "High" }
    },
    { 
      name: "Archer", 
      image: "/classes/archer.png", 
      color: "from-green-500 to-green-600",
      bgGradient: "from-green-100 to-green-50",
      description: "Long-range precision",
      stats: { HP: "Medium", MP: "Medium", Damage: "Medium" }
    },
    { 
      name: "Thief", 
      image: "/classes/thief.png", 
      color: "from-gray-600 to-gray-700",
      bgGradient: "from-gray-100 to-gray-50",
      description: "Swift and deadly",
      stats: { HP: "Low", MP: "Low", Damage: "Very High" }
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Mouse Trail Effect */}
      {mounted && mouseTrail.map((point) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50 animate-trail-fade"
          style={{
            left: point.x - 10,
            top: point.y - 10,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Image
            src="/leafs/1.png"
            alt=""
            width={20}
            height={20}
            className="opacity-60"
          />
        </div>
      ))}

      {/* Live Server Status Widget */}
      {mounted && (
        <div className="fixed top-24 right-6 z-40 animate-slide-in-right">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="relative">
                {serverStatus.online ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  </>
                ) : (
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                )}
              </div>
              <div className="text-sm">
                <div className="font-semibold flex items-center gap-2">
                  Server {serverStatus.online ? 'Online' : 'Offline'}
                  <Activity className="w-3 h-3 text-gray-500" />
                </div>
                <div className="text-gray-500">
                  {serverStatus.loading ? 'Loading...' : `${serverStatus.players} players`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute animate-float-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`
              }}
            >
              <div className="w-full h-full bg-orange-400/20 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Discord Widget */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <a 
          href="https://discord.gg/XRTeuK9kwm" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl shadow-2xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer hover:from-orange-600 hover:to-orange-500">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              <div>
                <div className="font-bold text-lg">Join Discord</div>
                {discordData.loading ? (
                  <div className="text-sm opacity-80">Loading...</div>
                ) : (
                  <div className="text-sm opacity-80">
                    <span className="text-green-300">●</span> {discordData.online} online • {discordData.members.toLocaleString()} members
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="font-semibold mb-1">MapleKaede Community</div>
          <div className="text-gray-300">Click to join our Discord server for events, updates, and support!</div>
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>

      {/* Enhanced Modern Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left Side - Logo/Brand */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold">
                <span className="text-gray-800">Maple</span>
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-transparent bg-clip-text">Kaede</span>
              </a>
            </div>
            
            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Features', href: '#features' },
                { name: 'Classes', href: '#classes' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'Community', href: '#community' }
              ].map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="px-4 py-2 text-gray-700 hover:text-orange-500 font-medium transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              ))}
            </div>
            
            {/* Right Side - CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/auth" 
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-orange-600 hover:to-orange-500"
              >
                Play Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-2">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Features', href: '#features' },
                { name: 'Classes', href: '#classes' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'Community', href: '#community' }
              ].map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a 
                  href="/auth" 
                  className="block mx-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full text-center font-medium"
                >
                  Play Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Modern */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Image with Blur and Opacity */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/test.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Overlay with adjustable opacity */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Falling Maple Leaves Animation */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {leafData.map((leaf) => (
              <div
                key={leaf.id}
                className="absolute w-full h-full"
              >
                <div
                  className="absolute animate-fall"
                  style={{
                    left: `${leaf.left}%`,
                    animationDelay: `-${leaf.startOffset}s`,
                    animationDuration: `${leaf.duration}s`,
                  }}
                >
                  <div 
                    className="animate-sway"
                    style={{
                      transform: `scale(${leaf.scale})`,
                      animationDuration: `${leaf.swayDuration}s`
                    }}
                  >
                    <Image
                      src={`/leafs/${leaf.leafType}.png`}
                      alt="Maple Leaf"
                      width={60}
                      height={60}
                      className="opacity-70"
                      priority
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gradient Mesh Background - Adjusted to orange tones */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto text-center z-20 relative">
          {/* Logo Image */}
          <div className="mb-12 inline-block">
            <Image 
              src="/assets/MapleKaede.png" 
              alt="MapleKaede" 
              width={300} 
              height={150} 
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          
          <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto font-light drop-shadow-lg">
            Experience the authentic MapleStory v83 classic server with 
            original gameplay, nostalgic features, and an amazing community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-2xl font-medium hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:from-orange-600 hover:to-orange-400">
              <Download className="w-5 h-5" />
              Download Client
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 bg-white/90 backdrop-blur text-orange-600 border-2 border-orange-400 rounded-2xl font-medium hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-300 hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 shadow-xl">
              <MessageCircle className="w-5 h-5" />
              Join Community
            </button>
          </div>

          {/* Live Stats Carousel */}
          <div className="relative h-24 overflow-hidden">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                  currentStat === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-8 py-4 shadow-lg">
                  <stat.icon className="w-6 h-6 text-gray-700" />
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Breaking Boundaries Style */}
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Why Choose MapleKaede
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the authentic classic v83 MapleStory server
            </p>
          </div>
          
          {/* Features with Breaking Boundaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Feature Icon/Image - Breaking out */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                    <feature.icon className="w-12 h-12 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-500 scale-150`} />
                </div>
                
                {/* Card */}
                <div className="relative mt-12 h-full">
                  <div className="relative h-full bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]">
                    {/* Animated Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                    
                    {/* Main Content */}
                    <div className="relative p-6 pt-16 text-center">
                      {/* Title with underline animation */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-6">
                        {feature.description}
                      </p>
                      
                      {/* Stats with count-up animation */}
                      <div className="mt-auto">
                        <div className={`text-3xl font-bold bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}>
                          <span className="inline-block group-hover:animate-count-up">
                            {index === 0 ? '100%' : index === 1 ? '0ms' : index === 2 ? '10+' : '99.9%'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {index === 0 ? 'Classic Experience' : index === 1 ? 'Latency' : index === 2 ? 'Daily Events' : 'Uptime'}
                        </div>
                      </div>
                      
                      {/* Learn more link on hover */}
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <button className={`text-sm font-medium bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text hover:underline`}>
                          Learn More →
                        </button>
                      </div>
                    </div>
                    
                    {/* Hover gradient at bottom */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/5 rounded-full blur-xl group-hover:w-full group-hover:bg-black/10 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Class Showcase */}
      <section id="classes" className="py-32 px-6 bg-gradient-to-b from-white to-orange-50/30 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Choose Your Class</h2>
            <p className="text-xl text-gray-600">Select your path and become a legend</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {classes.map((job, index) => (
              <div 
                key={job.name} 
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  {/* Character Image - Positioned to break out of card */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                    <div className="relative">
                      <Image
                        src={job.image}
                        alt={job.name}
                        width={220}
                        height={260}
                        className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3"
                        style={{
                          filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))'
                        }}
                      />
                      {/* Character glow on hover */}
                      <div className={`absolute inset-0 bg-gradient-radial ${job.color} opacity-0 group-hover:opacity-40 blur-3xl transition-opacity duration-500 scale-150`} />
                    </div>
                  </div>
                  
                  {/* Card Container */}
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02] mt-24">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${job.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Light background gradient for card */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${job.bgGradient} opacity-30`} />
                    
                    <div className="relative px-6 pb-6 pt-32 text-center">
                      {/* Class name */}
                      <h3 className="font-bold text-2xl mb-2 text-gray-900 group-hover:text-white transition-colors relative z-10">
                        {job.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 group-hover:text-white/90 transition-colors mb-4 relative z-10">
                        {job.description}
                      </p>
                      
                      {/* Stats - Initially visible but subtle */}
                      <div className="space-y-2 transition-all duration-500 relative z-10">
                        {Object.entries(job.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm text-gray-500 group-hover:text-white/90 transition-colors">
                            <span>{stat}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Choose button - appears on hover */}
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <button className="w-full px-6 py-3 bg-white/20 backdrop-blur text-white rounded-2xl text-sm font-semibold hover:bg-white/30 transition-all border border-white/30 shadow-lg">
                          Select {job.name}
                        </button>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Floor shadow under card */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/5 rounded-full blur-xl group-hover:w-full group-hover:bg-black/10 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Note about more classes */}
          <div className="text-center mt-16">
            <p className="text-gray-500 text-sm">More advanced classes available after reaching level 30!</p>
          </div>
        </div>
      </section>

      {/* Parallax Gallery Section - Breaking Boundaries Style */}
      <section id="gallery" className="py-32 relative overflow-visible bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">In-Game Screenshots</h2>
            <p className="text-xl text-gray-600">Explore the nostalgic world of MapleKaede</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { id: 1, title: "Henesys Hunting Ground", type: "Popular Map" },
              { id: 2, title: "Zakum Boss Fight", type: "Epic Battle" },
              { id: 3, title: "Kerning City PQ", type: "Party Quest" },
              { id: 4, title: "Free Market", type: "Trading Hub" },
              { id: 5, title: "Orbis Tower", type: "Iconic Location" },
              { id: 6, title: "Guild Event", type: "Community" }
            ].map((item) => (
              <div 
                key={item.id} 
                className="group relative"
                style={{ animationDelay: `${item.id * 100}ms` }}
              >
                {/* Floating badge */}
                <div className="absolute -top-6 right-4 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg transform group-hover:scale-110 transition-all duration-300">
                    {item.type}
                  </div>
                </div>
                
                {/* Main card */}
                <div className="relative">
                  <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl bg-white group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                    {/* Placeholder for screenshots - replace with actual images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500">
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <Gamepad2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">Screenshot {item.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title card - slides up from bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.type}</p>
                    </div>
                    
                    {/* View overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                        <button className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                          <span className="flex items-center gap-2">
                            View Full Size
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Corner decoration */}
                    <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/5 rounded-full blur-xl group-hover:w-full group-hover:bg-black/10 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA with breaking boundary style */}
          <div className="relative mt-20">
            <div className="text-center">
              <div className="inline-block relative">
                {/* Floating icon */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl animate-float">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <button className="mt-8 px-12 py-4 bg-white text-orange-600 rounded-3xl font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
                  <span className="flex items-center gap-3">
                    Explore Full Gallery
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gameplay Showcase - Updated Colors */}
      <section id="gameplay" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Classic v83
                <span className="block bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text leading-relaxed pb-2">
                  Pure Nostalgia
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Relive the golden age of MapleStory with authentic v83 gameplay, 
                original content, and the classic experience you remember and love.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Original Content</h4>
                    <p className="text-gray-600">All classic bosses, maps, and quests exactly as you remember</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Balanced Rates</h4>
                    <p className="text-gray-600">Carefully tuned rates that preserve the original grinding experience</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Active Community</h4>
                    <p className="text-gray-600">Join thousands of players who share your love for classic MapleStory</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Placeholder for game screenshot */}
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gamepad2 className="w-24 h-24 text-white/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-8">
                  <p className="text-white font-medium">Gameplay Screenshot</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Server Info - Breaking Boundaries Style */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Server Information</h2>
            <p className="text-xl text-gray-300">Everything you need to know to get started</p>
          </div>
          
          {/* Rate Cards with Breaking Boundaries */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { rate: "2x", type: "Experience Rate", icon: TrendingUp, color: "from-yellow-400 to-orange-400" },
              { rate: "2x", type: "Meso Rate", icon: Crown, color: "from-green-400 to-emerald-400" },
              { rate: "2x", type: "Drop Rate", icon: Gift, color: "from-orange-400 to-amber-400" }
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Floating Icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                {/* Card */}
                <div className="relative mt-10">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 pt-14 text-center border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]">
                    <div className={`text-5xl font-bold bg-gradient-to-r ${item.color} text-transparent bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {item.rate}
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-colors">{item.type}</p>
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/20 rounded-full blur-xl group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Info Cards with Breaking Style */}
          <div className="relative">
            {/* Main container with floating decorations */}
            <div className="absolute -top-12 left-8 z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full opacity-20 blur-3xl animate-pulse" />
            </div>
            <div className="absolute -top-8 right-12 z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-2000" />
            </div>
            
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 overflow-visible">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="relative">
                  {/* Floating badge */}
                  <div className="absolute -top-14 left-0">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5" />
                      Game Features
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-orange-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="group-hover/item:text-orange-300 transition-colors">Original Party Quest System</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-orange-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="group-hover/item:text-orange-300 transition-colors">Classic Rebirth System</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-orange-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="group-hover/item:text-orange-300 transition-colors">Original Events Schedule</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-orange-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="group-hover/item:text-orange-300 transition-colors">Vote NX Rewards</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Floating badge */}
                  <div className="absolute -top-14 left-0">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Server Specs
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-green-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="group-hover/item:text-green-300 transition-colors">99.9% Uptime Guarantee</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-green-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="group-hover/item:text-green-300 transition-colors">DDoS Protected Infrastructure</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-green-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="group-hover/item:text-green-300 transition-colors">Daily Automated Backups</span>
                      </li>
                      <li className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-green-500/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="group-hover/item:text-green-300 transition-colors">Professional Support Team</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Breaking Boundaries Style */}
      <section id="community" className="py-32 px-6 overflow-visible">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating decorative elements */}
          <div className="relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full opacity-10 blur-3xl animate-pulse" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 relative z-20">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-16 relative z-20">
              Join thousands of players in the authentic MapleStory v83 classic experience.
            </p>
          </div>
          
          {/* CTA Buttons with Breaking Boundaries */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {/* Download Button */}
            <div className="relative group">
              {/* Floating icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-300 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <button className="mt-6 px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-3xl font-medium shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-3 hover:from-orange-600 hover:to-orange-400 relative z-10">
                <span>Download Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Shadow */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-orange-500/20 rounded-full blur-xl group-hover:w-full transition-all duration-500" />
            </div>
            
            {/* Setup Guide Button */}
            <div className="relative group">
              {/* Floating icon */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-12 h-12 bg-white border-2 border-orange-400 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              
              <button className="mt-6 px-12 py-5 bg-white text-orange-600 border-2 border-orange-400 rounded-3xl font-medium shadow-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-300 hover:text-white hover:border-transparent transition-all duration-300 text-lg transform hover:scale-105 relative z-10">
                View Setup Guide
              </button>
              
              {/* Shadow */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/5 rounded-full blur-xl group-hover:w-full group-hover:bg-orange-500/20 transition-all duration-500" />
            </div>
          </div>
          
          {/* Stats with breaking boundaries */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15K+", label: "Active Players", icon: Users },
              { value: "24/7", label: "Support", icon: MessageCircle },
              { value: "99.9%", label: "Uptime", icon: Activity },
              { value: "2025", label: "Established", icon: Crown }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                {/* Floating icon */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                
                <div className="pt-8 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image 
                  src="/assets/MapleKaede.png" 
                  alt="MapleKaede" 
                  width={120} 
                  height={50} 
                  className="object-contain"
                />
              </div>
              <p className="text-gray-400">
                The authentic MapleStory v83 classic experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#classes" className="hover:text-white transition-colors">Classes</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wiki</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 MapleKaede. All rights reserved. | MapleStory is a trademark of Nexon.</p>
          </div>
        </div>
      </footer>

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
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0; }
        }
        @keyframes count-up {
          0% { transform: translateY(10px); opacity: 0; }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fall {
          from {
            transform: translateY(-150px) rotate(0deg);
          }
          to {
            transform: translateY(calc(100vh + 150px)) rotate(720deg);
          }
        }
        @keyframes sway {
          0%, 100% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(-50px);
          }
          75% {
            transform: translateX(50px);
          }
        }
        @keyframes trail-fade {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) rotate(360deg);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-count-up { animation: count-up 0.5s ease-out; }
        .animate-trail-fade { animation: trail-fade 1s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-fall { 
          animation: fall linear infinite;
          opacity: 0.7;
        }
        .animate-sway { 
          animation: sway ease-in-out infinite;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default MapleKaedeLanding;