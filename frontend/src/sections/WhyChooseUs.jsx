import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faHeart, faLayerGroup, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
      icon: <FontAwesomeIcon icon={faUtensils} />
    },
    {
      id: 'prepared-with-care',
      title: 'Prepared With Care',
      desc: 'Every order is prepared thoughtfully with attention to taste.',
      icon: <FontAwesomeIcon icon={faHeart} />
    },
    {
      id: 'delicious-variety',
      title: 'Delicious Variety',
      desc: 'Choose from creamy pasta, loaded fries, stuffed buns, biryani and combos.',
      icon: <FontAwesomeIcon icon={faLayerGroup} />
    },
    {
      id: 'whatsapp-ordering',
      title: 'Easy WhatsApp Ordering',
      desc: 'Place your food order easily through WhatsApp.',
      icon: <FontAwesomeIcon icon={faWhatsapp} />
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
    <section id="why-us" className="why-choose-section" aria-labelledby="why-choose-heading">
      <div className="container">
        {/* Section Heading */}
        <div className="section-header text-center">
          <span className="section-badge reveal-on-scroll">WHY A2 CRAVINGS?</span>
          <h2 id="why-choose-heading" className="section-title reveal-on-scroll reveal-delay-1">
            Why You'll Love <span className="accent-gradient">Every Bite</span>
          </h2>
          <p className="section-description reveal-on-scroll reveal-delay-2">
            Great taste, thoughtful preparation and a satisfying food experience. 
            Rawalpindi's trusted homemade kitchen bringing flavor right to your door.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="why-features-grid">
          {features.map((feat, idx) => (
            <TiltCard
              key={feat.id}
              className="why-feature-card reveal-on-scroll anim-card-in"
              style={{ transitionDelay: `${idx * 0.09}s` }}
            >
              {/* Animated Floating Icon Box */}
              <div className="why-icon-stage">
                <div className="why-icon-glow" aria-hidden="true" />
                <div className="why-icon-box" aria-hidden="true">
                  {feat.icon}
                </div>
              </div>

              {/* Card Content */}
              <h3 className="why-card-title">{feat.title}</h3>
              <p className="why-card-desc">{feat.desc}</p>

              {/* Decorative bottom corner glow line */}
              <div className="why-card-glow-line" aria-hidden="true" />
            </TiltCard>
          ))}
        </div>

        {/* Section Action CTAs */}
        <div className="why-us-actions text-center reveal-on-scroll reveal-delay-2">
          <Button
            variant="primary"
            size="md"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Order Now on WhatsApp with A2 Cravings"
            icon={<FontAwesomeIcon icon={faWhatsapp} />}
          >
            Order Now
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleViewMenu}
            ariaLabel="View Our Complete Homemade Menu"
            icon={<FontAwesomeIcon icon={faChevronDown} />}
          >
            View Our Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
