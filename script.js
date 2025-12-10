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
// DEBUG: prepínanie mriežky na mainscreene (klávesa G)
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "g") {
    const grid = document.getElementById("debug-grid");
    if (!grid) return;
    grid.style.display = grid.style.display === "none" ? "block" : "none";
  }
});

// sem budeme neskôr dopĺňať kliknutia na ikonky
document.getElementById("btn-dennicek").addEventListener("click", () => {
  console.log("Denníček klik");
  // tu pôjdeme na screen denníka
});

document.getElementById("btn-skola").addEventListener("click", () => {
  console.log("Škola hrou klik");
});

document.getElementById("btn-aplikacie").addEventListener("click", () => {
  console.log("Aplikácie klik");
});

document.getElementById("btn-media").addEventListener("click", () => {
  console.log("Médiá klik");
});
