import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ email: formData.email, password: formData.password, firstName: formData.firstName, lastName: formData.lastName });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Left side - Form */}
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
              <h2 className="text-2xl font-serif font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-1">Join our sweet family</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Confirm password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50 mt-2"
                style={{
                  background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
                  boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-red-700 hover:text-red-800">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #D4A853 0%, #C49A3D 100%)'
        }}
      >
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-5xl">🍬</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Join Our Family</h2>
          <p className="text-lg opacity-90 mb-6 max-w-sm">
            Get access to exclusive deals, new arrivals, and special festive collections
          </p>
          <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
            {['Premium quality sweets', 'Fast delivery', 'Exclusive member offers'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
