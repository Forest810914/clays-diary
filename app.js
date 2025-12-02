// Prepínanie obrazoviek
const screens = document.querySelectorAll(".screen");
let currentScreenId = "screen-home";
let lastScreenId = null;

function showScreen(id) {
  if (!id || id === currentScreenId) return;
  lastScreenId = currentScreenId;
  screens.forEach((s) => s.classList.remove("screen-active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("screen-active");
    currentScreenId = id;
  }
}

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

// Denník – logika
const diaryDateInput = document.getElementById("diaryDate");
const diaryTextArea = document.getElementById("diaryText");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const diaryStatus = document.getElementById("diaryStatus");
const todayBtn = document.getElementById("todayBtn");

const photoBtn = document.getElementById("photoBtn");
const photoInput = document.getElementById("photoInput");
const diaryPhotoPreview = document.getElementById("diaryPhotoPreview");
const diaryMediaPreview = document.getElementById("diaryMediaPreview");

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

function getDiaryPhotoKey(dateStr) {
  return `klarka-diary-photo-${dateStr}`;
}

function loadDiaryForDate(dateStr) {
  const key = getDiaryKey(dateStr);
  const content = localStorage.getItem(key) || "";
  diaryTextArea.value = content;
  diaryStatus.textContent = content ? "Na tento deň už máš uložený zápis." : "";

  // fotka
  const photoKey = getDiaryPhotoKey(dateStr);
  const photoData = localStorage.getItem(photoKey);
  if (photoData) {
    diaryPhotoPreview.src = photoData;
    diaryPhotoPreview.classList.add("visible");
  } else {
    diaryPhotoPreview.src = "";
    diaryPhotoPreview.classList.remove("visible");
  }
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

// Fotka – použijeme input type=file, uložíme do localStorage
photoBtn.addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dateStr = diaryDateInput.value || todayStr;
    const dataUrl = reader.result;
    // uložíme fotku pre daný dátum
    localStorage.setItem(getDiaryPhotoKey(dateStr), dataUrl);
    diaryPhotoPreview.src = dataUrl;
    diaryPhotoPreview.classList.add("visible");
    diaryStatus.textContent = "Fotka bola uložená ✔";
    setTimeout(() => (diaryStatus.textContent = ""), 2000);
  };
  reader.readAsDataURL(file);
});

// Hlasové ovládanie – príkazy + diktovanie
const voiceBtn = document.getElementById("voiceBtn");
const voiceDiaryBtn = document.getElementById("voiceDiaryBtn");

let recognition = null;
let listening = false;
let voiceMode = null; // 'command' | 'dictation'
let activeVoiceButton = null;

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

    if (voiceMode === "dictation") {
      handleDictation(transcript);
    } else {
      handleVoiceCommand(transcript);
    }
  });

  recognition.addEventListener("end", () => {
    listening = false;
    if (activeVoiceButton) {
      activeVoiceButton.classList.remove("listening");
    }
    activeVoiceButton = null;
    voiceMode = null;
  });

  voiceBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (listening && voiceMode === "command") {
      recognition.stop();
      return;
    }
    startListening("command", voiceBtn);
  });

  voiceDiaryBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (listening && voiceMode === "dictation") {
      recognition.stop();
      return;
    }
    startListening("dictation", voiceDiaryBtn);
  });
} else {
  // Ak prehliadač nepodporuje rozpoznávanie reči
  voiceBtn.disabled = true;
  voiceBtn.title = "Hlasové ovládanie nie je v tomto prehliadači podporované.";
  voiceDiaryBtn.disabled = true;
}

function startListening(mode, button) {
  if (!recognition) return;
  // ak už niečo počúvame, zastavíme
  if (listening) {
    recognition.stop();
  }
  voiceMode = mode;
  activeVoiceButton = button;
  button.classList.add("listening");
  listening = true;
  recognition.start();
}

// Hlasové príkazy
function handleVoiceCommand(text) {
  // denník / diár -> otvor denník
  if (text.includes("denník") || text.includes("diár")) {
    showScreen("screen-diary");
    diaryStatus.textContent = "Prepnuté hlasom na denník 🎤";
    setTimeout(() => (diaryStatus.textContent = ""), 2000);
    return;
  }

  // domov / hlavná obrazovka
  if (text.includes("domov") || text.includes("hlavná")) {
    showScreen("screen-home");
    return;
  }

  // späť
  if (text.includes("späť") || text.includes("zpäť") || text.includes("spať")) {
    if (lastScreenId) {
      showScreen(lastScreenId);
    } else {
      showScreen("screen-home");
    }
    return;
  }

  // uložiť denník
  if (
    (text.includes("ulož") || text.includes("uložiť")) &&
    (text.includes("denník") || text.includes("zápis"))
  ) {
    saveDiary();
    return;
  }

  // násobilka / štyri
  if (
    text.includes("násobilka") ||
    text.includes("nasobilka") ||
    text.includes("štyri") ||
    text.includes("styri")
  ) {
    alert("Tu neskôr doplníme násobilku pre číslo 4 😊");
    return;
  }

  alert(`Nerozumiem príkazu: "${text}"`);
}

// Diktovanie do denníka – pridáme text na koniec
function handleDictation(text) {
  const current = diaryTextArea.value;
  const separator = current && !current.endsWith(" ") ? " " : "";
  diaryTextArea.value = current + separator + text;
  diaryTextArea.focus();
  diaryStatus.textContent = "Text pridaný hlasom 🎤";
  setTimeout(() => (diaryStatus.textContent = ""), 2000);
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
