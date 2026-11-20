import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faUserCheck,
  faDatabase,
  faLock,
  faCookieBite,
  faUserGear,
  faArrowsRotate,
  faHeadset,
  faHouse,
  faChevronRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SEO from '../components/SEO';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const whatsappInquiryUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Hello A2 CRAVINGS, I have a question regarding your Privacy Policy."
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Privacy Policy"
        description="Learn how A2 CRAVINGS protects customer information, handles orders securely, and respects your privacy when ordering homemade food in Rawalpindi."
      />

      {/* Persistent Navbar */}
      <Navbar />

      {/* Background Ambience */}
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
              <span className="policy-breadcrumb-parent">Help & Policies</span>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-current">Privacy Policy</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faShieldHalved} className="legal-badge-icon" />
            <span>Customer Trust & Data Protection</span>
          </div>

          <h1 className="legal-title">
            Privacy <span className="text-gradient">Policy</span>
          </h1>

          <p className="legal-subtitle">
            At {businessData.name}, we value your trust. This Privacy Policy clearly explains how we collect, use, and protect your information when you browse our website and place food orders.
          </p>

          <div className="legal-meta">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Applies to {businessData.location.city}, {businessData.location.country}</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          <div className="legal-card">
            {/* Quick Summary Callout */}
            <div className="legal-callout">
              <FontAwesomeIcon icon={faShieldHalved} className="legal-callout-icon" />
              <div className="legal-callout-content">
                <strong>Our Plain-Language Privacy Promise</strong>
                We only collect the essential details needed to cook and deliver your food (your name, delivery address, and phone number). We never sell your personal data or share it with unsolicited marketers.
              </div>
            </div>

            {/* Section 1 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <h2 className="legal-section-title">1. Information We Collect</h2>
              </div>
              <p className="legal-p">
                When you place an order with {businessData.name} through our website order forms, Cart checkout, or directly over WhatsApp, we collect only the necessary details required to fulfill and deliver your food:
              </p>
              <ul className="legal-list">
                <li><strong>Customer Name:</strong> To address you respectfully and label your food packages correctly.</li>
                <li><strong>Contact Phone Number:</strong> To coordinate your order status, confirm order details, and allow our delivery rider to call upon arrival.</li>
                <li><strong>Delivery Address:</strong> Your complete address (house/flat number, street, sector, landmarks) within {businessData.location.city} so our rider can deliver promptly.</li>
                <li><strong>Order & Item Preferences:</strong> Your selected food items, spice preference, quantity, and any special preparation notes.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faDatabase} />
                </div>
                <h2 className="legal-section-title">2. How We Use Your Information</h2>
              </div>
              <p className="legal-p">
                We use the information we collect strictly for food preparation and delivery purposes, including:
              </p>
              <ul className="legal-list">
                <li>Preparing your dishes fresh in our hygienic home kitchen.</li>
                <li>Calculating delivery estimates and coordinating with our dispatch/riders.</li>
                <li>Sending you real-time WhatsApp updates regarding order confirmation and dispatch.</li>
                <li>Responding to your inquiries, customer service requests, or feedback.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <h2 className="legal-section-title">3. Zero Data Selling & Confidentiality</h2>
              </div>
              <p className="legal-p">
                <strong>We strictly respect your privacy.</strong> {businessData.name} does not sell, rent, trade, or distribute your phone numbers, addresses, or personal details to third-party advertising networks, telemarketers, or external data brokers.
              </p>
              <p className="legal-p">
                Your contact information is only accessed by our kitchen staff and assigned delivery riders for the specific purpose of bringing food to your doorstep.
              </p>
            </section>

            {/* Section 4 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <h2 className="legal-section-title">4. WhatsApp & Third-Party Platforms</h2>
              </div>
              <p className="legal-p">
                Our food ordering system utilizes WhatsApp (a Meta service) to facilitate fast, direct communication between customers and our kitchen. When clicking order links or submitting your cart, you communicate through WhatsApp subject to WhatsApp's standard end-to-end encryption protocols and privacy policy.
              </p>
            </section>

            {/* Section 5 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCookieBite} />
                </div>
                <h2 className="legal-section-title">5. Browser Local Storage & Cookies</h2>
              </div>
              <p className="legal-p">
                Our website does not deploy invasive tracking cookies. We utilize browser <code>localStorage</code> strictly for functional website features:
              </p>
              <ul className="legal-list">
                <li><strong>Cart Items:</strong> To remember your selected dishes so your cart does not vanish if you refresh the page.</li>
                <li><strong>Theme Preference:</strong> To remember whether you prefer Dark Mode or Light Mode across visits.</li>
              </ul>
              <p className="legal-p">
                You can clear your browser storage at any time through your web browser settings.
              </p>
            </section>

            {/* Section 6 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faUserGear} />
                </div>
                <h2 className="legal-section-title">6. Your Rights & Data Choices</h2>
              </div>
              <p className="legal-p">
                You have full control over your information. At any point, you may:
              </p>
              <ul className="legal-list">
                <li>Request that we delete your previous delivery addresses or contact details from our records.</li>
                <li>Ask to stop receiving occasional menu special announcements over WhatsApp.</li>
                <li>Verify what details we have on file for your delivery profile.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowsRotate} />
                </div>
                <h2 className="legal-section-title">7. Policy Changes & Updates</h2>
              </div>
              <p className="legal-p">
                We may occasionally update this Privacy Policy to reflect enhancements in our ordering procedures or legal guidelines. Any updates will be published directly on this page with an updated revision date.
              </p>
            </section>

            {/* Support Box */}
            <div className="legal-support-box">
              <div className="legal-support-info">
                <h4>Have questions about our Privacy Policy?</h4>
                <p>We are happy to answer any questions or address your data concerns directly.</p>
              </div>
              <div className="legal-support-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  type="button"
                  className="legal-btn legal-btn-secondary"
                  onClick={() => navigate('/contact-us')}
                >
                  <FontAwesomeIcon icon={faHeadset} />
                  <span>Contact Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Drawer & Footer */}
      <CartDrawer />
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
