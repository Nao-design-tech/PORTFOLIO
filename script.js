// ==================================================
// CONFIGURATION — À MODIFIER FACILEMENT
// ==================================================
const CONTACT_EMAIL = "naomiengangue@gmail.com";

const CV_URL = "assets/cv/CV-Naomie-Ngangue.pdf";

const animatedTitles = [
    "Professionnelle de l'Assurance & de la Réassurance",
    "Community Manager",
    "Digital & Communication",
    "Créative & entrepreneure"
];

// Réseaux sociaux — modifiez ici si vos liens changent
const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/naomie-ngangue-hande-35428b1b3",
    instagram: "https://www.instagram.com/naohadja",
    tiktok: "https://www.tiktok.com/@naomiehadja",
    facebook: "https://www.facebook.com/share/1HG3uzZfiA/"
};
// ==================================================


document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Année automatique dans le pied de page ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Application de la configuration (CV) ---------- */
  ["heroDownloadCv", "cvDownload", "ctaDownloadCv"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", CV_URL);
  });
  const cvView = document.getElementById("cvView");
  if (cvView) cvView.setAttribute("href", CV_URL);

  const emailDisplay = document.getElementById("contactEmailDisplay");
  if (emailDisplay) emailDisplay.textContent = CONTACT_EMAIL;

  /* ---------- Effet machine à écrire (intitulés animés) ---------- */
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    if (prefersReducedMotion) {
      typewriterEl.textContent = animatedTitles[0] || "";
    } else {
      let titleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const TYPING_SPEED = 55;
      const DELETING_SPEED = 28;
      const PAUSE_AFTER_TYPE = 2000;
      const PAUSE_AFTER_DELETE = 400;

      function tick() {
        const words = animatedTitles;
        if (!words.length) return;
        const currentWord = words[titleIndex % words.length];

        if (!isDeleting) {
          charIndex++;
          typewriterEl.textContent = currentWord.slice(0, charIndex);
          if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(tick, PAUSE_AFTER_TYPE);
            return;
          }
          setTimeout(tick, TYPING_SPEED);
        } else {
          charIndex--;
          typewriterEl.textContent = currentWord.slice(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            titleIndex++;
            setTimeout(tick, PAUSE_AFTER_DELETE);
            return;
          }
          setTimeout(tick, DELETING_SPEED);
        }
      }
      tick();
    }
  }

  /* ---------- Menu sticky + ombre au scroll ---------- */
  const header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile (hamburger) ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });
    navMenu.querySelectorAll(".nav__link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Lien actif dans le menu selon la section visible ---------- */
  const navLinks = document.querySelectorAll(".nav__link");
  const linkForSection = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute("href").replace("#", "");
    linkForSection.set(id, link);
  });
  const navSections = Array.from(linkForSection.keys())
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("is-active"));
        const activeLink = linkForSection.get(entry.target.id);
        if (activeLink) activeLink.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  navSections.forEach(section => sectionObserver.observe(section));

  /* ---------- Apparition progressive au défilement ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Galerie créative : masquer élégamment une image manquante ---------- */
  document.querySelectorAll(".gallery__item img").forEach(img => {
    img.addEventListener("error", () => {
      img.closest(".gallery__item").classList.add("gallery__item--missing");
      img.remove();
    });
  });

  /* ---------- Formulaire de contact : ouverture du client mail (mailto:) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const requestType = contactForm.requestType.value;
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        contactForm.reportValidity();
        return;
      }

      const mailSubject = encodeURIComponent(`[${requestType}] ${subject}`);
      const mailBody = encodeURIComponent(
        `Nom : ${name}\nEmail : ${email}\nType de demande : ${requestType}\n\n${message}`
      );

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
    });
  }
});
