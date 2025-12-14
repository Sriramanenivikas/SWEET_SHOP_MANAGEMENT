import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Check } from 'lucide-react';

// Local Indian Sweet Images - organized by category
const SWEET_IMAGES = {
  // BARFI Category
  'kaju katli': '/BARFI/Kaju_Barfi.jpg',
  'pista barfi': '/BARFI/PistaBurfi.jpg',
  'badam barfi': '/BARFI/Badam_Barfi.jpg',
  'coconut barfi': '/BARFI/Coconut_Barfi.jpg',
  'chocolate barfi': '/BARFI/Chocolate_arfi.jpg',
  'anjeer barfi': '/BARFI/Anjeer_Barfi.jpg',
  'kalakand': '/BARFI/Kalakand.jpg',
  'milk cake': '/BARFI/Kalakand.jpg',
  
  // LADOO Category
  'motichoor ladoo': '/LADOO/Motichoor_Ladoo.jpg',
  'besan ladoo': '/LADOO/Besan_Ladoo.jpg',
  'boondi ladoo': '/LADOO/Boondi_Ladoo.jpg',
  'rava ladoo': '/LADOO/Rava_Ladoo.jpg',
  'dry fruit ladoo': '/LADOO/Dry_Fruit_Ladoo.jpg',
  
  // HALWA Category
  'gajar halwa': '/HALWA/Gajar_Halwa.jpg',
  'moong dal halwa': '/HALWA/Moong_Dal_Halwa.jpg',
  'badam halwa': '/HALWA/Badam_Halwa.jpg',
  'suji halwa': '/HALWA/Suji_Halwa.jpg',
  
  // TRADITIONAL Category
  'gulab jamun': '/TRADITIONAL/Gulab_Jamun.jpg',
  'rasgulla': '/TRADITIONAL/Rasgulla.jpg',
  'rasmalai': '/TRADITIONAL/Rasmalai.jpg',
  'jalebi': '/TRADITIONAL/Jalebi.jpg',
  'mysore pak': '/TRADITIONAL/Mysore_Pak.jpg',
  'peda': '/TRADITIONAL/Peda.jpg',
  'sandesh': '/TRADITIONAL/Sandesh.jpg',
  'kesar pista roll': '/TRADITIONAL/Kesar_Pista_Roll.jpg',
  'kheer': '/TRADITIONAL/Kheer.jpg',
  
  // NAMKEEN Category
  'bhujia': '/NAMKEEN/Bhujia.jpg',
  'aloo bhujia': '/NAMKEEN/Aloo_Bhujia.jpg',
  'mixture': '/NAMKEEN/Mixture.jpeg',
  'soan papdi': '/NAMKEEN/Soan_Papdi.jpg',
  'chikki': '/NAMKEEN/Chikki.jpg',
};

// Category fallback images
const CATEGORY_IMAGES = {
  'BARFI': '/images/barfi.jpg',
  'LADOO': '/images/ladoo.jpg',
  'HALWA': '/images/halwa.jpg',
  'TRADITIONAL': '/images/traditional.jpg',
  'NAMKEEN': '/images/namkeen.jpg',
};

// Default fallback
const DEFAULT_IMAGE = '/images/premium.jpg';

// Get best matching image
const getProductImage = (name, category) => {
  const nameLower = (name || '').toLowerCase();
  
  // Try exact match
  for (const [key, url] of Object.entries(SWEET_IMAGES)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }
  
  // Try partial match
  const words = nameLower.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      for (const [key, url] of Object.entries(SWEET_IMAGES)) {
        if (key.includes(word) || word.includes(key.split(' ')[0])) {
          return url;
        }
      }
    }
  }
  
  // Category fallback
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
};

const ProductCard = ({ product, onPurchase, isAdmin = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError 
    ? (CATEGORY_IMAGES[product.category] || DEFAULT_IMAGE)
    : (product.imageUrl || getProductImage(product.name, product.category));

  const isOutOfStock = product.quantity === 0;

  const handlePurchase = async () => {
    if (isAdmin || isOutOfStock) return;
    
    setPurchasing(true);
    try {
      await onPurchase(product.id, quantity);
      setPurchased(true);
      setTimeout(() => setPurchased(false), 2000);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
    setPurchasing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Image Container - Anand Sweets Style Pink Background */}
      <div className="relative bg-gradient-to-br from-[#FFF5F8] to-[#FFF0F5] aspect-square flex items-center justify-center overflow-hidden">
        <motion.img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#C5A02F] to-[#D4AF37] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.15em] shadow-lg">
          {product.category}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-5 py-2 bg-red-600 text-white font-bold text-sm rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[17px] font-medium text-[#1A2E35] mb-1 leading-snug line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-[#1A2E35]">₹{product.price}</span>
          {/* Only show stock info when 10 or less items remain */}
          {product.quantity <= 10 && product.quantity > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <Package className="w-4 h-4 text-[#C5A02F]" />
              <span className="font-semibold text-[#C5A02F]">
                Only {product.quantity} left
              </span>
            </div>
          )}
        </div>

        {/* Actions - Only for non-admin users */}
        {!isAdmin && (
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center h-11 border border-[#C5A02F]/40 bg-[#FFFBF2] rounded overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
                className="w-10 h-full text-lg font-bold text-[#1A2E35] hover:text-[#C5A02F] hover:bg-[#C5A02F]/10 transition-colors disabled:opacity-40"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold text-[#1A2E35]">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                disabled={isOutOfStock}
                className="w-10 h-full text-lg font-bold text-[#1A2E35] hover:text-[#C5A02F] hover:bg-[#C5A02F]/10 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
              whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
              whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
              className={`flex-1 h-11 rounded font-bold text-[11px] uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : purchased
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-[#C5A02F] to-[#B8960B] hover:from-[#B8960B] hover:to-[#9A7B00] text-white shadow-md hover:shadow-lg'
              }`}
            >
              {purchased ? (
                <>
                  <Check className="w-4 h-4" />
                  Added!
                </>
              ) : purchasing ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
