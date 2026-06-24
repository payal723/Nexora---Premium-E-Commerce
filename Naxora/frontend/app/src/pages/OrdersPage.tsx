import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, Home, XCircle, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Order } from '@/types';

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
  Pending: { icon: Clock, color: 'text-[#f39c12]', bg: 'bg-[#f39c12]/10', label: 'Pending' },
  Confirmed: { icon: CheckCircle, color: 'text-[#00cec9]', bg: 'bg-[#00cec9]/10', label: 'Confirmed' },
  Shipped: { icon: Truck, color: 'text-[#6c5ce7]', bg: 'bg-[#6c5ce7]/10', label: 'Shipped' },
  Delivered: { icon: Home, color: 'text-[#00b894]', bg: 'bg-[#00b894]/10', label: 'Delivered' },
  Cancelled: { icon: XCircle, color: 'text-[#fd79a8]', bg: 'bg-[#fd79a8]/10', label: 'Cancelled' },
};

function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.orderStatus] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <Link
      to={`/order/${order._id}`}
      className="block bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-5 hover:border-[#3a3a4a] transition-all group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-[#6c6c7e] mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-[#a0a0b0]">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg}`}>
          <StatusIcon size={14} className={config.color} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] overflow-hidden"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={14} className="text-[#6c6c7e]" />
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-10 rounded-lg bg-[#2a2a3a] border border-[#3a3a4a] flex items-center justify-center">
              <span className="text-xs text-[#a0a0b0]">+{order.items.length - 3}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-[#a0a0b0]">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#6c6c7e]">Total</p>
          <p className="text-lg font-medium text-[#6c5ce7]">₹{order.grandTotal.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-[#6c5ce7] group-hover:gap-2 transition-all">
          <span>View Details</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { orders, ordersLoading, fetchOrders, isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Please sign in</h2>
          <p className="text-[#a0a0b0] mb-6">Sign in to view your orders</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="p-2 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-normal text-[#f8f9fa] tracking-tight">My Orders</h1>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-[#6c6c7e]" />
            </div>
            <h2 className="text-2xl text-[#f8f9fa] mb-2">No orders yet</h2>
            <p className="text-[#a0a0b0] mb-6">Start shopping to place your first order</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
            >
              <ArrowLeft size={16} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
