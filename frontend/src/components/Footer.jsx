import React from 'react';
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                  </svg>
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
            <span className="footer-tagline">Made with ❤️ for food lovers.</span>
          </div>

          {/* Back to Top Button */}
          <button
            type="button"
            className="back-to-top-btn"
            onClick={handleBackToTop}
            aria-label="Back to top of page"
          >
            <span>Back to Top</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
