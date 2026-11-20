import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faBowlFood,
  faBreadSlice,
  faFire,
  faBowlRice,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

const categoryIcons = {
  all: faUtensils,
  pasta: faBowlFood,
  buns: faBreadSlice,
  'loaded-fries': faFire,
  biryani: faBowlRice,
  combos: faLayerGroup
};

export const Categories = ({ categories = [], activeCategory, onSelectCategory }) => {
  return (
    <nav className="menu-categories-nav" aria-label="Menu Category Filter">
      <div className="menu-categories-list">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const icon = categoryIcons[cat.id] || faUtensils;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isActive}
            >
              <FontAwesomeIcon icon={icon} className="category-tab-icon" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Categories;
