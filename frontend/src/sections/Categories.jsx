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
  // Deduplicate categories by clean display name and filter out any temporary/junk timestamp suffixes
  const cleanCategories = React.useMemo(() => {
    const seenNames = new Set();
    const result = [];

    for (const cat of categories) {
      if (!cat) continue;
      // Strip trailing unix timestamps or numeric IDs (e.g. "Weekend Deals 1795509764912" -> "Weekend Deals")
      const cleanName = (cat.name || '')
        .replace(/[\s\-_]*\d{10,}[\w\-]*$/g, '')
        .trim() || cat.name;

      const normalizedKey = cleanName.toLowerCase();
      // Skip duplicate categories with identical clean name if one is already present
      if (normalizedKey && seenNames.has(normalizedKey) && cat.id !== 'all') {
        continue;
      }
      if (normalizedKey && cat.id !== 'all') {
        seenNames.add(normalizedKey);
      }

      result.push({
        ...cat,
        displayName: cleanName,
      });
    }

    return result;
  }, [categories]);

  return (
    <nav className="menu-categories-nav" aria-label="Menu Category Filter">
      <div className="menu-categories-list">
        {cleanCategories.map((cat) => {
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
              <span>{cat.displayName || cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Categories;
