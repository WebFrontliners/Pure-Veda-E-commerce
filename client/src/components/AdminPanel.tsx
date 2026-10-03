import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  Lock,
  Layers,
  Check,
  TrendingUp,
  Clock,
  Truck
} from 'lucide-react';
import {
  fetchAdminStats,
  fetchAdminOrders,
  updateOrderStatusApi,
  createAdminProductApi,
  updateAdminProductApi,
  deleteAdminProductApi,
  AdminStats
} from '../services/api';
import { Product, Category, Order } from '../types';

interface AdminPanelProps {
  categories: Category[];
  onClose: () => void;
  onRefreshCatalog: () => void;
  products: Product[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  categories,
  onClose,
  onRefreshCatalog,
  products,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pv_admin_auth') === 'true';
  });
  const [pinCode, setPinCode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'overview'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    description: '',
    price: 34.00,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
  });

  // Edit stock inline
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [stockInputVal, setStockInputVal] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === 'admin123' || pinCode === 'admin' || pinCode === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('pv_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. Hint: default passcode is "admin123"');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    localStorage.setItem('pv_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pv_admin_auth');
  };

  const handleStatusChange = async (orderId: number, newStatus: 'pending' | 'paid' | 'shipped') => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      loadData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleSaveStock = async (productId: number) => {
    try {
      await updateAdminProductApi(productId, { stock: stockInputVal });
      setEditingStockId(null);
      onRefreshCatalog();
      loadData();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      try {
        await deleteAdminProductApi(productId);
        onRefreshCatalog();
        loadData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminProductApi(newProduct);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category_id: categories[0]?.id || 1,
        description: '',
        price: 34.00,
        stock: 20,
        image_url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
        rating: 4.85,
      });
      onRefreshCatalog();
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create formulation');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Authentication Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-veda-800 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-veda-800">
              Apothecary Management
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Pure Veda Admin Portal
            </h2>
            <p className="text-xs text-stone-500">
              Restricted to authorized dispensary store managers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter Admin Passcode (e.g. admin123)"
                className="w-full text-center tracking-widest text-sm bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-veda-600 font-mono"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-600 font-medium mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-veda-800 hover:bg-veda-900 text-white font-medium text-sm transition-all shadow-md"
            >
              Verify & Enter Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="text-xs text-veda-700 hover:text-veda-900 font-bold underline"
            >
              Instant Demo Unlock (1-Click)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-100 flex flex-col overflow-hidden">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-veda-700 text-emerald-200 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold text-stone-100">
                Pure Veda Operations & Admin
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-veda-800 text-emerald-300 border border-veda-700">
                Staff Portal
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Live inventory management, customer order dispatch, and financial overview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-veda-700 hover:bg-veda-600 text-white text-xs font-semibold shadow-sm transition-all"
            id="admin-exit-storefront-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs text-stone-400 hover:text-rose-400 font-medium ml-1"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col overflow-y-auto max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Revenue</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                ${stats ? stats.totalRevenue.toFixed(2) : '0.00'}
              </h3>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Real-time settled
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                {stats ? stats.totalOrders : orders.length}
              </h3>
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" /> {stats?.paidOrders || 0} Ready to Ship
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Active Formulations</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                {products.length}
              </h3>
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-1">
                Across {categories.length} categories
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-veda-50 text-veda-800 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Low Stock Alert</span>
              <h3 className="font-serif text-2xl font-bold text-amber-600 mt-1">
                {stats ? stats.lowStockCount : 0}
              </h3>
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                ≤ 12 units remaining
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-veda-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              📊 Overview & Activity
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-veda-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>📦 Orders</span>
              <span className="px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-mono">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-veda-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>🌿 Formulations & Inventory</span>
              <span className="px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-mono">
                {products.length}
              </span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-veda-800 hover:bg-veda-900 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Formulation</span>
            </button>
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Orders List */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-base text-stone-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-veda-800 hover:underline font-semibold"
                >
                  View All
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No orders placed yet. Add an item from the storefront to test!
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">Order #{order.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {order.customer_name} • {order.items?.length || 1} items
                        </p>
                      </div>
                      <span className="font-serif font-bold text-sm text-stone-900">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-base text-stone-900">Inventory Status & Alerts</h3>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs text-veda-800 hover:underline font-semibold"
                >
                  Manage Stock
                </button>
              </div>

              <div className="space-y-3">
                {products
                  .filter((p) => p.stock <= 15)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-amber-200"
                        />
                        <div>
                          <p className="font-serif font-bold text-xs text-stone-900 line-clamp-1">
                            {p.name}
                          </p>
                          <span className="text-[11px] font-bold text-amber-700">
                            Only {p.stock} units left in stock!
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-xs text-stone-800">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                {products.filter((p) => p.stock <= 15).length === 0 && (
                  <p className="text-xs text-emerald-700 text-center py-6 font-medium">
                    All formulations have healthy inventory levels! ✨
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Manage shipments, view buyer details, and update dispatch status.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-xs">
                No orders have been received yet. Go to the storefront and complete a checkout!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Shipping Destination</th>
                      <th className="py-3 px-4">Formulations</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status & Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-veda-900">
                          #{o.id}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-stone-900">{o.customer_name}</p>
                          <p className="text-stone-400 text-[11px]">{o.customer_email}</p>
                        </td>
                        <td className="py-4 px-4 max-w-xs text-stone-600 line-clamp-2">
                          {o.shipping_address}
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {o.items?.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-stone-700">
                                • {it.product_name || `Item #${it.product_id}`} × {it.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-serif font-bold text-sm text-stone-900">
                          ${o.total_amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value as any)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              o.status === 'shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : o.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="paid">Paid (Awaiting Dispatch)</option>
                            <option value="shipped">Shipped 🚀</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inventory & Formulations */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter inventory by name or category..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-veda-600"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Showing {filteredProducts.length} of {products.length} formulations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Formulation</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price ($)</th>
                    <th className="py-3 px-4">Stock In-Hand</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-xl border border-stone-200"
                          />
                          <div>
                            <p className="font-serif font-bold text-xs text-stone-900">
                              {prod.name}
                            </p>
                            <span className="text-[10px] text-stone-400 font-mono">
                              SKU: PV-{prod.id.toString().padStart(4, '0')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          {prod.category_name || 'Herbal'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-sm text-stone-900">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {editingStockId === prod.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={stockInputVal}
                              onChange={(e) => setStockInputVal(parseInt(e.target.value, 10) || 0)}
                              className="w-16 border border-veda-600 rounded-lg px-2 py-1 text-xs font-bold font-mono text-center"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(prod.id)}
                              className="p-1 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                              title="Save Stock"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 text-stone-400 hover:text-stone-600"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                prod.stock <= 12
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {prod.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingStockId(prod.id);
                                setStockInputVal(prod.stock);
                              }}
                              className="text-stone-400 hover:text-stone-700 p-1"
                              title="Edit Stock"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-amber-500 font-bold">
                        ★ {prod.rating.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Add New Botanical Formulation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Saffron & Brahmi Memory Nectar"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category_id: parseInt(e.target.value, 10) })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Image URL (Unsplash or CDN) *
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Key herbs, benefits, dosage rituals..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-veda-800 hover:bg-veda-900 text-white text-xs font-semibold"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
