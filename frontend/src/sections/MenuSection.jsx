import React, { useState, useMemo, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import Categories from './Categories';
import { menuCategories, menuItems } from '../data/menuData';
import { useScrollReveal } from '../utils/useScrollReveal';

export const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Re-observe cards whenever category filter changes
  useScrollReveal(activeCategory);

  // Listen for custom category selection events (e.g. from footer menu links)
  useEffect(() => {
    const handleCategoryEvent = (e) => {
      if (e.detail && e.detail.categoryId) {
        setActiveCategory(e.detail.categoryId);
      }
    };

    window.addEventListener('a2:selectCategory', handleCategoryEvent);
    return () => window.removeEventListener('a2:selectCategory', handleCategoryEvent);
  }, []);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="menu" className="menu-section" aria-labelledby="menu-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge reveal-on-scroll">OUR MENU</span>
          <h2 id="menu-heading" className="section-title reveal-on-scroll reveal-delay-1">
            Explore Our <span className="accent-gradient">Delicious Menu</span>
          </h2>
          <p className="section-description reveal-on-scroll reveal-delay-2">
            Fresh homemade fast food in Rawalpindi, prepared with love and full of authentic flavor.
            Order freshly cooked pasta, crispy loaded fries, stuffed buns, and aromatic biryani right to your doorstep.
          </p>
        </div>

        {/* Category Filters */}
        <div className="menu-categories-wrapper reveal-on-scroll reveal-delay-1">
          <Categories
            categories={menuCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Menu Food Grid */}
        <div className="menu-grid" key={activeCategory}>
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="menu-grid-item reveal-on-scroll anim-card-in"
              style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}
            >
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
