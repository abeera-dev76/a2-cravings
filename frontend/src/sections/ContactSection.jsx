import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { businessData } from '../data/businessData';
import { menuItems } from '../data/menuData';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    foodItem: '',
    quantity: '1',
    instructions: ''
  });

  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Group menu items into structured categories
  const foodGroups = useMemo(() => [
    {
      label: 'Pastas',
      items: menuItems.filter((i) => i.category === 'pasta')
    },
    {
      label: 'Buns',
      items: menuItems.filter((i) => i.category === 'buns')
    },
    {
      label: 'Loaded Fries',
      items: menuItems.filter((i) => i.category === 'loaded-fries')
    },
    {
      label: 'Biryani',
      items: menuItems.filter((i) => i.category === 'biryani')
    },
    {
      label: 'Combo Deals & Extras',
      items: menuItems.filter((i) => i.category === 'combos')
    }
  ], []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectFoodItem = (itemValue) => {
    setFormData((prev) => ({ ...prev, foodItem: itemValue }));
    if (errors.foodItem) {
      setErrors((prev) => ({ ...prev, foodItem: '' }));
    }
    setIsDropdownOpen(false);
  };

  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDropdownOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your contact phone number.';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (e.g., 03145027631).';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your complete delivery address.';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a more detailed address (house, street, area, city).';
    }

    if (!formData.foodItem) {
      newErrors.foodItem = 'Please select a food item or deal from our menu.';
    }

    if (!formData.quantity || parseInt(formData.quantity, 10) < 1) {
      newErrors.quantity = 'Quantity must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build structured WhatsApp message
    let message = `Assalam o Alaikum A2 Cravings! I would like to place an order:\n\n`;
    message += `👤 *Customer Name:* ${formData.name.trim()}\n`;
    message += `📞 *Phone Number:* ${formData.phone.trim()}\n`;
    message += `📍 *Delivery Address:* ${formData.address.trim()}\n`;
    message += `🍽️ *Selected Item:* ${formData.foodItem}\n`;
    message += `🔢 *Quantity:* ${formData.quantity}\n`;

    if (formData.instructions.trim()) {
      message += `📝 *Instructions:* ${formData.instructions.trim()}\n`;
    }

    message += `\nPlease confirm my order and share the delivery details. Thank you!`;

    // Open WhatsApp with prefilled message
    const orderUrl = getWhatsAppUrl(businessData.contact.whatsapp, message);
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Assalam o Alaikum A2 Cravings! I have a question regarding your menu and orders."
  );

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge reveal-on-scroll">GET IN TOUCH</span>
          <h2 id="contact-heading" className="section-title reveal-on-scroll reveal-delay-1">
            Let's Talk About <span className="accent-gradient">Your Cravings</span>
          </h2>
          <p className="section-description reveal-on-scroll reveal-delay-2">
            Have a question or want to enjoy something delicious? Get in touch with A2 CRAVINGS.
            Fresh homemade food in Rawalpindi prepared with love and authentic flavors.
          </p>
        </div>

        {/* Contact Layout Grid: Info Cards (Left) & Quick Order Form (Right) */}
        <div className="contact-layout-grid">
          {/* Left Column: Contact Cards */}
          <div className="contact-info-col">
            <h3 className="contact-col-title reveal-on-scroll">Direct Channels</h3>
            <p className="contact-col-subtitle reveal-on-scroll reveal-delay-1">
              Reach out directly for orders, questions, or updates. We are always happy to help!
            </p>

            <div className="contact-cards-stack">
              {/* WhatsApp Card */}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card reveal-on-scroll anim-card-in"
                aria-label="Contact A2 Cravings on WhatsApp"
              >
                <div className="contact-card-icon-box whatsapp-box" aria-hidden="true">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">WhatsApp Orders</span>
                  <span className="contact-card-value">0314-5027631</span>
                  <span className="contact-card-action">Tap to chat with us →</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={businessData.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card reveal-on-scroll anim-card-in"
                style={{ transitionDelay: '0.1s' }}
                aria-label="Visit A2 Cravings on Instagram"
              >
                <div className="contact-card-icon-box instagram-box" aria-hidden="true">
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">Instagram</span>
                  <span className="contact-card-value">@a2_cravings</span>
                  <span className="contact-card-action">Follow our appetizing updates →</span>
                </div>
              </a>

              {/* Location Card */}
              <div
                className="contact-card location-card reveal-on-scroll anim-card-in"
                style={{ transitionDelay: '0.2s' }}
              >
                <div className="contact-card-icon-box location-box" aria-hidden="true">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">Location</span>
                  <span className="contact-card-value">{businessData.location.city}, {businessData.location.country}</span>
                  <span className="contact-card-desc">Serving fresh homemade orders in Rawalpindi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Order Form */}
          <div className="contact-form-col">
            <div className="contact-form-container reveal-on-scroll reveal-scale reveal-delay-1">
              <div className="form-header">
                <h3 className="form-title">Quick WhatsApp Order</h3>
                <p className="form-subtitle">
                  Fill in your details and send directly to our WhatsApp to confirm.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="order-form">
                {/* Customer Name */}
                <div className="form-group">
                  <label htmlFor="customer-name" className="form-label">
                    Customer Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`form-input ${errors.name ? 'has-error' : ''}`}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <span id="name-error" className="form-error-msg">{errors.name}</span>}
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="customer-phone" className="form-label">
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., 03145027631"
                    className={`form-input ${errors.phone ? 'has-error' : ''}`}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <span id="phone-error" className="form-error-msg">{errors.phone}</span>}
                </div>

                {/* Delivery Address */}
                <div className="form-group">
                  <label htmlFor="delivery-address" className="form-label">
                    Delivery Address <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="delivery-address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address, house number, street, area and city..."
                    className={`form-textarea ${errors.address ? 'has-error' : ''}`}
                    aria-invalid={errors.address ? 'true' : 'false'}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && <span id="address-error" className="form-error-msg">{errors.address}</span>}
                </div>

                {/* Food Item Dropdown & Quantity Row */}
                <div className="form-row-grid">
                  <div className="form-group flex-2">
                    <label htmlFor="food-item" className="form-label">
                      Select Food Item <span className="required-star">*</span>
                    </label>
                    <div className="custom-select-wrapper" ref={dropdownRef}>
                      <button
                        type="button"
                        id="food-item"
                        className={`custom-select-trigger ${isDropdownOpen ? 'is-open' : ''} ${errors.foodItem ? 'has-error' : ''}`}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        onKeyDown={handleDropdownKeyDown}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        aria-labelledby="food-item-label"
                      >
                        <span className={`trigger-label-text ${!formData.foodItem ? 'is-placeholder' : ''}`}>
                          {formData.foodItem || '-- Choose a delicious item --'}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`custom-select-chevron ${isDropdownOpen ? 'is-rotated' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Hidden input to maintain native form validation and submission compatibility */}
                      <input type="hidden" name="foodItem" value={formData.foodItem} />

                      {isDropdownOpen && (
                        <div
                          className="custom-dropdown-panel"
                          role="listbox"
                          aria-labelledby="food-item-label"
                        >
                          <div className="custom-dropdown-scroll">
                            {foodGroups.map((group) => (
                              <div key={group.label} className="custom-optgroup">
                                <div className="custom-optgroup-label">{group.label}</div>
                                <div className="custom-optgroup-items">
                                  {group.items.map((item) => {
                                    const itemValue = `${item.name} (Rs ${item.price})`;
                                    const isSelected = formData.foodItem === itemValue;
                                    return (
                                      <div
                                        key={item.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        className={`custom-option-item ${isSelected ? 'is-selected' : ''}`}
                                        onClick={() => handleSelectFoodItem(itemValue)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSelectFoodItem(itemValue);
                                          }
                                        }}
                                      >
                                        <div className="option-name-wrap">
                                          {isSelected && (
                                            <FontAwesomeIcon icon={faCheck} className="option-check-icon" aria-hidden="true" />
                                          )}
                                          <span className="option-item-name">{item.name}</span>
                                        </div>
                                        <span className="option-price-tag">Rs {item.price}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.foodItem && <span id="item-error" className="form-error-msg">{errors.foodItem}</span>}
                  </div>

                  {/* Quantity */}
                  <div className="form-group flex-1">
                    <label htmlFor="food-quantity" className="form-label">
                      Quantity <span className="required-star">*</span>
                    </label>
                    <input
                      id="food-quantity"
                      type="number"
                      name="quantity"
                      min="1"
                      max="50"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`form-input ${errors.quantity ? 'has-error' : ''}`}
                      aria-invalid={errors.quantity ? 'true' : 'false'}
                      aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                    />
                    {errors.quantity && <span id="quantity-error" className="form-error-msg">{errors.quantity}</span>}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div className="form-group">
                  <label htmlFor="additional-instructions" className="form-label">
                    Additional Instructions <span className="optional-tag">(Optional)</span>
                  </label>
                  <textarea
                    id="additional-instructions"
                    name="instructions"
                    rows="3"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="E.g., extra spicy, no onions, special delivery note..."
                    className="form-textarea"
                  />
                </div>

                {/* Submit Order Button */}
                <button type="submit" className="form-submit-btn">
                  <FontAwesomeIcon icon={faWhatsapp} className="btn-icon" />
                  <span>Submit Order on WhatsApp</span>
                </button>

                <p className="form-disclaimer">
                  Clicking submit opens your order directly in WhatsApp with 0314-5027631.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
