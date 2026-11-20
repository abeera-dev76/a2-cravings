import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('a2:route-change', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('a2:route-change', handleLocationChange);
    };
  }, []);

  // Normalize path (handle trailing slashes and index.html)
  const normalizedPath =
    currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

  const renderRoute = () => {
    const path = normalizedPath.toLowerCase();

    if (path === '/' || path === '' || path === '/index.html') {
      return <Home />;
    }
    if (path === '/privacy-policy' || path === '/privacy') {
      return <PrivacyPolicy />;
    }
    if (path === '/terms-and-conditions' || path === '/terms' || path === '/terms-conditions') {
      return <TermsConditions />;
    }
    if (path === '/faq' || path === '/faqs') {
      return <FAQ />;
    }
    if (path === '/contact-us' || path === '/contact') {
      return <ContactUs />;
    }
    if (path === '/about-us' || path === '/about') {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const el = document.getElementById('about');
          if (el) {
            const navHeight = 74;
            const targetPos = el.getBoundingClientRect().top + window.pageYOffset - (navHeight + 20);
            window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
          }
        }, 120);
      }
      return <Home />;
    }
    if (path === '/shipping-and-delivery' || path === '/shipping-policy' || path === '/delivery-policy') {
      return <ShippingPolicy />;
    }
    if (
      path === '/refund-policy' ||
      path === '/return-refund-policy' ||
      path === '/return-refund-cancellation-policy' ||
      path === '/cancellation-refund-policy'
    ) {
      return <RefundPolicy />;
    }

    if (path === '/track-order' || path === '/track' || path === '/order-tracking') {
      return <TrackOrder />;
    }

    if (path === '/admin/login' || path === '/admin-login') {
      return <AdminLogin />;
    }
    if (
      path === '/admin' ||
      path === '/admin/dashboard' ||
      path === '/admin/orders'
    ) {
      return <AdminDashboard />;
    }

    return <NotFound />;
  };

  return (
    <CartProvider>
      <ThemeProvider>
        {renderRoute()}
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;
