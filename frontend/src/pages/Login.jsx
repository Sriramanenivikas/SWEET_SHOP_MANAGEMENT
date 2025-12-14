import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Left side - Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)'
        }}
      >
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-5xl text-yellow-400 font-serif font-bold">S</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Sweet Shop</h1>
          <p className="text-lg opacity-90 mb-2">Premium Mithai Collection</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-amber-300">✦</span>
            <span className="text-sm uppercase tracking-widest opacity-75">Since 2024</span>
            <span className="text-amber-300">✦</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                <span className="text-yellow-400 text-xl font-serif font-bold">S</span>
              </div>
              <span className="text-xl font-serif font-bold text-red-800">Sweet Shop</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg" style={{ border: '2px solid #D4A853' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
                  boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-red-700 hover:text-red-800">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}
