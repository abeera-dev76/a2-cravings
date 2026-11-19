import React from 'react';

export const Categories = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="menu-categories-nav" aria-label="Menu Category Filter">
      <div className="menu-categories-list">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isActive}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Categories;
