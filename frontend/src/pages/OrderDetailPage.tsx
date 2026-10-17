import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Package, MapPin, ShieldCheck, CheckCircle2, Clock, Truck } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & Logged' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Inventory Verified' },
  { key: 'processing', label: 'Processing', desc: 'Packed at Warehouse' },
  { key: 'shipped', label: 'Shipped', desc: 'In Courier Transit' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed to Customer' },
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await apiClient.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500">
        <div className="h-8 w-8 border-3 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading order receipt & tracking details...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
        <Package className="h-10 w-10 text-gray-400 mx-auto" />
        <h2 className="text-lg font-black text-[#1A1A1A]">Order Not Found</h2>
        <p className="text-xs text-gray-500">This order may not exist or does not belong to your account.</p>
        <Link to="/orders" className="inline-block text-xs font-bold text-[#008060] hover:underline">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const displayOrderNum = order.order_number || `#${order.id.slice(-8).toUpperCase()}`;
  const currentStatus = (order.order_status || 'pending').toLowerCase();

  // Find step index
  const stepIndex = ORDER_STEPS.findIndex(s => s.key === currentStatus);
  const activeStep = stepIndex >= 0 ? stepIndex : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#008060] transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Order History</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E1E3E5] space-y-6 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs text-gray-400 font-mono font-bold uppercase">{displayOrderNum}</span>
            <h1 className="text-2xl font-black text-[#1A1A1A]">Order Details & Invoice</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full font-bold uppercase text-xs bg-gray-50 text-gray-700 border border-gray-200">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Card'}
            </span>
            <span className="px-3 py-1 rounded-full font-bold uppercase text-xs bg-[#F0F7F5] text-[#008060] border border-[#CBE2DA]">
              {order.order_status}
            </span>
          </div>
        </div>

        {/* ── Realistic Order Progress Tracking Stepper ─────────────────────── */}
        <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-gray-200 space-y-3">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-[#008060]" />
            Live Shipment Stepper
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-1 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-[#008060] text-white shadow-xs'
                      : 'bg-gray-200 text-gray-500'
                  } ${isCurrent ? 'ring-4 ring-[#008060]/20' : ''}`}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold ${isCompleted ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] text-gray-400 leading-tight">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address Details */}
        {order.shipping_address && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
              <MapPin className="h-4 w-4 text-[#008060]" />
              <span>Delivery Shipping Details:</span>
            </div>
            <div className="text-gray-600 pl-6 space-y-0.5">
              <p className="font-semibold text-[#1A1A1A]">{order.shipping_address.full_name} ({order.shipping_address.phone})</p>
              <p>{order.shipping_address.address_line}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}</p>
            </div>
          </div>
        )}

        {/* Purchased Items List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#1A1A1A]">Ordered Products</h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-[#1A1A1A]">{item.product_name}</h4>
                  <p className="text-gray-400">Unit Price: {formatCurrency(item.price, order.currency)}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 font-semibold mr-3">Qty: {item.quantity}</span>
                  <span className="font-black text-[#1A1A1A]">{formatCurrency(item.price * item.quantity, order.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-[#1A1A1A]">{formatCurrency(order.subtotal || order.total, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Shipping Fee</span>
            <span className="font-bold text-emerald-700">
              {order.shipping_fee === 0 || !order.shipping_fee ? 'FREE' : formatCurrency(order.shipping_fee, order.currency)}
            </span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm">
            <span className="font-black text-[#1A1A1A]">Total Payable</span>
            <span className="text-2xl font-black text-[#008060]">{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Shopify Certified Order • 100% Genuine Guaranteed</span>
        </div>

      </div>

    </div>
  );
};
