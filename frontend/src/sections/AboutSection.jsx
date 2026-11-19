import React, { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const AboutSection = () => {
  const imageCardRef = useRef(null);
  const [imageTilt, setImageTilt] = useState('');

  // Subtle 3D tilt on image banner for desktop
  const handleMouseMove = (e) => {
    if (!imageCardRef.current || window.innerWidth < 1024) return;
    const rect = imageCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setImageTilt(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`);
  };

  const handleMouseLeave = () => {
    setImageTilt('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)');
  };

  // Smooth scroll to existing Menu section
  const handleExploreMenu = (e) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      const navHeader = document.querySelector('.site-header');
      const navHeight = navHeader ? navHeader.offsetHeight : 80;
      const targetPos = menuEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + 20);
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  const whatsappUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.generalOrder
  );

  const highlights = [
    {
      id: 'homemade-goodness',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: 'Homemade-Style Goodness',
      desc: 'Authentic kitchen warmth and genuine flavors cooked like food made for family.'
    },
    {
      id: 'freshly-prepared',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          <circle cx="12" cy="12" r="9"/>
        </svg>
      ),
      title: 'Freshly Prepared Food',
      desc: 'Cooked fresh upon your order so every bite arrives hot, rich, and full of aroma.'
    },
    {
      id: 'made-with-care',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: 'Made With Care',
      desc: 'Prepared thoughtfully from recipe to packaging to give you a comforting dining experience.'
    }
  ];

  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-layout-grid">
          {/* Left Column: Food Photography Visual */}
          <div className="about-visual-col">
            <div
              ref={imageCardRef}
              className="about-image-card anim-reveal-food"
              style={{ transform: imageTilt }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Image Frame */}
              <div className="about-image-wrap">
                <img
                  src="/images/hero/hero-food.png"
                  alt="Delicious homemade food in Rawalpindi by A2 CRAVINGS"
                  className="about-food-img"
                  loading="lazy"
                  width="600"
                  height="500"
                  onError={(e) => {
                    e.currentTarget.src = '/images/pasta/a2-special-pasta.png';
                  }}
                />
                <div className="about-image-gradient" aria-hidden="true" />
              </div>

              {/* Decorative Brand Accent Tag */}
              <div className="about-floating-badge" aria-hidden="true">
                <span className="badge-flame">✨</span>
                <div>
                  <span className="badge-primary-text">A2 CRAVINGS</span>
                  <span className="badge-secondary-text">Homemade Fast Food • Rawalpindi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Storytelling & Highlights */}
          <div className="about-content-col">
            <div className="about-header">
              <span className="section-badge">OUR STORY</span>
              <h2 id="about-heading" className="about-main-title">
                Made With Love, <span className="accent-gradient">Served With Flavor.</span>
              </h2>
            </div>

            {/* Brand Description */}
            <div className="about-story-text">
              <p>
                At <strong>A2 CRAVINGS</strong>, we believe great food brings people together. 
                Our passion is serving delicious homemade-style food, prepared with care and full of flavor. 
                From creamy pasta and crispy loaded fries to flavorful biryani and freshly prepared buns, 
                every craving deserves something special.
              </p>
              <p>
                Our goal is to make every order enjoyable with tasty food, caring service and a memorable experience. 
                Thank you for being part of our journey!
              </p>
            </div>

            {/* Brand Highlights Cards */}
            <div className="about-highlights-grid">
              {highlights.map((h) => (
                <div key={h.id} className="about-highlight-card">
                  <div className="highlight-icon-box" aria-hidden="true">
                    {h.icon}
                  </div>
                  <div className="highlight-text-box">
                    <h3 className="highlight-card-title">{h.title}</h3>
                    <p className="highlight-card-desc">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="about-actions-row">
              <Button
                variant="primary"
                size="md"
                onClick={handleExploreMenu}
                ariaLabel="Explore our complete homemade menu"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                }
              >
                Explore Our Menu
              </Button>

              <Button
                variant="secondary"
                size="md"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Order on WhatsApp with A2 Cravings"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                  </svg>
                }
              >
                Order on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
