/**
 * BLACK GOLD BARBER – main.js
 * Maneja: preloader, navbar scroll, parallax, door transition,
 * contadores animados, máquinas encendiéndose, Swiper, AOS, menú móvil.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. PRELOADER
  ================================================================ */
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  // Remove preloader after animation (~2.4s)
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Trigger hero entrance after preloader
    initHeroEntrance();
  }, 2600);

  /* ================================================================
     2. NAVBAR – scroll effect
  ================================================================ */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ================================================================
     3. HAMBURGER MENU (móvil)
  ================================================================ */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('mobile-open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ================================================================
     4. HERO ENTRANCE (triggered after preloader)
  ================================================================ */
  function initHeroEntrance() {
    // Hero content is animated via CSS animations already.
    // Trigger parallax on the interior background
    startParallax();
  }

  /* ================================================================
     5. PARALLAX – interior section
  ================================================================ */
  function startParallax() {
    const parallaxEl = document.querySelector('.interior-parallax');
    if (!parallaxEl) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const interior = document.getElementById('interior');
          if (interior) {
            const rect   = interior.getBoundingClientRect();
            const offset = rect.top + scrolled;
            const progress = (scrolled - offset) / interior.offsetHeight;
            parallaxEl.style.transform = `translateY(${progress * 40}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ================================================================
     6. DOOR TRANSITION – opens when scrolled to
  ================================================================ */
  const doorSection = document.getElementById('door-transition');

  if (doorSection) {
    const doorObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Delay slightly for effect
          setTimeout(() => {
            doorSection.classList.add('opened');
          }, 300);
          doorObserver.unobserve(doorSection);
        }
      });
    }, { threshold: 0.5 });

    doorObserver.observe(doorSection);
  }

  /* ================================================================
     7. ANIMATED COUNTERS – interior stats
  ================================================================ */
  const statNums = document.querySelectorAll('.stat-num');

  const countUp = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const step     = target / (duration / 16);
    let current    = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('es-MX');
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ================================================================
     8. MÁQUINAS – encenderse una por una
  ================================================================ */
  const maquinasSection = document.getElementById('maquinas');
  const clippers        = document.querySelectorAll('.clipper');

  if (maquinasSection && clippers.length) {
    let triggered = false;

    const maquinasObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          maquinasSection.classList.add('animate');

          // Light up each clipper with staggered delay
          clippers.forEach((clipper, i) => {
            setTimeout(() => {
              clipper.classList.add('on');

              // Add buzz effect on the page (subtle)
              if (navigator.vibrate) {
                navigator.vibrate(30);
              }
            }, 600 + i * 280);
          });

          maquinasObserver.unobserve(maquinasSection);
        }
      });
    }, { threshold: 0.35 });

    maquinasObserver.observe(maquinasSection);
  }

  /* ================================================================
     9. GALLERY SWIPER
  ================================================================ */
  const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1.15,
    spaceBetween: 20,
    centeredSlides: false,
    loop: true,
    grabCursor: true,
    navigation: {
      prevEl: '.gallery-swiper .swiper-button-prev',
      nextEl: '.gallery-swiper .swiper-button-next',
    },
    breakpoints: {
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      900: {
        slidesPerView: 2.5,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 28,
      },
    },
  });

  /* ================================================================
     10. TESTIMONIALS SWIPER
  ================================================================ */
  const testimoniosSwiper = new Swiper('.testimonios-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.testimonios-swiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 2,
      },
    },
  });

  /* ================================================================
     11. AOS – Animate on Scroll
  ================================================================ */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  /* ================================================================
     12. SMOOTH SCROLL for anchor links
  ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = navbar?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ================================================================
     13. SERVICE CARDS – subtle tilt on hover (desktop only)
  ================================================================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ================================================================
     14. NAVBAR – active section highlight
  ================================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ================================================================
     15. HERO NEON POLE glow enhancement
  ================================================================ */
  const heroPole = document.querySelector('.neon-pole');
  if (heroPole) {
    // Flicker effect
    const flicker = () => {
      const delay = Math.random() * 8000 + 2000;
      setTimeout(() => {
        heroPole.style.opacity = '0.4';
        setTimeout(() => {
          heroPole.style.opacity = '1';
          setTimeout(() => {
            heroPole.style.opacity = '0.7';
            setTimeout(() => {
              heroPole.style.opacity = '1';
              flicker();
            }, 80);
          }, 50);
        }, 60);
      }, delay);
    };
    flicker();
  }

  /* ================================================================
     16. PRICE CARDS – gold shimmer on hover
  ================================================================ */
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.price-val').forEach((val, i) => {
        setTimeout(() => {
          val.style.textShadow = '0 0 12px rgba(201,168,76,0.6)';
          setTimeout(() => { val.style.textShadow = ''; }, 500);
        }, i * 60);
      });
    });
  });

  /* ================================================================
     17. CONTACT ICONS – pulse animation on scroll into view
  ================================================================ */
  document.querySelectorAll('.contact-icon').forEach((icon, i) => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            icon.style.animation = 'iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
          }, i * 100);
          io.unobserve(icon);
        }
      });
    }, { threshold: 0.5 });
    io.observe(icon);
  });

  // Add keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes iconPop {
      0%   { transform: scale(0.7) rotate(-10deg); }
      70%  { transform: scale(1.1) rotate(3deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    .nav-links a.active-link {
      color: var(--gold) !important;
    }
  `;
  document.head.appendChild(style);

});
