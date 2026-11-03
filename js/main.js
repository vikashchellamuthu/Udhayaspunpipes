/**
 * UDHAYA SPUN PIPES - Main Website Interactions
 * 
 * Features:
 * - Sticky navigation bar with scroll state
 * - Smooth anchor scrolling
 * - Active navigation link highlighting via IntersectionObserver
 * - Mobile hamburger menu toggle & auto-close
 * - Lightbox modal gallery with keyboard navigation (Esc, Prev, Next)
 * - Back to top button
 * - Scroll reveal animations (respects prefers-reduced-motion)
 */

document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initLightbox();
  initBackToTop();
  initScrollAnimations();
});

/**
 * Sticky Navigation Bar
 */
function initNavbar() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * Mobile Hamburger Menu
 */
function initMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta-mobile");

  if (!navToggle || !navMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains("is-open");
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("menu-lock", isOpen);
  }

  navToggle.addEventListener("click", () => toggleMenu());

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  // Close when clicking outside menu
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("is-open") && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close with Esc key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      toggleMenu(false);
      navToggle.focus();
    }
  });
}

/**
 * Active Navigation Link on Scroll (ScrollSpy)
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
          } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Image Gallery Lightbox Modal
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll("[data-lightbox-src]");
  const modal = document.getElementById("galleryModal");
  if (!modal || !galleryItems.length) return;

  const modalImg = modal.querySelector(".modal-image");
  const modalCaption = modal.querySelector(".modal-caption");
  const closeBtn = modal.querySelector(".modal-close");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    updateModalContent();
    modal.classList.add("modal-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-lock");
    closeBtn?.focus();
  }

  function closeLightbox() {
    modal.classList.remove("modal-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-lock");
  }

  function updateModalContent() {
    const item = itemsArray[currentIndex];
    const imgEl = item.querySelector("img");
    const src = item.getAttribute("data-lightbox-src") || imgEl?.getAttribute("src") || imgEl?.src;
    const title = item.getAttribute("data-lightbox-title") || imgEl?.alt || "";
    const desc = item.getAttribute("data-lightbox-desc") || "";

    if (modalImg) {
      modalImg.src = src;
      modalImg.alt = title;
    }
    if (modalCaption) {
      modalCaption.innerHTML = `<strong>${title}</strong>${desc ? ` &mdash; <span>${desc}</span>` : ""}`;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    updateModalContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    updateModalContent();
  }

  itemsArray.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(index);
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", showPrev);
  nextBtn?.addEventListener("click", showNext);

  // Click outside image closes modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-overlay")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("modal-active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  const toggleBackBtn = () => {
    if (window.scrollY > 400) {
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleBackBtn, { passive: true });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal-on-scroll").forEach(el => {
      el.classList.add("revealed");
    });
    return;
  }

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}
