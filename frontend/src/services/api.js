/**
 * A2 CRAVINGS — Reusable API Service
 * Connects React frontend to Express + MongoDB backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Normalizes a single product from MongoDB so frontend components
 * (FoodCard, CartContext, etc.) have a consistent `id` field.
 */
const normalizeProduct = (item) => {
  if (!item) return null;
  return {
    ...item,
    // Preserve backwards-compatibility for components expecting `item.id`
    id: item.slug || item._id,
  };
};

/**
 * Normalizes a single category object.
 */
const normalizeCategory = (cat) => {
  if (!cat) return null;
  return {
    ...cat,
    id: cat.slug || cat._id,
  };
};

/**
 * Fetch all active categories from MongoDB.
 * Automatically ensures the "All" category filter tab is present at the front.
 */
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch categories`);
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Invalid categories response format');
    }

    const normalized = data.data.map(normalizeCategory);

    // Ensure "All" filter tab is always first for UI navigation
    const hasAll = normalized.some((c) => c.id === 'all');
    if (!hasAll) {
      return [{ id: 'all', name: 'All' }, ...normalized];
    }
    return normalized;
  } catch (error) {
    console.error('API Error [fetchCategories]:', error.message);
    throw error;
  }
};

/**
 * Fetch products from MongoDB.
 * If category is passed (e.g. 'pasta'), it calls the backend filter API:
 *   GET /api/products?category=pasta
 * Otherwise:
 *   GET /api/products
 */
export const fetchProducts = async (category = 'all') => {
  try {
    let url = `${API_BASE_URL}/products`;
    if (category && category !== 'all') {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch products`);
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Invalid products response format');
    }

    return data.data.map(normalizeProduct);
  } catch (error) {
    console.error(`API Error [fetchProducts (category=${category})]:`, error.message);
    throw error;
  }
};

/**
 * Fetch a single product by slug or MongoDB _id.
 */
export const fetchProductById = async (idOrSlug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Product not found`);
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      throw new Error('Product not found in response');
    }

    return normalizeProduct(data.data);
  } catch (error) {
    console.error(`API Error [fetchProductById (${idOrSlug})]:`, error.message);
    throw error;
  }
};

/**
 * Create a new order in MongoDB.
 * Backend verifies items and calculates official prices from DB.
 */
export const createOrder = async (orderPayload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP ${res.status}: Failed to create order`);
    }

    return data;
  } catch (error) {
    console.error('API Error [createOrder]:', error.message);
    throw error;
  }
};

/**
 * Fetch an order safely by orderNumber or MongoDB _id.
 */
export const fetchOrderById = async (orderId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP ${res.status}: Failed to fetch order`);
    }

    return data.data;
  } catch (error) {
    console.error(`API Error [fetchOrderById (${orderId})]:`, error.message);
    throw error;
  }
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin Authentication & Order Management API Methods
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('a2_admin_token');
};

export const getAdminUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('a2_admin_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const adminLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('a2_admin_token');
    localStorage.removeItem('a2_admin_user');
  }
};

export const adminLogin = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('a2_admin_token', data.token);
      localStorage.setItem('a2_admin_user', JSON.stringify(data.admin));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminProfile = async () => {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    if (res.status === 401) adminLogout();
    throw new Error(data.message || 'Failed to fetch admin profile');
  }
  return data.data;
};

export const fetchAdminOrders = async ({ page = 1, limit = 20, status = 'all' } = {}) => {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated. Please log in.');

  let url = `${API_BASE_URL}/admin/orders?page=${page}&limit=${limit}`;
  if (status && status !== 'all') {
    url += `&status=${encodeURIComponent(status)}`;
  }

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    if (res.status === 401) {
      adminLogout();
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.message || 'Failed to load orders.');
  }

  return data;
};

export const updateAdminOrderStatus = async (orderId, newStatus) => {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated. Please log in.');

  const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    if (res.status === 401) {
      adminLogout();
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.message || 'Failed to update order status.');
  }

  return data;
};

/**
 * Check backend health status.
 */
export const checkApiHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

export default {
  fetchCategories,
  fetchProducts,
  fetchProductById,
  createOrder,
  fetchOrderById,
  adminLogin,
  adminLogout,
  getAdminToken,
  getAdminUser,
  fetchAdminProfile,
  fetchAdminOrders,
  updateAdminOrderStatus,
  checkApiHealth,
  API_BASE_URL,
};
