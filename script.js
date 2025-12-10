function show(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("visible"));
    document.getElementById(screenId).classList.remove("hidden");
    document.getElementById(screenId).classList.add("visible");
}

document.getElementById("btn-dennicek").addEventListener("click", () => {
    show("screen-dennicek");
});

document.getElementById("btn-skola").addEventListener("click", () => {
    alert("Škola hrou – zatiaľ prázdne");
});

document.getElementById("btn-aplikacie").addEventListener("click", () => {
    alert("Aplikácie – zatiaľ prázdne");
});

document.getElementById("btn-media").addEventListener("click", () => {
    alert("Médiá – zatiaľ prázdne");
});
