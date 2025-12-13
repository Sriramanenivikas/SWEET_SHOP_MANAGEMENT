import { useState } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = {
  CHOCOLATE: 'bg-amber-50 text-amber-700',
  CANDY: 'bg-pink-50 text-pink-700',
  PASTRY: 'bg-orange-50 text-orange-700',
  COOKIE: 'bg-yellow-50 text-yellow-700',
  CAKE: 'bg-rose-50 text-rose-700',
  ICE_CREAM: 'bg-sky-50 text-sky-700',
  OTHER: 'bg-gray-50 text-gray-700',
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
  const categoryColor = CATEGORY_COLORS[sweet.category] || CATEGORY_COLORS.OTHER;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl opacity-30">
            {sweet.category === 'CHOCOLATE' ? '🍫' :
             sweet.category === 'CANDY' ? '🍬' :
             sweet.category === 'PASTRY' ? '🥐' :
             sweet.category === 'COOKIE' ? '🍪' :
             sweet.category === 'CAKE' ? '🎂' :
             sweet.category === 'ICE_CREAM' ? '🍨' : '🍭'}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{sweet.name}</h3>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
            {sweet.category.replace('_', ' ')}
          </span>
        </div>

        {sweet.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{sweet.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-semibold text-gray-900">${sweet.price.toFixed(2)}</span>
          <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
            {isOutOfStock ? 'Out of stock' : `${sweet.quantity} in stock`}
          </span>
        </div>

        {message && (
          <div className={`mb-3 p-2 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {showPurchase ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">-</button>
              <span className="px-3 py-2 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">+</button>
            </div>
            <button onClick={handlePurchase} disabled={purchasing} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
              {purchasing ? 'Processing...' : `Buy $${(sweet.price * quantity).toFixed(2)}`}
            </button>
            <button onClick={() => { setShowPurchase(false); setQuantity(1); }} className="p-2.5 text-gray-400 hover:text-gray-600">✕</button>
          </div>
        ) : (
          <button onClick={() => setShowPurchase(true)} disabled={isOutOfStock} className={`w-full py-3 text-sm font-medium rounded-xl transition-colors ${
            isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </button>
        )}
      </div>
    </div>
  );
}
