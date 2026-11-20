/**
 * Lightweight client-side navigation helper for A2 CRAVINGS SPA.
 * Handles client-side route transitions, browser history, and anchor scrolling.
 */
export const navigate = (path = '/', hash = '') => {
  if (typeof window === 'undefined') return;

  const targetUrl = hash ? `${path}#${hash}` : path;

  // Push state to browser history
  window.history.pushState(null, '', targetUrl);

  // Dispatch custom route change event so App.jsx re-renders immediately
  window.dispatchEvent(new CustomEvent('a2:route-change', { detail: { path, hash } }));
  window.dispatchEvent(new PopStateEvent('popstate'));

  if (hash) {
    // If navigating to an anchor section (like #menu or #combos), scroll smoothly after DOM updates
    setTimeout(() => {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        const navHeader = document.querySelector('.site-header');
        const navHeight = navHeader ? navHeader.offsetHeight : 74;
        const extraOffset = window.innerWidth <= 540 ? 15 : 25;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + extraOffset);
        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export default navigate;
