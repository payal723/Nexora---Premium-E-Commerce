import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, X, ArrowRight, Package, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, cartLoading, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const shipping = cartTotal >= 500 || cartCount === 0 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to proceed to checkout');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Your cart is empty</h2>
          <p className="text-[#a0a0b0] mb-6 max-w-sm">
            Browse our products and add items to your cart
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-normal text-[#f8f9fa] mb-8 tracking-tight">
          Shopping Cart ({cartCount} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-4"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#0a0a0f] overflow-hidden shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-sm font-medium text-[#f8f9fa] hover:text-[#a29bfe] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      disabled={cartLoading}
                      className="p-1.5 text-[#6c6c7e] hover:text-[#fd79a8] transition-colors shrink-0 disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-[#6c6c7e] capitalize mt-1">{item.product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-[#0a0a0f] rounded-lg border border-[#2a2a3a]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={cartLoading}
                        className="w-8 h-8 flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm text-[#f8f9fa]">
                        {cartLoading ? <Loader2 size={12} className="animate-spin mx-auto" /> : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={cartLoading}
                        className="w-8 h-8 flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="text-lg font-medium text-[#6c5ce7]">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-[#6c5ce7] hover:text-[#a29bfe] transition-colors"
            >
              <ArrowRight size={14} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
              <h3 className="text-lg font-medium text-[#f8f9fa] mb-6">Order Summary</h3>

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

              <div className="border-t border-[#2a2a3a] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#f8f9fa] font-medium">Total</span>
                  <span className="text-xl font-medium text-[#6c5ce7]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartLoading || cart.length === 0}
                className="w-full h-14 bg-[#6c5ce7] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#a29bfe] transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package size={18} />
                {cartLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-[#fd79a8] mb-2">
                  Please sign in to checkout
                </p>
              )}

              {shipping > 0 && (
                <p className="text-xs text-center text-[#a0a0b0]">
                  Add ₹{(500 - cartTotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
