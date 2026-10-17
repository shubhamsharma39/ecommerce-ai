import { apiClient } from './client';

// ==================== AUTH SERVICES ====================
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  loginWithGoogle: async (credential: string) => {
    const response = await apiClient.post('/auth/google', { credential });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// ==================== PRODUCT SERVICES ====================
export interface ProductParams {
  search?: string;
  category?: string;
}

export const productsApi = {
  getProducts: async (params?: ProductParams) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getProductById: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },
};

// ==================== CART SERVICES ====================
export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },
  addItem: async (productId: string, quantity: number = 1) => {
    const response = await apiClient.post('/cart/items', { product_id: productId, quantity });
    return response.data;
  },
  updateItemQuantity: async (productId: string, quantity: number) => {
    const response = await apiClient.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },
  removeItem: async (productId: string) => {
    const response = await apiClient.delete(`/cart/items/${productId}`);
    return response.data;
  },
};

// ==================== ORDER SERVICES ====================
export interface ShippingAddressData {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state?: string;
  postal_code: string;
  country?: string;
}

export interface CreateOrderPayload {
  shipping_address?: ShippingAddressData;
  payment_method?: 'cod' | 'stripe';
}

export const ordersApi = {
  createFromCart: async (payload?: CreateOrderPayload) => {
    const response = await apiClient.post('/orders/create-from-cart', payload || {});
    return response.data;
  },
  getMyOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },
};

// ==================== PAYMENT SERVICES ====================
export const paymentsApi = {
  createCheckoutSession: async (orderId: string) => {
    const response = await apiClient.post('/payments/create-checkout-session', { order_id: orderId });
    return response.data;
  },
  verifySession: async (sessionId: string) => {
    const response = await apiClient.post('/payments/verify-session', null, {
      params: { session_id: sessionId },
    });
    return response.data;
  },
};

// ==================== ADMIN SERVICES ====================
export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image_url: string;
  stock: number;
  category: string;
  is_active?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  stock?: number;
  category?: string;
  is_active?: boolean;
}

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  low_stock_products: number;
  total_customers: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getProducts: async (params?: ProductParams) => {
    const response = await apiClient.get('/admin/products', { params });
    return response.data;
  },
  createProduct: async (data: CreateProductInput) => {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
  },
  updateProduct: async (productId: string, data: UpdateProductInput) => {
    const response = await apiClient.put(`/admin/products/${productId}`, data);
    return response.data;
  },
  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  },
  getOrders: async () => {
    const response = await apiClient.get('/admin/orders');
    return response.data;
  },
  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/admin/orders/${orderId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId: string, orderStatus: string) => {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, { order_status: orderStatus });
    return response.data;
  },
};

// ==================== AI AGENT SERVICES ====================
export const aiApi = {
  chat: async (message: string) => {
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  },
};
