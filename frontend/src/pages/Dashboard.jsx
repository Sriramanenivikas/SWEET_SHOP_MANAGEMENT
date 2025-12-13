import { useState, useEffect, useCallback } from 'react';
import { sweetsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SearchFilter from '../components/SearchFilter';
import SweetCard from '../components/SweetCard';

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  const fetchSweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (Object.keys(searchParams).length > 0) {
        response = await sweetsAPI.search({ ...searchParams, page, size: 12 });
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
  }, [page, searchParams]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Discover Sweets</h1>
          <p className="text-gray-500">Browse our collection of handcrafted sweets and treats.</p>
        </div>

        <div className="mb-8">
          <SearchFilter onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchSweets} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No sweets found.</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} onUpdate={fetchSweets} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
