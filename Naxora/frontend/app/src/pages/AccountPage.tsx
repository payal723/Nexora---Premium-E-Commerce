import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, LogOut, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, logout, orders } = useApp();

  if (!user) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Please sign in</h2>
          <p className="text-[#a0a0b0] mb-6">Sign in to view your account details</p>
          <Link
            to="/"
            className="inline-flex px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center text-[#a29bfe] text-xl font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-medium text-[#f8f9fa]">{user.name}</h1>
              <p className="text-sm text-[#a0a0b0]">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Link
            to="/cart"
            className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-5 text-center hover:border-[#6c5ce7] transition-colors group"
          >
            <ShoppingBag size={24} className="mx-auto text-[#6c5ce7] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-[#f8f9fa]">My Cart</p>
          </Link>
          <Link
            to="/wishlist"
            className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-5 text-center hover:border-[#fd79a8] transition-colors group"
          >
            <Heart size={24} className="mx-auto text-[#fd79a8] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-[#f8f9fa]">Wishlist</p>
          </Link>
          <div className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-5 text-center">
            <MapPin size={24} className="mx-auto text-[#00cec9] mb-2" />
            <p className="text-sm text-[#f8f9fa]">Addresses</p>
          </div>
          <Link
            to="/orders"
            className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-5 text-center hover:border-[#a29bfe] transition-colors group"
          >
            <Package size={24} className="mx-auto text-[#a29bfe] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-[#f8f9fa]">Orders ({orders.length})</p>
          </Link>
        </div>

        {/* Account Details */}
        <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
          <h2 className="text-lg font-medium text-[#f8f9fa] mb-4">Account Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-[#2a2a3a]">
              <span className="text-sm text-[#a0a0b0]">Full Name</span>
              <span className="text-sm text-[#f8f9fa]">{user.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#2a2a3a]">
              <span className="text-sm text-[#a0a0b0]">Email</span>
              <span className="text-sm text-[#f8f9fa]">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#2a2a3a]">
              <span className="text-sm text-[#a0a0b0]">Member Since</span>
              <span className="text-sm text-[#f8f9fa]">June 2026</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#a0a0b0]">Account Type</span>
              <span className="text-sm text-[#00cec9]">Premium</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              toast.info('Logged out successfully');
            }}
            className="mt-6 flex items-center gap-2 text-sm text-[#fd79a8] hover:text-[#fd79a8]/80 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
