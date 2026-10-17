import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi, ordersApi, ShippingAddressData } from '@/api/services';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Banknote, 
  CreditCard,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Truck
} from 'lucide-react';

export const CheckoutPage: React.FC<{ onCartUpdated?: () => void }> = ({ onCartUpdated }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) return { items: [], total_amount: 0 };
      return cartApi.getCart();
    },
    enabled: isAuthenticated
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim()) {
        throw new Error('Please fill in all required shipping address fields.');
      }

      const shippingAddress: ShippingAddressData = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address_line: addressLine.trim(),
        city: city.trim(),
        state: state.trim() || 'Default State',
        postal_code: postalCode.trim(),
        country: 'India'
      };

      return ordersApi.createFromCart({
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (onCartUpdated) onCartUpdated();

      if (paymentMethod === 'stripe') {
        ordersApi.createFromCart({ payment_method: 'stripe' });
      } else {
        setPlacedOrder(data);
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || err.message || 'Failed to place order.');
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
        <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto" />
        <h2 className="text-xl font-black text-[#1A1A1A]">Sign in to Checkout</h2>
        <p className="text-xs text-gray-500">Please sign in to your Shopify account to complete your order.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#008060] hover:bg-[#006E52] font-bold text-xs text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  // Order Success Screen
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-[#E1E3E5] rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008060]">Order Placed Successfully</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            Thank You for Shopping with Shopify!
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Your order has been confirmed and registered in our database. Our logistics hub is preparing it for dispatch via Cash on Delivery.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Order Tracking ID</p>
              <p className="text-sm font-black text-[#008060] font-mono">
                {placedOrder.order_number || `#${placedOrder.id?.slice(-8).toUpperCase()}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Payment Mode</p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Cash on Delivery</p>
            </div>
          </div>

          <div className="text-xs text-gray-700 space-y-1">
            <p className="font-bold text-[#1A1A1A]">Delivery Address:</p>
            <p>{placedOrder.shipping_address?.full_name} • {placedOrder.shipping_address?.phone}</p>
            <p>{placedOrder.shipping_address?.address_line}, {placedOrder.shipping_address?.city}, {placedOrder.shipping_address?.postal_code}</p>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-bold text-[#1A1A1A]">
            <span>Total Payable on Delivery:</span>
            <span className="text-sm text-[#008060] font-black">{formatCurrency(placedOrder.total, 'USD')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#008060] text-white font-bold text-xs hover:bg-[#006E52] transition shadow-xs"
          >
            <Package className="h-4 w-4" />
            <span>View in My Orders</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-[#1A1A1A] font-bold text-xs hover:bg-gray-200 transition"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.total_amount || 0;
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingFee;

  if (!isLoading && items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
        <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto" />
        <h2 className="text-xl font-black text-[#1A1A1A]">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#008060] hover:bg-[#006E52] font-bold text-xs text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">Checkout</h1>
          <p className="text-xs text-gray-500 mt-1">Provide your delivery details and choose your payment preference.</p>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#008060] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cart</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1E3E5] space-y-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <MapPin className="h-5 w-5 text-[#008060]" />
              <h2 className="text-base font-black text-[#1A1A1A]">1. Shipping & Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#1A1A1A] flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1A1A1A] flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-[#1A1A1A]">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat / House No., Floor, Building, Street"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1A1A1A]">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1A1A1A]">State</label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1A1A1A]">Postal Code *</label>
                <input
                  type="text"
                  required
                  placeholder="400001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#008060]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1E3E5] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Banknote className="h-5 w-5 text-[#008060]" />
              <h2 className="text-base font-black text-[#1A1A1A]">2. Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash on Delivery (COD) Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-[#008060] bg-[#F0F7F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#008060] mt-1"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-emerald-700" />
                    <span className="font-bold text-xs text-[#1A1A1A]">Cash on Delivery</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">RECOMMENDED</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Pay comfortably at your doorstep with Cash or UPI upon verified delivery.
                  </p>
                </div>
              </label>

              {/* Online Stripe / Card Option */}
              <label
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'stripe'
                    ? 'border-[#008060] bg-[#F0F7F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="accent-[#008060] mt-1"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#008060]" />
                    <span className="font-bold text-xs text-[#1A1A1A]">Card / Stripe Checkout</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Direct online payment via Visa, Mastercard, or test card.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-[#E1E3E5] space-y-5 shadow-xs sticky top-24">
            <h2 className="text-base font-black text-[#1A1A1A]">Order Summary</h2>

            {/* Item List Preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 border-b border-gray-100 pb-3">
              {items.map((item: any) => (
                <div key={item.product_id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-9 w-9 rounded-lg bg-gray-50 object-contain p-1 border border-gray-200 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-[#1A1A1A] truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A1A1A] shrink-0">
                    {formatCurrency(item.line_total, 'USD')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-bold text-[#1A1A1A]">{formatCurrency(subtotal, 'USD')}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Express Delivery</span>
                <span className="font-bold text-emerald-700">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee, 'USD')}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-[#1A1A1A]">Total Amount</span>
                <span className="text-2xl font-black text-[#008060]">
                  {formatCurrency(total, 'USD')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={() => placeOrderMutation.mutate()}
              disabled={placeOrderMutation.isPending}
              className="w-full py-4 rounded-xl bg-[#008060] hover:bg-[#006E52] disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#008060]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order (Cash on Delivery)</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1 text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Safe & Verified Order Submission</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
