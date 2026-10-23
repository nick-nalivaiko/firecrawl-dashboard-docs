const tocButton = document.querySelector('[data-toc-toggle]');
const toc = document.querySelector('[data-toc]');

if (tocButton && toc) {
  tocButton.addEventListener('click', () => {
    const open = toc.classList.toggle('is-open');
    tocButton.setAttribute('aria-expanded', String(open));
  });

  toc.addEventListener('click', event => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 760px)').matches) {
      toc.classList.remove('is-open');
      tocButton.setAttribute('aria-expanded', 'false');
    }
  });
}

const tocLinks = [...document.querySelectorAll('.toc-link[href^="#"]')];
const sections = tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    tocLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-15% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] });
  sections.forEach(section => observer.observe(section));
}
