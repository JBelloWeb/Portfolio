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







