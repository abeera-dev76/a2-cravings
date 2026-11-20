import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faReceipt,
  faClock,
  faCircleCheck,
  faFire,
  faTruckFast,
  faBagShopping,
  faBan,
  faArrowsRotate,
  faHouse,
  faChevronRight,
  faArrowLeft,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SEO from '../components/SEO';
import { fetchOrderById } from '../services/api';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';
import '../styles/legal.css';
import '../styles/tracking.css';

// 5 Active Status Progression Steps
const TRACKING_STEPS = [
  {
    id: 'pending',
    title: 'Order Placed',
    desc: 'Received by kitchen',
    icon: faClock,
  },
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    desc: 'Accepted & queued',
    icon: faCircleCheck,
  },
  {
    id: 'preparing',
    title: 'Preparing Food',
    desc: 'Freshly handcrafted',
    icon: faFire,
  },
  {
    id: 'out_for_delivery',
    title: 'Out for Delivery',
    desc: 'Rider on the way',
    icon: faTruckFast,
  },
  {
    id: 'delivered',
    title: 'Delivered',
    desc: 'Enjoy your meal!',
    icon: faBagShopping,
  },
];

export const TrackOrder = () => {
  const [inputOrderNumber, setInputOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activePollingRef = useRef(null);

  // Parse order ID from URL query or hash on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrder = params.get('orderId') || params.get('order') || window.location.hash.replace('#', '');
      if (urlOrder) {
        const clean = decodeURIComponent(urlOrder).trim();
        setInputOrderNumber(clean);
        handleFetchOrder(clean, false);
      }
    }
  }, []);

  // Fetch Order Details
  const handleFetchOrder = useCallback(async (orderNum, isSilentRefresh = false) => {
    if (!orderNum || !orderNum.trim()) {
      setError('Please enter a valid order number (e.g. A2-20261120-5109).');
      return;
    }

    if (!isSilentRefresh) {
      setLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await fetchOrderById(orderNum.trim());
      setOrder(data);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      if (!isSilentRefresh) {
        setOrder(null);
        setError(err.message || 'Order not found. Please verify your order number.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Submit Search Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputOrderNumber.trim()) return;

    // Update URL without full reload
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/track-order?orderId=${encodeURIComponent(inputOrderNumber.trim())}`);
    }
    handleFetchOrder(inputOrderNumber.trim(), false);
  };

  // ─── Automatic Status Polling (Every 12s) ───
  useEffect(() => {
    // Clear any previous interval
    if (activePollingRef.current) {
      clearInterval(activePollingRef.current);
      activePollingRef.current = null;
    }

    // Only poll if we have an active, non-delivered, non-cancelled order
    if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
      activePollingRef.current = setInterval(() => {
        handleFetchOrder(order.orderNumber, true);
      }, 12000); // 12 seconds
    }

    return () => {
      if (activePollingRef.current) {
        clearInterval(activePollingRef.current);
      }
    };
  }, [order, handleFetchOrder]);

  // Determine current active step index
  const currentStepIndex = order
    ? TRACKING_STEPS.findIndex((s) => s.id === order.status)
    : -1;

  // WhatsApp Help Message for current order
  const orderWhatsAppUrl = order
    ? getWhatsAppUrl(
        businessData.contact.whatsapp,
        `Assalam o Alaikum A2 Cravings! I am tracking my order #${order.orderNumber}. Could you please share an update?`
      )
    : getWhatsAppUrl(businessData.contact.whatsapp, 'Assalam o Alaikum A2 Cravings! I have a question about my order.');

  return (
    <div className="policy-page-wrapper">
      <SEO
        title="Track Your Order | A2 CRAVINGS Rawalpindi"
        description="Track your A2 CRAVINGS homemade food order status in real time. Live kitchen preparation and delivery updates in Rawalpindi."
      />

      <Navbar />

      <main className="legal-page-main tracking-page-container">
        <div className="container">
          {/* Top Bar with Back Link & Breadcrumb */}
          <div className="policy-top-bar reveal-on-scroll">
            <a
              href="/"
              className="policy-back-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="policy-back-icon" aria-hidden="true" />
              <span>Back to Home</span>
            </a>

            <nav className="policy-breadcrumb" aria-label="Breadcrumb">
              <a
                href="/"
                className="policy-breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <FontAwesomeIcon icon={faHouse} style={{ marginRight: '0.4rem' }} aria-hidden="true" />
                <span>Home</span>
              </a>
              <span className="policy-breadcrumb-sep" aria-hidden="true">/</span>
              <span className="policy-breadcrumb-current" aria-current="page">Track Order</span>
            </nav>
          </div>

          {/* Search Card */}
          <div className="tracking-search-card">
            <h1 className="tracking-search-title">Track Your Food Order</h1>
            <p className="tracking-search-subtitle">
              Enter your A2 order number (found in your WhatsApp confirmation message) to view live preparation and delivery status.
            </p>

            <form onSubmit={handleSubmit} className="tracking-search-form" noValidate>
              <div className="tracking-input-wrapper">
                <FontAwesomeIcon icon={faReceipt} className="tracking-input-icon" />
                <input
                  type="text"
                  className="tracking-input"
                  placeholder="e.g. A2-20261120-5109"
                  value={inputOrderNumber}
                  onChange={(e) => setInputOrderNumber(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <button
                type="submit"
                className="tracking-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error / Not Found Message */}
          {error && !loading && (
            <div
              className="menu-state-card"
              style={{ maxWidth: '640px', margin: '0 auto 2.5rem' }}
              role="alert"
            >
              <div className="menu-state-icon-box error">
                <FontAwesomeIcon icon={faBan} />
              </div>
              <h3 className="menu-state-title">Order Not Found</h3>
              <p className="menu-state-desc">{error}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1.25rem' }}>
                Tip: Order numbers start with <strong>A2-</strong> (e.g. A2-20261120-5109). If you placed an order directly via WhatsApp, you can also ask us for your order update directly.
              </p>
              <a
                href={orderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-help-cta"
                style={{ display: 'inline-flex', margin: '0 auto' }}
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>Contact Kitchen on WhatsApp</span>
              </a>
            </div>
          )}

          {/* ─── Live Order Tracking Display ─── */}
          {order && (
            <div className="tracking-result-wrap">
              {/* Header Bar */}
              <div className="tracking-header-bar">
                <div className="tracking-ord-id-wrap">
                  <span className="tracking-ord-label">Order Number</span>
                  <span className="tracking-ord-number">#{order.orderNumber}</span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                    Placed on{' '}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently'}
                  </span>
                </div>

                <div className="tracking-live-tag-group">
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="tracking-live-pulse" title="Auto-refreshes every 12 seconds">
                      <span className="tracking-pulse-dot" />
                      <span>Live Updates Active</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="tracking-refresh-btn"
                    onClick={() => handleFetchOrder(order.orderNumber, false)}
                    disabled={isRefreshing}
                    title="Refresh status now"
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} spin={isRefreshing} />
                    <span>{isRefreshing ? 'Checking...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>

              {/* ─── Cancelled State vs Active Progress Tracker ─── */}
              {order.status === 'cancelled' ? (
                <div className="tracking-cancelled-card">
                  <FontAwesomeIcon icon={faBan} className="tracking-cancelled-icon" />
                  <h3 className="tracking-cancelled-title">Order Cancelled</h3>
                  <p className="tracking-cancelled-desc">
                    This order was cancelled. If you believe this is an error or would like to place a new order, please message us directly on WhatsApp.
                  </p>
                  <a
                    href={orderWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-help-cta"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    <span>Chat With Us on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <div className="tracking-stepper-card">
                  <div className="tracking-stepper-track">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isCompleted = currentStepIndex > idx;
                      const isActive = currentStepIndex === idx;

                      return (
                        <div
                          key={step.id}
                          className={`tracking-step ${isCompleted ? 'is-completed' : ''} ${isActive ? 'is-active' : ''}`}
                        >
                          {/* Connecting bar to next step (except last) */}
                          {idx < TRACKING_STEPS.length - 1 && (
                            <div className="tracking-step-line" />
                          )}

                          <div className="tracking-step-circle">
                            <FontAwesomeIcon icon={step.icon} />
                          </div>

                          <span className="tracking-step-title">{step.title}</span>
                          <span className="tracking-step-desc">{step.desc}</span>
                        </div>
                      );
                    })}
                  </div>

                  {lastRefreshed && (
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '1.75rem 0 0' }}>
                      Status checked at {lastRefreshed.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}

              {/* ─── Safe Order Summary Grid ─── */}
              <div className="tracking-details-grid">
                {/* Left Card: Customer & Status Info (Safe Masked) */}
                <div className="tracking-info-card">
                  <div className="tracking-card-header">
                    <FontAwesomeIcon icon={faReceipt} className="tracking-card-icon" />
                    <h3 className="tracking-card-title">Order Information</h3>
                  </div>

                  <div className="tracking-detail-row">
                    <span className="tracking-detail-label">Status</span>
                    <span className="tracking-detail-value" style={{ textTransform: 'capitalize', color: '#FF8C00' }}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="tracking-detail-row">
                    <span className="tracking-detail-label">Customer Name</span>
                    <span className="tracking-detail-value">{order.customer?.name || 'Customer'}</span>
                  </div>

                  <div className="tracking-detail-row">
                    <span className="tracking-detail-label">Contact Phone</span>
                    <span className="tracking-detail-value">{order.customer?.phone || '••••••••'}</span>
                  </div>

                  <div className="tracking-detail-row">
                    <span className="tracking-detail-label">Total Items</span>
                    <span className="tracking-detail-value">{order.totalItems || order.items?.length || 1}</span>
                  </div>

                  <a
                    href={orderWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-help-cta"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    <span>Need Help? Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Right Card: Ordered Items & Total */}
                <div className="tracking-info-card">
                  <div className="tracking-card-header">
                    <FontAwesomeIcon icon={faBagShopping} className="tracking-card-icon" />
                    <h3 className="tracking-card-title">Ordered Items</h3>
                  </div>

                  <div className="tracking-items-list">
                    {order.items?.map((item, i) => (
                      <div key={i} className="tracking-item-row">
                        <div>
                          <span className="tracking-item-name">{item.name}</span>
                          <span className="tracking-item-qty">x{item.quantity}</span>
                        </div>
                        <span className="tracking-item-price">
                          Rs {(item.subtotal || item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="tracking-total-row">
                    <span>Total Bill:</span>
                    <span className="tracking-total-amount">Rs {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default TrackOrder;
