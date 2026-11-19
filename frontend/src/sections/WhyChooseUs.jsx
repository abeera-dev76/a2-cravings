import React, { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const WhyChooseUs = () => {
  // Feature cards data adhering strictly to prompt
  const features = [
    {
      id: 'homemade-taste',
      title: 'Homemade-Style Taste',
      desc: 'Enjoy comforting homemade-style flavors in every order.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      )
    },
    {
      id: 'prepared-with-care',
      title: 'Prepared With Care',
      desc: 'Every order is prepared thoughtfully with attention to taste.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      id: 'delicious-variety',
      title: 'Delicious Variety',
      desc: 'Choose from creamy pasta, loaded fries, stuffed buns, biryani and combos.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      )
    },
    {
      id: 'whatsapp-ordering',
      title: 'Easy WhatsApp Ordering',
      desc: 'Place your food order easily through WhatsApp.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      )
    }
  ];

  // Reusable 3D Tilt Hook for each card
  const TiltCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState('');

    const handleMouseMove = (e) => {
      if (!cardRef.current || window.innerWidth < 1024) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      setTilt(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`);
    };

    const handleMouseLeave = () => {
      setTilt('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)');
    };

    return (
      <div
        ref={cardRef}
        className={className}
        style={{ transform: tilt }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  };

  // Smooth scroll to Menu section
  const handleViewMenu = (e) => {
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

  return (
    <section id="why-us" className="why-us-section" aria-labelledby="why-us-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">WHY A2 CRAVINGS?</span>
          <h2 id="why-us-heading" className="section-title">
            Why You'll Love <span className="accent-gradient">Every Bite</span>
          </h2>
          <p className="section-description">
            Great taste, thoughtful preparation and a satisfying food experience. 
            Delivering authentic homemade fast food flavors across Rawalpindi.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="why-us-grid">
          {features.map((item) => (
            <TiltCard key={item.id} className="why-us-card anim-card-in">
              <div className="why-card-icon-wrap" aria-hidden="true">
                <div className="why-icon-bubble">
                  {item.icon}
                </div>
              </div>

              <div className="why-card-content">
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-desc">{item.desc}</p>
              </div>

              {/* Decorative bottom corner glow line */}
              <div className="why-card-glow-line" aria-hidden="true" />
            </TiltCard>
          ))}
        </div>

        {/* Section Action CTAs */}
        <div className="why-us-actions text-center">
          <Button
            variant="primary"
            size="md"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Order Now on WhatsApp with A2 Cravings"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
              </svg>
            }
          >
            Order Now
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleViewMenu}
            ariaLabel="View Our Complete Homemade Menu"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            }
          >
            View Our Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
