import React, { useState, useMemo, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import Categories from './Categories';
import { menuCategories, menuItems } from '../data/menuData';

export const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

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
          <span className="section-badge">OUR MENU</span>
          <h2 id="menu-heading" className="section-title">
            Explore Our <span className="accent-gradient">Delicious Menu</span>
          </h2>
          <p className="section-description">
            Fresh homemade fast food in Rawalpindi, prepared with love and full of authentic flavor.
            Order freshly cooked pasta, crispy loaded fries, stuffed buns, and aromatic biryani right to your doorstep.
          </p>
        </div>

        {/* Category Filters */}
        <div className="menu-categories-wrapper">
          <Categories
            categories={menuCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Menu Food Grid */}
        <div className="menu-grid" key={activeCategory}>
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-grid-item anim-card-in">
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
