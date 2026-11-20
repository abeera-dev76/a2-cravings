import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKitchenSet, faClock, faHeart, faStar, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
      icon: <FontAwesomeIcon icon={faKitchenSet} />,
      title: 'Homemade-Style Goodness',
      desc: 'Authentic kitchen warmth and genuine flavors cooked like food made for family.'
    },
    {
      id: 'freshly-prepared',
      icon: <FontAwesomeIcon icon={faClock} />,
      title: 'Freshly Prepared Food',
      desc: 'Cooked fresh upon your order so every bite arrives hot, rich, and full of aroma.'
    },
    {
      id: 'made-with-care',
      icon: <FontAwesomeIcon icon={faHeart} />,
      title: 'Made With Care',
      desc: 'Prepared thoughtfully from recipe to packaging to give you a comforting dining experience.'
    }
  ];

  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-layout-grid">
          {/* Left Column: Food Photography Visual */}
          <div className="about-visual-col reveal-on-scroll reveal-scale">
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
                <span className="badge-flame">
                  <FontAwesomeIcon icon={faStar} />
                </span>
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
              <span className="section-badge reveal-on-scroll">ABOUT US</span>
              <h2 id="about-heading" className="about-main-title reveal-on-scroll reveal-delay-1">
                Made With Love, <span className="accent-gradient">Served With Flavor.</span>
              </h2>
            </div>

            {/* Brand Description */}
            <div className="about-story-text reveal-on-scroll reveal-delay-2">
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
              {highlights.map((h, idx) => (
                <div
                  key={h.id}
                  className="about-highlight-card reveal-on-scroll"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
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

            {/* Rawalpindi / Proudly Local & Kitchen Stats Box */}
            <div className="about-stats-row reveal-on-scroll">
              <div className="about-stat-box">
                <span className="stat-box-num">100%</span>
                <span className="stat-box-lbl">Fresh To Order</span>
              </div>
              <div className="about-stat-box">
                <span className="stat-box-num">4.9★</span>
                <span className="stat-box-lbl">Customer Rated</span>
              </div>
              <div className="about-stat-box about-stat-box-local">
                <span className="stat-box-num stat-box-city">{businessData.location.city}</span>
                <span className="stat-box-lbl">Proudly Local</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="about-actions-row reveal-on-scroll reveal-delay-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleExploreMenu}
                ariaLabel="Explore our complete homemade menu"
                icon={<FontAwesomeIcon icon={faChevronDown} />}
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
                icon={<FontAwesomeIcon icon={faWhatsapp} />}
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
