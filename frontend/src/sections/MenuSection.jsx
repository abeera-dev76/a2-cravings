import React, { useState, useEffect, useCallback } from 'react';
import FoodCard from '../components/FoodCard';
import Categories from './Categories';
import { menuCategories } from '../data/menuData';
import { fetchCategories, fetchProducts } from '../services/api';
import { useScrollReveal } from '../utils/useScrollReveal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate,
  faTriangleExclamation,
  faUtensils,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export const MenuSection = () => {
  const [categories, setCategories] = useState(menuCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;

    fetchCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load categories from API, using fallback:', err.message);
        // Retain fallback menuCategories
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products whenever active category changes
  const loadProducts = useCallback(async (catId) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchProducts(catId);
      setProducts(items);
    } catch (err) {
      console.error('Failed to load menu products:', err);
      setError('Unable to load our menu right now. Please check your internet connection or backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  // Re-observe cards whenever category, products or loading state changes
  useScrollReveal([activeCategory, products.length, loading]);

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

  const handleRetry = () => {
    loadProducts(activeCategory);
  };

  const handleResetCategory = () => {
    setActiveCategory('all');
  };

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
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* ─── State 1: Loading Skeleton Grid ─── */}
        {loading && (
          <div className="menu-skeleton-grid" aria-label="Loading menu items" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="menu-skeleton-card">
                <div className="menu-skeleton-img" />
                <div className="menu-skeleton-body">
                  <div className="menu-skeleton-line title" />
                  <div className="menu-skeleton-line price" />
                  <div className="menu-skeleton-line desc-1" />
                  <div className="menu-skeleton-line desc-2" />
                  <div className="menu-skeleton-line btn" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── State 2: Error State with Retry Button ─── */}
        {!loading && error && (
          <div className="menu-state-wrapper">
            <div className="menu-state-card" role="alert">
              <div className="menu-state-icon-box error">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <h3 className="menu-state-title">Menu Unavailable</h3>
              <p className="menu-state-desc">{error}</p>
              <button
                type="button"
                className="menu-state-action-btn"
                onClick={handleRetry}
              >
                <FontAwesomeIcon icon={faRotate} />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── State 3: Empty Category State ─── */}
        {!loading && !error && products.length === 0 && (
          <div className="menu-state-wrapper">
            <div className="menu-state-card">
              <div className="menu-state-icon-box empty">
                <FontAwesomeIcon icon={faUtensils} />
              </div>
              <h3 className="menu-state-title">No Items Found</h3>
              <p className="menu-state-desc">
                We currently don't have any items available in this category. Check out our other popular dishes!
              </p>
              <button
                type="button"
                className="menu-state-action-btn"
                onClick={handleResetCategory}
              >
                <span>Explore All Items</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}

        {/* ─── State 4: Products Grid ─── */}
        {!loading && !error && products.length > 0 && (
          <div className="menu-grid" key={activeCategory}>
            {products.map((item, idx) => (
              <div
                key={item.id}
                className="menu-grid-item reveal-on-scroll anim-card-in"
                style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}
              >
                <FoodCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
