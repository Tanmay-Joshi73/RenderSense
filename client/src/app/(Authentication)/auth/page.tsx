'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Activity, Mail, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { log } from 'console';
 const baseURL = 'http://localhost:5000/users';
const AuthPages = () => {
  const route=useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('before doing any form input',baseURL);
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('on the way to the submission',baseURL);
    
    e.preventDefault();
    setLoading(true);
    setError(null);

   
    console.log(baseURL);
    

const endpoint = isLogin ? `${baseURL}/login` : `${baseURL}/create`;

const payload = isLogin
  ? { Email: formData.email, Password: formData.password }
  : { Name: formData.username, Email: formData.email, Password: formData.password };
try {
  const response = await axios.post(endpoint, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
 
  

  console.log('✅ Success:', response.data);

  if (isLogin) {
    alert(`Welcome back, ${response.data.Name || response.data.Email}!`);
    route.push('/Dash')
  } else {
    alert('Account created successfully!');
    setIsLogin(true);
    route.push('/Dash')
  }
} catch (err: any) {
  console.error('❌ Error:', err);
  setError(err.response?.data?.message || 'Something went wrong');
} finally {
  setLoading(false);
}

  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-6 py-12">
      {/* Background decorations */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
      />

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="w-8 h-8 text-cyan-400" />
            <span className="font-bold text-2xl">Render Uptime Automator</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400">
            {isLogin
              ? 'Sign in to access your monitoring dashboard'
              : 'Join us to start monitoring your services'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-8 shadow-2xl"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Username (only for signup) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition text-white placeholder-slate-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button className="text-slate-400 hover:text-cyan-400 transition inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span onClick={function (){
                route.push('/')
            }}>Back to Home </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPages;
