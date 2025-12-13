import { useState, useEffect, useCallback } from 'react';
import { sweetsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { value: 'CHOCOLATE', label: 'Chocolate' },
  { value: 'CANDY', label: 'Candy' },
  { value: 'PASTRY', label: 'Pastry' },
  { value: 'COOKIE', label: 'Cookie' },
  { value: 'CAKE', label: 'Cake' },
  { value: 'ICE_CREAM', label: 'Ice Cream' },
  { value: 'OTHER', label: 'Other' },
];

const emptyForm = { name: '', category: 'CHOCOLATE', price: '', quantity: '', description: '', imageUrl: '' };

export default function Admin() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [restockData, setRestockData] = useState({ id: null, quantity: '' });

  const fetchSweets = useCallback(async () => {
    try {
      const response = await sweetsAPI.getAll(0, 100);
      setSweets(response.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSweets(); }, [fetchSweets]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const openAddModal = () => { setEditingSweet(null); setFormData(emptyForm); setShowModal(true); };

  const openEditModal = (sweet) => {
    setEditingSweet(sweet);
    setFormData({ name: sweet.name, category: sweet.category, price: sweet.price.toString(), quantity: sweet.quantity.toString(), description: sweet.description || '', imageUrl: sweet.imageUrl || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity, 10) };
    try {
      if (editingSweet) {
        await sweetsAPI.update(editingSweet.id, data);
        showMessage('success', 'Sweet updated successfully');
      } else {
        await sweetsAPI.create(data);
        showMessage('success', 'Sweet created successfully');
      }
      setShowModal(false);
      fetchSweets();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    try {
      await sweetsAPI.delete(id);
      showMessage('success', 'Sweet deleted successfully');
      fetchSweets();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async (id) => {
    if (!restockData.quantity || restockData.id !== id) return;
    try {
      await sweetsAPI.restock(id, parseInt(restockData.quantity, 10));
      showMessage('success', 'Stock updated successfully');
      setRestockData({ id: null, quantity: '' });
      fetchSweets();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Restock failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your sweet shop inventory</p>
          </div>
          <button onClick={openAddModal} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">Add Sweet</button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{message.text}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Restock</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sweets.map((sweet) => (
                  <tr key={sweet.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{sweet.name}</div>
                      {sweet.description && <div className="text-sm text-gray-500 truncate max-w-xs">{sweet.description}</div>}
                    </td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{sweet.category.replace('_', ' ')}</span></td>
                    <td className="px-6 py-4 font-medium text-gray-900">${sweet.price.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`font-medium ${sweet.quantity === 0 ? 'text-red-500' : sweet.quantity < 10 ? 'text-amber-500' : 'text-gray-900'}`}>{sweet.quantity}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input type="number" min="1" placeholder="Qty" value={restockData.id === sweet.id ? restockData.quantity : ''} onChange={(e) => setRestockData({ id: sweet.id, quantity: e.target.value })} className="w-20 px-3 py-1.5 text-sm bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        <button onClick={() => handleRestock(sweet.id)} disabled={restockData.id !== sweet.id || !restockData.quantity} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Add</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(sweet)} className="text-sm font-medium text-gray-600 hover:text-gray-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(sweet.id)} className="text-sm font-medium text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
                    {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Stock</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL (optional)</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : editingSweet ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
