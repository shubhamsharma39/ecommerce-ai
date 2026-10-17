import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { formatCurrency } from '@/lib/utils';
import { Package, ArrowRight, AlertCircle, Clock, Truck, CheckCircle2 } from 'lucide-react';

interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number?: string;
  items: OrderItem[];
  total: number;
  order_status: string;
  payment_method?: string;
  created_at: string;
}

export const OrdersPage: React.FC = () => {
  const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500">
        <div className="h-8 w-8 border-3 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading your order history...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-[#1A1A1A]">Unable to Load Orders</h2>
        <p className="text-xs text-gray-500">Please make sure you are signed in and the backend server is running.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white border border-[#E1E3E5] rounded-3xl space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#F0F7F5] border border-[#CBE2DA] flex items-center justify-center mx-auto text-[#008060]">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A]">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-500">When you place orders via Cash on Delivery or Card, they will appear here with live tracking.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#008060] font-bold text-xs text-white hover:bg-[#006E52] transition shadow-xs"
        >
          <span>Explore Shopify Store</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Pending</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">My Orders</h1>
          <p className="text-xs text-gray-500 mt-1">Track and manage your order shipments and delivery status.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white text-[#1A1A1A] font-bold text-xs border border-[#E1E3E5] shadow-xs">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const displayOrderNum = order.order_number || `#${order.id.slice(-8).toUpperCase()}`;

          return (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-white border border-[#E1E3E5] shadow-xs space-y-4 hover:border-gray-300 transition"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 text-xs">
                <div>
                  <span className="font-black text-[#008060] font-mono text-sm">{displayOrderNum}</span>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 uppercase">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                  {getStatusBadge(order.order_status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                    <span>
                      {item.product_name} <strong className="text-gray-400">× {item.quantity}</strong>
                    </span>
                    <span className="font-bold text-[#1A1A1A]">{formatCurrency(item.price * item.quantity, 'USD')}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Total Amount: </span>
                  <span className="font-black text-base text-[#008060]">{formatCurrency(order.total, 'USD')}</span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#008060] hover:text-[#006E52] transition"
                >
                  <span>Track Order & Invoice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
