import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Plus, Edit2, Trash2, RefreshCw,
  TrendingUp, AlertTriangle, X, Save, Search, LogOut, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI } from '../services/api';

const CATEGORIES = ['BARFI', 'LADOO', 'HALWA', 'TRADITIONAL', 'NAMKEEN'];
const CHART_COLORS = ['#C5A02F', '#8B1D24', '#1A2E35', '#D4AF37', '#B8860B', '#DAA520', '#FFD700'];

const Admin = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'BARFI',
    price: '',
    quantity: '',
    description: '',
    imageUrl: '',
  });
  const [restockQuantity, setRestockQuantity] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop', { replace: true });
    }
  }, [isAdmin, navigate]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sweetsAPI.getAll(0, 100);
      setProducts(response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Analytics calculations
  const analytics = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    lowStock: products.filter(p => p.quantity < 50).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    categoryData: CATEGORIES.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length,
      value: products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price * p.quantity), 0),
    })),
  };

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await sweetsAPI.create({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Failed to add product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await sweetsAPI.update(selectedProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Failed to update product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await sweetsAPI.delete(product.id);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      const qty = parseInt(restockQuantity);
      if (isNaN(qty) || qty < 1) {
        alert('Please enter a valid quantity (minimum 1)');
        return;
      }
      await sweetsAPI.restock(selectedProduct.id, qty);
      setShowRestockModal(false);
      setRestockQuantity('');
      fetchProducts();
    } catch (error) {
      console.error('Restock error:', error);
      const message = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'An unexpected error occurred. Please try again later.';
      alert('Failed to restock: ' + message);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    });
    setShowEditModal(true);
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setShowRestockModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'BARFI',
      price: '',
      quantity: '',
      description: '',
      imageUrl: '',
    });
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-brand-navy text-white z-50">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/favicon.png"
              alt="Mithai Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-serif font-bold text-brand-gold tracking-[0.2em]">
              MITHAI
            </h1>
          </div>
          <p className="text-xs tracking-[0.2em] text-gray-400 mt-1">ADMIN PANEL</p>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-brand-gold text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'inventory' 
                ? 'bg-brand-gold text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Package className="w-5 h-5" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'analytics' 
                ? 'bg-brand-gold text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center font-bold">
              {user?.firstName?.[0]}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-brand-gold" />
                  </div>
                  <span className="text-sm text-green-500 font-medium">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-brand-navy">{analytics.totalProducts}</h3>
                <p className="text-gray-500 text-sm">Total Products</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-brand-navy">₹{analytics.totalValue.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm">Inventory Value</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  {analytics.lowStock > 0 && (
                    <span className="text-sm text-orange-500 font-medium">Attention</span>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-brand-navy">{analytics.lowStock}</h3>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-red-500" />
                  </div>
                  {analytics.outOfStock > 0 && (
                    <span className="text-sm text-red-500 font-medium">Critical</span>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-brand-navy">{analytics.outOfStock}</h3>
                <p className="text-gray-500 text-sm">Out of Stock</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-brand-navy mb-6">Products by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#C5A02F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-brand-navy mb-6">Inventory Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryData.filter(d => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {analytics.categoryData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-brand-navy">Inventory</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-xl shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
              />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <div className="animate-pulse h-8 bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-brand-navy">{product.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-bold bg-brand-gold/10 text-brand-gold rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${
                            product.quantity === 0 ? 'text-red-500' :
                            product.quantity < 50 ? 'text-orange-500' : 'text-green-500'
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openRestockModal(product)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Restock"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Analytics</h2>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Category Value Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-brand-navy mb-6">Category-wise Inventory Value</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Bar dataKey="value" fill="#C5A02F" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-brand-navy mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Low Stock Alerts
                </h3>
                <div className="grid gap-4">
                  {products.filter(p => p.quantity < 50).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
                  ) : (
                    products.filter(p => p.quantity < 50).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                        <div>
                          <p className="font-medium text-brand-navy">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-bold ${product.quantity === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                            {product.quantity} left
                          </span>
                          <button
                            onClick={() => openRestockModal(product)}
                            className="px-4 py-2 bg-brand-gold text-white font-bold rounded-lg hover:bg-brand-gold-dark transition-colors"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-navy">Add Product</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none resize-none"
                    placeholder="Product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    placeholder="/BARFI/Kaju_Barfi.jpg or https://example.com/image.jpg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Add Product
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-navy">Edit Product</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    placeholder="/BARFI/Kaju_Barfi.jpg or https://example.com/image.jpg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restock Modal */}
      <AnimatePresence>
        {showRestockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRestockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-navy">Restock Product</h3>
                <button onClick={() => setShowRestockModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                <strong>{selectedProduct?.name}</strong><br />
                Current stock: <span className="font-bold text-brand-navy">{selectedProduct?.quantity}</span>
              </p>

              <form onSubmit={handleRestock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Quantity</label>
                  <input
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold outline-none"
                    placeholder="Enter quantity to add"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Restock
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
