import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadset,
  faPhone,
  faLocationDot,
  faClock,
  faPaperPlane,
  faMotorcycle,
  faHouse,
  faChevronRight,
  faCommentDots,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SEO from '../components/SEO';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Construct formatted WhatsApp message
    const msg = [
      `*NEW INQUIRY — A2 CRAVINGS*`,
      `---------------------------------`,
      `*Name:* ${formData.name.trim() || 'Valued Customer'}`,
      formData.phone.trim() ? `*Phone:* ${formData.phone.trim()}` : null,
      `*Topic:* ${formData.inquiryType}`,
      `*Message:*`,
      formData.message.trim() || 'Hello, I would like to inquire about your menu and delivery.',
      `---------------------------------`,
      `Sent via A2 CRAVINGS Website Contact Form`
    ]
      .filter(Boolean)
      .join('\n');

    const targetUrl = getWhatsAppUrl(businessData.contact.whatsapp, msg);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Contact Us"
        description="Get in touch with A2 CRAVINGS in Rawalpindi. Reach our kitchen directly on WhatsApp at 0314-5027631 or follow our Instagram @a2_cravings for fresh homemade food delivery."
      />

      <Navbar />

      {/* Ambient Lighting */}
      <div className="legal-bg-ambient" aria-hidden="true">
        <div className="legal-glow-circle-1" />
        <div className="legal-glow-circle-2" />
      </div>

      {/* Hero Header */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          {/* Top Navigation & Breadcrumbs */}
          <div className="policy-top-bar">
            <a
              href="/"
              className="policy-back-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              aria-label="Back to A2 CRAVINGS Home"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="policy-back-icon" />
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
                Home
              </a>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-parent">Help & Support</span>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-current">Contact Us</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faHeadset} className="legal-badge-icon" />
            <span>Direct Kitchen Support</span>
          </div>

          <h1 className="legal-title">
            Get in <span className="text-gradient">Touch</span>
          </h1>

          <p className="legal-subtitle">
            Craving freshly prepared pasta, loaded fries, stuffed buns, or authentic biryani? We are just a message or call away in {businessData.location.city}!
          </p>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          {/* 3 Prominent Contact Channels */}
          <div className="contact-cards-grid">
            {/* WhatsApp Card */}
            <div className="contact-card-box">
              <div className="contact-card-icon wa" aria-hidden="true">
                <FontAwesomeIcon icon={faWhatsapp} />
              </div>
              <h3 className="contact-card-title">Chat on WhatsApp</h3>
              <p className="contact-card-meta">
                Fastest way to order, track deliveries, or ask questions directly with our kitchen.
              </p>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="legal-btn legal-btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>{businessData.contact.whatsappDisplay}</span>
              </a>
            </div>

            {/* Instagram Card */}
            <div className="contact-card-box">
              <div className="contact-card-icon insta" aria-hidden="true">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
              <h3 className="contact-card-title">Follow on Instagram</h3>
              <p className="contact-card-meta">
                Check daily kitchen stories, new dishes, customer reviews, and secret specials.
              </p>
              <a
                href={businessData.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="legal-btn legal-btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span>@a2_cravings</span>
              </a>
            </div>

            {/* Location & Delivery Card */}
            <div className="contact-card-box">
              <div className="contact-card-icon location" aria-hidden="true">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <h3 className="contact-card-title">Kitchen & Delivery</h3>
              <p className="contact-card-meta">
                Homemade fresh kitchen serving {businessData.location.deliveryArea}.
              </p>
              <div
                className="legal-btn legal-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', pointerEvents: 'none' }}
              >
                <FontAwesomeIcon icon={faMotorcycle} />
                <span>{businessData.location.city}, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form Card */}
          <div className="legal-card">
            <div className="legal-section-header" style={{ marginBottom: '1.25rem' }}>
              <div className="legal-section-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faCommentDots} />
              </div>
              <div>
                <h2 className="legal-section-title">Send Us a Direct Message</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Fill out this quick form and it will open directly in WhatsApp with your message formatted.
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="contact-form-wrapper">
              <div className="contact-form-grid">
                <div className="contact-form-field">
                  <label htmlFor="contact-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    className="contact-form-input"
                    placeholder="e.g. Ali Ahmed"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    className="contact-form-input"
                    placeholder="e.g. 03XX-XXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact-form-field">
                <label htmlFor="contact-topic">What is your inquiry regarding?</label>
                <select
                  id="contact-topic"
                  name="inquiryType"
                  className="contact-form-input"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="Food Order Inquiry">Food Order / Menu Question</option>
                  <option value="Delivery Area & Time">Delivery Area & Time Inquiry</option>
                  <option value="Party or Bulk Catering">Party / Bulk Catering Order</option>
                  <option value="Custom Spice or Ingredients">Custom Ingredients / Dietary Question</option>
                  <option value="Feedback or Compliment">Customer Feedback or Suggestion</option>
                  <option value="Other Question">Other Question</option>
                </select>
              </div>

              <div className="contact-form-field">
                <label htmlFor="contact-message">Your Message or Order Notes *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows="4"
                  className="contact-form-textarea"
                  placeholder="Tell us what you crave or ask your question here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="legal-btn legal-btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem 1.5rem', fontSize: '1rem' }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Send Message via WhatsApp</span>
              </button>
            </form>

            {/* Operating Hours Note */}
            <div className="legal-callout" style={{ marginTop: '1.75rem', marginBottom: 0 }}>
              <FontAwesomeIcon icon={faClock} className="legal-callout-icon" />
              <div className="legal-callout-content">
                <strong>Kitchen Operating Hours & Response Time</strong>
                Our homemade kitchen operates daily <span className="legal-placeholder">[e.g. 1:00 PM – 11:30 PM]</span>. WhatsApp messages are typically answered within 5 to 15 minutes during operating hours.
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default ContactUs;
