// Prepínanie obrazoviek
const screens = document.querySelectorAll(".screen");
const homeScreen = document.getElementById("screen-home");
const diaryScreen = document.getElementById("screen-diary");

// Tlačidlá na prepínanie
document.querySelectorAll(".card[data-target]").forEach((card) => {
  card.addEventListener("click", () => {
    const targetId = card.getAttribute("data-target");
    showScreen(targetId);
  });
});

document.querySelectorAll(".back-btn[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    showScreen(targetId);
  });
});

function showScreen(id) {
  screens.forEach((s) => s.classList.remove("screen-active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("screen-active");
  }
}

// Denník – logika
const diaryDateInput = document.getElementById("diaryDate");
const diaryTextArea = document.getElementById("diaryText");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const diaryStatus = document.getElementById("diaryStatus");
const todayBtn = document.getElementById("todayBtn");

function formatDateToInput(date) {
  // YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDiaryKey(dateStr) {
  return `klarka-diary-${dateStr}`;
}

function loadDiaryForDate(dateStr) {
  const key = getDiaryKey(dateStr);
  const content = localStorage.getItem(key) || "";
  diaryTextArea.value = content;
  diaryStatus.textContent = content ? "Na tento deň už máš uložený zápis." : "";
}

function saveDiary() {
  const dateStr = diaryDateInput.value;
  if (!dateStr) return;

  const text = diaryTextArea.value.trim();
  const key = getDiaryKey(dateStr);
  localStorage.setItem(key, text);
  diaryStatus.textContent = "Zápis bol uložený ✔";
  setTimeout(() => (diaryStatus.textContent = ""), 2000);
}

// Nastavenie dnešného dátumu pri otvorení
const today = new Date();
const todayStr = formatDateToInput(today);
diaryDateInput.value = todayStr;
loadDiaryForDate(todayStr);

todayBtn.addEventListener("click", () => {
  const t = new Date();
  const tStr = formatDateToInput(t);
  diaryDateInput.value = tStr;
  loadDiaryForDate(tStr);
});

diaryDateInput.addEventListener("change", () => {
  if (diaryDateInput.value) {
    loadDiaryForDate(diaryDateInput.value);
  }
});

saveDiaryBtn.addEventListener("click", saveDiary);

// Hlasové ovládanie – jednoduchý základ
const voiceBtn = document.getElementById("voiceBtn");
let recognition = null;
let listening = false;

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "sk-SK";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Rozpoznaný text:", transcript);

    handleVoiceCommand(transcript);
  });

  recognition.addEventListener("end", () => {
    listening = false;
    voiceBtn.classList.remove("listening");
  });

  voiceBtn.addEventListener("click", () => {
    if (listening) {
      recognition.stop();
      return;
    }
    listening = true;
    voiceBtn.classList.add("listening");
    recognition.start();
  });
} else {
  // Ak prehliadač nepodporuje rozpoznávanie reči
  voiceBtn.disabled = true;
  voiceBtn.title = "Hlasové ovládanie nie je v tomto prehliadači podporované.";
}

// Tu si vieš definovať vozové príkazy
function handleVoiceCommand(text) {
  // Príklady:
  // "denník", "diár", "napíš denník"
  if (text.includes("denník") || text.includes("diár")) {
    showScreen("screen-diary");
    diaryStatus.textContent = "Prepnuté hlasom na denník 🎤";
    setTimeout(() => (diaryStatus.textContent = ""), 2000);
    return;
  }

  // "domov", "hlavná obrazovka"
  if (text.includes("domov") || text.includes("hlavná")) {
    showScreen("screen-home");
    return;
  }

  // "štyri", "násobilka"
  if (text.includes("štyri") || text.includes("styri") || text.includes("násobilka")) {
    alert("Tu neskôr doplníme násobilku pre číslo 4 😊");
    return;
  }

  alert(`Nerozumiem príkazu: "${text}"`);
}

// Zatiaľ len info pre kliknuté karty bez obsahu
document.getElementById("card-multiplication").addEventListener("click", () => {
  alert("Tu neskôr spravíme obrazovku na násobilku 😉");
});

document.getElementById("card-games").addEventListener("click", () => {
  alert("Tu môžu byť jednoduché hry pre Klárku.");
});

document.getElementById("card-audio").addEventListener("click", () => {
  alert("Tu môžu byť nahraté rozprávky a pesničky.");
});
