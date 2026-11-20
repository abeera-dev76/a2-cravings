import { useEffect } from 'react';

/**
 * Custom hook to initialize performant scroll reveal animations via IntersectionObserver.
 * Triggers animation once per element as it enters viewport.
 * Respects prefers-reduced-motion and gracefully degrades if JS is disabled.
 * @param {*} dependency - Optional dependency to re-run observation (e.g. category filter change).
 */
export const useScrollReveal = (dependency) => {
  useEffect(() => {
    // Check if window or document is undefined (SSR safety)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Check for prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      return;
    }

    // Activate scroll reveal styling once JS confirms observer capability
    document.documentElement.classList.add('has-scroll-reveal');

    // Create single performant observer instance
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve immediately so animation runs only once
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -45px 0px', // triggers slightly before full view for smooth entrance
        threshold: 0.1
      }
    );

    // Observe all unrevealed elements
    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
    elements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount or dependency update
    return () => {
      observer.disconnect();
    };
  }, [dependency]);
};

export default useScrollReveal;
