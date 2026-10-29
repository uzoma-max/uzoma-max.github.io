document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Typing effect in the hero
const phrases = [
  "build fintech products.",
  "turn ideas into specs.",
  "write API docs developers love.",
  "ship front-end features in JavaScript.",
];
const typed = document.getElementById("typed");

if (reduceMotion) {
  typed.textContent = phrases[0];
} else {
  let phrase = 0;
  let char = 0;
  let deleting = false;

  (function type() {
    const text = phrases[phrase];
    char += deleting ? -1 : 1;
    typed.textContent = text.slice(0, char);

    let delay = deleting ? 35 : 70;
    if (!deleting && char === text.length) {
      delay = 1600;
      deleting = true;
    } else if (deleting && char === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(type, delay);
  })();
}

// Stagger the cards inside each section
document.querySelectorAll(".reveal").forEach((section) => {
  section.querySelectorAll(".project, .skill-group, .cert, .timeline-item, .stat").forEach((el, i) => {
    el.style.setProperty("--i", i);
  });
});

// Count-up numbers in the About stats
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const start = performance.now();
  const duration = 1200;
  (function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  })(start);
}

// Reveal sections as they scroll into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Highlight the nav link for the section on screen
const navLinks = document.querySelectorAll(".nav-links a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

// Progress bar and nav shadow on scroll
const progressBar = document.getElementById("progress");
const nav = document.getElementById("nav");

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  nav.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
