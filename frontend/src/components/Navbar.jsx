import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center shadow-lg">
              <span className="text-yellow-400 text-2xl font-serif font-bold">S</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-red-800 tracking-wide">
                Sweet Shop
              </h1>
              <p className="text-xs text-amber-600 tracking-widest uppercase">Premium Mithai</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors uppercase tracking-wider"
            >
              Sweets
            </Link>
            <span className="text-amber-400">✦</span>
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors uppercase tracking-wider"
            >
              Categories
            </Link>
            <span className="text-amber-400">✦</span>
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors uppercase tracking-wider"
            >
              Specials
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-semibold text-sm">
                      {user.firstName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(196, 30, 58, 0.3)'
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
    </header>
  );
}
