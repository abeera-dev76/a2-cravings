import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faUtensils,
  faFire,
  faBowlFood,
  faShieldHeart,
  faCertificate,
  faTruckFast,
  faHouse,
  faChevronRight,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SEO from '../components/SEO';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const AboutUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const whatsappOrderUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="About Us"
        description="Discover the passion behind A2 CRAVINGS in Rawalpindi. Homemade fast food crafted with love, signature elbow macaroni pasta in aluminum foil trays, loaded fries, and fresh ingredients."
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
          <nav className="legal-breadcrumb" aria-label="Breadcrumb">
            <a
              href="/"
              className="legal-breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <FontAwesomeIcon icon={faHouse} style={{ marginRight: '4px' }} />
              Home
            </a>
            <span className="legal-breadcrumb-sep">
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            <span className="legal-breadcrumb-current">About Us</span>
          </nav>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faHeart} className="legal-badge-icon" />
            <span>Our Kitchen & Culinary Passion</span>
          </div>

          <h1 className="legal-title">
            The Story Behind <span className="text-gradient">{businessData.name}</span>
          </h1>

          <p className="legal-subtitle">
            Homemade fast food cooked with pure passion, authentic spices, and heartfelt care right here in {businessData.location.city}, Pakistan.
          </p>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          {/* Main Story Card */}
          <div className="legal-card">
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faUtensils} />
                </div>
                <h2 className="legal-section-title">Where Every Craving Deserves Something Special</h2>
              </div>
              <p className="legal-p">
                {businessData.name} started with a simple belief: <strong>fast food shouldn't feel industrial, oily, or mass-produced</strong>. Great comfort food should feel like home — made with real, fresh ingredients, generous melted cheese, tender marinated chicken, and genuine care.
              </p>
              <p className="legal-p">
                Based in {businessData.location.city}, we set out to craft recipes that satisfy deep cravings. From our velvety creamy white sauce pastas to crunchy loaded fries and fragrant Karachi-style biryani, every dish is prepared in our home kitchen to order — never frozen, never pre-microwaved.
              </p>
            </section>

            {/* Why Elbow Macaroni Section */}
            <section className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faBowlFood} />
                </div>
                <h2 className="legal-section-title">Why Elbow Macaroni & Aluminum Foil Trays?</h2>
              </div>
              <p className="legal-p">
                Our signature pasta dishes have become a customer favorite for a reason. While standard restaurants serve penne or spaghetti that quickly dry out in transit, we intentionally choose <strong>ELBOW MACARONI</strong>:
              </p>
              <ul className="legal-list">
                <li><strong>Sauce Retention:</strong> The curved shape of elbow macaroni traps rich creamy Alfredo sauce and molten mozzarella inside each bite.</li>
                <li><strong>Aluminum Foil Trays:</strong> Our heat-retaining aluminum serving trays keep the pasta steaming hot from our oven to your dining table, preventing soggy textures.</li>
                <li><strong>Crisp Toppings:</strong> Allows our melted cheese, seasoned chicken chunks, herbs, and capsicum to form a golden gratinated crust.</li>
              </ul>
            </section>

            {/* 4 Pillars of Excellence Grid */}
            <div className="about-features-grid">
              <div className="about-feature-card">
                <div className="about-feature-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFire} />
                </div>
                <h3 className="about-feature-title">100% Cooked Fresh</h3>
                <p className="about-feature-desc">
                  No reheated food. Every single order is cooked fresh from scratch the moment your WhatsApp message is confirmed.
                </p>
              </div>

              <div className="about-feature-card">
                <div className="about-feature-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faShieldHeart} />
                </div>
                <h3 className="about-feature-title">Hygienic Home Kitchen</h3>
                <p className="about-feature-desc">
                  Clean cooking surfaces, fresh premium chicken, sanitized utensils, and safe handling that you can trust for your family.
                </p>
              </div>

              <div className="about-feature-card">
                <div className="about-feature-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCertificate} />
                </div>
                <h3 className="about-feature-title">Authentic Flavors</h3>
                <p className="about-feature-desc">
                  Real herbs, rich cream, pure cheeses, and chef-crafted spice blends that elevate homemade comfort food into luxury dining.
                </p>
              </div>

              <div className="about-feature-card">
                <div className="about-feature-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <h3 className="about-feature-title">Hot & Fast Delivery</h3>
                <p className="about-feature-desc">
                  Delivered across {businessData.location.city} with insulated thermal carriers and dedicated riders who respect your time.
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <div className="about-stat-value">100%</div>
                <div className="about-stat-label">Fresh Ingredients</div>
              </div>
              <div className="about-stat-item">
                <div className="about-stat-value">0%</div>
                <div className="about-stat-label">Artificial Preservatives</div>
              </div>
              <div className="about-stat-item">
                <div className="about-stat-value">4.9★</div>
                <div className="about-stat-label">Customer Satisfaction</div>
              </div>
              <div className="about-stat-item about-stat-item-location">
                <div className="about-stat-value about-stat-value-city">{businessData.location.city}</div>
                <div className="about-stat-label">Proudly Local</div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="legal-support-box" style={{ marginTop: '2rem' }}>
              <div className="legal-support-info">
                <h4>Ready to taste the difference?</h4>
                <p>Browse our menu and experience handcrafted comfort food tonight.</p>
              </div>
              <div className="legal-support-actions">
                <button
                  type="button"
                  className="legal-btn legal-btn-primary"
                  onClick={() => navigate('/', 'menu')}
                >
                  <FontAwesomeIcon icon={faUtensils} />
                  <span>Explore Our Menu</span>
                </button>
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Order on WhatsApp</span>
                </a>
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

export default AboutUs;
