import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {

    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/favicon.png"
              alt="Mithai Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-serif font-bold text-brand-gold tracking-[0.2em]">
                MITHAI
              </span>
              <span className="text-[9px] text-brand-navy tracking-[0.3em] font-semibold group-hover:text-brand-gold transition-colors">
                SWEETS & SAVOURIES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold uppercase tracking-wide text-brand-navy hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/5 transition-all"
                >
                  <User className="w-5 h-5 text-brand-gold" />
                  <span className="hidden sm:block text-sm font-medium text-brand-navy">
                    {user?.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-brand-gold/20 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-brand-navy">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                          isAdmin ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-gold/10 text-brand-gold'
                        }`}>
                          {user?.role}
                        </span>
                      </div>
                      
                      <div className="py-2">
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-navy hover:bg-brand-gold/5 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/shop"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-navy hover:bg-brand-gold/5 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Browse Sweets
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-gold hover:bg-brand-gold-dark rounded-full transition-all shadow-lg shadow-brand-gold/20"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-navy hover:text-brand-gold"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-brand-gold/20"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-gold/10 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
