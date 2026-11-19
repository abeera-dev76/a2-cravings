import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const Hero = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle 3D parallax on desktop mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Avoid computation on touch devices or small screens
      if (window.innerWidth < 1024) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleExploreClick = (e) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback if menu section not mounted yet
      window.scrollTo({
        top: window.innerHeight * 0.85,
        behavior: 'smooth'
      });
    }
  };

  const whatsappOrderUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  // Parallax transform calculations
  const foodTransform = `
    perspective(1000px)
    rotateY(${mousePos.x * 9}deg)
    rotateX(${-mousePos.y * 9}deg)
    translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)
  `;

  const glowTransform = `
    translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 0)
  `;

  return (
    <section className="hero-section" ref={containerRef} aria-label="Hero Section">
      {/* Background Ambience & Lighting */}
      <div className="hero-bg-overlay" aria-hidden="true">
        <div className="hero-glow-ambient" />
        <div className="hero-mesh-grid" />
        <div className="hero-particle particle-1" />
        <div className="hero-particle particle-2" />
        <div className="hero-particle particle-3" />
        <div className="hero-particle particle-4" />
      </div>

      <div className="container hero-container">
        {/* Left Side: Typography & Conversion Action */}
        <div className="hero-content">
          {/* Small Badge */}
          <div className="hero-badge anim-reveal-1">
            <span className="badge-heart">❤️</span>
            <span className="badge-text">HOMEMADE WITH LOVE</span>
          </div>

          {/* Primary SEO H1 Heading */}
          <h1 className="hero-title anim-reveal-2">
            <span className="sr-only">Homemade Fast Food in Rawalpindi - A2 CRAVINGS</span>
            <span className="hero-title-line">Cravings Made Fresh.</span>
            <span className="hero-title-line accent-gradient">
              Flavor Made Unforgettable.
            </span>
          </h1>

          {/* Description */}
          <p className="hero-description anim-reveal-3">
            Delicious homemade fast food prepared fresh with love in Rawalpindi. 
            From sizzling creamy pastas and crispy loaded fries to aromatic chicken biryani — 
            your favorite flavors, made specially for you.
          </p>

          {/* CTA Action Buttons */}
          <div className="hero-actions anim-reveal-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleExploreClick}
              ariaLabel="Explore our homemade menu"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              }
            >
              Explore Our Menu
            </Button>

            <Button
              variant="secondary"
              size="lg"
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Order on WhatsApp with A2 Cravings"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              }
            >
              Order on WhatsApp
            </Button>
          </div>

          {/* Small Trust Highlights */}
          <div className="hero-trust-bar anim-reveal-4">
            <div className="trust-item">
              <span className="trust-icon">✨</span>
              <span className="trust-label">Freshly Homemade</span>
            </div>
            <div className="trust-divider" aria-hidden="true">•</div>
            <div className="trust-item">
              <span className="trust-icon">🌿</span>
              <span className="trust-label">Quality Ingredients</span>
            </div>
            <div className="trust-divider" aria-hidden="true">•</div>
            <div className="trust-item">
              <span className="trust-icon">👨‍🍳</span>
              <span className="trust-label">Made With Love</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3D-Style Cinematic Food Visual Composition */}
        <div className="hero-visual anim-reveal-food">
          <div className="hero-3d-stage">
            {/* Cinematic Orange Backlight Glow */}
            <div 
              className="hero-glow-disk" 
              style={{ transform: glowTransform }}
              aria-hidden="true" 
            />

            {/* Central 3D Floating Burger Composition */}
            <div 
              className="hero-food-wrapper"
              style={{ transform: foodTransform }}
            >
              {/* Dynamic Pedestal Shadow */}
              <div className="hero-food-shadow" aria-hidden="true" />

              {/* Main Food Image */}
              <img
                src="/images/hero/hero-burger.webp"
                alt="Fresh homemade fast food by A2 Cravings in Rawalpindi"
                className="hero-food-img"
                width="640"
                height="640"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  // Graceful fallback to hero-food banner if webp is unsupported
                  e.currentTarget.src = "/images/hero/hero-food.png";
                }}
              />

              {/* Layered Floating Ingredients for 3D Depth */}
              <div className="floating-ingredient ingredient-leaf" aria-hidden="true">
                <span className="badge-pill">🔥 Fresh & Hot</span>
              </div>

              <div className="floating-ingredient ingredient-badge" aria-hidden="true">
                <span className="rating-star">✨ Fresh</span>
                <span className="rating-text">Chef Special</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
