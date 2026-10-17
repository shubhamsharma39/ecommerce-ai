import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { 
  ShoppingBag, 
  LogOut, 
  Shield, 
  Search, 
  X, 
  User as UserIcon,
  ChevronDown,
  Truck,
  Percent,
  Menu,
  Package,
  Sparkles
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  cartCount?: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  searchQuery = '',
  setSearchQuery,
}) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 8 Target Categories connected to real store filtering
  const categories = [
    { name: 'Mobiles', path: '/shop?category=Mobiles' },
    { name: 'Electronics', path: '/shop?category=Electronics' },
    { name: 'Fashion', path: '/shop?category=Fashion' },
    { name: 'Home & Kitchen', path: '/shop?category=Home%20%26%20Kitchen' },
    { name: 'Beauty & Personal Care', path: '/shop?category=Beauty%20%26%20Personal%20Care' },
    { name: 'Books & Stationery', path: '/shop?category=Books%20%26%20Stationery' },
    { name: 'Sports & Fitness', path: '/shop?category=Sports%20%26%20Fitness' },
    { name: 'Accessories', path: '/shop?category=Accessories' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/shop') {
      navigate(searchQuery.trim() ? `/shop?search=${encodeURIComponent(searchQuery.trim())}` : '/shop');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E1E3E5] shadow-xs">
        
        {/* ── 1. Top Announcement Bar ──────────────────────────────────────── */}
        <div className="bg-[#1A1A1A] text-white text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-[#008060] animate-pulse"></span>
              <span>Welcome to <strong>Shopify</strong> — Express Cash on Delivery & Free Shipping over $50</span>
            </div>

            <div className="hidden sm:flex items-center gap-5 text-white/80">
              <Link to="/orders" className="flex items-center gap-1.5 hover:text-white transition">
                <Truck className="h-3.5 w-3.5 text-[#008060]" />
                <span>Track Order</span>
              </Link>
              <span className="text-white/20">|</span>
              <Link to="/shop" className="flex items-center gap-1.5 hover:text-white transition">
                <Percent className="h-3.5 w-3.5 text-[#008060]" />
                <span>Super Deals</span>
              </Link>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1 text-[#F49342] font-semibold">
                <Sparkles className="h-3 w-3" />
                <span>24x7 Help Desk</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Main Header Row (Shopify Brand, Search, User, Orders, Cart) ─ */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Left: Mobile Toggle & Shopify Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-[#1A1A1A] transition"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              {/* Shopify Bag Icon Emblem */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008060] text-white shadow-md shadow-[#008060]/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#1A1A1A] leading-none group-hover:text-[#008060] transition-colors">
                  Shopify<span className="text-[#008060]">.</span>
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
                  Modern Store
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar with Enter Submission */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl relative items-center"
          >
            <div className="flex w-full items-center bg-[#F0F7F5] border border-[#CBE2DA] rounded-xl overflow-hidden focus-within:border-[#008060] focus-within:ring-2 focus-within:ring-[#008060]/20 transition bg-white/70">
              <div className="pl-3.5 text-[#008060]">
                <Search className="h-4 w-4" />
              </div>

              <input
                type="text"
                placeholder="Search products, brands, mobiles, electronics, fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="pr-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#008060] hover:bg-[#006E52] text-white text-xs font-bold transition flex items-center gap-1"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Right: My Orders, Admin, Auth & Cart */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* My Orders Direct Link */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] hover:text-[#008060] px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <Package className="h-4 w-4 text-[#008060]" />
              <span>My Orders</span>
            </Link>

            {/* Admin Badge if role is admin */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Auth or Sign Up Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 pl-1.5 pr-2 py-1 rounded-xl">
                <img
                  src={user.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={user.name}
                  className="h-7 w-7 rounded-full border border-gray-300 object-cover"
                />
                <span className="hidden xl:inline text-xs font-bold text-[#1A1A1A] max-w-[90px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                  }}
                  className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] hover:text-[#008060] px-3 py-2 rounded-xl border border-gray-200 hover:border-[#008060] transition shadow-2xs"
              >
                <UserIcon className="h-4 w-4 text-[#008060]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-xs font-bold text-white bg-[#008060] hover:bg-[#006E52] px-3.5 py-2 rounded-xl transition shadow-sm relative group"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1A1A] text-[9px] font-black text-white border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

          </div>
        </div>

        {/* ── 3. 8 Target Categories Navigation Strip ───────────────────────── */}
        <div className="border-t border-[#E1E3E5] bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-1 text-xs">
            {categories.map((cat, idx) => {
              const isActive = location.pathname === '/shop' && location.search.includes(encodeURIComponent(cat.name).replace(/%20/g, '+'));
              return (
                <Link
                  key={idx}
                  to={cat.path}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold flex items-center gap-1 text-xs ${
                    isActive
                      ? 'bg-[#008060] text-white shadow-xs'
                      : 'text-[#424242] hover:text-[#008060] hover:bg-white'
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {setSearchQuery && (
          <form onSubmit={handleSearchSubmit} className="md:hidden border-t border-[#E1E3E5] px-4 py-2.5 bg-gray-50">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#008060]" />
              <input
                type="text"
                placeholder="Search products in Shopify..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 bg-white border border-gray-300 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#008060]"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-[#008060] text-white rounded-lg text-xs font-bold"
              >
                Go
              </button>
            </div>
          </form>
        )}

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-3">
            <div className="text-xs font-bold text-gray-500 uppercase">Categories</div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:text-[#008060] bg-gray-50 rounded-lg"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]"
              >
                <Package className="h-4 w-4 text-[#008060]" />
                <span>My Orders</span>
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700"
                >
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}

      </header>

      {/* Auth Modal for Sign In / Register */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
