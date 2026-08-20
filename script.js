/* ==========================================================================
   CONFIGURATION — Les deux seules choses à modifier sans toucher au reste
   ========================================================================== */
const CONFIG = {
  // Adresse email qui recevra les messages envoyés depuis le formulaire de contact
  EMAIL_CONTACT: "naomiengangue@gmail.com",

  // Intitulés de poste affichés en boucle dans le hero (2 à 4 entrées conseillées)
  INTITULES_POSTE: [
    "Community Manager",
    "Conseillère en Assurance",
    "Chargée de Communication Digitale",
    "Passionnée de Réassurance"
  ]
};
/* ========================================================================== */


document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Année automatique dans le pied de page ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Effet machine à écrire (intitulés de poste) ---------- */
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    if (prefersReducedMotion) {
      // Sans animation : on affiche simplement le premier intitulé
      typewriterEl.textContent = CONFIG.INTITULES_POSTE[0] || "";
    } else {
      let titleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const TYPING_SPEED = 65;
      const DELETING_SPEED = 35;
      const PAUSE_AFTER_TYPE = 1800; // pause avant d'effacer
      const PAUSE_AFTER_DELETE = 400; // pause avant le mot suivant

      function tick() {
        const words = CONFIG.INTITULES_POSTE;
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
    // Ferme le menu mobile après le clic sur un lien
    navMenu.querySelectorAll(".nav__link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Lien actif dans le menu selon la section visible ---------- */
  const sections = document.querySelectorAll("main .section, .hero");
  const navLinks = document.querySelectorAll(".nav__link");
  const linkForSection = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute("href").replace("#", "");
    linkForSection.set(id, link);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("is-active"));
        const activeLink = linkForSection.get(entry.target.id);
        if (activeLink) activeLink.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

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

  /* ---------- Formulaire de contact : ouverture du client mail (mailto:) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        contactForm.reportValidity();
        return;
      }

      const mailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
      const mailBody = encodeURIComponent(
        `Nom : ${name}\nEmail : ${email}\n\n${message}`
      );

      window.location.href = `mailto:${CONFIG.EMAIL_CONTACT}?subject=${mailSubject}&body=${mailBody}`;
    });
  }
});
