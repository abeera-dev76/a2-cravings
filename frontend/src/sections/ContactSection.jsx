import React, { useState } from 'react';
import { businessData } from '../data/businessData';
import { menuItems } from '../data/menuData';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    foodItem: '',
    quantity: '1',
    instructions: ''
  });

  const [errors, setErrors] = useState({});

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
          <span className="section-badge">GET IN TOUCH</span>
          <h2 id="contact-heading" className="section-title">
            Let's Talk About <span className="accent-gradient">Your Cravings</span>
          </h2>
          <p className="section-description">
            Have a question or want to enjoy something delicious? Get in touch with A2 CRAVINGS.
            Fresh homemade food in Rawalpindi prepared with love and authentic flavors.
          </p>
        </div>

        {/* Contact Layout Grid: Info Cards (Left) & Quick Order Form (Right) */}
        <div className="contact-layout-grid">
          {/* Left Column: Contact Cards */}
          <div className="contact-info-col">
            <h3 className="contact-col-title">Direct Channels</h3>
            <p className="contact-col-subtitle">
              Reach out directly for orders, questions, or updates. We are always happy to help!
            </p>

            <div className="contact-cards-stack">
              {/* WhatsApp Card */}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card anim-card-in"
                aria-label="Contact A2 Cravings on WhatsApp"
              >
                <div className="contact-card-icon-box whatsapp-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                  </svg>
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
                className="contact-card anim-card-in"
                aria-label="Visit A2 Cravings on Instagram"
              >
                <div className="contact-card-icon-box instagram-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">Instagram</span>
                  <span className="contact-card-value">@a2_cravings</span>
                  <span className="contact-card-action">Follow our appetizing updates →</span>
                </div>
              </a>

              {/* Location Card */}
              <div className="contact-card location-card anim-card-in">
                <div className="contact-card-icon-box location-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
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
            <div className="contact-form-container anim-card-in">
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

                {/* Food Item Dropdown & Quantity Row */}
                <div className="form-row-grid">
                  <div className="form-group flex-2">
                    <label htmlFor="food-item" className="form-label">
                      Select Food Item <span className="required-star">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="food-item"
                        name="foodItem"
                        value={formData.foodItem}
                        onChange={handleChange}
                        className={`form-select ${errors.foodItem ? 'has-error' : ''}`}
                        aria-invalid={errors.foodItem ? 'true' : 'false'}
                        aria-describedby={errors.foodItem ? 'item-error' : undefined}
                      >
                        <option value="">-- Choose a delicious item --</option>
                        <optgroup label="Pastas">
                          {menuItems.filter((i) => i.category === 'pasta').map((item) => (
                            <option key={item.id} value={`${item.name} (Rs ${item.price})`}>
                              {item.name} — Rs {item.price}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Buns">
                          {menuItems.filter((i) => i.category === 'buns').map((item) => (
                            <option key={item.id} value={`${item.name} (Rs ${item.price})`}>
                              {item.name} — Rs {item.price}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Loaded Fries">
                          {menuItems.filter((i) => i.category === 'loaded-fries').map((item) => (
                            <option key={item.id} value={`${item.name} (Rs ${item.price})`}>
                              {item.name} — Rs {item.price}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Biryani">
                          {menuItems.filter((i) => i.category === 'biryani').map((item) => (
                            <option key={item.id} value={`${item.name} (Rs ${item.price})`}>
                              {item.name} — Rs {item.price}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Combo Deals">
                          {menuItems.filter((i) => i.category === 'combos').map((item) => (
                            <option key={item.id} value={`${item.name} (Rs ${item.price})`}>
                              {item.name} — Rs {item.price}
                            </option>
                          ))}
                        </optgroup>
                      </select>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                  </svg>
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
