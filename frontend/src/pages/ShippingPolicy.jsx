import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruckFast,
  faMapLocationDot,
  faStopwatch,
  faReceipt,
  faBoxOpen,
  faCloudSunRain,
  faPhoneVolume,
  faHouse,
  faChevronRight,
  faHeadset,
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

export const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const whatsappInquiryUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Hello A2 CRAVINGS, I would like to check delivery availability and charges for my area."
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Shipping & Delivery Policy"
        description="Learn about A2 CRAVINGS food delivery policy in Rawalpindi. Estimated delivery times, delivery coverage areas, aluminum foil packaging to keep meals hot, and delivery fees."
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
              <span className="policy-breadcrumb-current">Shipping & Delivery</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faTruckFast} className="legal-badge-icon" />
            <span>Fast, Hot & Secure Delivery</span>
          </div>

          <h1 className="legal-title">
            Shipping & <span className="text-gradient">Delivery Policy</span>
          </h1>

          <p className="legal-subtitle">
            Everything you need to know about how {businessData.name} prepares, packages, and delivers fresh homemade meals across {businessData.location.city}.
          </p>

          <div className="legal-meta">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Serving {businessData.location.deliveryArea}</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          <div className="legal-card">
            {/* Quick Summary Callout */}
            <div className="legal-callout">
              <FontAwesomeIcon icon={faTruckFast} className="legal-callout-icon" />
              <div className="legal-callout-content">
                <strong>Our Freshness Delivery Commitment</strong>
                We cook every order from scratch and dispatch it in sealed aluminum foil trays and thermal insulation so your food reaches your doorstep piping hot.
              </div>
            </div>

            {/* Section 1 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faMapLocationDot} />
                </div>
                <h2 className="legal-section-title">1. Delivery Coverage Area</h2>
              </div>
              <p className="legal-p">
                {businessData.name} proudly operates out of {businessData.location.city}, Pakistan. We deliver across:
              </p>
              <ul className="legal-list">
                <li>Major residential and commercial sectors across {businessData.location.city}.</li>
                <li>Nearby vicinities and surrounding neighborhoods within our rider coverage radius.</li>
                <li>If you are unsure whether we deliver to your specific sector or phase, simply send your location pin on WhatsApp and our team will confirm within minutes.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faStopwatch} />
                </div>
                <h2 className="legal-section-title">2. Preparation & Estimated Delivery Times</h2>
              </div>
              <p className="legal-p">
                Because we prepare all dishes fresh to order (never reheating pre-cooked items), total delivery time consists of two stages:
              </p>
              <ul className="legal-list">
                <li><strong>Kitchen Preparation Time:</strong> 15 to 25 minutes (boiling macaroni, grilling seasoned chicken, simmering creamy sauces, and melting mozzarella cheese).</li>
                <li><strong>Rider Transit Time:</strong> 15 to 30 minutes depending on your sector distance and traffic conditions.</li>
                <li><strong>Total Estimated Delivery Time:</strong> <span className="legal-placeholder">[e.g. 35 to 50 minutes]</span> from WhatsApp confirmation.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <h2 className="legal-section-title">3. Delivery Charges & Distance Calculation</h2>
              </div>
              <p className="legal-p">
                Menu prices cover the cost of the food. Delivery fees are calculated transparently based on distance from our kitchen in {businessData.location.city} to your location:
              </p>
              <ul className="legal-list">
                <li>Standard local delivery charges typically range from <span className="legal-placeholder">[e.g. Rs 50 to Rs 150 depending on distance]</span>.</li>
                <li>Exact delivery fees are confirmed transparently with you on WhatsApp <em>before</em> we begin cooking your order.</li>
                <li>We do not charge hidden packaging or handling fees.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBoxOpen} />
                </div>
                <h2 className="legal-section-title">4. Temperature Preservation & Packaging</h2>
              </div>
              <p className="legal-p">
                We take special pride in our packaging standards:
              </p>
              <ul className="legal-list">
                <li><strong>Aluminum Foil Serving Trays:</strong> All pasta items are baked and sealed inside aluminum foil trays that retain internal heat, preventing sauce separation and moisture buildup.</li>
                <li><strong>Secure Food Containers:</strong> Loaded fries, stuffed buns, and biryani are packed in clean, food-grade containers to prevent leakage or crushing during transport.</li>
                <li><strong>Thermal Delivery Bags:</strong> Our delivery riders carry thermal insulation carriers to protect your food against cold weather or humidity.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faPhoneVolume} />
                </div>
                <h2 className="legal-section-title">5. Receiving Your Food & Rider Coordination</h2>
              </div>
              <p className="legal-p">
                To prevent unnecessary delays or food cooling:
              </p>
              <ul className="legal-list">
                <li>Please keep your contact phone nearby and reachable when your order is out for delivery.</li>
                <li>Our rider will call or send a WhatsApp message upon arriving at your gate or building entrance.</li>
                <li>Please meet the rider promptly (within 5–10 minutes) so your food can be enjoyed at its peak temperature and texture.</li>
                <li>If paying via Cash on Delivery, having exact or near-exact change helps our rider maintain fast service for subsequent customers.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCloudSunRain} />
                </div>
                <h2 className="legal-section-title">6. Weather, Traffic & Unforeseen Delays</h2>
              </div>
              <p className="legal-p">
                During severe rainstorms, unexpected road closures, or intense rush-hour traffic in {businessData.location.city}, delivery times may be slightly extended for rider safety. In such situations, we will notify you proactively via WhatsApp with an updated ETA.
              </p>
            </section>

            {/* Support Box */}
            <div className="legal-support-box">
              <div className="legal-support-info">
                <h4>Want to check delivery to your address?</h4>
                <p>Send your location on WhatsApp to confirm delivery time and fee instantly.</p>
              </div>
              <div className="legal-support-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Check on WhatsApp</span>
                </a>
                <button
                  type="button"
                  className="legal-btn legal-btn-secondary"
                  onClick={() => navigate('/', 'contact')}
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

export default ShippingPolicy;
