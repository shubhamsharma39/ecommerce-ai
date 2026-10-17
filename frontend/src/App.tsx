import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Bot, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIChatWidget } from '@/components/AIChatWidget';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage';
import { CheckoutCancelPage } from '@/pages/CheckoutCancelPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { apiClient } from '@/api/client';
import { useAppSelector } from '@/store/hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: cartData, refetch: refetchCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) return { items: [] };
      const res = await apiClient.get('/cart');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const cartCount =
    cartData?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B132B] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route
              path="/"
              element={<HomePage searchQuery={searchQuery} onCartUpdated={refetchCart} />}
            />
            <Route
              path="/shop"
              element={<ShopPage onCartUpdated={refetchCart} />}
            />
            <Route
              path="/products/:id"
              element={<ProductDetailPage onCartUpdated={refetchCart} />}
            />
            <Route path="/cart" element={<CartPage onCartUpdated={refetchCart} />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage onCartUpdated={refetchCart} />
                </ProtectedRoute>
              }
            />
            <Route path="/payment/success" element={<CheckoutSuccessPage />} />
            <Route path="/payment/cancel" element={<CheckoutCancelPage />} />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>

      <Footer />

      {/* Floating AI Shopping Assistant FAB */}
      <button
        onClick={() => setIsAIChatOpen((open) => !open)}
        aria-label="Open AI Support Assistant"
        title="AI Assistant Copilot"
        className="fixed bottom-8 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 group"
      >
        <span className={`absolute inset-0 rounded-2xl bg-blue-400 opacity-20 ${isAIChatOpen ? '' : 'animate-ping'}`} />
        {isAIChatOpen ? (
          <X className="relative h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <Bot className="relative h-6 w-6 text-white transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {/* AI Chat Panel */}
      <AIChatWidget isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
