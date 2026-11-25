import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faXmark,
  faPlus,
  faMinus,
  faTrashCan,
  faArrowRight,
  faBagShopping,
  faCircleCheck,
  faTruckFast,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '../context/CartContext';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { createOrder, fetchDeliveryAreas } from '../services/api';
import { navigate } from '../utils/navigation';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [checkoutData, setCheckoutData] = useState(() => {
    try {
      const saved = localStorage.getItem('a2_customer_checkout_info');
      return saved ? JSON.parse(saved) : { name: '', phone: '', address: '', instructions: '' };
    } catch (e) {
      return { name: '', phone: '', address: '', instructions: '' };
    }
  });

  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [loadingAreas, setLoadingAreas] = useState(false);

  const [errors, setErrors] = useState({});
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [placedOrderSuccess, setPlacedOrderSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load active delivery areas when cart opens
  useEffect(() => {
    let isMounted = true;
    const loadAreas = async () => {
      try {
        setLoadingAreas(true);
        const areas = await fetchDeliveryAreas();
        if (isMounted) {
          setDeliveryAreas(areas);
          if (areas.length > 0) {
            try {
              const savedAreaId = localStorage.getItem('a2_selected_delivery_area_id');
              if (savedAreaId && areas.some((a) => a._id === savedAreaId)) {
                setSelectedAreaId(savedAreaId);
              }
            } catch (err) {}
          }
        }
      } catch (err) {
        console.warn('Could not load delivery areas:', err.message);
      } finally {
        if (isMounted) setLoadingAreas(false);
      }
    };

    if (isCartOpen) {
      loadAreas();
    }

    return () => {
      isMounted = false;
    };
  }, [isCartOpen]);

  const selectedArea = deliveryAreas.find((a) => a._id === selectedAreaId) || null;
  const foodSubtotal = totalPrice;
  const deliveryFee = selectedArea ? selectedArea.deliveryFee : 0;
  const grandTotal = foodSubtotal + deliveryFee;

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Prefill name and phone if customer is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setCheckoutData((prev) => {
        let changed = false;
        const updated = { ...prev };
        if (!updated.name.trim() && user.name) {
          updated.name = user.name;
          changed = true;
        }
        if (!updated.phone.trim() && user.phone) {
          updated.phone = user.phone;
          changed = true;
        }
        return changed ? updated : prev;
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => {
      const updated = { ...prev, [name]: value };
      try {
        localStorage.setItem('a2_customer_checkout_info', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedAreaId(areaId);
    try {
      localStorage.setItem('a2_selected_delivery_area_id', areaId);
    } catch (err) {}
    if (errors.deliveryArea) {
      setErrors((prev) => ({ ...prev, deliveryArea: '' }));
    }
  };

  const validateCheckout = () => {
    const newErrors = {};
    if (!checkoutData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!checkoutData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(checkoutData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (e.g. 03145027631).';
    }

    if (deliveryAreas.length > 0) {
      if (!selectedAreaId) {
        newErrors.deliveryArea = 'Please select your delivery area.';
      } else if (selectedArea && selectedArea.minOrderAmount > 0 && foodSubtotal < selectedArea.minOrderAmount) {
        newErrors.deliveryArea = `Minimum food order for ${selectedArea.name} is Rs ${selectedArea.minOrderAmount}. (Current subtotal: Rs ${foodSubtotal})`;
      }
    }

    if (!checkoutData.address.trim()) {
      newErrors.address = 'Please enter your delivery address.';
    } else if (checkoutData.address.trim().length < 8) {
      newErrors.address = 'Please provide full address (house, street, area).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    if (!validateCheckout()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Record order in MongoDB backend
      const orderPayload = {
        customer: {
          name: checkoutData.name.trim(),
          phone: checkoutData.phone.trim(),
          address: checkoutData.address.trim(),
          notes: (checkoutData.instructions || '').trim(),
        },
        deliveryAreaId: selectedAreaId || undefined,
        items: cart.map((item) => ({
          productId: item.id || item.slug,
          quantity: item.quantity,
        })),
        source: 'web',
      };

      const result = await createOrder(orderPayload);
      if (result && result.data && result.data.orderNumber) {
        const orderNumber = result.data.orderNumber;
        // Order successfully created — clear cart, close drawer, redirect to tracking page
        clearCart();
        closeCart();
        navigate(`/track-order?orderId=${encodeURIComponent(orderNumber)}`);
        return;
      } else {
        throw new Error('Could not obtain order confirmation from server.');
      }
    } catch (apiErr) {
      console.error('Order creation failed:', apiErr);
      setSubmitError(apiErr.message || 'Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} aria-modal="true" role="dialog">
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <FontAwesomeIcon icon={faBagShopping} className="cart-header-icon" />
            <h2 className="cart-header-title">Your Order Cart</h2>
            {totalCount > 0 && <span className="cart-badge-count">{totalCount}</span>}
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Content Body */}
        <div className="cart-drawer-body">
          {placedOrderSuccess ? (
            <div className="cart-order-success-view">
              <div className="cart-success-badge">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
              <h3 className="cart-success-title">Order Sent via WhatsApp!</h3>
              <p className="cart-success-desc">
                Your order was sent to our WhatsApp. Our team will confirm it shortly.
              </p>

              <div className="cart-success-actions">
                <a
                  href={placedOrderSuccess.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cart-reopen-wa-btn"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Re-open WhatsApp Chat</span>
                </a>

                <button
                  type="button"
                  className="cart-close-success-btn"
                  onClick={() => {
                    setPlacedOrderSuccess(null);
                    closeCart();
                  }}
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <h3 className="cart-empty-heading">Your cart is empty</h3>
              <p className="cart-empty-desc">
                Satisfy your cravings! Browse our authentic menu and add your favorite dishes.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-md cart-explore-btn"
                onClick={() => {
                  closeCart();
                  const menuEl = document.getElementById('menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Our Menu</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                      onError={(e) => {
                        if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                          e.currentTarget.src = item.fallbackImage;
                        } else {
                          e.currentTarget.src = '/images/hero/hero-food.png';
                        }
                      }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>

                      <div className="cart-item-price-row">
                        <span className="cart-item-unit-price">Rs {item.price} each</span>
                        <span className="cart-item-subtotal">Rs {item.price * item.quantity}</span>
                      </div>

                      <div className="cart-item-qty-bar">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form Toggle / Details */}
              <div className="cart-checkout-section">
                {!showCheckoutForm ? (
                  <button
                    type="button"
                    className="btn-toggle-checkout"
                    onClick={() => setShowCheckoutForm(true)}
                  >
                    <span>Add Delivery Details (Required for WhatsApp Order)</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="cart-delivery-form" noValidate>
                    <div className="cart-form-header">
                      <h4>Delivery Details</h4>
                      <button
                        type="button"
                        className="btn-link-collapse"
                        onClick={() => setShowCheckoutForm(false)}
                      >
                        Hide
                      </button>
                    </div>

                    <div className="cart-form-field">
                      <label htmlFor="cart-name">Your Name *</label>
                      <input
                        id="cart-name"
                        type="text"
                        name="name"
                        value={checkoutData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={`cart-input ${errors.name ? 'has-error' : ''}`}
                      />
                      {errors.name && <span className="cart-error-text">{errors.name}</span>}
                    </div>

                    <div className="cart-form-field">
                      <label htmlFor="cart-phone">Phone Number *</label>
                      <input
                        id="cart-phone"
                        type="tel"
                        name="phone"
                        value={checkoutData.phone}
                        onChange={handleInputChange}
                        placeholder="03145027631"
                        className={`cart-input ${errors.phone ? 'has-error' : ''}`}
                      />
                      {errors.phone && <span className="cart-error-text">{errors.phone}</span>}
                    </div>

                    {/* Delivery Area Dropdown Selector */}
                    {deliveryAreas.length > 0 && (
                      <div className="cart-form-field">
                        <label htmlFor="cart-delivery-area">Delivery Area *</label>
                        <select
                          id="cart-delivery-area"
                          name="deliveryArea"
                          value={selectedAreaId}
                          onChange={handleAreaChange}
                          className={`cart-input cart-select ${errors.deliveryArea ? 'has-error' : ''}`}
                        >
                          <option value="">-- Select Your Delivery Area --</option>
                          {deliveryAreas.map((area) => (
                            <option key={area._id} value={area._id}>
                              {area.name} — Rs {area.deliveryFee}
                              {area.estimatedTime ? ` (${area.estimatedTime})` : ''}
                              {area.minOrderAmount > 0 ? ` [Min: Rs ${area.minOrderAmount}]` : ''}
                            </option>
                          ))}
                        </select>
                        {errors.deliveryArea && (
                          <span className="cart-error-text" style={{ color: '#ff4d4f', fontSize: '0.82rem', marginTop: '0.25rem', display: 'block' }}>
                            {errors.deliveryArea}
                          </span>
                        )}
                        {selectedArea && selectedArea.minOrderAmount > 0 && (
                          <span style={{ fontSize: '0.78rem', color: foodSubtotal >= selectedArea.minOrderAmount ? '#25D366' : '#FF8C00', marginTop: '0.2rem', display: 'block' }}>
                            Minimum order for {selectedArea.name}: Rs {selectedArea.minOrderAmount} {foodSubtotal >= selectedArea.minOrderAmount ? '✓' : `(Add Rs ${selectedArea.minOrderAmount - foodSubtotal} more)`}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="cart-form-field">
                      <label htmlFor="cart-address">Complete Delivery Address *</label>
                      <textarea
                        id="cart-address"
                        name="address"
                        rows="2"
                        value={checkoutData.address}
                        onChange={handleInputChange}
                        placeholder="House / Street / Sector, Rawalpindi"
                        className={`cart-textarea ${errors.address ? 'has-error' : ''}`}
                      />
                      {errors.address && <span className="cart-error-text">{errors.address}</span>}
                    </div>

                    <div className="cart-form-field">
                      <label htmlFor="cart-notes">Instructions (Optional)</label>
                      <input
                        id="cart-notes"
                        type="text"
                        name="instructions"
                        value={checkoutData.instructions}
                        onChange={handleInputChange}
                        placeholder="E.g., extra spicy, no cutlery"
                        className="cart-input"
                      />
                    </div>

                    {submitError && (
                      <div
                        className="cart-error-banner"
                        style={{
                          color: '#ff4d4f',
                          background: 'rgba(255, 77, 79, 0.12)',
                          border: '1px solid rgba(255, 77, 79, 0.35)',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.85rem',
                          marginTop: '0.75rem',
                          textAlign: 'center',
                          fontWeight: 500,
                        }}
                      >
                        {submitError}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with Subtotal, Delivery Fee and Primary Checkout Button */}
        {!placedOrderSuccess && cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-price-breakdown">
              <div className="cart-breakdown-row">
                <span>Food Subtotal:</span>
                <span>Rs {foodSubtotal.toLocaleString()}</span>
              </div>
              <div className="cart-breakdown-row">
                <span>Delivery Charges:</span>
                <span className="cart-delivery-charge-val">
                  {selectedArea
                    ? `Rs ${selectedArea.deliveryFee.toLocaleString()} (${selectedArea.name})`
                    : (deliveryAreas.length > 0 ? 'Select area in checkout' : 'Rs 0')}
                </span>
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Total Payable:</span>
                <span className="cart-total-value">
                  Rs {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="cart-delivery-note">
              Prompt & fresh homemade delivery across Rawalpindi.
            </p>

            {showCheckoutForm ? (
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} spin className="btn-icon" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="btn-icon" />
                    <span>Confirm Order (Rs {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={() => setShowCheckoutForm(true)}
              >
                <span>Proceed to Checkout (Rs {grandTotal.toLocaleString()})</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}

            <button type="button" className="cart-clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
