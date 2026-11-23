const toggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');
if (toggle && nav) {
  const mobile = matchMedia('(max-width: 740px)');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    nav.hidden = mobile.matches;
  }
  function resetMenu() {
    toggle.hidden = !mobile.matches;
    closeMenu();
  }
  resetMenu();
  mobile.addEventListener('change', resetMenu);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'false';
    toggle.setAttribute('aria-expanded', String(open));
    nav.hidden = !open;
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

if ('IntersectionObserver' in window) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = document.querySelectorAll('[data-reveal]');
  const revealed = new WeakSet();
  function reveal(section) {
    if (revealed.has(section)) return;
    revealed.add(section);
    section.classList.add('entered');
    observer.unobserve(section);
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  }, { threshold: 0.08 });
  function updateMotion() {
    observer.disconnect();
    if (!motion.matches) {
      sections.forEach(section => {
        if (!revealed.has(section)) observer.observe(section);
      });
    }
  }
  motion.addEventListener('change', updateMotion);
  updateMotion();
  document.addEventListener('focusin', event => {
    const section = event.target.closest('[data-reveal]');
    if (section) reveal(section);
  });
}
