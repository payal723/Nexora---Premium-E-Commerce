

const API_BASE = import.meta.env.VITE_API_URL || '';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const config: RequestInit = {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  } else if (options.body) {
    config.body = options.body;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as T;
}

// Auth APIs
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request<{ success: boolean; user: { _id: string; name: string; email: string; role: string } }>('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  login: (email: string, password: string) =>
    request<{ success: boolean; user: { _id: string; name: string; email: string; role: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  logout: () =>
    request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  getMe: () =>
    request<{ success: boolean; user: { _id: string; name: string; email: string; role: string; address?: Record<string, string>; phone?: string } }>('/api/auth/me'),

  refresh: () =>
    request<{ success: boolean }>('/api/auth/refresh', { method: 'POST' }),
};

// Cart APIs
export interface CartItemResponse {
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    stock: number;
    isActive: boolean;
  };
  quantity: number;
  price: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
}

export const cartAPI = {
  getCart: () =>
    request<{ success: boolean; cart: CartResponse }>('/api/cart'),

  addToCart: (productId: string, quantity: number = 1) =>
    request<{ success: boolean; cart: CartResponse }>('/api/cart', {
      method: 'POST',
      body: { productId, quantity },
    }),

  updateItem: (productId: string, quantity: number) =>
    request<{ success: boolean; cart: CartResponse }>(`/api/cart/${productId}`, {
      method: 'PUT',
      body: { quantity },
    }),

  removeItem: (productId: string) =>
    request<{ success: boolean; cart: CartResponse }>(`/api/cart/${productId}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    request<{ success: boolean }>('/api/cart/clear', { method: 'DELETE' }),
};

// Order APIs
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsTotal: number;
  shippingCharge: number;
  tax: number;
  grandTotal: number;
  statusHistory: StatusHistory[];
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersListResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

export const orderAPI = {
  placeOrder: (shippingAddress: ShippingAddress, notes?: string) =>
    request<OrderResponse>('/api/orders', {
      method: 'POST',
      body: { shippingAddress, notes },
    }),

  getMyOrders: (page: number = 1) =>
    request<OrdersListResponse>(`/api/orders/my-orders?page=${page}`),

  getOrderById: (id: string) =>
    request<OrderResponse>(`/api/orders/${id}`),

  cancelOrder: (id: string, reason?: string) =>
    request<OrderResponse>(`/api/orders/${id}/cancel`, {
      method: 'PATCH',
      body: { reason },
    }),
};

// Product APIs
export const productAPI = {
 getProducts: () =>
  request<{ success: boolean; products: unknown[] }>('/api/products'),

 getProductById: (id: string) =>
  request<{ success: boolean; product: Product }>(`/api/products/${id}`),
};
