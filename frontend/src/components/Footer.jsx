import React from 'react';
import { Link } from 'react-router-dom';
import { GoldFrame, GoldFlower, Sparkle } from './GoldSVGs';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white relative overflow-hidden">
      {/* Gold Border */}
      <div className="h-1 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold" />
      
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 opacity-10">
        <GoldFlower size={60} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-10">
        <GoldFlower size={50} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkle size={16} className="opacity-60" />
              <h3 className="text-3xl font-serif font-bold text-brand-gold tracking-[0.2em]">
                MITHAI
              </h3>
              <Sparkle size={16} className="opacity-60" />
            </div>
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-6">SWEETS & SAVOURIES</p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Crafting authentic Indian sweets with love since 1985. Our recipes have been 
              passed down through generations, ensuring every bite takes you back to the 
              golden era of traditional confectionery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-brand-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-brand-gold transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-gray-300 hover:text-brand-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-brand-gold transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-brand-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-12">
          <GoldFrame className="w-full h-4" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2024 Mithai Sweets & Savouries. All rights reserved.</p>
          <p className="text-xs flex items-center gap-2">
            Made with <span className="text-brand-gold">♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
