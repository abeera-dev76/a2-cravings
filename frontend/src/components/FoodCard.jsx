import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { businessData } from '../data/businessData';

export const FoodCard = ({ item }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)');
  };

  // Prefilled WhatsApp order URL for this specific food item
  const whatsappUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    WHATSAPP_MESSAGES.itemOrder(item.name, item.price)
  );

  return (
    <article
      ref={cardRef}
      className={`food-card ${isHovered ? 'is-card-hovered' : ''}`}
      style={{ transform: transformStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`${item.name} - Rs ${item.price}`}
    >
      {/* Food Image Container */}
      <div className="food-card-image-wrap">
        {item.badge && <span className="food-card-badge">{item.badge}</span>}
        <img
          src={item.image}
          alt={item.alt || `${item.name} - A2 Cravings Rawalpindi`}
          className="food-card-image"
          loading="lazy"
          width="400"
          height="300"
          onError={(e) => {
            // Graceful tiered fallback: specific fallback image -> hero food banner
            if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
              e.currentTarget.src = item.fallbackImage;
            } else {
              e.currentTarget.src = '/images/hero/hero-food.png';
            }
          }}
        />
        <div className="food-card-image-gradient" aria-hidden="true" />
      </div>

      {/* Food Content Details */}
      <div className="food-card-body">
        <div className="food-card-header">
          <h3 className="food-card-title">{item.name}</h3>
          <span className="food-card-price">Rs {item.price}</span>
        </div>

        <p className="food-card-description">{item.description}</p>

        {/* Card CTA: Order on WhatsApp */}
        <div className="food-card-footer">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="food-card-order-btn"
            aria-label={`Order ${item.name} for Rs ${item.price} on WhatsApp`}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
