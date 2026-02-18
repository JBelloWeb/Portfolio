const d = document;
let bars = d.getElementById("bars");
let ul = d.querySelector("ul");

bars.addEventListener("click", () => {
    bars.className = "fa-solid fa-bars unactive";
    ul.className = "active"; 
});

d.addEventListener("click", (e) => {
    if (e.target !== bars && ul.className === "active") {
        bars.className = "fa-solid fa-bars";
        ul.className = "disactive";
}});
