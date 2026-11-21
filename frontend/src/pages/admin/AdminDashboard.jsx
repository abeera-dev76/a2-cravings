import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faReceipt,
  faUtensils,
  faLayerGroup,
  faUsers,
  faGlobe,
  faChartLine,
  faGear,
  faChevronLeft,
  faChevronRight,
  faBoxesStacked,
  faClock,
  faCircleCheck,
  faFire,
  faTruckFast,
  faBan,
  faMagnifyingGlass,
  faRightFromBracket,
  faHouse,
  faArrowsRotate,
  faXmark,
  faBars,
  faCircleNotch,
  faArrowRight,
  faUser,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import {
  getAdminToken,
  getAdminUser,
  adminLogout,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminProfile,
  fetchProducts,
  fetchCategories,
  fetchAdminUserStats,
  fetchAdminUsers,
  fetchAdminUserById
} from '../../services/api';
import { navigate } from '../../utils/navigation';
import './admin.css';

export const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(() => getAdminUser());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'menu' | 'categories' | 'customers' | 'website' | 'analytics' | 'settings'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Orders State
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [allOrdersForStats, setAllOrdersForStats] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Products & Categories State (for live Menu & Categories tabs)
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');
  const [menuSearch, setMenuSearch] = useState('');

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateToast, setUpdateToast] = useState(null);

  // Registered Users State (MongoDB User Management)
  const [userStats, setUserStats] = useState({ totalUsers: 0, newUsersToday: 0, newUsersThisMonth: 0 });
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Auth Guard
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAdminProfile()
      .then((profile) => setAdminUser(profile))
      .catch(() => {
        adminLogout();
        navigate('/admin/login');
      });
  }, []);

  // 2. Load Orders
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await fetchAdminOrders({
        page,
        limit: 15,
        status: statusFilter,
      });
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setOrdersError(err.message || 'Failed to load orders.');
    } finally {
      setLoadingOrders(false);
    }
  }, [page, statusFilter]);

  // 3. Load all orders (up to 100) for real overview statistics
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchAdminOrders({ page: 1, limit: 100, status: 'all' });
      setAllOrdersForStats(data.data || []);
    } catch (err) {
      console.warn('Could not load statistics data:', err.message);
    }
  }, []);

  // 4. Load live products and categories from MongoDB
  const loadMenuData = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts('all'),
        fetchCategories(),
      ]);
      setProductsList(prods || []);
      setCategoriesList(cats || []);
    } catch (err) {
      console.warn('Could not load menu/categories:', err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // 5. Load registered users from MongoDB
  const loadUsersData = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const [statsData, usersData] = await Promise.all([
        fetchAdminUserStats(),
        fetchAdminUsers({ page: usersPage, limit: 15, search: usersSearch }),
      ]);
      setUserStats(statsData || { totalUsers: 0, newUsersToday: 0, newUsersThisMonth: 0 });
      setUsersList(usersData.data || []);
      setUsersTotalPages(usersData.totalPages || 1);
    } catch (err) {
      setUsersError(err.message || 'Failed to load users from database.');
    } finally {
      setLoadingUsers(false);
    }
  }, [usersPage, usersSearch]);

  useEffect(() => {
    loadOrders();
    loadStats();
    loadMenuData();
    loadUsersData();
  }, [loadOrders, loadStats, loadMenuData, loadUsersData]);

  // Open Individual Customer Details Modal
  const handleOpenUserDetail = async (userId) => {
    setLoadingUserDetail(true);
    try {
      const detail = await fetchAdminUserById(userId);
      setSelectedUserDetail(detail);
    } catch (err) {
      console.error('Failed to load user detail:', err.message);
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Open Order Details Modal
  const handleOpenDetails = (ord) => {
    setSelectedOrder(ord);
    setModalStatus(ord.status);
    setUpdateToast(null);
  };

  // Handle Order Status Update
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !modalStatus || modalStatus === selectedOrder.status) return;

    setUpdatingStatus(true);
    setUpdateToast(null);
    try {
      const result = await updateAdminOrderStatus(selectedOrder.orderNumber, modalStatus);
      setUpdateToast({ type: 'success', text: `Status updated to '${modalStatus}' successfully!` });
      setSelectedOrder(result.data);
      loadOrders();
      loadStats();
    } catch (err) {
      setUpdateToast({ type: 'error', text: err.message || 'Failed to update status.' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Calculate Real Statistics from live MongoDB orders
  const stats = useMemo(() => {
    const counts = {
      total: allOrdersForStats.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };

    allOrdersForStats.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
      if (o.status !== 'cancelled') {
        counts.totalRevenue += o.totalAmount || 0;
      }
    });

    return counts;
  }, [allOrdersForStats]);

  // Filter orders by search query
  const displayedOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((o) => {
      const numMatch = (o.orderNumber || '').toLowerCase().includes(q);
      const nameMatch = (o.customer?.name || '').toLowerCase().includes(q);
      const phoneMatch = (o.customer?.phone || '').includes(q);
      return numMatch || nameMatch || phoneMatch;
    });
  }, [orders, searchQuery]);

  // Extract unique customers from real MongoDB orders (strictly no hardcoded fallbacks)
  const uniqueCustomers = useMemo(() => {
    const map = new Map();
    allOrdersForStats.forEach((o) => {
      const phone = o.customer?.phone?.trim();
      if (!phone) return;
      const orderSpent = o.status !== 'cancelled' ? (o.totalAmount || 0) : 0;
      if (!map.has(phone)) {
        map.set(phone, {
          name: (o.customer?.name || 'N/A').trim(),
          phone: phone,
          address: (o.customer?.address || 'N/A').trim(),
          orderCount: 1,
          totalSpent: orderSpent,
          lastOrderDate: o.createdAt,
        });
      } else {
        const existing = map.get(phone);
        existing.orderCount++;
        existing.totalSpent += orderSpent;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      }
    });
    return Array.from(map.values());
  }, [allOrdersForStats]);

  // Actual food categories count in MongoDB (excluding 'all' UI filter tab)
  const realCategoriesCount = useMemo(() => {
    return categoriesList.filter((c) => c.slug !== 'all' && c.id !== 'all').length;
  }, [categoriesList]);

  // Dynamic category filter tabs from actual MongoDB categories
  const menuCategoryTabs = useMemo(() => {
    const tabs = [{ slug: 'all', name: 'All Dishes' }];
    categoriesList.forEach((c) => {
      const slug = c.slug || c.id;
      if (slug && slug !== 'all' && !tabs.some((t) => t.slug === slug)) {
        tabs.push({ slug, name: c.name || slug.replace(/-/g, ' ') });
      }
    });
    return tabs;
  }, [categoriesList]);

  // Filtered products for Menu tab
  const displayedProducts = useMemo(() => {
    let prods = productsList;
    if (menuFilterCategory !== 'all') {
      prods = prods.filter((p) => p.category === menuFilterCategory);
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase().trim();
      prods = prods.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return prods;
  }, [productsList, menuFilterCategory, menuSearch]);

  // Organized Navigation Items (live database counts only, no dummy fallbacks)
  const navItems = [
    { id: 'overview',   label: 'Dashboard Overview', icon: faGaugeHigh },
    { id: 'orders',     label: 'Orders Management',  icon: faReceipt, count: stats.pending },
    { id: 'users',      label: 'Users',              icon: faUsers, count: userStats.totalUsers },
    { id: 'menu',       label: 'Menu & Products',    icon: faUtensils },
    { id: 'categories', label: 'Categories',         icon: faLayerGroup },
    { id: 'customers',  label: 'Order Customers',    icon: faUser, count: uniqueCustomers.length },
    { id: 'website',    label: 'Website Management', icon: faGlobe },
    { id: 'analytics',  label: 'Analytics & Reports',icon: faChartLine },
    { id: 'settings',   label: 'Settings',           icon: faGear },
  ];

  return (
    <div className="admin-shell">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div className="admin-logo-wrap">
          <img
            src="/images/branding/logo.png"
            alt="A2 CRAVINGS"
            className="admin-mobile-logo"
            onError={(e) => { e.currentTarget.src = '/images/branding/logo-white.png'; }}
          />
        </div>
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={() => setMobileDrawerOpen((prev) => !prev)}
          aria-label="Toggle navigation drawer"
        >
          <FontAwesomeIcon icon={mobileDrawerOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileDrawerOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* ─── Sidebar Navigation ─── */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''} ${mobileDrawerOpen ? 'is-open' : ''}`}>
        {/* Sidebar Header with Original Brand Logo */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand-box">
            <img
              src="/images/branding/logo.png"
              alt="A2 CRAVINGS Logo"
              className="admin-sidebar-logo-img"
              onError={(e) => { e.currentTarget.src = '/images/branding/logo-white.png'; }}
            />
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            type="button"
            className="admin-sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <FontAwesomeIcon icon={sidebarCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileDrawerOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <FontAwesomeIcon icon={item.icon} className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
                {item.count !== undefined && item.count > 0 && !sidebarCollapsed && (
                  <span
                    className="pill-badge"
                    style={{
                      marginLeft: 'auto',
                      background: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(255,140,0,0.18)',
                      color: isActive ? '#0A0A0A' : '#FF8C00',
                      fontWeight: 700,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Admin User Profile & Sign Out */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">
              {(adminUser?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{adminUser?.name || 'A2 Admin'}</span>
              <span className="admin-user-email">{adminUser?.email || 'admin@a2cravings.com'}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className={`admin-main ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
        {/* Upgraded Dashboard Heading */}
        <header className="admin-page-header">
          <div className="admin-page-title-wrap">
            <h1 className="admin-main-heading">
              A2 <span>CRAVINGS</span>
            </h1>
            <p className="admin-main-subtitle">
              Manage your restaurant operations, orders and menu in one place.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className={`admin-refresh-btn${isRefreshing ? ' is-refreshing' : ''}`}
              onClick={async () => {
                if (isRefreshing) return;
                setIsRefreshing(true);
                try {
                  await Promise.allSettled([
                    loadOrders(),
                    loadStats(),
                    loadUsersData(),
                    loadMenuData(),
                  ]);
                  setUpdateToast({ type: 'success', message: 'Data refreshed successfully' });
                  setTimeout(() => setUpdateToast(null), 3000);
                } catch {
                  setUpdateToast({ type: 'error', message: 'Some data failed to refresh' });
                  setTimeout(() => setUpdateToast(null), 3000);
                } finally {
                  setIsRefreshing(false);
                }
              }}
              disabled={isRefreshing}
              title="Refresh all data"
            >
              <FontAwesomeIcon icon={faArrowsRotate} spin={isRefreshing} />
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-site-link-btn"
              title="Open customer website in new tab"
            >
              <FontAwesomeIcon icon={faHouse} />
              <span>View Live Website</span>
            </a>
          </div>
        </header>

        {/* ─── TAB 1: DASHBOARD OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="admin-view-content">
            {/* Real KPI Statistics Grid */}
            <section className="admin-stats-grid" aria-label="Key Performance Indicators">
              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('all');
                }}
                title="Click to view all orders"
              >
                <div className="admin-stat-icon-wrap total">
                  <FontAwesomeIcon icon={faBoxesStacked} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Total Orders</span>
                  <span className="admin-stat-value">{stats.total}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('pending');
                }}
                title="Click to filter Pending orders"
              >
                <div className="admin-stat-icon-wrap pending">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Pending Orders</span>
                  <span className="admin-stat-value">{stats.pending}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('confirmed');
                }}
                title="Click to filter Confirmed orders"
              >
                <div className="admin-stat-icon-wrap confirmed">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Confirmed Orders</span>
                  <span className="admin-stat-value">{stats.confirmed}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('preparing');
                }}
                title="Click to filter Preparing orders"
              >
                <div className="admin-stat-icon-wrap preparing">
                  <FontAwesomeIcon icon={faFire} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Preparing Orders</span>
                  <span className="admin-stat-value">{stats.preparing}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('out_for_delivery');
                }}
                title="Click to filter Out For Delivery orders"
              >
                <div className="admin-stat-icon-wrap delivery">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Out for Delivery</span>
                  <span className="admin-stat-value">{stats.out_for_delivery}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('delivered');
                }}
                title="Click to filter Delivered orders"
              >
                <div className="admin-stat-icon-wrap delivered">
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Delivered Orders</span>
                  <span className="admin-stat-value">{stats.delivered}</span>
                </div>
              </div>

              <div
                className="admin-stat-card"
                onClick={() => {
                  setActiveTab('orders');
                  setStatusFilter('all');
                }}
                title="Total revenue from actual valid orders (strictly excludes cancelled orders)"
              >
                <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Valid Revenue</span>
                  <span className="admin-stat-value" style={{ color: '#10B981', fontSize: '1.25rem' }}>
                    Rs {stats.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </section>

            {/* Quick Action Shortcuts Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255, 140, 0, 0.25)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveTab('orders')}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', color: '#FFFFFF' }}>Live Orders Queue</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    Review, accept and update cooking status
                  </p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ color: '#FF8C00', fontSize: '1.2rem' }} />
              </div>

              <div
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveTab('menu')}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', color: '#FFFFFF' }}>Menu & Catalog</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    View {productsList.length} handcrafted dishes across {realCategoriesCount} categories
                  </p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ color: '#FF8C00', fontSize: '1.2rem' }} />
              </div>
            </div>

            {/* Recent Orders Preview Table */}
            <div className="admin-table-card">
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Recent Orders
                </h2>
                <button
                  type="button"
                  className="admin-action-btn"
                  onClick={() => setActiveTab('orders')}
                >
                  View All Orders →
                </button>
              </div>

              {allOrdersForStats.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No orders recorded yet.
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrdersForStats.slice(0, 5).map((ord) => (
                        <tr key={ord._id || ord.orderNumber}>
                          <td><span className="admin-ord-num">#{ord.orderNumber}</span></td>
                          <td><span className="admin-cust-name">{ord.customer?.name}</span></td>
                          <td><span className="admin-cust-phone">{ord.customer?.phone}</span></td>
                          <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </td>
                          <td><strong style={{ color: '#FF8C00' }}>Rs {ord.totalAmount?.toLocaleString()}</strong></td>
                          <td>
                            <span className={`admin-badge ${ord.status}`}>
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => handleOpenDetails(ord)}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: ORDERS MANAGEMENT ─── */}
        {activeTab === 'orders' && (
          <div className="admin-view-content">
            {/* Filter Pills & Search Bar */}
            <div className="admin-controls-card">
              <div className="admin-filter-tabs">
                {[
                  { id: 'all', label: 'All Orders', count: stats.total },
                  { id: 'pending', label: 'Pending', count: stats.pending },
                  { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                  { id: 'preparing', label: 'Preparing', count: stats.preparing },
                  { id: 'out_for_delivery', label: 'Out for Delivery', count: stats.out_for_delivery },
                  { id: 'delivered', label: 'Delivered', count: stats.delivered },
                  { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`admin-filter-pill ${statusFilter === tab.id ? 'is-active' : ''}`}
                    onClick={() => {
                      setStatusFilter(tab.id);
                      setPage(1);
                    }}
                  >
                    <span>{tab.label}</span>
                    <span className="pill-badge">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="admin-search-box">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by order #, name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="admin-table-card">
              {loadingOrders ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: '#FF8C00' }}>
                  <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                    Loading orders from MongoDB...
                  </p>
                </div>
              ) : ordersError ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#F87171' }}>
                  <p>{ordersError}</p>
                  <button type="button" className="admin-action-btn" onClick={loadOrders}>
                    Retry
                  </button>
                </div>
              ) : displayedOrders.length === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <FontAwesomeIcon icon={faBoxesStacked} size="2x" style={{ marginBottom: '1rem' }} />
                  <h3>No Orders Found</h3>
                  <p>There are no orders matching your current filter.</p>
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Date & Time</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedOrders.map((ord) => (
                        <tr key={ord._id || ord.orderNumber}>
                          <td><span className="admin-ord-num">#{ord.orderNumber}</span></td>
                          <td><span className="admin-cust-name">{ord.customer?.name}</span></td>
                          <td><span className="admin-cust-phone">{ord.customer?.phone}</span></td>
                          <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString('en-PK', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Recent'}
                          </td>
                          <td>{ord.totalItems || ord.items?.reduce((s, i) => s + i.quantity, 0) || (ord.items?.length || 0)} items</td>
                          <td><strong style={{ color: '#FF8C00' }}>Rs {ord.totalAmount?.toLocaleString()}</strong></td>
                          <td>
                            <span className={`admin-badge ${ord.status}`}>
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => handleOpenDetails(ord)}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="admin-pagination-bar">
                  <span>Page {page} of {totalPages}</span>
                  <div className="admin-pag-btns">
                    <button
                      type="button"
                      className="admin-pag-btn"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="admin-pag-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: USERS MANAGEMENT (REAL MONGODB USERS) ─── */}
        {activeTab === 'users' && (
          <div className="admin-view-content">
            {/* KPI Statistics Grid directly from MongoDB */}
            <section className="admin-stats-grid" aria-label="User Management Statistics">
              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap total">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Total Registered Users</span>
                  <span className="admin-stat-value">{userStats.totalUsers}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap pending" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">New Users Today</span>
                  <span className="admin-stat-value" style={{ color: '#10B981' }}>{userStats.newUsersToday}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap confirmed" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">New Users This Month</span>
                  <span className="admin-stat-value" style={{ color: '#3B82F6' }}>{userStats.newUsersThisMonth}</span>
                </div>
              </div>
            </section>

            {/* Search & Filter Controls */}
            <div className="admin-controls-card">
              <div className="admin-search-box" style={{ width: '100%', maxWidth: '450px' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by customer name, email or phone..."
                  value={usersSearch}
                  onChange={(e) => {
                    setUsersSearch(e.target.value);
                    setUsersPage(1);
                  }}
                />
              </div>

              <button
                type="button"
                className="admin-action-btn"
                onClick={loadUsersData}
                title="Refresh users from MongoDB"
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="admin-table-card">
              {loadingUsers ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: '#FF8C00' }}>
                  <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                    Loading registered users from MongoDB...
                  </p>
                </div>
              ) : usersError ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#F87171' }}>
                  <p>{usersError}</p>
                  <button type="button" className="admin-action-btn" onClick={loadUsersData}>
                    Retry
                  </button>
                </div>
              ) : usersList.length === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <FontAwesomeIcon icon={faUsers} size="2x" style={{ marginBottom: '1rem' }} />
                  <h3>No Registered Users Found</h3>
                  <p>There are no registered customer accounts matching your query in MongoDB.</p>
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Email Address</th>
                        <th>Phone Number</th>
                        <th>Registration Date</th>
                        <th>Account Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u._id || u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'rgba(255, 140, 0, 0.15)',
                                  color: '#FF8C00',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {(u.name || 'C')[0].toUpperCase()}
                              </div>
                              <strong style={{ color: '#FFFFFF' }}>{u.name}</strong>
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${u.email}`} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                              {u.email}
                            </a>
                          </td>
                          <td>
                            <a href={`tel:${u.phone}`} style={{ color: '#FF8C00', textDecoration: 'none' }}>
                              {u.phone}
                            </a>
                          </td>
                          <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('en-PK', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '999px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                background: u.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: u.status === 'active' ? '#10B981' : '#F87171',
                              }}
                            >
                              ● {u.status || 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => handleOpenUserDetail(u._id || u.id)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {usersTotalPages > 1 && (
                <div className="admin-pagination-bar">
                  <span>Page {usersPage} of {usersTotalPages}</span>
                  <div className="admin-pag-btns">
                    <button
                      type="button"
                      className="admin-pag-btn"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="admin-pag-btn"
                      disabled={usersPage >= usersTotalPages}
                      onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: MENU & PRODUCTS ─── */}
        {activeTab === 'menu' && (
          <div className="admin-view-content">
            <div className="admin-controls-card">
              <div className="admin-filter-tabs">
                {menuCategoryTabs.map((tab) => (
                  <button
                    key={tab.slug}
                    type="button"
                    className={`admin-filter-pill ${menuFilterCategory === tab.slug ? 'is-active' : ''}`}
                    onClick={() => setMenuFilterCategory(tab.slug)}
                  >
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              <div className="admin-search-box">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search dishes by name..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-card">
              {loadingProducts ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: '#FF8C00' }}>
                  <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                    Loading products from MongoDB...
                  </p>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <FontAwesomeIcon icon={faUtensils} size="2x" style={{ marginBottom: '1rem' }} />
                  <h3>No Dishes Found</h3>
                  <p>No products found in the database matching your criteria.</p>
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Dish Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Badge</th>
                        <th>Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedProducts.map((p) => (
                        <tr key={p.slug || p._id || p.id}>
                          <td>
                            <img
                              src={p.image || p.fallbackImage}
                              alt={p.name}
                              className="admin-product-thumb"
                              onError={(e) => { e.currentTarget.src = '/images/hero/hero-food.png'; }}
                            />
                          </td>
                          <td>
                            <strong style={{ color: '#FFFFFF' }}>{p.name}</strong>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)' }}>
                              {p.description ? p.description.slice(0, 70) + '...' : ''}
                            </p>
                          </td>
                          <td>
                            <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.7)' }}>
                              {p.category}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: '#FF8C00' }}>Rs {p.price}</strong>
                          </td>
                          <td>
                            {p.badge ? (
                              <span style={{ background: 'rgba(255,140,0,0.15)', color: '#FF8C00', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {p.badge}
                              </span>
                            ) : (
                              <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.82rem' }}>
                              ● Active (Ready)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: CATEGORIES ─── */}
        {activeTab === 'categories' && (
          <div className="admin-view-content">
            <div className="admin-table-card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF' }}>Active Food Categories</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Categories synced from MongoDB database
                </p>
              </div>

              {realCategoriesCount === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <FontAwesomeIcon icon={faLayerGroup} size="2x" style={{ marginBottom: '1rem' }} />
                  <h3>No Categories Found</h3>
                  <p>No food categories configured in MongoDB database.</p>
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Display Name</th>
                        <th>Slug Identifier</th>
                        <th>Display Order</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.filter((c) => c.slug || c.id !== 'all').map((cat, idx) => (
                        <tr key={cat.slug || cat._id || idx}>
                          <td><strong style={{ color: '#FFFFFF' }}>{cat.name}</strong></td>
                          <td><code style={{ color: '#FF8C00' }}>{cat.slug || cat.id}</code></td>
                          <td>Priority #{cat.order || idx + 1}</td>
                          <td>
                            <span style={{ color: '#10B981', fontWeight: 600 }}>● Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 5: CUSTOMERS ─── */}
        {activeTab === 'customers' && (
          <div className="admin-view-content">
            <div className="admin-table-card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF' }}>Customer Profiles</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Aggregated from authenticated MongoDB order history
                </p>
              </div>

              {uniqueCustomers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No customer records found yet.
                </div>
              ) : (
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Delivery Area</th>
                        <th>Total Orders</th>
                        <th>Total Spent</th>
                        <th>Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueCustomers.map((cust, i) => (
                        <tr key={i}>
                          <td><strong style={{ color: '#FFFFFF' }}>{cust.name}</strong></td>
                          <td>
                            <a href={`tel:${cust.phone}`} style={{ color: '#FF8C00', textDecoration: 'none' }}>
                              {cust.phone}
                            </a>
                          </td>
                          <td style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '240px' }}>{cust.address}</td>
                          <td>{cust.orderCount} order(s)</td>
                          <td><strong style={{ color: '#FF8C00' }}>Rs {cust.totalSpent.toLocaleString()}</strong></td>
                          <td style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                            {new Date(cust.lastOrderDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 6, 7, 8: COMING SOON MODULES ─── */}
        {(activeTab === 'website' || activeTab === 'analytics' || activeTab === 'settings') && (
          <div className="admin-coming-soon-card">
            <div className="admin-coming-soon-icon">
              <FontAwesomeIcon
                icon={
                  activeTab === 'website'
                    ? faGlobe
                    : activeTab === 'analytics'
                    ? faChartLine
                    : faGear
                }
              />
            </div>
            <span className="admin-coming-soon-badge">Roadmap Feature</span>
            <h2 className="admin-coming-soon-title">
              {activeTab === 'website'
                ? 'Website Management'
                : activeTab === 'analytics'
                ? 'Analytics & Financial Reports'
                : 'System Settings'}
            </h2>
            <p className="admin-coming-soon-desc">
              {activeTab === 'website'
                ? 'Direct CMS controls for homepage banners, deal announcements, and contact information are scheduled for the next release.'
                : activeTab === 'analytics'
                ? 'Advanced sales graphs, peak kitchen hours, and monthly revenue exports are coming soon.'
                : 'Kitchen thermal receipt printer integration, automated WhatsApp notification webhooks, and staff role permissions are in development.'}
            </p>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => setActiveTab('overview')}
            >
              ← Back to Dashboard Overview
            </button>
          </div>
        )}
      </main>

      {/* ─── Order Details Modal ─── */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                Order <span style={{ color: '#FF8C00' }}>#{selectedOrder.orderNumber}</span>
              </h2>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Status Update Control */}
              <div>
                <h3 className="admin-modal-section-title">Change Order Status</h3>
                <div className="admin-status-update-row">
                  <select
                    className="admin-status-select"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    className="admin-status-save-btn"
                    disabled={updatingStatus || modalStatus === selectedOrder.status}
                    onClick={handleUpdateStatus}
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                  </button>
                </div>

                {updateToast && (
                  <div className={`admin-toast ${updateToast.type}`}>
                    {updateToast.text}
                  </div>
                )}
              </div>

              {/* Customer Information (Full unmasked) */}
              <div>
                <h3 className="admin-modal-section-title">Customer Details</h3>
                <div className="admin-info-box">
                  <div className="admin-info-row">
                    <span className="admin-info-label">Customer Name</span>
                    <span className="admin-info-val">{selectedOrder.customer?.name}</span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Phone Number</span>
                    <span className="admin-info-val">
                      <a
                        href={`tel:${selectedOrder.customer?.phone}`}
                        style={{ color: '#FF8C00', textDecoration: 'none' }}
                      >
                        {selectedOrder.customer?.phone}
                      </a>
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Delivery Address</span>
                    <span className="admin-info-val">{selectedOrder.customer?.address}</span>
                  </div>
                  {selectedOrder.customer?.notes && (
                    <div className="admin-info-row">
                      <span className="admin-info-label">Special Notes</span>
                      <span className="admin-info-val" style={{ color: '#FBBF24' }}>
                        {selectedOrder.customer?.notes}
                      </span>
                    </div>
                  )}
                  <div className="admin-info-row">
                    <span className="admin-info-label">Order Placed</span>
                    <span className="admin-info-val">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString('en-PK')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ordered Products Snapshot */}
              <div>
                <h3 className="admin-modal-section-title">Ordered Items</h3>
                <div className="admin-info-box" style={{ padding: '0.5rem' }}>
                  <table className="admin-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="num-col">Qty</th>
                        <th className="num-col">Price</th>
                        <th className="num-col">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.name}</td>
                          <td className="num-col">x{it.quantity}</td>
                          <td className="num-col">Rs {it.price}</td>
                          <td className="num-col" style={{ color: '#FF8C00', fontWeight: 600 }}>
                            Rs {it.subtotal || it.price * it.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem 0.75rem 0.5rem',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>Grand Total:</span>
                    <span style={{ color: '#FF8C00' }}>Rs {selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Individual Customer Details Modal ─── */}
      {selectedUserDetail && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUserDetail(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                Customer: <span style={{ color: '#FF8C00' }}>{selectedUserDetail.name}</span>
              </h2>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedUserDetail(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div>
                <h3 className="admin-modal-section-title">Registration Details</h3>
                <div className="admin-info-box">
                  <div className="admin-info-row">
                    <span className="admin-info-label">Full Name</span>
                    <span className="admin-info-val">{selectedUserDetail.name}</span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Email Address</span>
                    <span className="admin-info-val">
                      <a href={`mailto:${selectedUserDetail.email}`} style={{ color: '#FF8C00', textDecoration: 'none' }}>
                        {selectedUserDetail.email}
                      </a>
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Phone Number</span>
                    <span className="admin-info-val">
                      <a href={`tel:${selectedUserDetail.phone}`} style={{ color: '#FF8C00', textDecoration: 'none' }}>
                        {selectedUserDetail.phone}
                      </a>
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Account Status</span>
                    <span
                      className="admin-info-val"
                      style={{ color: selectedUserDetail.status === 'active' ? '#10B981' : '#F87171' }}
                    >
                      ● {selectedUserDetail.status || 'Active'}
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Registered On</span>
                    <span className="admin-info-val">
                      {selectedUserDetail.createdAt
                        ? new Date(selectedUserDetail.createdAt).toLocaleString('en-PK')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span className="admin-info-label">Last Updated</span>
                    <span className="admin-info-val">
                      {selectedUserDetail.updatedAt
                        ? new Date(selectedUserDetail.updatedAt).toLocaleString('en-PK')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History for this customer */}
              <div>
                <h3 className="admin-modal-section-title">
                  Associated Orders ({selectedUserDetail.ordersCount || 0})
                </h3>
                {(!selectedUserDetail.orders || selectedUserDetail.orders.length === 0) ? (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    No orders placed with this customer's phone number yet.
                  </div>
                ) : (
                  <div className="admin-info-box" style={{ padding: '0.5rem' }}>
                    <table className="admin-items-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserDetail.orders.map((ord) => (
                          <tr key={ord._id || ord.orderNumber}>
                            <td>
                              <code style={{ color: '#FF8C00' }}>#{ord.orderNumber}</code>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                              {ord.createdAt
                                ? new Date(ord.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
                                : ''}
                            </td>
                            <td style={{ fontWeight: 600 }}>Rs {ord.totalAmount?.toLocaleString()}</td>
                            <td>
                              <span className={`admin-badge ${ord.status}`}>
                                {ord.status?.replace(/_/g, ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
