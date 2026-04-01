document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".hamburger");
  const menuOverlay = document.getElementById("mobileNav");
  const overlayLinks = document.querySelectorAll(".nav-overlay-link");
  const backToTop = document.querySelector(".back-to-top");
  const stickyBuy = document.querySelector(".sticky-buy");
  const progressBar = document.querySelector(".scroll-progress");
  const yearNode = document.getElementById("year");

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!menuButton || !menuOverlay) return;
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
  };

  if (menuButton && menuOverlay) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.classList.toggle("active", !expanded);
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuOverlay.classList.toggle("open", !expanded);
      menuOverlay.setAttribute("aria-hidden", String(expanded));
      body.classList.toggle("menu-open", !expanded);

      if (!expanded && window.gsap) {
        gsap.fromTo(
          ".nav-overlay li",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: "power3.out" }
        );
      }
    });

    overlayLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const handleScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }

    if (stickyBuy && window.innerWidth <= 760) {
      stickyBuy.classList.toggle("visible", window.scrollY > 280);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const litersInput = document.getElementById("litrosAgua");
  const calcButton = document.getElementById("calcularDilucao");
  const calcResult = document.getElementById("resultadoDilucao");

  const renderDose = () => {
    if (!litersInput || !calcResult) return;
    const liters = Math.max(1, Number(litersInput.value) || 1);
    const ml = liters * 100;
    calcResult.textContent = `Para ${liters}L de água: ${ml}mL de Bico Fino.`;
  };

  if (calcButton) {
    calcButton.addEventListener("click", renderDose);
  }

  if (litersInput) {
    litersInput.addEventListener("input", renderDose);
  }

  renderDose();

  const counterNodes = document.querySelectorAll("[data-counter]");
  if (counterNodes.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const target = Number(node.getAttribute("data-counter")) || 0;
          const duration = 900;
          const start = performance.now();

          const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = String(Math.round(target * eased));
            if (progress < 1) {
              requestAnimationFrame(update);
            }
          };

          requestAnimationFrame(update);
          counterObserver.unobserve(node);
        });
      },
      { threshold: 0.45 }
    );

    counterNodes.forEach((node) => counterObserver.observe(node));
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".top-alert", { y: -20, opacity: 0, duration: 0.38 })
    .from(".site-header", { y: -28, opacity: 0, duration: 0.5 }, "<")
    .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.35 }, "<0.2")
    .from(".hero h1", { y: 30, opacity: 0, duration: 0.6 }, "<")
    .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.55 }, "<0.08")
    .from(".hero-bullets li", { y: 18, opacity: 0, duration: 0.4, stagger: 0.07 }, "<0.08")
    .from(".hero-ctas .btn", { y: 18, opacity: 0, duration: 0.4, stagger: 0.08 }, "<0.08")
    .from(".hero-stats article", { y: 16, opacity: 0, duration: 0.35, stagger: 0.08 }, "<0.08")
    .from(".product-frame", { y: 34, opacity: 0, scale: 0.95, duration: 0.7 }, "<0.05")
    .from(".trust-panel", { y: 24, opacity: 0, duration: 0.45 }, "<0.1");

  gsap.to(".aurora-a", {
    x: 18,
    y: -18,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".aurora-b", {
    x: -14,
    y: 16,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.utils.toArray(".reveal").forEach((node) => {
    gsap.from(node, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: node,
        start: "top 84%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.utils.toArray(".reveal-left").forEach((node) => {
    gsap.from(node, {
      x: -35,
      opacity: 0,
      duration: 0.68,
      ease: "power3.out",
      scrollTrigger: {
        trigger: node,
        start: "top 86%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.utils.toArray(".reveal-right").forEach((node) => {
    gsap.from(node, {
      x: 35,
      opacity: 0,
      duration: 0.68,
      ease: "power3.out",
      scrollTrigger: {
        trigger: node,
        start: "top 86%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.utils.toArray(".reveal-scale").forEach((node) => {
    gsap.from(node, {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: node,
        start: "top 87%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.utils.toArray("[data-stagger]").forEach((group) => {
    if (group.closest(".hero")) return;
    gsap.from(group.children, {
      y: 22,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.utils.toArray(".spray-reveal").forEach((section) => {
    const spray = section.querySelector(".spray-overlay");
    if (!spray) return;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 83%",
          toggleActions: "play none none none"
        }
      })
      .fromTo(
        spray,
        { xPercent: -120, opacity: 0 },
        { xPercent: 120, opacity: 0.9, duration: 1.15, ease: "power4.out" }
      )
      .to(spray, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.26");
  });

  gsap.utils.toArray("[data-parallax]").forEach((node) => {
    const speed = Number(node.getAttribute("data-parallax")) || 0.15;
    gsap.to(node, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  const pestCards = gsap.utils.toArray("#pragas .pragas-grid li");
  if (pestCards.length) {
    gsap.from(pestCards, {
      opacity: 0,
      y: 28,
      rotateX: -18,
      transformOrigin: "50% 100%",
      duration: 0.62,
      stagger: { each: 0.07, from: "random" },
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: "#pragas .pragas-grid",
        start: "top 82%",
        toggleActions: "play none none none"
      }
    });
  }

  const card = document.querySelector("[data-tilt]");
  if (card) {
    let raf = null;

    const resetTilt = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        ease: "power3.out"
      });
    };

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 900,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    card.addEventListener("mouseleave", resetTilt);
    card.addEventListener("blur", resetTilt, true);
  }
});
