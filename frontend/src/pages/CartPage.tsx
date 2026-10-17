import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Banknote,
  Check
} from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  line_total: number;
  stock: number;
}

interface CartResponse {
  items: CartItem[];
  total_amount: number;
}

export const CartPage: React.FC<{ onCartUpdated?: () => void }> = ({ onCartUpdated }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: cart, isLoading } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) return { items: [], total_amount: 0 };
      return cartApi.getCart();
    },
    enabled: isAuthenticated
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => {
      return cartApi.updateItemQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (onCartUpdated) onCartUpdated();
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => {
      return cartApi.removeItem(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (onCartUpdated) onCartUpdated();
    }
  });

  if (!isAuthenticated) {
    return (
      <>
        <div className="max-w-md mx-auto my-16 text-center p-8 rounded-3xl bg-white border border-[#E1E3E5] space-y-5 shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F7F5] border border-[#CBE2DA] mx-auto text-[#008060]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1A1A1A]">Sign In to View Your Cart</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your shopping cart is saved securely to your Shopify account. Sign in to view your items, adjust quantities, and checkout.
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#008060] hover:bg-[#006E52] font-bold text-xs text-white shadow-xs transition"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500">
        <div className="h-8 w-8 border-3 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading your shopping cart...</span>
      </div>
    );
  }

  const items = cart?.items || [];
  const rawSubtotal = cart?.total_amount || 0;
  const discountAmount = discountApplied ? rawSubtotal * 0.15 : 0;
  const freeShippingThreshold = 50;
  const shippingFee = rawSubtotal >= freeShippingThreshold || rawSubtotal === 0 ? 0 : 4.99;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + shippingFee);

  const progressToFreeShipping = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 rounded-3xl bg-white border border-[#E1E3E5] space-y-5 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A]">Your Cart is Currently Empty</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Looks like you haven't added anything yet. Explore our curated collections of mobiles, electronics, and fashion!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#008060] hover:bg-[#006E52] font-bold text-xs text-white shadow-xs transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Title & Item Counter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] flex items-center gap-3">
          <span>Shopping Cart</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0F7F5] text-[#008060] border border-[#CBE2DA]">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </h1>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#008060] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Free Shipping Progress Ribbon */}
      <div className="p-4 rounded-2xl bg-white border border-[#E1E3E5] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-[#008060]" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-extrabold">🎉 You've unlocked Free Express Delivery!</span>
            ) : (
              <span>
                Add <span className="text-[#1A1A1A] font-black">${amountNeededForFreeShipping.toFixed(2)}</span> more to qualify for <span className="text-[#008060] font-bold">Free Shipping</span>
              </span>
            )}
          </span>
          <span className="text-gray-500 font-semibold">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#008060] to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E1E3E5] shadow-xs hover:border-gray-300 transition"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl bg-gray-50 object-contain p-2 shrink-0 border border-gray-100"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#1A1A1A] line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    Unit price: {formatCurrency(item.price, 'USD')}
                  </p>
                  <p className="text-sm font-black text-[#008060] sm:hidden">
                    Total: {formatCurrency(item.line_total, 'USD')}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        productId: item.product_id,
                        quantity: Math.max(1, item.quantity - 1)
                      })
                    }
                    disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 transition font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#1A1A1A]">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        productId: item.product_id,
                        quantity: Math.min(item.stock || 50, item.quantity + 1)
                      })
                    }
                    disabled={item.quantity >= (item.stock || 50) || updateQuantityMutation.isPending}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 transition font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="hidden sm:block text-right w-24">
                  <span className="text-sm font-black text-[#1A1A1A]">
                    {formatCurrency(item.line_total, 'USD')}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItemMutation.mutate(item.product_id)}
                  disabled={removeItemMutation.isPending}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-[#E1E3E5] space-y-5 shadow-xs">
            <h2 className="text-base font-black text-[#1A1A1A]">Order Summary</h2>

            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600">Promo Discount Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SHOPIFY15"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#008060] uppercase"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim().toUpperCase() === 'SHOPIFY15' || promoCode.trim().toUpperCase() === 'SHOP15') {
                      setDiscountApplied(true);
                    }
                  }}
                  className="px-3.5 py-2 bg-[#F0F7F5] hover:bg-[#E0EFEA] text-[#008060] border border-[#CBE2DA] rounded-xl text-xs font-bold transition"
                >
                  Apply
                </button>
              </div>
              {discountApplied && (
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" /> 15% discount applied!
                </p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-bold text-[#1A1A1A]">{formatCurrency(rawSubtotal, 'USD')}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Special Discount (15%)</span>
                  <span>-{formatCurrency(discountAmount, 'USD')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-emerald-700">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee, 'USD')}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-[#1A1A1A]">Total Payable</span>
                <span className="text-2xl font-black text-[#008060]">
                  {formatCurrency(finalTotal, 'USD')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-[#008060] hover:bg-[#006E52] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#008060]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Payment & Security Badge */}
            <div className="space-y-2 pt-2 border-t border-gray-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <Banknote className="h-4 w-4" />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-[#008060]" />
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
