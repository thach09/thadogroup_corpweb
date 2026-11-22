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


if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('entered');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
}
