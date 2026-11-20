import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faUtensils,
  faTag,
  faUserCheck,
  faTriangleExclamation,
  faTruckFast,
  faBan,
  faHandshakeAngle,
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
import { getWhatsAppUrl } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const whatsappInquiryUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Hello A2 CRAVINGS, I have a question regarding your Terms & Conditions."
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Terms & Conditions"
        description="Review the terms and conditions for ordering homemade fast food from A2 CRAVINGS in Rawalpindi. Clear policies on ordering, pricing, delivery, and customer responsibilities."
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
              <span className="policy-breadcrumb-parent">Help & Policies</span>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-current">Terms & Conditions</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faScaleBalanced} className="legal-badge-icon" />
            <span>Ordering Guidelines & Policies</span>
          </div>

          <h1 className="legal-title">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>

          <p className="legal-subtitle">
            Welcome to {businessData.name}. These Terms & Conditions outline the guidelines for browsing our menu, placing food orders, and receiving homemade deliveries in {businessData.location.city}.
          </p>

          <div className="legal-meta">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>{businessData.location.city}, {businessData.location.region}, {businessData.location.country}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="legal-main-content">
        <div className="legal-container">
          <div className="legal-card">
            {/* Plain Language Callout */}
            <div className="legal-callout">
              <FontAwesomeIcon icon={faHandshakeAngle} className="legal-callout-icon" />
              <div className="legal-callout-content">
                <strong>Fair & Simple Ordering Terms</strong>
                We prepare all food fresh to order with authentic ingredients. In return, we kindly ask customers to provide accurate delivery addresses, answer rider calls promptly, and confirm their orders via WhatsApp.
              </div>
            </div>

            {/* Section 1 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faUtensils} />
                </div>
                <h2 className="legal-section-title">1. About Our Kitchen & Service Scope</h2>
              </div>
              <p className="legal-p">
                {businessData.name} is an independent homemade fast-food kitchen located in {businessData.location.city}, Pakistan. We specialize in elbow macaroni pastas baked in aluminum foil trays, gourmet stuffed buns, loaded fries platters, and authentic biryani.
              </p>
              <p className="legal-p">
                All food is cooked fresh upon order confirmation. We operate primarily via home delivery across {businessData.location.deliveryArea} and direct takeaway.
              </p>
            </section>

            {/* Section 2 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <h2 className="legal-section-title">2. Order Placement & WhatsApp Confirmation</h2>
              </div>
              <p className="legal-p">
                When you click "Add to Cart", submit an order through our website form, or use our direct WhatsApp links, a prefilled order message is prepared for WhatsApp.
              </p>
              <ul className="legal-list">
                <li><strong>Order Confirmation:</strong> An order is officially placed and entered into our cooking queue only after our team acknowledges your message on WhatsApp and confirms acceptance.</li>
                <li><strong>Order Details:</strong> Customers are responsible for reviewing their item choices, quantities, and delivery address before confirming.</li>
                <li><strong>Kitchen Availability:</strong> While we endeavor to maintain all menu items, dishes remain subject to daily ingredient availability.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTag} />
                </div>
                <h2 className="legal-section-title">3. Pricing, Payments & Delivery Fees</h2>
              </div>
              <ul className="legal-list">
                <li><strong>Currency:</strong> All prices displayed on our website and menu cards are quoted in Pakistani Rupees (PKR / Rs.).</li>
                <li><strong>Price Transparency:</strong> Dish prices are listed clearly. If a price changes on special holidays or menu revisions, the confirmed price will be communicated to you before cooking commences.</li>
                <li><strong>Delivery Charges:</strong> Delivery fees depend on your distance from our kitchen in {businessData.location.city} and will be confirmed on WhatsApp before dispatch.</li>
                <li><strong>Payment Methods:</strong> We accept Cash on Delivery (COD) and <span className="legal-placeholder">[Direct Bank Transfer / JazzCash / EasyPaisa upon request]</span>.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <h2 className="legal-section-title">4. Customer Responsibilities During Delivery</h2>
              </div>
              <p className="legal-p">
                To guarantee that your food arrives hot, fresh, and on time, customers agree to:
              </p>
              <ul className="legal-list">
                <li>Provide a complete, accurate delivery address with relevant landmarks (e.g., house number, street number, sector/colony, famous nearby spot).</li>
                <li>Keep the provided mobile number active and reachable so our delivery rider can contact you upon arrival.</li>
                <li>Be available to collect the order within 5–10 minutes of rider arrival to ensure food temperature and freshness are maintained.</li>
                <li>Have the exact or approximate cash amount ready for Cash on Delivery orders.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>
                <h2 className="legal-section-title">5. Dietary Information & Food Allergies</h2>
              </div>
              <p className="legal-p">
                Our dishes are prepared in a homemade kitchen environment that handles ingredients including poultry (chicken), dairy (milk, butter, cheese, cream), gluten/wheat (pasta, buns), capsicum, and diverse spices.
              </p>
              <p className="legal-p">
                If you or anyone in your household has specific food allergies, dietary restrictions, or spice sensitivities, you must inform our kitchen team on WhatsApp <em>prior</em> to order confirmation.
              </p>
            </section>

            {/* Section 6 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBan} />
                </div>
                <h2 className="legal-section-title">6. Cancellations & Order Modifications</h2>
              </div>
              <p className="legal-p">
                Because our meals are perishable and prepared fresh to order, cancellations or changes to your food items must be communicated immediately over WhatsApp before cooking starts.
              </p>
              <p className="legal-p">
                Once cooking is underway or the rider has been dispatched with hot food, orders cannot be cancelled. For complete details, please refer to our <a href="/refund-policy" onClick={(e) => { e.preventDefault(); navigate('/refund-policy'); }} style={{ color: 'var(--color-orange)', textDecoration: 'underline' }}>Return & Refund Policy</a>.
              </p>
            </section>

            {/* Support Box */}
            <div className="legal-support-box">
              <div className="legal-support-info">
                <h4>Have questions about our Terms?</h4>
                <p>We are always available to clarify any aspect of our service or ordering guidelines.</p>
              </div>
              <div className="legal-support-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Chat with Us</span>
                </a>
                <button
                  type="button"
                  className="legal-btn legal-btn-secondary"
                  onClick={() => navigate('/faq')}
                >
                  <FontAwesomeIcon icon={faHeadset} />
                  <span>Read FAQs</span>
                </button>
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

export default TermsConditions;
