import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleQuestion,
  faChevronDown,
  faMagnifyingGlass,
  faBowlFood,
  faTruckFast,
  faCreditCard,
  faReceipt,
  faHeadset,
  faHouse,
  faChevronRight,
  faXmark,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SEO from '../components/SEO';
import { businessData } from '../data/businessData';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { navigate } from '../utils/navigation';

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(new Set([1, 4])); // Open first & pasta question by default

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const toggleAccordion = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const faqData = [
    {
      id: 1,
      category: 'ordering',
      question: 'How do I place an order with A2 CRAVINGS?',
      answer: `Ordering is fast and effortless! Browse our menu, add your favorite items to your Cart, and click "Proceed to Order on WhatsApp". Your complete order (items, quantities, prices, and your delivery address) will be neatly pre-filled into WhatsApp. Simply hit Send, and our kitchen team will confirm your order in minutes.`
    },
    {
      id: 2,
      category: 'ordering',
      question: 'Can I customize the spice level or ingredients?',
      answer: `Yes, absolutely! Since every meal is prepared fresh in our kitchen, you can request custom spice levels (Mild, Medium, Extra Spicy), or ask us to omit capsicum or chili flakes. Just mention your preferences in the special instructions field or message us directly on WhatsApp.`
    },
    {
      id: 3,
      category: 'ordering',
      question: 'Can I place bulk orders for parties or family gatherings?',
      answer: `Yes! We cater for family get-togethers, birthday celebrations, office lunches, and special occasions. For large or bulk orders, please message us on WhatsApp at least 3 to 4 hours in advance (or the day prior) so our kitchen can prepare fresh, hot batches for your gathering.`
    },
    {
      id: 4,
      category: 'food',
      question: 'What pasta shape do you use, and how is it served?',
      answer: `All our pasta dishes (Chicken Creamy Pasta, Chicken Cheese Creamy Pasta, Spicy Chicken Cheese Pasta, and White Sauce Pasta) are specially crafted with ELBOW MACARONI pasta shape. They are served hot in sturdy aluminum foil serving trays that retain steam, sauce consistency, and melted cheese beautifully.`
    },
    {
      id: 5,
      category: 'food',
      question: 'Is your food freshly cooked or pre-made?',
      answer: `Every single dish at A2 CRAVINGS is 100% prepared fresh to order. We never use pre-cooked pasta, leftover chicken, or reheated meals. Our chicken is freshly seasoned, our sauces are simmered fresh, and our cheese is melted right before packaging.`
    },
    {
      id: 6,
      category: 'delivery',
      question: 'What areas do you deliver to in Rawalpindi?',
      answer: `We deliver throughout ${businessData.location.city} and nearby vicinities. When sending your address on WhatsApp, our team will verify your exact location and assign a nearby delivery rider.`
    },
    {
      id: 7,
      category: 'delivery',
      question: 'How long does food delivery take?',
      answer: `Average total delivery time is estimated at [e.g., 35 to 50 minutes]. This includes 15–25 minutes of fresh cooking time in our kitchen, followed by direct transit to your location. During peak dinner hours, heavy rain, or distant areas, we will communicate any brief delay on WhatsApp.`
    },
    {
      id: 8,
      category: 'delivery',
      question: 'How is the food packaged to stay hot during delivery?',
      answer: `Our pasta is packed in sealed aluminum foil trays that lock in heat and freshness. Stuffed buns, loaded fries, and biryani are packaged in food-grade, grease-resistant containers and transported securely so your meal arrives steaming hot.`
    },
    {
      id: 9,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: `We primarily accept Cash on Delivery (COD). We also support [Direct Bank Transfer / JazzCash / EasyPaisa] upon request — simply ask our team on WhatsApp for account details when placing your order.`
    },
    {
      id: 10,
      category: 'ordering',
      question: 'Can I cancel or modify my order after sending it?',
      answer: `Because all dishes are made fresh to order, cancellations or modifications must be sent immediately via WhatsApp before our kitchen begins cooking. Once cooking is underway or the rider has been dispatched, orders cannot be cancelled.`
    },
    {
      id: 11,
      category: 'payment',
      question: 'Are delivery charges included in the item prices?',
      answer: `Food prices on our menu reflect the food cost. Delivery charges vary depending on the distance from our kitchen to your location in Rawalpindi, and are clearly confirmed with you on WhatsApp prior to dispatch.`
    },
    {
      id: 12,
      category: 'food',
      question: 'What should I do if there is an issue with my order?',
      answer: `Your satisfaction is our priority! In the rare event that an item is missing, damaged in transit, or not prepared to your instructions, please take a quick photo and message us immediately on WhatsApp (within 30 minutes of delivery). We will replace it promptly or provide credit towards your next meal.`
    }
  ];

  // Filtered FAQ items
  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'ordering', label: 'Ordering & WhatsApp' },
    { id: 'food', label: 'Food & Pasta' },
    { id: 'delivery', label: 'Delivery & Packaging' },
    { id: 'payment', label: 'Payment & Pricing' }
  ];

  const whatsappInquiryUrl = getWhatsAppUrl(
    businessData.contact.whatsapp,
    "Hello A2 CRAVINGS, I have a question that was not listed in your FAQ."
  );

  return (
    <div className="legal-page-wrapper">
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Got questions about ordering from A2 CRAVINGS? Find answers about our elbow macaroni pastas, delivery areas in Rawalpindi, packaging, payment methods, and customization."
      />

      <Navbar />

      {/* Ambient Lighting */}
      <div className="legal-bg-ambient" aria-hidden="true">
        <div className="legal-glow-circle-1" />
        <div className="legal-glow-circle-2" />
      </div>

      {/* Hero Header */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          {/* Top Navigation & Breadcrumbs */}
          <div className="policy-top-bar">
            <a
              href="/"
              className="policy-back-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              aria-label="Back to A2 CRAVINGS Home"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="policy-back-icon" />
              <span>Back to Home</span>
            </a>

            <nav className="policy-breadcrumb" aria-label="Breadcrumb">
              <a
                href="/"
                className="policy-breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Home
              </a>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-parent">Help & Policies</span>
              <span className="policy-breadcrumb-sep">›</span>
              <span className="policy-breadcrumb-current">Frequently Asked Questions</span>
            </nav>
          </div>

          <div className="legal-badge">
            <FontAwesomeIcon icon={faCircleQuestion} className="legal-badge-icon" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h1 className="legal-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>

          <p className="legal-subtitle">
            Find everything you need to know about placing orders, our elbow macaroni pasta dishes, delivery times across {businessData.location.city}, and food packaging.
          </p>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="legal-main-content">
        <div className="legal-container">
          {/* Live Search Bar */}
          <div className="faq-search-wrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="faq-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="faq-search-input"
              placeholder="Search questions (e.g. delivery time, elbow macaroni, payment, custom spice)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '1.2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="faq-categories" role="tablist" aria-label="FAQ Categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`faq-cat-btn ${activeCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion Group */}
          <div className="faq-accordion-group" role="region" aria-label="FAQ Accordion">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.has(faq.id);
                return (
                  <article
                    key={faq.id}
                    className={`faq-item ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-icon-wrap" aria-hidden="true">
                        <FontAwesomeIcon icon={faChevronDown} />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-answer-${faq.id}`}
                        className="faq-answer"
                        role="region"
                      >
                        <p style={{ margin: 0 }}>{faq.answer}</p>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="faq-empty-state">
                <p>No questions matched your search query "{searchQuery}".</p>
                <button
                  type="button"
                  className="legal-btn legal-btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  style={{ marginTop: '0.75rem' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Support / Still Have Questions Box */}
          <div className="legal-card" style={{ marginTop: '2.5rem' }}>
            <div className="legal-support-box" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
              <div className="legal-support-info">
                <h4>Still have a question?</h4>
                <p>Can't find the answer you're looking for? Reach out to our kitchen directly on WhatsApp.</p>
              </div>
              <div className="legal-support-actions">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-btn legal-btn-whatsapp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>Ask on WhatsApp</span>
                </a>
                <button
                  type="button"
                  className="legal-btn legal-btn-secondary"
                  onClick={() => navigate('/contact-us')}
                >
                  <FontAwesomeIcon icon={faHeadset} />
                  <span>Contact Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default FAQ;
