import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUtensils, faBowlFood, faTriangleExclamation, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { navigate } from '../utils/navigation';
import '../styles/notfound.css';

export const NotFound = () => {
  // Update document title for SEO and UX
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '404 - Page Not Found | A2 CRAVINGS';
    return () => {
      document.title = prevTitle || 'A2 CRAVINGS | Homemade Fast Food in Rawalpindi';
    };
  }, []);

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleExploreMenu = (e) => {
    e.preventDefault();
    navigate('/', 'menu');
  };

  const handleShortcutClick = (e, categoryId) => {
    e.preventDefault();
    navigate('/', 'menu');
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('a2:selectCategory', { detail: { categoryId } })
      );
    }, 150);
  };

  return (
    <div className="not-found-page" aria-label="404 Page Not Found">
      <Navbar />

      <main className="not-found-hero">
        {/* Background ambient orange lighting */}
        <div className="not-found-bg-ambient" aria-hidden="true">
          <div className="not-found-glow-circle" />
        </div>

        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <section className="not-found-card" role="alert" aria-live="polite">
            {/* Status Badge */}
            <div className="not-found-badge">
              <FontAwesomeIcon icon={faTriangleExclamation} className="not-found-badge-icon" />
              <span>404 • Page Not Found</span>
            </div>

            {/* Food Platter Visual with Floating Cutlery */}
            <div className="not-found-visual-wrapper" aria-hidden="true">
              <div className="not-found-visual-halo" />
              <img
                src="/images/hero food.png"
                alt="A2 Cravings delicious food platter"
                className="not-found-food-img"
                width="220"
                height="220"
                loading="eager"
              />
              <div className="not-found-floating-pin" title="A2 Cravings Fresh Kitchen">
                <FontAwesomeIcon icon={faUtensils} />
              </div>
            </div>

            {/* Large 404 Heading */}
            <h1 className="not-found-code">404</h1>

            {/* Main Message */}
            <h2 className="not-found-heading">Oops! This page is not on our menu.</h2>

            {/* Description */}
            <p className="not-found-desc">
              Looks like this page went missing! Don't worry, our delicious food is still waiting for you.
            </p>

            {/* Optional Small Subtext */}
            <p className="not-found-subtext">
              "Lost your way? Let us help you find something delicious!"
            </p>

            {/* Navigation Actions */}
            <div className="not-found-actions">
              <a
                href="/"
                className="not-found-btn not-found-btn-primary"
                onClick={handleBackToHome}
                aria-label="Back to A2 CRAVINGS Home"
              >
                <FontAwesomeIcon icon={faHouse} />
                <span>Back to Home</span>
              </a>

              <a
                href="/#menu"
                className="not-found-btn not-found-btn-secondary"
                onClick={handleExploreMenu}
                aria-label="Explore A2 CRAVINGS Menu"
              >
                <FontAwesomeIcon icon={faUtensils} />
                <span>Explore Our Menu</span>
              </a>
            </div>

            {/* Quick Cravings Shortcuts */}
            <div className="not-found-shortcuts">
              <div className="not-found-shortcuts-title">Popular Cravings Today</div>
              <div className="not-found-pill-group">
                <button
                  type="button"
                  className="not-found-pill"
                  onClick={(e) => handleShortcutClick(e, 'pasta')}
                >
                  <FontAwesomeIcon icon={faBowlFood} />
                  <span>Creamy Pasta</span>
                </button>
                <button
                  type="button"
                  className="not-found-pill"
                  onClick={(e) => handleShortcutClick(e, 'loaded-fries')}
                >
                  <FontAwesomeIcon icon={faBowlFood} />
                  <span>Loaded Fries</span>
                </button>
                <button
                  type="button"
                  className="not-found-pill"
                  onClick={(e) => handleShortcutClick(e, 'buns')}
                >
                  <FontAwesomeIcon icon={faBowlFood} />
                  <span>Stuffed Buns</span>
                </button>
                <button
                  type="button"
                  className="not-found-pill"
                  onClick={(e) => handleShortcutClick(e, 'biryani')}
                >
                  <FontAwesomeIcon icon={faBowlFood} />
                  <span>Chicken Biryani</span>
                </button>
                <button
                  type="button"
                  className="not-found-pill"
                  onClick={(e) => handleShortcutClick(e, 'combos')}
                >
                  <FontAwesomeIcon icon={faBowlFood} />
                  <span>Value Combos</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
