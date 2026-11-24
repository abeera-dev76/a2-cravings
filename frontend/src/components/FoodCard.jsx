import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ item }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const activePrice = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
    addToCart({ ...item, price: activePrice }, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const badgeText = item.badge || (item.isBestseller ? 'Bestseller' : item.isFeatured ? 'Featured' : item.isNewArrival ? 'New' : '');

  return (
    <article
      ref={cardRef}
      className={`food-card ${isHovered ? 'is-card-hovered' : ''}`}
      style={{ transform: transformStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`${item.name} - Rs ${item.discountPrice || item.price}`}
    >
      {/* Food Image Container */}
      <div className="food-card-image-wrap">
        {badgeText && <span className="food-card-badge">{badgeText}</span>}
        <picture>
          {item.image && item.image.endsWith('.webp') && (
            <source srcSet={item.image} type="image/webp" />
          )}
          <img
            src={item.image || item.fallbackImage || '/images/hero/hero-food.png'}
            alt={item.alt || `${item.name} - A2 Cravings Rawalpindi`}
            className="food-card-image"
            loading="lazy"
            width="400"
            height="300"
            onError={(e) => {
              if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                e.currentTarget.src = item.fallbackImage;
              } else {
                e.currentTarget.src = '/images/hero/hero-food.png';
              }
            }}
          />
        </picture>
        <div className="food-card-image-gradient" aria-hidden="true" />
      </div>

      {/* Food Content Details */}
      <div className="food-card-body">
        <div className="food-card-header">
          <h3 className="food-card-title">{item.name}</h3>
          <div className="food-card-price-wrap" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            {item.discountPrice && item.discountPrice < item.price ? (
              <>
                <span className="food-card-price" style={{ color: '#FF8C00', fontWeight: 700 }}>
                  Rs {item.discountPrice}
                </span>
                <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginLeft: '0.35rem' }}>
                  Rs {item.price}
                </span>
              </>
            ) : (
              <span className="food-card-price">Rs {item.price}</span>
            )}
          </div>
        </div>

        {item.prepTime && (
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>⏱ Prep: {item.prepTime}</span>
          </div>
        )}

        <p className="food-card-description">{item.description}</p>

        {/* Card Actions: Add to Cart */}
        <div className="food-card-footer">
          <button
            type="button"
            className={`food-card-cart-btn ${isAdded ? 'is-added' : ''} ${item.isAvailable === false ? 'is-disabled' : ''}`}
            onClick={item.isAvailable === false ? undefined : handleAddToCart}
            disabled={item.isAvailable === false}
            aria-label={item.isAvailable === false ? `${item.name} is currently unavailable` : `Add ${item.name} to cart`}
            style={item.isAvailable === false ? { opacity: 0.5, cursor: 'not-allowed', background: '#333333', color: '#999999' } : {}}
          >
            <FontAwesomeIcon icon={isAdded ? faCheck : faCartPlus} className="btn-icon" />
            <span>{item.isAvailable === false ? 'Out of Stock' : isAdded ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
