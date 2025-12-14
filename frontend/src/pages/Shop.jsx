import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Package, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['ALL', 'BARFI', 'LADOO', 'HALWA', 'TRADITIONAL', 'NAMKEEN'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 10000 },
  { label: 'Under ₹300', min: 0, max: 300 },
  { label: '₹300 - ₹500', min: 300, max: 500 },
  { label: '₹500 - ₹800', min: 500, max: 800 },
  { label: 'Above ₹800', min: 800, max: 10000 },
];

// Gold Paisley/Flower SVG decoration - Anand Sweets Style
const GoldFlowerSVG = ({ className = "" }) => (
  <img 
    src="https://www.anandsweets.in/cdn/shop/files/pick_flower.svg?v=1709636209" 
    alt="" 
    className={`w-10 h-10 ${className}`}
    onError={(e) => { e.target.style.display = 'none'; }}
  />
);

// Gold Swirl decoration - Custom SVG
const GoldSwirlSVG = ({ className = "" }) => (
  <svg className={className} width="200" height="30" viewBox="0 0 200 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="swirlGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C5A02F" stopOpacity="0.3"/>
        <stop offset="50%" stopColor="#D4AF37"/>
        <stop offset="100%" stopColor="#C5A02F" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    <path d="M0 15 Q25 5 50 15 T100 15 T150 15 T200 15" stroke="url(#swirlGold)" strokeWidth="2" fill="none"/>
    <path d="M0 15 Q25 25 50 15 T100 15 T150 15 T200 15" stroke="url(#swirlGold)" strokeWidth="2" fill="none"/>
    <circle cx="100" cy="15" r="4" fill="#D4AF37"/>
    <circle cx="50" cy="15" r="2" fill="#D4AF37" opacity="0.6"/>
    <circle cx="150" cy="15" r="2" fill="#D4AF37" opacity="0.6"/>
  </svg>
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sweetsAPI.getAll(0, 100);
      let filtered = response.data.content || [];
      
      // Apply filters
      if (selectedCategory !== 'ALL') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
        );
      }
      if (selectedPriceRange.min > 0 || selectedPriceRange.max < 10000) {
        filtered = filtered.filter(p => 
          p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
        );
      }
      
      setProducts(filtered);
      setTotalProducts(filtered.length);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalProducts(0);
    }
    setLoading(false);
  }, [searchTerm, selectedCategory, selectedPriceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    if (category === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (range) => {
    setSelectedPriceRange(range);
    setShowPriceDropdown(false);
  };

  const handlePurchase = async (productId, quantity) => {
    try {
      await sweetsAPI.purchase(productId, quantity);
      fetchProducts();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'ALL' || searchTerm || selectedPriceRange.label !== 'All Prices';

  return (
    <div className="min-h-screen bg-[#FFFBF2]">
      <Navbar />

      {/* Page Header - Anand Sweets Style */}
      <header className="relative py-16 text-center bg-[#FFFBF2] overflow-hidden">
        {/* Breadcrumb */}
        <nav className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          <Link to="/" className="hover:text-[#C5A02F] transition-colors">Home</Link>
          <span className="mx-3">›</span>
          {selectedCategory !== 'ALL' ? (
            <>
              <Link to="/shop" className="hover:text-[#C5A02F] transition-colors">Shop</Link>
              <span className="mx-3">›</span>
              <span className="text-[#1A2E35]">{selectedCategory}</span>
            </>
          ) : (
            <span className="text-[#1A2E35]">All Sweets</span>
          )}
        </nav>

        {/* Title with Gold Decorations */}
        <div className="flex items-center justify-center gap-6 mb-3">
          <GoldFlowerSVG className="hidden sm:block" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2E35] tracking-tight">
            {selectedCategory === 'ALL' ? 'Our Sweets' : selectedCategory}
          </h1>
          <GoldFlowerSVG className="hidden sm:block" />
        </div>

        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
        </p>

        {/* Gold Swirl Decoration */}
        <div className="flex justify-center mt-6">
          <GoldSwirlSVG />
        </div>
      </header>

      {/* Filters Bar */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Filter & Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[#C5A02F]/30 bg-white focus:border-[#C5A02F] focus:ring-2 focus:ring-[#C5A02F]/20 outline-none transition-all text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowPriceDropdown(false);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#C5A02F]/30 bg-white hover:border-[#C5A02F] transition-colors text-sm font-bold uppercase tracking-wide"
              >
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#C5A02F]/20 overflow-hidden z-50"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#C5A02F]/10 transition-colors ${
                          selectedCategory === cat ? 'text-[#C5A02F] bg-[#C5A02F]/5 font-bold' : 'text-[#1A2E35]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#C5A02F]/30 bg-white hover:border-[#C5A02F] transition-colors text-sm font-bold"
              >
                {selectedPriceRange.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showPriceDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#C5A02F]/20 overflow-hidden z-50"
                  >
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => handlePriceChange(range)}
                        className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#C5A02F]/10 transition-colors ${
                          selectedPriceRange.label === range.label ? 'text-[#C5A02F] bg-[#C5A02F]/5 font-bold' : 'text-[#1A2E35]'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Right: Sort (static for now) */}
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 cursor-pointer hover:text-[#C5A02F] transition-colors">
            Featured
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-[1400px] mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product} 
                  onPurchase={handlePurchase}
                  isAdmin={isAdmin}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#C5A02F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-[#C5A02F]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A2E35] mb-3">No sweets found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters or search term</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-[#C5A02F] to-[#B8960B] text-white font-bold rounded-full hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
