import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { Product, CartItem, User, Order } from '@/types';
import { authAPI, cartAPI, orderAPI } from '@/lib/api';
import { toast } from 'sonner';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartLoading: boolean;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authLoading: boolean;
  isAuthenticated: boolean;

  // Orders
  orders: Order[];
  ordersLoading: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (shippingAddress: Record<string, string>, notes?: string) => Promise<Order | null>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected product for detail
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper: Convert backend cart items to frontend CartItem format
function mapCartItems(backendCart: { items: Array<{ product: { _id: string; name: string; price: number; images: { url: string }[]; stock: number; isActive: boolean }; quantity: number; price: number }>; totalPrice: number; totalItems: number }): CartItem[] {
  if (!backendCart || !backendCart.items) return [];
  return backendCart.items.map((item) => ({
    product: {
      id: item.product._id,
      name: item.product.name,
      category: '',
      price: item.price || item.product.price,
      image: item.product.images?.[0]?.url || '/placeholder.jpg',
      rating: 0,
      reviews: 0,
      description: '',
      features: [],
      inStock: item.product.stock > 0 && item.product.isActive,
    },
    quantity: item.quantity,
  }));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexora_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const authChecked = useRef(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.success && response.user) {
          setUser({
            id: response.user._id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            address: response.user.address,
            phone: response.user.phone,
          });
          // Fetch cart after auth confirmed
          await fetchCart();
        }
      } catch {
        // Not authenticated, that's fine
        setUser(null);
      } finally {
        setAuthLoading(false);
        authChecked.current = true;
      }
    };
    checkAuth();
  }, []);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await cartAPI.getCart();
      if (response.success && response.cart) {
        const mapped = mapCartItems(response.cart);
        setCart(mapped);
      }
    } catch {
      // If cart fetch fails, just keep empty cart
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback(async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    try {
      setCartLoading(true);
      const response = await cartAPI.addToCart(product.id, 1);
      if (response.success) {
        const mapped = mapCartItems(response.cart);
        setCart(mapped);
        toast.success(`${product.name} added to cart`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) return;
    try {
      setCartLoading(true);
      const response = await cartAPI.removeItem(productId);
      if (response.success) {
        const mapped = mapCartItems(response.cart);
        setCart(mapped);
        toast.info('Item removed from cart');
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      setCartLoading(true);
      const response = await cartAPI.updateItem(productId, quantity);
      if (response.success) {
        const mapped = mapCartItems(response.cart);
        setCart(mapped);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setCartLoading(false);
    }
  }, [user, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    toast.info('Cart cleared');
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      toast.success('Added to wishlist');
      return [...prev, productId];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      const response = await authAPI.login(email, password);
      if (response.success && response.user) {
        setUser({
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
        });
        // Fetch cart after login
        await fetchCart();
        toast.success('Welcome back!');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [fetchCart]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      const response = await authAPI.register(name, email, password);
      if (response.success && response.user) {
        setUser({
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
        });
        toast.success('Account created successfully!');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setCart([]);
      setOrders([]);
      toast.info('Logged out successfully');
    }
  }, []);

  // Orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getMyOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  const placeOrder = useCallback(async (shippingAddress: Record<string, string>, notes?: string) => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return null;
    }
    try {
      const sa = {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        zipCode: shippingAddress.zipCode || '',
        country: shippingAddress.country || 'India',
        phone: shippingAddress.phone || '',
      };
      const response = await orderAPI.placeOrder(sa, notes);
      if (response.success) {
        toast.success('Order placed successfully!');
        setCart([]);
        // Refresh orders
        await fetchOrders();
        return response.order;
      }
      return null;
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to place order');
      return null;
    }
  }, [user, fetchOrders]);

  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    try {
      const response = await orderAPI.cancelOrder(orderId, reason);
      if (response.success) {
        toast.success('Order cancelled');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? response.order : o))
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to cancel order');
    }
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isAuthenticated = !!user;

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartLoading,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        login,
        register,
        logout,
        authLoading,
        isAuthenticated,
        orders,
        ordersLoading,
        fetchOrders,
        placeOrder,
        cancelOrder,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
