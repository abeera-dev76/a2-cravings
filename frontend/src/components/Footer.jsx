import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const Footer = () => {
  // Smooth scroll helper respecting sticky navbar height
  const scrollToTarget = (e, targetId) => {
    e.preventDefault();

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navHeader = document.querySelector('.site-header');
      const navHeight = navHeader ? navHeader.offsetHeight : 80;
      const extraOffset = window.innerWidth <= 540 ? 15 : 25;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + extraOffset);

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  // Navigate to Menu section AND activate the corresponding category filter
  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault();

    // Dispatch custom event to activate category filter
    window.dispatchEvent(
      new CustomEvent('a2:selectCategory', { detail: { categoryId } })
    );

    // Scroll to Menu section
    scrollToTarget(e, 'menu');
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappFooterUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  return (
    <footer className="site-footer" aria-label="A2 CRAVINGS Footer">
      {/* Thin Orange Brand Accent Line */}
      <div className="footer-top-accent" aria-hidden="true" />

      <div className="container footer-container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          {/* COLUMN 1 — BRAND */}
          <div className="footer-col footer-col-brand">
            <a
              href="#home"
              className="footer-logo-link"
              onClick={(e) => scrollToTarget(e, 'home')}
              aria-label="A2 CRAVINGS - Back to Home"
            >
              <img
                src={businessData.branding.logo}
                alt="A2 Cravings homemade fast food Rawalpindi"
                className="footer-logo-img"
                width="160"
                height="46"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </a>

            <p className="footer-brand-desc">
              Delicious homemade-style food, prepared with care and full of flavor.
              Every craving deserves something special.
            </p>

            <div className="footer-brand-badge">
              <span className="footer-dot-glow" aria-hidden="true" />
              <span>Homemade in Rawalpindi, Pakistan</span>
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Quick Links</h3>
            <ul className="footer-links-list">
              <li>
                <a
                  href="#home"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'home')}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'menu')}
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#combos"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'combos')}
                >
                  Combos
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'about')}
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'contact')}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — OUR MENU CATEGORIES */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Our Menu</h3>
            <ul className="footer-links-list">
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => handleCategoryClick(e, 'pasta')}
                >
                  Pasta
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => handleCategoryClick(e, 'buns')}
                >
                  Buns
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => handleCategoryClick(e, 'loaded-fries')}
                >
                  Loaded Fries
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => handleCategoryClick(e, 'biryani')}
                >
                  Biryani
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="footer-link"
                  onClick={(e) => handleCategoryClick(e, 'combos')}
                >
                  Combos
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — FOLLOW US & CHAT */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Follow Us</h3>
            <p className="footer-col-subtext">
              Connect with our social kitchen and order directly.
            </p>

            <div className="footer-social-stack">
              {/* Instagram */}
              <a
                href={businessData.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-item"
                aria-label="Follow A2 CRAVINGS on Instagram"
              >
                <div className="footer-social-icon insta-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <div className="footer-social-meta">
                  <span className="social-meta-title">Instagram</span>
                  <span className="social-meta-handle">@a2_cravings</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappFooterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-item"
                aria-label="Chat with A2 CRAVINGS on WhatsApp"
              >
                <div className="footer-social-icon wa-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <div className="footer-social-meta">
                  <span className="social-meta-title">WhatsApp</span>
                  <span className="social-meta-handle">0314-5027631</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <span>© 2026 A2 CRAVINGS. All Rights Reserved.</span>
            <span className="footer-tagline">
              Made with <FontAwesomeIcon icon={faHeart} className="footer-heart-icon" /> for food lovers.
            </span>
          </div>

          {/* Back to Top Button */}
          <button
            type="button"
            className="back-to-top-btn"
            onClick={handleBackToTop}
            aria-label="Back to top of page"
          >
            <span>Back to Top</span>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
