import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faXmark,
  faPlus,
  faMinus,
  faTrashCan,
  faArrowRight,
  faBagShopping
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '../context/CartContext';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { createOrder } from '../services/api';

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

  const [checkoutData, setCheckoutData] = useState(() => {
    try {
      const saved = localStorage.getItem('a2_customer_checkout_info');
      return saved ? JSON.parse(saved) : { name: '', phone: '', address: '', instructions: '' };
    } catch (e) {
      return { name: '', phone: '', address: '', instructions: '' };
    }
  });

  const [errors, setErrors] = useState({});
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

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
    if (!validateCheckout()) {
      return;
    }

    let orderNumber = null;
    try {
      // Record order in MongoDB backend
      const orderPayload = {
        customer: {
          name: checkoutData.name.trim(),
          phone: checkoutData.phone.trim(),
          address: checkoutData.address.trim(),
          notes: (checkoutData.instructions || '').trim(),
        },
        items: cart.map((item) => ({
          productId: item.id || item.slug,
          quantity: item.quantity,
        })),
        source: 'whatsapp',
      };
      const result = await createOrder(orderPayload);
      if (result && result.data && result.data.orderNumber) {
        orderNumber = result.data.orderNumber;
      }
    } catch (apiErr) {
      console.warn('Backend order recording skipped or failed, continuing with direct WhatsApp checkout:', apiErr.message);
    }

    // Build structured multi-item WhatsApp order message
    let message = `Assalam o Alaikum A2 Cravings! I would like to place an order:\n\n`;
    if (orderNumber) {
      message += `📋 *ORDER NUMBER:* #${orderNumber}\n\n`;
    }
    message += `🛒 *ORDER ITEMS:*\n`;
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} (Rs ${item.price} each) = Rs ${item.price * item.quantity}\n`;
    });

    message += `\n💰 *Total Bill:* Rs ${totalPrice.toLocaleString()}\n`;
    message += `👤 *Customer Name:* ${checkoutData.name.trim()}\n`;
    message += `📞 *Phone Number:* ${checkoutData.phone.trim()}\n`;
    message += `📍 *Delivery Address:* ${checkoutData.address.trim()}\n`;

    if (checkoutData.instructions.trim()) {
      message += `📝 *Instructions:* ${checkoutData.instructions.trim()}\n`;
    }

    message += `\nPlease confirm my order and share delivery time. Thank you!`;

    const orderUrl = getWhatsAppUrl(businessData.contact.whatsapp, message);
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
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
          {cart.length === 0 ? (
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
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with Subtotal and Primary Checkout Button */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total Amount:</span>
              <span className="cart-total-value">Rs {totalPrice.toLocaleString()}</span>
            </div>

            <p className="cart-delivery-note">
              Free & prompt delivery within Rawalpindi & nearby vicinities.
            </p>

            {showCheckoutForm ? (
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={handleCheckoutSubmit}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="btn-icon" />
                <span>Confirm Order on WhatsApp (Rs {totalPrice.toLocaleString()})</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={() => setShowCheckoutForm(true)}
              >
                <span>Proceed to Delivery & Checkout</span>
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
