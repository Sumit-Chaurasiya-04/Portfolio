document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primary-navigation');
  const typedEl = document.getElementById('typed');

  function getHeaderHeight() {
    return header ? header.getBoundingClientRect().height : 0;
  }

  function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const headerOffset = getHeaderHeight();
    const elementTop = target.getBoundingClientRect().top + window.pageYOffset;
    const scrollToPosition = Math.max(elementTop - headerOffset - 8, 0);

    window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      smoothScrollTo(href);
      if (history.pushState) {
        history.pushState(null, '', href);
      } else {
        window.location.hash = href;
      }
    });
  });

  // Optional: set current year in footer if element exists
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Back to Top button behavior
  const backToTopBtn = document.getElementById('backToTop');
  const showAfter = 250; // px

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > showAfter) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Contact form validation
  const form = document.getElementById('contact-form');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  function ensureErrorEl(container) {
    let errorEl = container.querySelector('.error-text');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-text';
      container.appendChild(errorEl);
    }
    return errorEl;
  }

  function setFieldError(inputEl, message) {
    const group = inputEl.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    const errorEl = ensureErrorEl(group);
    errorEl.textContent = message;
    inputEl.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(inputEl) {
    const group = inputEl.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
    inputEl.removeAttribute('aria-invalid');
  }

  function isValidEmail(value) {
    // Basic email pattern suitable for UI validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      let valid = true;

      if (emailInput) {
        const value = emailInput.value.trim();
        clearFieldError(emailInput);
        if (!value || !isValidEmail(value)) {
          setFieldError(emailInput, 'Please enter a valid email address.');
          valid = false;
        }
      }

      if (messageInput) {
        const value = messageInput.value.trim();
        clearFieldError(messageInput);
        if (value.length === 0) {
          setFieldError(messageInput, 'Message cannot be empty.');
          valid = false;
        }
      }

      if (!valid) {
        e.preventDefault();
      }
    });

    if (emailInput) {
      emailInput.addEventListener('input', () => clearFieldError(emailInput));
    }
    if (messageInput) {
      messageInput.addEventListener('input', () => clearFieldError(messageInput));
    }
  }

  // Theme handling
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  const storedTheme = localStorage.getItem('theme');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
      if (themeToggle) themeToggle.textContent = '☀';
    } else {
      root.removeAttribute('data-theme');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'false');
      if (themeToggle) themeToggle.textContent = '☾';
    }
  }

  const initialTheme = storedTheme || (prefersLight.matches ? 'light' : 'dark');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // Typing animation in hero
  if (typedEl) {
    const roles = ['Web Developer', 'Designer', 'Creator'];
    const typeDelay = 90;
    const deleteDelay = 45;
    const holdDelay = 1200;
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, holdDelay);
          return;
        }
        setTimeout(tick, typeDelay);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, typeDelay);
          return;
        }
        setTimeout(tick, deleteDelay);
      }
    }

    tick();
  }

  // Mobile nav toggle
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when clicking a link
    primaryNav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Scroll reveal for sections
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    revealEls.forEach((el) => observer.observe(el));
  }
});