'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo en Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-4 relative">
            <Image
              src="/MovieRate-logo.png"
              alt="MovieRate Logo"
              width={90}
              height={90}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieRate</h1>
          <p className="text-gray-400">Rate movies, share reviews with friends</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="#" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <span className="text-gray-400">Don&apos;t have an account? </span>
          <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;