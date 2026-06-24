import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, LogOut, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist, user, login, register, logout, setSearchQuery } = useApp();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
    { name: 'Deals', path: '/shop' },
    { name: 'New Arrivals', path: '/shop' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 100);
      setIsVisible(currentY < 100 || currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close auth modal on successful auth
  useEffect(() => {
    if (user && authOpen) {
      setAuthOpen(false);
      setAuthError('');
    }
  }, [user, authOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      setSearchQuery(input.value.trim());
      navigate('/shop');
      setSearchOpen(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      let success;
      if (authMode === 'login') {
        success = await login(email, password);
      } else {
        const name = formData.get('name') as string;
        success = await register(name, email, password);
      }
      if (success) {
        setAuthOpen(false);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#2a2a3a]'
            : 'bg-[#0a0a0f]/50 backdrop-blur-md border-b border-transparent'
        }`}
        style={{ height: '64px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-medium tracking-tight text-[#f8f9fa]">
              Nex<span className="text-[#6c5ce7]">ora</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-[#a29bfe]'
                    : 'text-[#a0a0b0] hover:text-[#f8f9fa]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div className="h-0.5 bg-[#6c5ce7] rounded-full mt-0.5" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link
              to="/wishlist"
              className="relative p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5 hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#fd79a8] text-[10px] text-white rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#6c5ce7] text-[10px] text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/account"
                  className="p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5"
                  aria-label="Account"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 text-[#a0a0b0] hover:text-[#fd79a8] transition-colors rounded-lg hover:bg-white/5"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthOpen(true); }}
                className="hidden sm:block px-4 py-2 text-sm bg-[#6c5ce7] text-white rounded-full hover:bg-[#a29bfe] transition-colors"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors rounded-lg hover:bg-white/5 md:hidden"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0f]/98 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a3a]">
            <span className="text-xl font-medium text-[#f8f9fa]">
              Nex<span className="text-[#6c5ce7]">ora</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 text-[#a0a0b0] hover:text-[#f8f9fa]"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-3 text-lg text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5 rounded-lg transition-colors"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-[#2a2a3a] mt-4 pt-4">
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-4 py-3 text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                <Heart size={18} /> Wishlist ({wishlist.length})
              </Link>
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShoppingCart size={18} /> My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-[#a0a0b0] hover:text-[#fd79a8] hover:bg-white/5 rounded-lg w-full"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setAuthOpen(true); setAuthMode('login'); }}
                  className="flex items-center gap-3 px-4 py-3 text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5 rounded-lg"
                >
                  <User size={18} /> Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6c6c7e]" size={20} />
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                autoFocus
                className="w-full h-14 pl-14 pr-14 bg-[#12121a] border border-[#2a2a3a] rounded-2xl text-[#f8f9fa] placeholder:text-[#6c6c7e] focus:outline-none focus:border-[#6c5ce7] text-lg"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6c6c7e] hover:text-[#f8f9fa]"
              >
                <X size={20} />
              </button>
            </form>
            <p className="text-center text-sm text-[#6c6c7e] mt-4">
              Press Enter to search or ESC to close
            </p>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => { setAuthOpen(false); setAuthError(''); }}
              className="absolute top-4 right-4 text-[#6c6c7e] hover:text-[#f8f9fa]"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-medium text-[#f8f9fa]">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-[#a0a0b0] mt-1">
                {authMode === 'login' ? 'Sign in to your account' : 'Join Nexora today'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-[#fd79a8]/10 border border-[#fd79a8]/20 rounded-xl text-sm text-[#fd79a8]">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm text-[#a0a0b0] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full h-12 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full h-12 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full h-12 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="Min 6 characters"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-[#6c5ce7] text-white rounded-xl font-medium hover:bg-[#a29bfe] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 size={16} className="animate-spin" />}
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#a0a0b0] mt-4">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                className="text-[#6c5ce7] hover:text-[#a29bfe]"
              >
                {authMode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
