/**
 * Shared, framework-free progressive enhancement layer: scroll-reveal,
 * active-section nav tracking, mouse-follow card glow, and magnetic
 * buttons. Deliberately vanilla (not a React island) — it's pure DOM
 * effects with no shared state, so it ships as a single small script
 * instead of hydrating a component tree for it.
 *
 * Content is fully visible without this script (see the CSS defaults in
 * global.css); it only adds the reveal-on-scroll motion on top.
 */

function setupScrollReveal(): void {
  const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (revealEls.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  revealEls.forEach((el) => el.classList.add("is-hidden"));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-hidden");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  revealEls.forEach((el) => observer.observe(el));
}

function setupActiveSectionNav(): void {
  const sections = document.querySelectorAll<HTMLElement>("main section[id]");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-section-nav] a[href^='#']");
  if (sections.length === 0 || navLinks.length === 0) return;

  const setActive = (id: string) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      link.style.color = isActive ? "var(--text)" : "var(--dim)";
      const underline = link.querySelector<HTMLElement>(".dg-nav-underline");
      if (underline) underline.style.width = isActive ? "100%" : "0";
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        const topMost = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
        setActive(topMost.target.id);
      }
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCardGlow(): void {
  const cards = document.querySelectorAll<HTMLElement>("[data-glow]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

function setupMagneticButtons(): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const buttons = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

function setupMobileMenu(): void {
  const toggle = document.querySelector<HTMLElement>("[data-mobile-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.hasAttribute("hidden") === false;
    menu.toggleAttribute("hidden", isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.classList.toggle("is-open", !isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-open");
    });
  });
}

function init(): void {
  setupScrollReveal();
  setupActiveSectionNav();
  setupCardGlow();
  setupMagneticButtons();
  setupMobileMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
