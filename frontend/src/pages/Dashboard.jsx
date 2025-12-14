import { useState, useEffect, useCallback } from 'react';
import { sweetsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SearchFilter from '../components/SearchFilter';
import SweetCard from '../components/SweetCard';

const CATEGORIES = [
  { value: '', label: 'All Sweets', icon: '✦' },
  { value: 'CHOCOLATE', label: 'Chocolate', icon: '🍫' },
  { value: 'CANDY', label: 'Candy', icon: '🍬' },
  { value: 'PASTRY', label: 'Pastry', icon: '🥐' },
  { value: 'COOKIE', label: 'Cookie', icon: '🍪' },
  { value: 'CAKE', label: 'Cake', icon: '🎂' },
  { value: 'ICE_CREAM', label: 'Ice Cream', icon: '🍨' },
  { value: 'OTHER', label: 'Other', icon: '🍭' },
];

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchSweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const params = { ...searchParams };
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (Object.keys(params).length > 0) {
        response = await sweetsAPI.search({ ...params, page, size: 12 });
      } else {
        response = await sweetsAPI.getAll(page, 12);
      }
      setSweets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchParams, selectedCategory]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(0);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F3' }}>
      <Navbar />

      {/* Hero Banner */}
      <div
        className="relative py-12 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #D4A853 0%, #C49A3D 50%, #D4A853 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] mb-2 opacity-90">Premium Collection</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            ✦ MITHAI ✦
          </h1>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            Experience the nostalgia and rich flavors of traditional Indian sweets
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div
              className="bg-white rounded-lg p-6 sticky top-24"
              style={{
                border: '1px solid #E8E0D5',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              <h3 className="font-serif text-lg font-bold text-red-800 border-b border-amber-200 pb-3 mb-4">
                Categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded transition-all text-sm ${
                        selectedCategory === cat.value
                          ? 'bg-red-700 text-white font-semibold'
                          : 'text-gray-600 hover:bg-amber-50 hover:text-red-700'
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Range Quick Filters */}
              <h4 className="font-serif text-sm font-bold text-red-800 border-b border-amber-200 pb-2 mt-6 mb-3">
                Price Range
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Under ₹500', min: 0, max: 500 },
                  { label: '₹500 - ₹1000', min: 500, max: 1000 },
                  { label: 'Above ₹1000', min: 1000, max: '' },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handleSearch({ minPrice: range.min, maxPrice: range.max || undefined })}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-red-700 rounded transition-all border-b border-dashed border-gray-100"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchFilter onSearch={handleSearch} />
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-red-800">
                {selectedCategory
                  ? CATEGORIES.find(c => c.value === selectedCategory)?.label
                  : 'All Premium Sweets'}
              </h2>
              <span className="text-sm text-gray-500">
                {sweets.length} items
              </span>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading delicious sweets...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-lg border border-red-200">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchSweets}
                  className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : sweets.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-amber-200">
                <p className="text-xl text-gray-500 mb-2">No sweets found</p>
                <p className="text-sm text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sweets.map((sweet) => (
                    <SweetCard key={sweet.id} sweet={sweet} onUpdate={fetchSweets} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-5 py-2 text-sm font-semibold border-2 border-amber-400 text-amber-700 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className="px-5 py-2 text-sm font-semibold border-2 border-amber-400 text-amber-700 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Footer Category Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
        {[
          { name: 'PREMIUM', color: '#C41E3A' },
          { name: 'MITHAI', color: '#D4A853' },
          { name: 'BAKERY', color: '#8B4513' },
          { name: 'SPECIALS', color: '#E91E63' },
        ].map((tile) => (
          <div
            key={tile.name}
            className="h-32 flex items-center justify-center cursor-pointer transition-all hover:opacity-90"
            style={{ backgroundColor: tile.color }}
          >
            <h3 className="text-white font-serif text-xl font-bold tracking-wider">
              {tile.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
