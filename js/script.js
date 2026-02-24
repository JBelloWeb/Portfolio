const d = document;
let bars = d.getElementById("bars");
let ul = d.querySelector("ul");
let tarjetas = d.querySelectorAll(".tarjeta");

bars.addEventListener("click", () => {
    bars.className = "fa-solid fa-bars unactive";
    ul.className = "active"; 
});

d.addEventListener("click", (e) => {
    if (e.target !== bars && ul.className === "active") {
        bars.className = "fa-solid fa-bars";
        ul.className = "disactive";
}});

const ReorderCards = () => {
    let i = 0;
    for(let t of tarjetas){
        if(i == 0){t.className = "tarjeta top-card";}
        if(i == 1){t.className = "tarjeta middle-card";}
        if(i == 2){t.className = "tarjeta last-card";}
        i++;
    }
}

ReorderCards();

const CardToBack = () => {
    let firstCard = tarjetas[0];
    tarjetas = Array.from(tarjetas);
    tarjetas.shift();
    tarjetas.push(firstCard);
    firstCard.classList.toggle("move-back");
    setInterval(() => {
        ReorderCards();
    }, 1000);
}

for(let t of tarjetas){
    t.addEventListener("click", CardToBack);
}







