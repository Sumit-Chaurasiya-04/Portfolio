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
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
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
    form.addEventListener('submit', async (e) => {
      let valid = true;

      if (emailInput) {
        const value = emailInput.value.trim();
        clearFieldError(emailInput);
        if (!value || !isValidEmail(value)) {
          setFieldError(emailInput, 'Please enter a valid email address.');
          valid = false;
        }
      }

      if (nameInput) {
        const value = nameInput.value.trim();
        clearFieldError(nameInput);
        if (value.length === 0) {
          setFieldError(nameInput, 'Name cannot be empty.');
          valid = false;
        }
      }

      if (subjectInput) {
        const value = subjectInput.value.trim();
        clearFieldError(subjectInput);
        if (value.length === 0) {
          setFieldError(subjectInput, 'Subject cannot be empty.');
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

      const successEl = document.getElementById('formSuccess');

      if (!valid) {
        e.preventDefault();
        if (successEl) {
          successEl.hidden = true;
        }
        return;
      }

      e.preventDefault();
      const subjectLine = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : `Portfolio Contact from ${nameInput ? nameInput.value.trim() : 'Visitor'}`;
      const bodyText = `${messageInput ? messageInput.value.trim() : ''}\n\nFrom: ${emailInput ? emailInput.value.trim() : ''}${nameInput ? `\nName: ${nameInput.value.trim()}` : ''}`;

      const formspreeEndpoint = form.getAttribute('data-formspree');
      if (formspreeEndpoint) {
        try {
          const payload = { email: emailInput.value.trim(), message: bodyText, name: nameInput ? nameInput.value.trim() : '', subject: subjectLine };
          const res = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            if (successEl) {
              successEl.textContent = 'Thanks! Your message has been sent.';
              successEl.hidden = false;
            }
            form.reset();
            return;
          }
        } catch (_) {
          // fall through to mailto fallback
        }
      }

      // Fallback: Mailto submission opens the user's email client
      const mailto = `mailto:sumitchaurasiya381@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailto;
      if (successEl) {
        successEl.textContent = 'Thanks! Your email app should open with your message.';
        successEl.hidden = false;
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
    const roles = ['Student', 'AI Practitioner', 'Teacher', 'Developer'];
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
    function setMenuState(isOpen) {
      document.body.classList.toggle('nav-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    menuToggle.addEventListener('click', () => {
      const nextState = !document.body.classList.contains('nav-open');
      setMenuState(nextState);
    });

    // Close menu when clicking a link
    primaryNav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setMenuState(false);
      }
    });

    // Close when clicking outside the menu when open (on small screens)
    document.addEventListener('click', (event) => {
      const clickTarget = event.target;
      const isClickInsideNav = primaryNav.contains(clickTarget);
      const isClickOnToggle = menuToggle.contains(clickTarget);
      if (document.body.classList.contains('nav-open') && !isClickInsideNav && !isClickOnToggle) {
        setMenuState(false);
      }
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

  // Scrollspy: highlight nav link for visible section
  const sectionIds = ['#home', '#about', '#skills', '#projects', '#contact'];
  const sectionEls = sectionIds
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  function setActiveLink(id) {
    document.querySelectorAll('nav a[href^="#"]').forEach((a) => a.classList.remove('active'));
    const active = document.querySelector(`nav a[href="${id}"]`);
    if (active) active.classList.add('active');
  }

  if (sectionEls.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) {
        setActiveLink(`#${visible[0].target.id}`);
      }
    }, {
      rootMargin: `-${getHeaderHeight() + 8}px 0px -60% 0px`,
      threshold: [0.2, 0.4, 0.6, 0.8]
    });

    sectionEls.forEach((el) => spyObserver.observe(el));

    // Initialize active state on load
    const currentHash = window.location.hash && sectionIds.includes(window.location.hash) ? window.location.hash : '#home';
    setActiveLink(currentHash);
  }
});