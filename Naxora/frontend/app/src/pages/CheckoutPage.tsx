import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, User, Truck, CreditCard } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, user, placeOrder, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
    notes: '',
  });

  const shipping = cartTotal >= 500 || cartCount === 0 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Please sign in</h2>
          <p className="text-[#a0a0b0] mb-6">Sign in to proceed to checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Your cart is empty</h2>
          <p className="text-[#a0a0b0] mb-6">Add items to your cart before checkout</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.zipCode || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsPlacing(true);
    const order = await placeOrder(form, form.notes || undefined);
    setIsPlacing(false);
    if (order) {
      navigate(`/order/${order._id}`);
    }
  };

  const inputClass = 'w-full h-12 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] placeholder:text-[#6c6c7e] focus:outline-none focus:border-[#6c5ce7] transition-colors';
  const labelClass = 'block text-sm text-[#a0a0b0] mb-1.5';

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/cart"
            className="p-2 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-normal text-[#f8f9fa] tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-[#6c5ce7]" />
                  <h3 className="text-lg font-medium text-[#f8f9fa]">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c6c7e]" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={`${inputClass} pl-11`}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-[#6c5ce7]" />
                  <h3 className="text-lg font-medium text-[#f8f9fa]">Shipping Address</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input
                      type="text"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      className={inputClass}
                      placeholder="123 Main Street, Apt 4B"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={inputClass}
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className={inputClass}
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>PIN Code</label>
                      <input
                        type="text"
                        value={form.zipCode}
                        onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                        className={inputClass}
                        placeholder="400001"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className={inputClass}
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
                <h3 className="text-lg font-medium text-[#f8f9fa] mb-4">Order Notes (Optional)</h3>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full h-24 px-4 py-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] placeholder:text-[#6c6c7e] focus:outline-none focus:border-[#6c5ce7] transition-colors resize-none"
                  placeholder="Any special instructions for delivery..."
                />
              </div>

              <button
                type="submit"
                disabled={isPlacing}
                className="w-full h-14 bg-[#6c5ce7] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#a29bfe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package size={18} />
                {isPlacing ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit space-y-6">
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <h3 className="text-lg font-medium text-[#f8f9fa] mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[#0a0a0f] overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#f8f9fa] line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-[#6c6c7e]">Qty: {item.quantity}</p>
                      <p className="text-sm text-[#6c5ce7]">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Subtotal</span>
                  <span className="text-[#f8f9fa]">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#00cec9]' : 'text-[#f8f9fa]'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0b0]">GST (18%)</span>
                  <span className="text-[#f8f9fa]">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-[#2a2a3a] pt-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#f8f9fa] font-medium">Total</span>
                  <span className="text-xl font-medium text-[#6c5ce7]">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[#6c5ce7]" />
                <h3 className="text-lg font-medium text-[#f8f9fa]">Payment Method</h3>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-xl border border-[#2a2a3a]">
                <Truck size={20} className="text-[#00cec9]" />
                <div>
                  <p className="text-sm text-[#f8f9fa] font-medium">Cash on Delivery</p>
                  <p className="text-xs text-[#6c6c7e]">Pay when you receive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
