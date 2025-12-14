import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoldDiya } from '../components/GoldSVGs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      
      // CRITICAL: Role-based redirect
      if (userData.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  // Demo login handlers
  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    
    const credentials = role === 'admin' 
      ? { email: 'admin@sweetshop.com', password: 'Admin@123' }
      : { email: 'user@sweetshop.com', password: 'Admin@123' };
    
    setEmail(credentials.email);
    setPassword(credentials.password);

    try {
      const userData = await login(credentials.email, credentials.password);
      
      if (userData.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-navy relative overflow-hidden items-center justify-center">
        {/* Gold accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center px-12">
          <GoldDiya size={80} className="mx-auto mb-8" />
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Sign in to explore our premium collection of authentic Indian sweets
          </p>
          
          {/* Trust badges */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold">39+</div>
              <div className="text-sm text-gray-400">Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold">50K+</div>
              <div className="text-sm text-gray-400">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold">100+</div>
              <div className="text-sm text-gray-400">Varieties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center mb-8 group">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/favicon.png"
                alt="Mithai Logo"
                className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
              />
              <h1 className="text-3xl font-serif font-bold text-brand-gold tracking-[0.2em]">
                MITHAI
              </h1>
            </div>
            <p className="text-xs tracking-[0.3em] text-gray-500">SWEETS & SAVOURIES</p>
          </Link>

          {/* Demo Login Buttons */}
          <div className="mb-8">
            <p className="text-center text-sm text-gray-500 mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-red to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin Demo
              </motion.button>
              <motion.button
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-gold to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <User className="w-5 h-5" />
                User Demo
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-brand-cream text-sm text-gray-500">or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-xl shadow-lg shadow-brand-gold/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-gold font-bold hover:text-brand-gold-dark">
              Create Account
            </Link>
          </p>

          {/* Back to Home */}
          <Link
            to="/"
            className="block text-center mt-4 text-sm text-gray-500 hover:text-brand-gold"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
