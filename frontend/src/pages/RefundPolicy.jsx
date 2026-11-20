import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateLeft,
  faBowlFood,
  faBan,
  faTriangleExclamation,
  faCamera,
  faHandHoldingDollar,
  faHeadset,
  faHouse,
  faChevronRight,
  faCircleCheck,
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

export const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const whatsappInquiryUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Hello A2 CRAVINGS, I would like to inquire about your Return, Refund & Cancellation Policy."
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Return, Refund & Cancellation Policy"
        description="Read A2 CRAVINGS policy on food cancellations, order replacements, and refunds in Rawalpindi. Transparent terms designed to protect customer satisfaction."
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
              <span className="policy-breadcrumb-current">Return & Refund Policy</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faRotateLeft} className="legal-badge-icon" />
            <span>Fair Customer Resolution</span>
          </div>

          <h1 className="legal-title">
            Return, Refund & <span className="text-gradient">Cancellation</span>
          </h1>

          <p className="legal-subtitle">
            At {businessData.name}, customer satisfaction and food safety are our highest priorities. Here is our straightforward policy on order cancellations, replacements, and refunds.
          </p>

          <div className="legal-meta">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Applicable in {businessData.location.city}, {businessData.location.country}</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          <div className="legal-card">
            {/* Quick Summary Callout */}
            <div className="legal-callout">
              <FontAwesomeIcon icon={faCircleCheck} className="legal-callout-icon" />
              <div className="legal-callout-content">
                <strong>Our Customer Satisfaction Pledge</strong>
                If our kitchen ever makes a mistake or your meal arrives damaged, we promise to make it right immediately — with a fresh replacement or credit toward your next craving.
              </div>
            </div>

            {/* Section 1 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBowlFood} />
                </div>
                <h2 className="legal-section-title">1. Perishable Food Notice</h2>
              </div>
              <p className="legal-p">
                Because {businessData.name} provides freshly cooked, perishable food items prepared specifically to your order, <strong>physical returns of food items cannot be accepted once delivered and accepted</strong> due to hygiene and health regulations.
              </p>
              <p className="legal-p">
                However, if there is any issue with item accuracy, preparation, or packaging condition, we offer fast solutions as outlined below.
              </p>
            </section>

            {/* Section 2 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBan} />
                </div>
                <h2 className="legal-section-title">2. Order Cancellation Window</h2>
              </div>
              <p className="legal-p">
                We understand plans can change. You may cancel your order under the following conditions:
              </p>
              <ul className="legal-list">
                <li><strong>Before Cooking Begins:</strong> You can cancel without any charge if you notify us via WhatsApp immediately after placing the order, before our kitchen starts cooking.</li>
                <li><strong>After Cooking Has Started:</strong> Once ingredients have been prepared, cooked, or packaged, cancellations cannot be accepted as the food cannot be restocked or resold.</li>
                <li><strong>After Rider Dispatch:</strong> Orders already in transit cannot be cancelled under any circumstance.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCamera} />
                </div>
                <h2 className="legal-section-title">3. Missing, Wrong, or Damaged Items</h2>
              </div>
              <p className="legal-p">
                In the rare event that your food package is incomplete, contains an incorrect dish, or was damaged during transit:
              </p>
              <ul className="legal-list">
                <li><strong>Notify Us Promptly:</strong> Please message our kitchen team on WhatsApp within 30 minutes of receiving your delivery.</li>
                <li><strong>Provide a Photo:</strong> Send a quick photo of the delivered packaging and items along with your order details.</li>
                <li><strong>Immediate Resolution:</strong> We will verify the issue immediately and provide either:
                  <ul style={{ marginTop: '0.4rem' }}>
                    <li>An expedited fresh replacement delivered at no additional delivery fee, or</li>
                    <li>A full store credit for the affected item applied to your next order, or</li>
                    <li>A direct monetary refund for the missing/damaged portion via <span className="legal-placeholder">[Bank Transfer / JazzCash / EasyPaisa]</span>.</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </div>
                <h2 className="legal-section-title">4. Refund Methods & Processing Timelines</h2>
              </div>
              <p className="legal-p">
                When a refund is approved by our kitchen management:
              </p>
              <ul className="legal-list">
                <li><strong>Store Credit (Fastest):</strong> Can be issued instantly and redeemed on any future order by simply mentioning it on WhatsApp.</li>
                <li><strong>Digital Wallets / Bank Transfer:</strong> Approved cash refunds are processed within <span className="legal-placeholder">[e.g. 24 to 48 hours]</span> to your provided account number.</li>
                <li><strong>Cash on Delivery Adjustments:</strong> If an error is spotted upon rider arrival, the bill amount can be adjusted directly with rider coordination.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>
                <h2 className="legal-section-title">5. Non-Refundable Scenarios</h2>
              </div>
              <p className="legal-p">
                Refunds or free replacements cannot be granted in the following circumstances:
              </p>
              <ul className="legal-list">
                <li>If an incorrect or incomplete delivery address was submitted and the rider was unable to locate you.</li>
                <li>If the customer is unreachable by phone or WhatsApp when the delivery rider arrives, leading to food deterioration or aborted delivery.</li>
                <li>If issues are reported several hours or days after delivery when freshness cannot be verified.</li>
                <li>Subjective taste preferences (e.g., general preference differences) when the dish was prepared correctly according to the standard menu recipe.</li>
              </ul>
            </section>

            {/* Support Box */}
            <div className="legal-support-box">
              <div className="legal-support-info">
                <h4>Need assistance with an order?</h4>
                <p>Our team is ready to help resolve any issues with your meal right away.</p>
              </div>
              <div className="legal-support-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Support on WhatsApp</span>
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

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default RefundPolicy;
