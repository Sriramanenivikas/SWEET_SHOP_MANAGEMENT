import { useState } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORY_IMAGES = {
  CHOCOLATE: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop',
  CANDY: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&h=300&fit=crop',
  PASTRY: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=300&h=300&fit=crop',
  COOKIE: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop',
  CAKE: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
  ICE_CREAM: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop',
  OTHER: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop',
};

export default function SweetCard({ sweet, onUpdate }) {
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPurchase, setShowPurchase] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePurchase = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to purchase' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setPurchasing(true);
    try {
      await sweetsAPI.purchase(sweet.id, quantity);
      setMessage({ type: 'success', text: 'Purchase successful!' });
      setShowPurchase(false);
      setQuantity(1);
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Purchase failed'
      });
    } finally {
      setPurchasing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const isOutOfStock = sweet.quantity === 0;
  const imageUrl = sweet.imageUrl || CATEGORY_IMAGES[sweet.category] || CATEGORY_IMAGES.OTHER;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
         style={{
           border: '2px solid #D4A853',
           boxShadow: '0 4px 20px rgba(212, 168, 83, 0.15)'
         }}>
      {/* Inner decorative border */}
      <div className="absolute inset-2 border border-amber-300/50 rounded pointer-events-none z-10"></div>

      {/* Image section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        <img
          src={imageUrl}
          alt={sweet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = CATEGORY_IMAGES[sweet.category] || CATEGORY_IMAGES.OTHER;
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-red-700 text-white rounded shadow-lg">
            {sweet.category.replace('_', ' ')}
          </span>
        </div>
        {/* Stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-red-600 text-white font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {sweet.name}
        </h3>

        {/* Description */}
        {sweet.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
            {sweet.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-red-700">
              ₹{sweet.price.toFixed(0)}
            </span>
            <span className="text-xs text-gray-400 ml-1">inc. GST</span>
          </div>
          {!isOutOfStock && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {sweet.quantity} in stock
            </span>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-3 p-2 rounded text-sm text-center font-medium ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Actions */}
        {showPurchase ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-600 font-bold hover:bg-amber-50 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center text-xl font-bold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-600 font-bold hover:bg-amber-50 transition-colors"
              >
                +
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPurchase(false); setQuantity(1); }}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 py-2 text-sm font-semibold text-white rounded transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
                }}
              >
                {purchasing ? 'Processing...' : `Buy ₹${(sweet.price * quantity).toFixed(0)}`}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPurchase(true)}
            disabled={isOutOfStock}
            className="w-full py-3 text-sm font-bold uppercase tracking-wider rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isOutOfStock
                ? '#E5E5E5'
                : 'linear-gradient(135deg, #D4A853 0%, #C49A3D 100%)',
              color: isOutOfStock ? '#999' : 'white',
              boxShadow: isOutOfStock ? 'none' : '0 2px 8px rgba(212, 168, 83, 0.4)'
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>

      {/* Bottom decorative corner flourishes */}
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-400 rounded-br-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-400 rounded-bl-lg"></div>
    </div>
  );
}
