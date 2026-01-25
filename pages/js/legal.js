(function () {
  const THEME_KEY = "theme";
  const body = document.body;
  const switchEl = document.getElementById("theme-switch");

  function applyTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    if (next === "light") {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
      if (switchEl) {
        switchEl.checked = true;
      }
    } else {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
      if (switchEl) {
        switchEl.checked = false;
      }
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(saved);

    if (!switchEl) return;
    switchEl.addEventListener("change", function () {
      const next = this.checked ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  function initHeaderElevation() {
    const header = document.querySelector(".page-header");
    if (!header) return;

    const sync = () => {
      if (window.scrollY > 12) {
        header.classList.add("elevated");
      } else {
        header.classList.remove("elevated");
      }
    };

    sync();
    window.addEventListener("scroll", sync);
  }

  function initSmoothAnchors() {
    const links = document.querySelectorAll('.quick-nav a[href^="#"]');
    if (!links.length) return;

    const setActive = (id) => {
      links.forEach((a) => {
        const target = a.getAttribute("href").slice(1);
        a.classList.toggle("active", target === id);
      });
    };

    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = a.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 16;
          window.scrollTo({ top, behavior: "smooth" });
          setActive(id);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    document
      .querySelectorAll(".legal-section[id]")
      .forEach((sec) => observer.observe(sec));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initReveal();
    initHeaderElevation();
    initSmoothAnchors();
  });
})();
