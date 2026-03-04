const d = document;
const bars = d.getElementById("bars");
const ul = d.querySelector("ul");
let tarjetas = Array.from(d.querySelectorAll(".tarjeta"));
let isAnimatingCard = false;

// MENÚ
bars.addEventListener("click", () => {
  bars.className = "fa-solid fa-bars unactive";
  ul.className = "active";
});

d.addEventListener("click", (e) => {
  if (e.target !== bars && !ul.contains(e.target) && ul.className === "active") {
    bars.className = "fa-solid fa-bars";
    ul.className = "disactive";
  }
});

// HISTORIA - TARJETAS
const ReorderCards = () => {
  tarjetas.forEach((t, i) => {
    t.classList.remove("move-back", "top-card", "middle-card", "last-card");

    if (i === 0) t.classList.add("top-card");
    if (i === 1) t.classList.add("middle-card");
    if (i === 2) t.classList.add("last-card");
  });
};

ReorderCards();

const CardToBack = () => {
  if (isAnimatingCard || tarjetas.length === 0) return;

  isAnimatingCard = true;
  const firstCard = tarjetas[0];

  tarjetas.shift();
  tarjetas.push(firstCard);

  firstCard.classList.add("move-back");

  setTimeout(() => {
    firstCard.classList.remove("move-back");
    ReorderCards();
    isAnimatingCard = false;
  }, 1000);
};

tarjetas.forEach((t) => {
  t.style.cursor = "pointer";
  t.addEventListener("click", CardToBack);
});

// Modern reveal-on-scroll using IntersectionObserver
(function () {
  const supportsIO = "IntersectionObserver" in window;
  const opts = { threshold: 0.12, rootMargin: "0px 0px -8% 0px" };

  // Observe main sections, headers and cards but DO NOT add reveal to
  // individual `.tarjeta` elements (they have their own transform-based
  // animations handled elsewhere).
  const targets = Array.from(
    d.querySelectorAll(
      "main#inicio, .section-header, .card, .projects-grid, #tarjetas"
    )
  );

  targets.forEach((el) => {
    // skip individual tarjeta elements to preserve their existing transforms
    if (el.classList && el.classList.contains("tarjeta")) return;
    el.classList.add("reveal");
    // only apply stagger to project grids (not to #tarjetas which uses absolute stacking)
    if (el.matches(".projects-grid")) el.classList.add("stagger");
  });

  if (!supportsIO) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add("in-view");

      if (el.classList.contains("stagger")) {
        const children = Array.from(el.children);
        children.forEach((ch, i) => {
          ch.style.transitionDelay = `${i * 80}ms`;
        });
      }

      observer.unobserve(el);
    });
  }, opts);

  targets.forEach((t) => io.observe(t));
})();







