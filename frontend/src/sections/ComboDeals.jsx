import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

export const ComboDeals = () => {
  const { addToCart, openCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const handleAddComboToCart = (combo) => {
    addToCart(
      {
        id: combo.id,
        name: combo.name,
        price: combo.price,
        image: combo.image,
        category: 'combos',
      },
      1
    );
    setAddedId(combo.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1800);
    openCart();
  };

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
          <span className="section-badge reveal-on-scroll">EXCLUSIVE DEALS</span>
          <h2 id="combos-heading" className="section-title reveal-on-scroll reveal-delay-1">
            Special <span className="accent-gradient">Combos & Deals</span>
          </h2>
          <p className="section-description reveal-on-scroll reveal-delay-2">
            Enjoy your favorite homemade food combinations at A2 CRAVINGS. More flavor, more happiness!
            Pairing our signature pastas, loaded fries, and authentic chicken biryani with cold refreshing drinks in Rawalpindi.
          </p>
        </div>

        {/* Featured Card: Siblings Combo */}
        <div className="featured-combo-wrapper reveal-on-scroll reveal-scale">
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
                        <span className="combo-item-check" aria-hidden="true">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add to Cart Action Button */}
                <div className="featured-combo-cta">
                  <button
                    type="button"
                    onClick={() => handleAddComboToCart(featuredCombo)}
                    className={`combo-order-btn featured-btn ${addedId === featuredCombo.id ? 'is-added' : ''}`}
                    aria-label={`Add ${featuredCombo.name} to cart`}
                  >
                    <FontAwesomeIcon icon={addedId === featuredCombo.id ? faCheck : faCartPlus} className="btn-icon" />
                    <span>{addedId === featuredCombo.id ? 'Added to Cart!' : 'Add Siblings Combo to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          </CardWithTilt>
        </div>

        {/* Regular Combos Grid */}
        <div className="combos-grid">
          {regularCombos.map((combo, idx) => (
            <CardWithTilt
              key={combo.id}
              className="combo-card reveal-on-scroll anim-card-in"
              style={{ transitionDelay: `${idx * 0.09}s` }}
            >
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
                  <button
                    type="button"
                    onClick={() => handleAddComboToCart(combo)}
                    className={`combo-order-btn ${addedId === combo.id ? 'is-added' : ''}`}
                    aria-label={`Add ${combo.name} to cart`}
                  >
                    <FontAwesomeIcon icon={addedId === combo.id ? faCheck : faCartPlus} className="btn-icon" />
                    <span>{addedId === combo.id ? 'Added!' : 'Add to Cart'}</span>
                  </button>
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
