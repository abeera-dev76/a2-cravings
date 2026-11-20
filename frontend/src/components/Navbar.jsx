import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faArrowRight, faXmark, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';
import { navigate } from '../utils/navigation';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalCount, openCart } = useCart();
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

    const isHome = typeof window !== 'undefined' && 
      (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.html');

    if (!isHome) {
      navigate('/', targetId === 'home' ? '' : targetId);
      return;
    }

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

  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('a2:route-change', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('a2:route-change', handleRouteChange);
    };
  }, []);

  const isHome = currentPath === '/' || currentPath === '' || currentPath === '/index.html';

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
              className={`nav-link ${isHome && activeSection === 'home' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'home')}
            >
              Home
            </a>
            <a
              href="#menu"
              className={`nav-link ${isHome && activeSection === 'menu' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'menu')}
            >
              Menu
            </a>
            <a
              href="#combos"
              className={`nav-link ${isHome && activeSection === 'combos' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'combos')}
            >
              Combos
            </a>
            <a
              href="#about"
              className={`nav-link ${isHome && activeSection === 'about' ? 'is-active' : ''}`}
              onClick={(e) => scrollToSection(e, 'about')}
            >
              About Us
            </a>
            <a
              href="/contact-us"
              className={`nav-link ${currentPath === '/contact-us' || currentPath === '/contact' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact-us');
              }}
            >
              Contact
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="nav-actions">
            {/* Dark / Light Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </button>

            {/* Cart Icon Button */}
            <button
              type="button"
              className="nav-cart-btn"
              onClick={openCart}
              aria-label={`Open cart${totalCount > 0 ? ` (${totalCount} items)` : ''}`}
              title="View Cart"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              {totalCount > 0 && (
                <span className="nav-cart-badge" aria-hidden="true">{totalCount > 9 ? '9+' : totalCount}</span>
              )}
            </button>

            <a
              href={orderNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-order-btn"
              onClick={handleButtonClick}
              aria-label="Order on WhatsApp with A2 Cravings"
            >
              <span className="nav-order-icon">
                <FontAwesomeIcon icon={faWhatsapp} />
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
          <div className="mobile-drawer-header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </button>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="mobile-nav-links" aria-label="Mobile Links">
          <a
            href="#home"
            className={`mobile-nav-link ${isHome && activeSection === 'home' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <span>Home</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
          </a>
          <a
            href="#menu"
            className={`mobile-nav-link ${isHome && activeSection === 'menu' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'menu')}
          >
            <span>Menu</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
          </a>
          <a
            href="#combos"
            className={`mobile-nav-link ${isHome && activeSection === 'combos' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'combos')}
          >
            <span>Combos</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
          </a>
          <a
            href="#about"
            className={`mobile-nav-link ${isHome && activeSection === 'about' ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, 'about')}
          >
            <span>About Us</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
          </a>
          <a
            href="/contact-us"
            className={`mobile-nav-link ${currentPath === '/contact-us' || currentPath === '/contact' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              closeMobileMenu();
              navigate('/contact-us');
            }}
          >
            <span>Contact</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
          </a>
          <a
            href="/faq"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              closeMobileMenu();
              navigate('/faq');
            }}
          >
            <span>FAQs & Help</span>
            <FontAwesomeIcon icon={faArrowRight} className="mobile-nav-arrow" aria-hidden="true" />
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
            <FontAwesomeIcon icon={faWhatsapp} className="btn-icon" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
