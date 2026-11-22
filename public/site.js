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

const copy = document.querySelector('#copy-number');
const feedback = document.querySelector('#copy-status');
if (copy && feedback) {
  copy.hidden = false;

  function legacyCopy(value) {
    if (typeof document.execCommand !== 'function') return false;
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    field.remove();
    return copied;
  }

  async function writeNumber(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        // Fall back to the selection-based copy used by older or restricted browsers.
      }
    }
    return legacyCopy(value);
  }

  function announce(message) {
    feedback.textContent = '';
    window.setTimeout(() => { feedback.textContent = message; }, 0);
  }

  copy.addEventListener('click', async () => {
    const copied = await writeNumber(copy.dataset.number);
    announce(copied ? copy.dataset.success : copy.dataset.fallback);
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
