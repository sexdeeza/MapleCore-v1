'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail, Sparkles, Check, ArrowRight, Star, Calendar } from 'lucide-react';
import { authAPI } from '@/services/api';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    remember: false
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    agreeTerms: false
  });

  const passwordRequirements = [
    { text: 'At least 6 characters', met: registerData.password.length >= 6 },
    { text: 'Contains uppercase', met: /[A-Z]/.test(registerData.password) },
    { text: 'Contains lowercase', met: /[a-z]/.test(registerData.password) },
    { text: 'Contains number', met: /[0-9]/.test(registerData.password) }
  ];

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the API service
      const response = await authAPI.login(loginData.username, loginData.password);

      if (response.ok) {
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify({
          ...response.data.user,
          isLoggedIn: true
        }));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.birthday) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerData.username.length > 13) {
      setError('Username must be 13 characters or less');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!registerData.agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the API service
      const response = await authAPI.register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        birthday: registerData.birthday,
      });

      if (response.ok) {
        // Auto-login after successful registration
        setTimeout(() => {
          setLoginData({
            username: registerData.username,
            password: registerData.password,
            remember: false
          });
          setIsRegister(false);
          handleLogin();
        }, 1000);
      } else {
        setError(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/test.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-orange-500/60 to-amber-600/80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo */}
          <Image 
            src="/assets/MapleKaede.png" 
            alt="MapleKaede" 
            width={300} 
            height={150} 
            className="mb-8 drop-shadow-2xl"
          />
          
          {/* Welcome Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
            {isRegister ? 'Join Our Adventure' : 'Welcome Back'}
          </h1>
          <p className="text-xl text-white/90 text-center max-w-md drop-shadow-lg">
            {isRegister 
              ? 'Create your account and begin your journey in the world of MapleStory'
              : 'Log in to continue your epic adventure with thousands of players worldwide'
            }
          </p>

          {/* Stats */}
          <div className="mt-12 flex gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">2,847+</div>
              <div className="text-sm opacity-90">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-20 text-white/20 animate-float">
            <Sparkles className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-20 text-white/20 animate-float animation-delay-2000">
            <Star className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 relative bg-gray-50">
        {/* Back button */}
        <a 
          href="/" 
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </a>

        {/* Mobile Logo (only visible on mobile) */}
        <div className="lg:hidden absolute top-8 right-8 z-20">
          <Image 
            src="/assets/MapleKaede.png" 
            alt="MapleKaede" 
            width={120} 
            height={60} 
            className="object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="min-h-screen flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Tab Switcher */}
            <div className="flex mb-8 bg-white rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  !isRegister 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  isRegister 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Forms Container with Animation */}
            <div className="relative overflow-hidden">
              <div 
                className={`transition-all duration-500 ${
                  isRegister ? '-translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100'
                }`}
              >
                {/* Login Form */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 mb-8">Please enter your details to login</p>

                  <div className="space-y-6">
                    {/* Username field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={loginData.username}
                          onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Enter your username"
                          maxLength={13}
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me and forgot password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={loginData.remember}
                          onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-0" 
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium">
                        Forgot password?
                      </a>
                    </div>

                    {/* Login button */}
                    <button
                      onClick={handleLogin}
                      disabled={isLoading || !loginData.username || !loginData.password}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-500 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login to Play
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div 
                className={`transition-all duration-500 ${
                  !isRegister ? 'translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100'
                }`}
              >
                {/* Register Form */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                  <p className="text-gray-600 mb-6">Join thousands of players today</p>

                  <div className="space-y-5">
                    {/* Username field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Choose a username (max 13 chars)"
                          maxLength={13}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {registerData.username.length}/13 characters
                        </div>
                      </div>
                    </div>

                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Birthday field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={registerData.birthday}
                          onChange={(e) => setRegisterData({...registerData, birthday: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password requirements inline */}
                      {registerData.password && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>{req.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Passwords do not match
                        </p>
                      )}
                    </div>

                    {/* Terms checkbox */}
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={registerData.agreeTerms}
                        onChange={(e) => setRegisterData({...registerData, agreeTerms: e.target.checked})}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-0 mt-0.5" 
                      />
                      <label className="text-sm text-gray-600 leading-relaxed">
                        I agree to the <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Terms of Service</a> and <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Privacy Policy</a>
                      </label>
                    </div>

                    {/* Register button */}
                    <button
                      onClick={handleRegister}
                      disabled={isLoading || !registerData.agreeTerms || registerData.password !== registerData.confirmPassword || !registerData.username || !registerData.email || !registerData.password || !registerData.birthday}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-500 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AuthPage;