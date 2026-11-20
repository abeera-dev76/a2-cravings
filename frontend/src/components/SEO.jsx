import { useEffect } from 'react';
import { businessData } from '../data/businessData';

/**
 * Lightweight SEO Component for A2 CRAVINGS.
 * Dynamically updates document title, meta descriptions, Open Graph,
 * and canonical tags without external dependencies.
 */
export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = '/images/branding/logo.png'
}) => {
  useEffect(() => {
    // Construct page title
    const siteTitle = businessData.name;
    const finalTitle = title ? `${title} | ${siteTitle}` : businessData.seo.defaultTitle;
    document.title = finalTitle;

    // Helper to get or create a meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Description
    const finalDesc = description || businessData.seo.defaultDescription;
    setMetaTag('name', 'description', finalDesc);

    // Keywords
    const finalKeywords = keywords
      ? (Array.isArray(keywords) ? keywords.join(', ') : keywords)
      : businessData.seo.keywords.join(', ');
    setMetaTag('name', 'keywords', finalKeywords);

    // Open Graph
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', siteTitle);
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);

    // Canonical link
    if (canonical) {
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonical);
    }
  }, [title, description, keywords, canonical, ogType, ogImage]);

  return null;
};

export default SEO;
