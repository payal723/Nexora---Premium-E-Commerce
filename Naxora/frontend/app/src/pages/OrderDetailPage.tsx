import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, Home, XCircle, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { orderAPI } from '@/lib/api';
import type { Order } from '@/types';
import { toast } from 'sonner';

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string; description: string }> = {
  Pending: { icon: Clock, color: 'text-[#f39c12]', bg: 'bg-[#f39c12]/10', label: 'Pending', description: 'Your order has been placed and is awaiting confirmation.' },
  Confirmed: { icon: CheckCircle, color: 'text-[#00cec9]', bg: 'bg-[#00cec9]/10', label: 'Confirmed', description: 'Your order has been confirmed and is being prepared.' },
  Shipped: { icon: Truck, color: 'text-[#6c5ce7]', bg: 'bg-[#6c5ce7]/10', label: 'Shipped', description: 'Your order is on the way! Track your package.' },
  Delivered: { icon: Home, color: 'text-[#00b894]', bg: 'bg-[#00b894]/10', label: 'Delivered', description: 'Your order has been delivered. Enjoy!' },
  Cancelled: { icon: XCircle, color: 'text-[#fd79a8]', bg: 'bg-[#fd79a8]/10', label: 'Cancelled', description: 'This order has been cancelled.' },
};

const allStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cancelOrder, isAuthenticated } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrderById(id);
        if (response.success) {
          setOrder(response.order);
        }
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || 'Failed to load order');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const handleCancel = async () => {
    if (!order || !window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    await cancelOrder(order._id, 'Cancelled by user');
    // Refresh order data
    try {
      const response = await orderAPI.getOrderById(order._id);
      if (response.success) setOrder(response.order);
    } catch {
      // ignore
    }
    setCancelling(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Please sign in</h2>
          <p className="text-[#a0a0b0] mb-6">Sign in to view order details</p>
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

  if (loading) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-[#2a2a3a] mb-4" />
          <h2 className="text-xl text-[#f8f9fa] mb-2">Order not found</h2>
          <Link to="/orders" className="text-[#6c5ce7] hover:text-[#a29bfe]">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const config = statusConfig[order.orderStatus] || statusConfig.Pending;
  const StatusIcon = config.icon;
  const currentStatusIndex = allStatuses.indexOf(order.orderStatus);
  const isCancellable = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="p-2 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-normal text-[#f8f9fa] tracking-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-[#6c6c7e]">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`${config.bg} rounded-2xl border border-[#2a2a3a] p-5 mb-6`}>
          <div className="flex items-center gap-3">
            <StatusIcon size={24} className={config.color} />
            <div>
              <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
              <p className="text-sm text-[#a0a0b0]">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            {order.orderStatus !== 'Cancelled' && (
              <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
                <h3 className="text-lg font-medium text-[#f8f9fa] mb-6">Order Tracking</h3>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#2a2a3a]">
                    <div
                      className="w-full bg-[#6c5ce7] transition-all duration-500"
                      style={{
                        height: currentStatusIndex >= 0
                          ? `${Math.min((currentStatusIndex / (allStatuses.length - 1)) * 100, 100)}%`
                          : '0%',
                      }}
                    />
                  </div>

                  <div className="space-y-6 relative">
                    {allStatuses.map((status, index) => {
                      const sConfig = statusConfig[status];
                      const SIcon = sConfig.icon;
                      const isActive = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div key={status} className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isActive
                                ? 'bg-[#6c5ce7] border-[#6c5ce7]'
                                : 'bg-[#0a0a0f] border-[#2a2a3a]'
                            } ${isCurrent ? 'ring-2 ring-[#6c5ce7]/30' : ''}`}
                          >
                            <SIcon size={16} className={isActive ? 'text-white' : 'text-[#6c6c7e]'} />
                          </div>
                          <div className="pt-1.5">
                            <p className={`text-sm font-medium ${isActive ? 'text-[#f8f9fa]' : 'text-[#6c6c7e]'}`}>
                              {sConfig.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-[#a0a0b0] mt-0.5">
                                {order.statusHistory.find(h => h.status === status)
                                  ? new Date(order.statusHistory.find(h => h.status === status)!.timestamp).toLocaleString('en-IN')
                                  : 'In progress...'}
                              </p>
                            )}
                            {status === 'Delivered' && order.deliveredAt && (
                              <p className="text-xs text-[#a0a0b0] mt-0.5">
                                {new Date(order.deliveredAt).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled Status */}
            {order.orderStatus === 'Cancelled' && (
              <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
                <h3 className="text-lg font-medium text-[#f8f9fa] mb-2">Order Cancelled</h3>
                <p className="text-sm text-[#a0a0b0]">
                  {order.cancellationReason || 'This order was cancelled.'}
                </p>
                {order.cancelledAt && (
                  <p className="text-xs text-[#6c6c7e] mt-2">
                    Cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <h3 className="text-lg font-medium text-[#f8f9fa] mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-[#6c6c7e]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#f8f9fa] line-clamp-2">{item.name}</p>
                      <p className="text-xs text-[#6c6c7e] mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-[#f8f9fa]">₹{item.price.toLocaleString()}</p>
                      <p className="text-xs text-[#6c6c7e]">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="h-fit space-y-6">
            {/* Order Summary */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <h3 className="text-lg font-medium text-[#f8f9fa] mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Items Total</span>
                  <span className="text-[#f8f9fa]">₹{order.itemsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Shipping</span>
                  <span className={order.shippingCharge === 0 ? 'text-[#00cec9]' : 'text-[#f8f9fa]'}>
                    {order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">GST (18%)</span>
                  <span className="text-[#f8f9fa]">₹{order.tax.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-[#2a2a3a] pt-4">
                <div className="flex justify-between">
                  <span className="text-[#f8f9fa] font-medium">Grand Total</span>
                  <span className="text-xl font-medium text-[#6c5ce7]">₹{order.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-[#6c5ce7]" />
                <h3 className="text-lg font-medium text-[#f8f9fa]">Shipping Address</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-[#f8f9fa]">{order.shippingAddress.street}</p>
                <p className="text-[#a0a0b0]">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-[#a0a0b0]">{order.shippingAddress.country}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Phone size={14} className="text-[#6c6c7e]" />
                  <span className="text-[#a0a0b0]">{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[#6c5ce7]" />
                <h3 className="text-lg font-medium text-[#f8f9fa]">Payment</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a0a0b0]">Method</span>
                  <span className="text-[#f8f9fa]">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0b0]">Status</span>
                  <span className={order.paymentStatus === 'Paid' ? 'text-[#00cec9]' : 'text-[#f39c12]'}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-[#6c5ce7]" />
                <h3 className="text-lg font-medium text-[#f8f9fa]">Status History</h3>
              </div>
              <div className="space-y-3">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#6c5ce7] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-[#f8f9fa]">{h.status}</p>
                      <p className="text-xs text-[#6c6c7e]">
                        {new Date(h.timestamp).toLocaleString('en-IN')}
                      </p>
                      {h.note && <p className="text-xs text-[#a0a0b0] mt-0.5">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            {isCancellable && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full h-12 border border-[#fd79a8] text-[#fd79a8] rounded-xl font-medium hover:bg-[#fd79a8]/10 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
