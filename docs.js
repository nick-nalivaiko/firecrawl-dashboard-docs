const menuButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const menuBackdrop = document.querySelector('[data-menu-backdrop]');
const mobileViewport = window.matchMedia('(max-width: 860px)');
const pageMain = document.querySelector('main');
const pageFooter = document.querySelector('footer');
const brandLink = document.querySelector('.brand');

const setMenuOpen = (open, restoreFocus = false) => {
  if (!menuButton || !mobileMenu || !menuBackdrop) return;

  const shouldOpen = open && mobileViewport.matches;
  menuButton.setAttribute('aria-expanded', String(shouldOpen));
  mobileMenu.setAttribute('aria-hidden', String(!shouldOpen));
  mobileMenu.inert = !shouldOpen;
  mobileMenu.classList.toggle('is-open', shouldOpen);
  menuBackdrop.classList.toggle('is-open', shouldOpen);
  document.body.classList.toggle('menu-open', shouldOpen);
  if (pageMain) pageMain.inert = shouldOpen;
  if (pageFooter) pageFooter.inert = shouldOpen;
  if (brandLink) brandLink.inert = shouldOpen;

  if (shouldOpen) {
    mobileMenu.querySelector('a')?.focus();
  } else if (restoreFocus) {
    menuButton.focus();
  }
};

if (menuButton && mobileMenu && menuBackdrop) {
  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menuBackdrop.addEventListener('click', () => setMenuOpen(false, true));

  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }

    if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
      const focusable = [...mobileMenu.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  mobileViewport.addEventListener('change', event => {
    if (!event.matches) setMenuOpen(false);
  });
}

const tocLinks = [...document.querySelectorAll('.toc-link[href^="#"], .mobile-nav-link[href^="#"]')];
const sections = [...new Set(tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean))];

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    tocLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-15% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] });
  sections.forEach(section => observer.observe(section));
}
