import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowUp, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  // Smooth scroll helper respecting sticky navbar height
  const scrollToTarget = (e, targetId) => {
    e.preventDefault();

    const isHome = typeof window !== 'undefined' && 
      (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html');

    if (!isHome) {
      navigate('/', targetId === 'home' ? '' : targetId);
      return;
    }

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

    const isHome = typeof window !== 'undefined' && 
      (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html');

    if (!isHome) {
      navigate('/', 'menu');
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('a2:selectCategory', { detail: { categoryId } })
        );
      }, 150);
      return;
    }

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

  const handlePageNav = (e, path) => {
    e.preventDefault();
    navigate(path);
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
        {/* Main 3-Section Grid */}
        <div className="footer-grid">
          {/* SECTION 1 — A2 CRAVINGS (BRAND & SOCIAL MEDIA) */}
          <div className="footer-col footer-col-brand reveal-on-scroll">
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

            {/* Existing Social Media Links */}
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

          {/* SECTION 2 — QUICK LINKS */}
          <div className="footer-col footer-col-quick reveal-on-scroll reveal-delay-1">
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
                  href="#about"
                  className="footer-link"
                  onClick={(e) => scrollToTarget(e, 'about')}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="footer-link"
                  onClick={(e) => handlePageNav(e, '/contact-us')}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* SECTION 3 — HELP & POLICIES */}
          <div className="footer-col footer-col-policies reveal-on-scroll reveal-delay-2">
            <h3 className="footer-col-heading">Help & Policies</h3>
            <ul className="footer-links-list footer-policies-list">
              <li>
                <a
                  href="/shipping-and-delivery"
                  className="footer-link footer-policy-link"
                  onClick={(e) => handlePageNav(e, '/shipping-and-delivery')}
                >
                  <FontAwesomeIcon icon={faAngleRight} className="footer-policy-arrow" aria-hidden="true" />
                  <span>Shipping & Delivery</span>
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="footer-link footer-policy-link"
                  onClick={(e) => handlePageNav(e, '/refund-policy')}
                >
                  <FontAwesomeIcon icon={faAngleRight} className="footer-policy-arrow" aria-hidden="true" />
                  <span>Return & Refund Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="footer-link footer-policy-link"
                  onClick={(e) => handlePageNav(e, '/privacy-policy')}
                >
                  <FontAwesomeIcon icon={faAngleRight} className="footer-policy-arrow" aria-hidden="true" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  className="footer-link footer-policy-link"
                  onClick={(e) => handlePageNav(e, '/terms-and-conditions')}
                >
                  <FontAwesomeIcon icon={faAngleRight} className="footer-policy-arrow" aria-hidden="true" />
                  <span>Terms & Conditions</span>
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="footer-link footer-policy-link"
                  onClick={(e) => handlePageNav(e, '/faq')}
                >
                  <FontAwesomeIcon icon={faAngleRight} className="footer-policy-arrow" aria-hidden="true" />
                  <span>Frequently Asked Questions</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom-bar reveal-on-scroll">
          <div className="footer-copyright">
            <span>© {currentYear} A2 CRAVINGS. All Rights Reserved.</span>
            <span className="footer-tagline">
              Made with <FontAwesomeIcon icon={faHeart} className="footer-heart-icon" /> for food lovers in Rawalpindi.
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

        {/* BOTTOM LEGAL LINKS ROW */}
        <div className="footer-legal-bar reveal-on-scroll">
          <div className="footer-legal-links">
            <a
              href="/privacy-policy"
              className="footer-legal-link"
              onClick={(e) => handlePageNav(e, '/privacy-policy')}
            >
              Privacy Policy
            </a>
            <span className="footer-link-divider">•</span>
            <a
              href="/terms-and-conditions"
              className="footer-legal-link"
              onClick={(e) => handlePageNav(e, '/terms-and-conditions')}
            >
              Terms & Conditions
            </a>
            <span className="footer-link-divider">•</span>
            <a
              href="/shipping-and-delivery"
              className="footer-legal-link"
              onClick={(e) => handlePageNav(e, '/shipping-and-delivery')}
            >
              Shipping & Delivery
            </a>
            <span className="footer-link-divider">•</span>
            <a
              href="/refund-policy"
              className="footer-legal-link"
              onClick={(e) => handlePageNav(e, '/refund-policy')}
            >
              Return & Refund Policy
            </a>
            <span className="footer-link-divider">•</span>
            <a
              href="/faq"
              className="footer-legal-link"
              onClick={(e) => handlePageNav(e, '/faq')}
            >
              FAQ
            </a>
          </div>
          <div style={{ color: '#666', fontSize: '0.78rem' }}>
            <span>Rawalpindi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
