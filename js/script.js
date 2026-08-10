document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
const syncThemeIcon = () => {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    (!document.documentElement.getAttribute("data-theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
};
syncThemeIcon();
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const isDarkNow =
    current === "dark" ||
    (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const next = isDarkNow ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  syncThemeIcon();
});

// Back to top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 480);
});

// Scroll progress bar
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
});

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Assign a stagger index to repeated chip/tag children so CSS can offset their transition-delay.
// Reset the index per group (each skill category, or the more-apps grid) and cap it so the
// delay never grows unbounded across dozens of items — otherwise later groups take seconds to appear.
document.querySelectorAll(".skill-category, .more-apps-grid").forEach((group) => {
  group.querySelectorAll(".skill-tag, .more-app-item").forEach((el, i) => {
    el.style.setProperty("--i", Math.min(i, 8));
  });
});

// Animate stat numbers counting up once their row is visible
const animateCount = (el) => {
  const raw = el.textContent.trim();
  const match = raw.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = parseInt(digits, 10);
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".stat-num").forEach(animateCount);
      statObserver.disconnect();
    });
  },
  { threshold: 0.4 }
);
const statRow = document.querySelector(".stat-row");
if (statRow) statObserver.observe(statRow);

// Cursor-following spotlight glow in the hero
const hero = document.querySelector(".hero");
if (hero) {
  const spotlight = document.createElement("div");
  spotlight.className = "hero-spotlight";
  hero.prepend(spotlight);
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    hero.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const navAnchors = navLinks.querySelectorAll("a");
const spySections = [...navAnchors].map((a) => document.querySelector(a.getAttribute("href")));

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

spySections.forEach((section) => section && spyObserver.observe(section));
