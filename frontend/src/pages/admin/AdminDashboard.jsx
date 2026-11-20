import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faBoxesStacked,
  faClock,
  faCircleCheck,
  faTruckFast,
  faBan,
  faFire,
  faMagnifyingGlass,
  faRightFromBracket,
  faHouse,
  faReceipt,
  faPhone,
  faLocationDot,
  faUserShield,
  faArrowsRotate,
  faXmark,
  faBars,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import {
  getAdminToken,
  getAdminUser,
  adminLogout,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminProfile
} from '../../services/api';
import { navigate } from '../../utils/navigation';
import './admin.css';

export const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(() => getAdminUser());
  const [activeTab, setActiveTab] = useState('orders'); // 'overview' | 'orders'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [allOrdersForStats, setAllOrdersForStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateToast, setUpdateToast] = useState(null);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Auth Guard
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Verify token validity with backend
    fetchAdminProfile()
      .then((profile) => {
        setAdminUser(profile);
      })
      .catch(() => {
        adminLogout();
        navigate('/admin/login');
      });
  }, []);

  // 2. Fetch Orders for current view
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders({
        page,
        limit: 15,
        status: statusFilter,
      });
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  // 3. Fetch all orders (up to 100) for real overview statistics
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchAdminOrders({ page: 1, limit: 100, status: 'all' });
      setAllOrdersForStats(data.data || []);
    } catch (err) {
      console.warn('Could not load stats data:', err.message);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [loadOrders, loadStats]);

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Open Order Details Modal
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setModalStatus(order.status);
    setUpdateToast(null);
  };

  // Handle Order Status Update
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !modalStatus || modalStatus === selectedOrder.status) {
      return;
    }

    setUpdatingStatus(true);
    setUpdateToast(null);
    try {
      const result = await updateAdminOrderStatus(selectedOrder.orderNumber, modalStatus);
      setUpdateToast({ type: 'success', text: `Status updated to '${modalStatus}' successfully!` });

      // Update selected order in state
      setSelectedOrder(result.data);

      // Refresh list and stats
      loadOrders();
      loadStats();
    } catch (err) {
      setUpdateToast({ type: 'error', text: err.message || 'Failed to update status.' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Calculate Real Statistics
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

  // Filtered orders by client-side search query
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

  return (
    <div className="admin-shell">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div className="admin-logo-wrap">
          <div className="admin-logo-dot" />
          <span className="admin-brand-name">A2 <span>CRAVINGS</span></span>
          <span className="admin-badge-portal">Admin</span>
        </div>
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-wrap">
            <div className="admin-logo-dot" />
            <span className="admin-brand-name">A2 <span>CRAVINGS</span></span>
          </div>
          <span className="admin-badge-portal">Admin</span>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setSidebarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faChartPie} />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              setSidebarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faBoxesStacked} />
            <span>Orders Management</span>
          </button>

          <button
            type="button"
            className="admin-nav-item"
            onClick={() => {
              navigate('/');
            }}
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>Customer Website</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">
              {(adminUser?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{adminUser?.name || 'Admin'}</span>
              <span className="admin-user-email">{adminUser?.email || ''}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-title-wrap">
            <h1>
              {activeTab === 'overview' ? 'Kitchen & Sales Overview' : 'Live Orders Management'}
            </h1>
            <p>
              Real-time MongoDB orders data from your A2 CRAVINGS food ordering platform.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={() => {
              loadOrders();
              loadStats();
            }}
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* ─── Real Statistics Cards ─── */}
        <section className="admin-stats-grid" aria-label="Key Performance Indicators">
          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('all');
            }}
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
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('pending');
            }}
          >
            <div className="admin-stat-icon-wrap pending">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Pending</span>
              <span className="admin-stat-value">{stats.pending}</span>
            </div>
          </div>

          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('confirmed');
            }}
          >
            <div className="admin-stat-icon-wrap confirmed">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Confirmed</span>
              <span className="admin-stat-value">{stats.confirmed}</span>
            </div>
          </div>

          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('preparing');
            }}
          >
            <div className="admin-stat-icon-wrap preparing">
              <FontAwesomeIcon icon={faFire} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Preparing</span>
              <span className="admin-stat-value">{stats.preparing}</span>
            </div>
          </div>

          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('out_for_delivery');
            }}
          >
            <div className="admin-stat-icon-wrap delivery">
              <FontAwesomeIcon icon={faTruckFast} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Out For Delivery</span>
              <span className="admin-stat-value">{stats.out_for_delivery}</span>
            </div>
          </div>

          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('delivered');
            }}
          >
            <div className="admin-stat-icon-wrap delivered">
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Delivered</span>
              <span className="admin-stat-value">{stats.delivered}</span>
            </div>
          </div>
        </section>

        {/* ─── Orders Controls Bar (Filters & Search) ─── */}
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

        {/* ─── Orders Table ─── */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#FF8C00' }}>
              <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
              <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading live orders from MongoDB...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#F87171' }}>
              <p>{error}</p>
              <button
                type="button"
                className="admin-action-btn"
                style={{ marginTop: '1rem' }}
                onClick={loadOrders}
              >
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
                      <td>
                        <span className="admin-ord-num">#{ord.orderNumber}</span>
                      </td>
                      <td>
                        <span className="admin-cust-name">{ord.customer?.name}</span>
                      </td>
                      <td>
                        <span className="admin-cust-phone">{ord.customer?.phone}</span>
                      </td>
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
                      <td>
                        {ord.totalItems || ord.items?.reduce((s, i) => s + i.quantity, 0) || 1} items
                      </td>
                      <td>
                        <strong style={{ color: '#FF8C00' }}>Rs {ord.totalAmount?.toLocaleString()}</strong>
                      </td>
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
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
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
              {/* Status Update Row */}
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

              {/* Customer Information (Full unmasked for admin) */}
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
    </div>
  );
};

export default AdminDashboard;
