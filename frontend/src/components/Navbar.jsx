import React, { useState, useEffect } from 'react';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [ripples, setRipples] = useState([]);

  // Check URL query to automatically open drawer for testing if ?menu=open
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('menu=open')) {
      setMobileMenuOpen(true);
    }
  }, []);

  // Track scroll position to trigger sticky glass effect & active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      const sections = ['home', 'menu', 'combos', 'about', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    closeMobileMenu();

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navHeight = 74;
      const extraOffset = window.innerWidth <= 540 ? 15 : 25;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + extraOffset);

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  const handleButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const orderNowUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Left: Brand Logo */}
          <a 
            href="#home" 
            className="nav-logo-link"
            onClick={(e) => scrollToSection(e, 'home')}
            aria-label="A2 Cravings Home"
          >
            <img
              src={businessData.branding.logo}
              alt="A2 Cravings homemade fast food Rawalpindi"
              className="nav-logo-img"
              width="155"
              height="44"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </a>

          {/* Center: Desktop Navigation Landmark */}
          <nav className="nav-links" aria-label="Main Navigation">
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'home')}
            >
              Home
            </a>
            <a
              href="#menu"
              className={`nav-link ${activeSection === 'menu' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'menu')}
            >
              Menu
            </a>
            <a
              href="#combos"
              className={`nav-link ${activeSection === 'combos' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'combos')}
            >
              Combos
            </a>
            <a
              href="#about"
              className={`nav-link ${activeSection === 'about' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'about')}
            >
              Our Story
            </a>
            <a
              href="#contact"
              className={`nav-link ${activeSection === 'contact' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'contact')}
            >
              Contact
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="nav-actions">
            <a
              href={orderNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-order-btn"
              onClick={handleButtonClick}
              aria-label="Order on WhatsApp with A2 Cravings"
            >
              <span className="nav-order-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                </svg>
              </span>
              <span>Order Now</span>

              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="ripple-wave"
                  style={{
                    top: ripple.y,
                    left: ripple.x,
                    width: ripple.size,
                    height: ripple.size
                  }}
                />
              ))}
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* SEPARATE MOBILE NAVIGATION DRAWER & BACKDROP OUTSIDE HEADER */}
      <div 
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside 
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileMenuOpen}
      >
        {/* Drawer Top Header with Brand Logo & Close Button */}
        <div className="mobile-drawer-header">
          <img
            src={businessData.branding.logo}
            alt="A2 Cravings Logo"
            className="mobile-drawer-logo"
            width="135"
            height="38"
          />
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="mobile-nav-links" aria-label="Mobile Links">
          <a
            href="#home"
            className={`mobile-nav-link ${activeSection === 'home' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <span>Home</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href="#menu"
            className={`mobile-nav-link ${activeSection === 'menu' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'menu')}
          >
            <span>Menu</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href="#combos"
            className={`mobile-nav-link ${activeSection === 'combos' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'combos')}
          >
            <span>Combos</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href="#about"
            className={`mobile-nav-link ${activeSection === 'about' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'about')}
          >
            <span>Our Story</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href="#contact"
            className={`mobile-nav-link ${activeSection === 'contact' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            <span>Contact</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
        </nav>

        {/* Drawer Bottom Footer CTA */}
        <div className="mobile-nav-footer">
          <a
            href={orderNowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-md mobile-drawer-order-btn"
            onClick={closeMobileMenu}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
            </svg>
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
