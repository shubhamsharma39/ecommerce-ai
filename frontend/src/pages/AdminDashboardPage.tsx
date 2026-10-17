import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, CreateProductInput, UpdateProductInput } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  X, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Search,
  TrendingUp
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  stock: number;
  category: string;
  is_active: boolean;
}

interface Order {
  id: string;
  order_number?: string;
  user_id: string;
  items: any[];
  total: number;
  currency: string;
  payment_method?: string;
  payment_status: string;
  order_status: string;
  shipping_address?: any;
  created_at: string;
}

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // New Product Form State
  const [newProduct, setNewProduct] = useState<CreateProductInput>({
    name: '',
    description: '',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
    stock: 20,
    category: 'Electronics',
    is_active: true
  });

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats()
  });

  const { data: adminProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['adminProducts'],
    queryFn: () => adminApi.getProducts()
  });

  const { data: adminOrders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['adminOrders'],
    queryFn: () => adminApi.getOrders()
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductInput) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setShowCreateModal(false);
      setNewProduct({
        name: '',
        description: '',
        price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
        stock: 20,
        category: 'Electronics',
        is_active: true
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) => adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setEditingProduct(null);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setDeletingProductId(null);
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
      adminApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  const filteredOrders = adminOrders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.shipping_address?.full_name && o.shipping_address.full_name.toLowerCase().includes(q))
    );
  });

  const filteredProducts = adminProducts.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#EFE8DE] p-6 sm:p-8 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 w-fit mb-2">
            <Shield className="h-3.5 w-3.5 text-amber-700" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C130E]">
            ShopSphere Admin Portal
          </h1>
          <p className="text-xs text-[#82746C] mt-1">
            Real-time control over products, customer orders, and store revenues.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] border border-[#DFD5C6] rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-[#C24A2A] text-white shadow-xs'
                : 'text-[#4A3C33] hover:text-[#1C130E]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'products'
                ? 'bg-[#C24A2A] text-white shadow-xs'
                : 'text-[#4A3C33] hover:text-[#1C130E]'
            }`}
          >
            Products ({adminProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-[#C24A2A] text-white shadow-xs'
                : 'text-[#4A3C33] hover:text-[#1C130E]'
            }`}
          >
            Orders ({adminOrders.length})
          </button>
        </div>
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Revenue */}
            <div className="p-6 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#82746C] uppercase">Total Revenue</span>
                <div className="p-2 rounded-xl bg-[#FDF2EE] text-[#C24A2A]">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#1C130E]">
                {stats ? formatCurrency(stats.total_revenue, 'USD') : '$0.00'}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> All-time completed orders
              </p>
            </div>

            {/* Total Orders */}
            <div className="p-6 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#82746C] uppercase">Customer Orders</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#1C130E]">
                {stats ? stats.total_orders : adminOrders.length}
              </p>
              <p className="text-[11px] text-[#82746C]">Total orders placed</p>
            </div>

            {/* Active Products */}
            <div className="p-6 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#82746C] uppercase">Active Products</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#1C130E]">
                {stats ? stats.total_products : adminProducts.length}
              </p>
              <p className="text-[11px] text-[#82746C]">Listed in catalog</p>
            </div>

            {/* Registered Users */}
            <div className="p-6 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#82746C] uppercase">Registered Users</span>
                <div className="p-2 rounded-xl bg-stone-100 text-[#1C130E]">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#1C130E]">
                {stats ? stats.total_customers : '10+'}
              </p>
              <p className="text-[11px] text-[#82746C]">Registered shoppers</p>
            </div>

          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-2xl bg-white border border-[#EFE8DE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#1C130E]">Quick Store Operations</h3>
              <p className="text-xs text-[#82746C]">Easily add new products to the catalog or update customer orders.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setShowCreateModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#C24A2A] hover:bg-[#A83A1D] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C130E] font-bold text-xs transition flex items-center gap-1.5"
              >
                <Package className="h-4 w-4" />
                <span>Manage Orders</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ──────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#82746C]" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#DFD5C6] rounded-xl text-xs text-[#1C130E] placeholder:text-[#82746C] focus:outline-none focus:border-[#C24A2A]"
              />
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C24A2A] hover:bg-[#A83A1D] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {productsLoading ? (
            <div className="p-12 text-center text-[#82746C]">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-[#EFE8DE] space-y-3">
              <Package className="h-8 w-8 text-[#82746C] mx-auto" />
              <h3 className="text-base font-bold text-[#1C130E]">No Products Found</h3>
              <p className="text-xs text-[#82746C]">Click "Add New Product" to populate your store inventory.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#EFE8DE] rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#82746C] font-bold border-b border-[#EFE8DE]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8DE]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-contain bg-[#FAF7F2] p-1 border border-[#EFE8DE] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1C130E] line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-[#82746C] line-clamp-1">{p.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EFE8DE] text-[#4A3C33] font-semibold text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-[#1C130E]">
                          {formatCurrency(p.price, p.currency || 'USD')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg text-[#82746C] hover:text-[#C24A2A] hover:bg-[#FDF2EE] transition"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-1.5 rounded-lg text-[#82746C] hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
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
      )}

      {/* ── ORDERS TAB ────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#82746C]" />
            <input
              type="text"
              placeholder="Search by order # or customer name..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#DFD5C6] rounded-xl text-xs text-[#1C130E] placeholder:text-[#82746C] focus:outline-none focus:border-[#C24A2A]"
            />
          </div>

          {ordersLoading ? (
            <div className="p-12 text-center text-[#82746C]">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-[#EFE8DE] space-y-3">
              <Package className="h-8 w-8 text-[#82746C] mx-auto" />
              <h3 className="text-base font-bold text-[#1C130E]">No Customer Orders Yet</h3>
              <p className="text-xs text-[#82746C]">Orders placed by customers will automatically show up here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#EFE8DE] rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#82746C] font-bold border-b border-[#EFE8DE]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer & Address</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8DE]">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF7F2]/50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#C24A2A]">
                          {o.order_number || `#${o.id.slice(-8).toUpperCase()}`}
                          <p className="text-[10px] text-[#82746C] font-sans mt-0.5">
                            {new Date(o.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#1C130E]">{o.shipping_address?.full_name || 'Customer'}</p>
                          <p className="text-[11px] text-[#82746C]">{o.shipping_address?.city || 'Local'}</p>
                        </td>
                        <td className="py-3 px-4 text-[#4A3C33]">
                          {o.items?.length || 0} items
                        </td>
                        <td className="py-3 px-4 font-black text-[#1C130E]">
                          {formatCurrency(o.total, 'USD')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FAF7F2] border border-[#EFE8DE] text-[#4A3C33]">
                            {o.payment_method === 'cod' ? 'COD' : 'Stripe'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={o.order_status}
                            onChange={(e) =>
                              updateOrderStatusMutation.mutate({ orderId: o.id, status: e.target.value })
                            }
                            className="bg-[#FAF7F2] border border-[#DFD5C6] text-xs font-bold text-[#1C130E] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#C24A2A] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE PRODUCT MODAL ───────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C130E]/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DFD5C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <h3 className="text-base font-black text-[#1C130E]">Add New Product to ShopSphere</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#82746C] hover:text-[#1C130E]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProductMutation.mutate(newProduct);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#4A3C33] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3C33] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed specifications and key features..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#4A3C33] mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A3C33] mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#008060] cursor-pointer"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A3C33] mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EFE8DE]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-[#1C130E] font-bold hover:bg-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#008060] hover:bg-[#006E52] text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PRODUCT MODAL ─────────────────────────────────────────── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C130E]/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DFD5C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <h3 className="text-base font-black text-[#1C130E]">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="text-[#82746C] hover:text-[#1C130E]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProductMutation.mutate({
                  id: editingProduct.id,
                  data: {
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    stock: editingProduct.stock,
                    category: editingProduct.category,
                    image_url: editingProduct.image_url
                  }
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#4A3C33] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3C33] mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#4A3C33] mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A3C33] mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD5C6] rounded-xl text-[#1C130E] focus:outline-none focus:border-[#C24A2A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#008060]"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EFE8DE]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-[#1C130E] font-bold hover:bg-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#008060] hover:bg-[#006E52] text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────────── */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C130E]/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#DFD5C6] text-center space-y-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-[#1C130E]">Confirm Product Deletion</h3>
            <p className="text-xs text-[#82746C]">
              Are you sure you want to remove this product from the store catalog? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-[#1C130E] font-bold text-xs hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProductMutation.mutate(deletingProductId)}
                disabled={deleteProductMutation.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50"
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
