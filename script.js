document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggleButton = document.querySelector('.theme-toggle');
    const rootElement = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      rootElement.classList.add('light');
      if (themeToggleButton) themeToggleButton.textContent = '🌙';
    } else {
      if (themeToggleButton) themeToggleButton.textContent = '☀️';
    }
    themeToggleButton && themeToggleButton.addEventListener('click', () => {
      const isLight = rootElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggleButton.textContent = isLight ? '🌙' : '☀️';
    });
  
    // Smooth scrolling for navbar links with offset for fixed navbar
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const primaryNav = document.getElementById('primary-navigation');
    if (hamburger && primaryNav) {
      const closeMenu = () => {
        primaryNav.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
      };
      hamburger.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });
      // Close on link click
      primaryNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeMenu()));
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!primaryNav.contains(e.target) && e.target !== hamburger) {
          closeMenu();
        }
      });
    }
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
        const targetY = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navHeight - 12
        );
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  
    // Back to Top button
    const backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.textContent = '↑';
    Object.assign(backToTop.style, {
      position: 'fixed',
      right: '24px',
      bottom: '24px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      border: 'none',
      background: 'var(--accent)',
      color: '#00111f',
      boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 200ms ease, transform 200ms ease',
      transform: 'translateY(8px)',
      zIndex: '1000'
    });
    document.body.appendChild(backToTop);
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
        backToTop.style.transform = 'translateY(0)';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
        backToTop.style.transform = 'translateY(8px)';
      }
    });
  
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Contact form validation
    const form = document.querySelector('.contact-form');
    if (form) {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      // Utility to ensure an error node exists after an input
      const ensureErrorNode = (input) => {
        if (!input) return null;
        const next = input.nextElementSibling;
        if (next && next.classList && next.classList.contains('field-error')) return next;
        const err = document.createElement('div');
        err.className = 'field-error';
        err.style.color = '#ef4444';
        err.style.fontSize = '12px';
        err.style.marginTop = '6px';
        err.style.minHeight = '16px';
        input.insertAdjacentElement('afterend', err);
        return err;
      };
  
      const setError = (input, message) => {
        const node = ensureErrorNode(input);
        if (!node) return;
        node.textContent = message;
        input && input.setAttribute('aria-invalid', message ? 'true' : 'false');
      };
  
      const clearError = (input) => setError(input, '');
  
      const clearValidity = () => {
        [nameInput, emailInput, subjectInput, messageInput].forEach((el) => {
          if (el) el.setCustomValidity('');
        });
      };
  
      form.addEventListener('submit', (event) => {
        clearValidity();
        let valid = true;
  
        if (nameInput && nameInput.value.trim() === '') {
          setError(nameInput, 'Please enter your name.');
          valid = false;
        } else { clearError(nameInput); }
  
        if (emailInput) {
          const emailValue = emailInput.value.trim();
          if (emailValue === '') {
            setError(emailInput, 'Please enter your email.');
            valid = false;
          } else if (!emailPattern.test(emailValue)) {
            setError(emailInput, 'Please enter a valid email address.');
            valid = false;
          } else { clearError(emailInput); }
        }
  
        if (subjectInput && subjectInput.value.trim() === '') {
          setError(subjectInput, 'Please enter a subject.');
          valid = false;
        } else { clearError(subjectInput); }
  
        if (messageInput && messageInput.value.trim() === '') {
          setError(messageInput, 'Please enter a message.');
          valid = false;
        } else { clearError(messageInput); }
  
        if (!valid) {
          event.preventDefault();
          return;
        }
  
        // Placeholder success handling
        event.preventDefault();
        alert('Thanks! Your message has been sent.');
        form.reset();
      });
  
      const liveValidate = () => {
        const fakeEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(fakeEvent);
      };
  
      ['input', 'blur'].forEach((evt) => {
        [nameInput, emailInput, subjectInput, messageInput].forEach((el) => {
          if (!el) return;
          el.addEventListener(evt, () => {
            // Validate individual field
            if (el === nameInput) {
              setError(el, el.value.trim() ? '' : 'Please enter your name.');
            } else if (el === emailInput) {
              const v = el.value.trim();
              setError(el, v === '' ? 'Please enter your email.' : (!emailPattern.test(v) ? 'Please enter a valid email address.' : ''));
            } else if (el === subjectInput) {
              setError(el, el.value.trim() ? '' : 'Please enter a subject.');
            } else if (el === messageInput) {
              setError(el, el.value.trim() ? '' : 'Please enter a message.');
            }
          });
        });
      });
    }
  
    // Typing effect
    const typingTarget = document.querySelector('.typing');
    const phrases = ['Computer Science Student', 'Freelance Tutor', 'Developer'];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const deleteSpeed = 55;
    const holdTime = 1100;
  
    const tick = () => {
      if (!typingTarget) return;
      const fullText = phrases[currentPhraseIndex];
      if (isDeleting) {
        currentCharIndex -= 1;
      } else {
        currentCharIndex += 1;
      }
  
      typingTarget.textContent = fullText.slice(0, Math.max(0, currentCharIndex));
  
      if (!isDeleting && currentCharIndex === fullText.length) {
        setTimeout(() => {
          isDeleting = true;
        }, holdTime);
      }
  
      if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }
  
      const delay = isDeleting ? deleteSpeed : typeSpeed;
      setTimeout(tick, delay);
    };
    tick();
  
    // Reveal on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => observer.observe(el));
  });