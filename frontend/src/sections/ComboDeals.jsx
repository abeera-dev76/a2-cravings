import React, { useRef, useState } from 'react';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { businessData } from '../data/businessData';

export const ComboDeals = () => {
  // Combos definition adhering strictly to requirements
  const regularCombos = [
    {
      id: 'pasta-drink-combo',
      name: 'Pasta + Drink',
      price: 700,
      includes: ['1 Creamy Chicken Pasta', '1 Chilled Soft Drink'],
      image: '/images/combos/pasta-drink-combo.png',
      alt: 'Pasta and Drink Combo Deal - Fresh homemade food in Rawalpindi by A2 Cravings'
    },
    {
      id: 'biryani-drink-combo',
      name: 'Biryani + Drink',
      price: 470,
      includes: ['1 Chicken Biryani', '1 Chilled Soft Drink'],
      image: '/images/combos/biryani-drink-combo.png',
      alt: 'Chicken Biryani and Drink Combo - Authentic food combos in Rawalpindi'
    },
    {
      id: 'aalu-biryani-drink-combo',
      name: 'Aalu Biryani + Drink',
      price: 370,
      includes: ['1 Aalu Biryani', '1 Chilled Soft Drink'],
      image: '/images/combos/aalu-biryani-drink-combo.png',
      alt: 'Aalu Biryani with Drink Deal - A2 Cravings food combos in Rawalpindi'
    },
    {
      id: 'loaded-fries-drink-combo',
      name: 'Loaded Fries + Drink',
      price: 500,
      includes: ['1 Crispy Loaded Fries', '1 Chilled Soft Drink'],
      image: '/images/combos/loaded-fries-drink-combo.png',
      alt: 'Loaded Fries and Drink Value Combo - Homemade fast food in Rawalpindi'
    }
  ];

  const featuredCombo = {
    id: 'siblings-combo',
    name: 'Siblings Combo',
    price: 1400,
    badge: 'Family Favorite',
    description: 'The ultimate feast designed for sharing! Handcrafted with love and packed with our most popular signature dishes.',
    includes: [
      '1 Chicken Cheese Pasta',
      '1 Chicken Biryani',
      '1 Fries',
      '2 Drinks'
    ],
    image: '/images/combos/siblings-combo-deal.png',
    alt: 'Siblings Combo Deal by A2 Cravings - 1 Chicken Cheese Pasta, 1 Chicken Biryani, 1 Fries, 2 Drinks'
  };

  // Reusable 3D Tilt hook for individual combo cards
  const CardWithTilt = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState('');

    const handleMouseMove = (e) => {
      if (!cardRef.current || window.innerWidth < 1024) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setTilt(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`);
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

  return (
    <section id="combos" className="combos-section" aria-labelledby="combos-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">EXCLUSIVE DEALS</span>
          <h2 id="combos-heading" className="section-title">
            Special <span className="accent-gradient">Combos & Deals</span>
          </h2>
          <p className="section-description">
            Enjoy your favorite homemade food combinations at A2 CRAVINGS. More flavor, more happiness!
            Pairing our signature pastas, loaded fries, and authentic chicken biryani with cold refreshing drinks in Rawalpindi.
          </p>
        </div>

        {/* Featured Card: Siblings Combo */}
        <div className="featured-combo-wrapper">
          <CardWithTilt className="featured-combo-card anim-card-in">
            <div className="featured-combo-grid">
              <div className="featured-combo-image-wrap">
                <span className="featured-badge">{featuredCombo.badge}</span>
                <img
                  src={featuredCombo.image}
                  alt={featuredCombo.alt}
                  className="featured-combo-image"
                  loading="lazy"
                  width="600"
                  height="450"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero/hero-food.png';
                  }}
                />
                <div className="food-card-image-gradient" aria-hidden="true" />
              </div>

              <div className="featured-combo-content">
                <div className="featured-combo-header">
                  <div>
                    <span className="featured-sublabel">Mega Value Feast</span>
                    <h3 className="featured-combo-title">{featuredCombo.name}</h3>
                  </div>
                  <div className="featured-combo-price">
                    <span className="price-label">Only</span>
                    <span className="price-amount">Rs {featuredCombo.price}</span>
                  </div>
                </div>

                <p className="featured-combo-desc">{featuredCombo.description}</p>

                {/* Items Included Checklist */}
                <div className="featured-combo-items">
                  <h4 className="combo-items-heading">What's Included:</h4>
                  <ul className="combo-items-list" aria-label="Siblings Combo items">
                    {featuredCombo.includes.map((item, idx) => (
                      <li key={idx} className="combo-item-pill">
                        <span className="combo-item-check" aria-hidden="true">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Action Button */}
                <div className="featured-combo-cta">
                  <a
                    href={getWhatsAppUrl(
                      businessData.contact.whatsapp,
                      WHATSAPP_MESSAGES.comboOrder(featuredCombo.name, featuredCombo.price)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="combo-order-btn featured-btn"
                    aria-label={`Order ${featuredCombo.name} for Rs ${featuredCombo.price} on WhatsApp`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                    </svg>
                    <span>Order Combo on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </CardWithTilt>
        </div>

        {/* Regular Combos Grid */}
        <div className="combos-grid">
          {regularCombos.map((combo) => (
            <CardWithTilt key={combo.id} className="combo-card anim-card-in">
              <div className="combo-card-image-wrap">
                <img
                  src={combo.image}
                  alt={combo.alt}
                  className="combo-card-image"
                  loading="lazy"
                  width="400"
                  height="300"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero/hero-food.png';
                  }}
                />
                <div className="food-card-image-gradient" aria-hidden="true" />
              </div>

              <div className="combo-card-body">
                <div className="combo-card-header">
                  <h3 className="combo-card-title">{combo.name}</h3>
                  <span className="combo-card-price">Rs {combo.price}</span>
                </div>

                <div className="combo-includes-wrap">
                  <span className="combo-includes-title">Includes:</span>
                  <ul className="combo-item-list-compact">
                    {combo.includes.map((inc, i) => (
                      <li key={i} className="combo-mini-item">
                        <span className="mini-bullet">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="combo-card-footer">
                  <a
                    href={getWhatsAppUrl(
                      businessData.contact.whatsapp,
                      WHATSAPP_MESSAGES.comboOrder(combo.name, combo.price)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="combo-order-btn"
                    aria-label={`Order ${combo.name} for Rs ${combo.price} on WhatsApp`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/>
                    </svg>
                    <span>Order Combo</span>
                  </a>
                </div>
              </div>
            </CardWithTilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComboDeals;
