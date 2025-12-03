// -------------------------------
// Pomocné funkcie pre prepínanie obrazoviek
// -------------------------------

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
    announceScreen(id);  // 👈 pridali sme toto
  }
}

// -------------------------------
// Hlásenie obrazoviek (pozdravy a možnosti)
// -------------------------------

let hasAnnouncedHome = false;

function announceScreen(id) {
  let text = "";

  if (id === "screen-home") {
    if (hasAnnouncedHome) return; // aby to nehučalo stále dookola
    text = "Ahoj Klárka. Vyber si: Môj denník, Škola hrou, Aplikácie alebo Médiá.";
    hasAnnouncedHome = true;
  } else if (id === "screen-diary") {
    text = "Otvorila si Môj denník. Môžeš písať, diktovať, pridávať fotky a nálepky.";
  } else if (id === "screen-school") {
    text = "Vitaj v rozprávkovej škole. Vyber si Hravé počítanie, Vybrané slová alebo Let's talk English.";
  } else if (id === "screen-apps") {
    text = "Tu sú aplikácie a mini hry.";
  } else if (id === "screen-media") {
    text = "Tu nájdeš rozprávky, pesničky a videá.";
  } else if (id === "screen-settings") {
    text = "Tu sú nastavenia pre rodiča.";
  }

  if (text) {
    speak(text, "sk-SK");
  }
}


// Pre hlavné karty (dedinka)
document.querySelectorAll(".village-card[data-target]").forEach((card) => {
  card.addEventListener("click", () => {
    const targetId = card.getAttribute("data-target");
    showScreen(targetId);
  });
});

// Pre späť tlačidlá
document.querySelectorAll(".back-btn[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    showScreen(targetId);
  });
});

// Nastavenia
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", () => {
  showScreen("screen-settings");
});

// Škola hrou – dvere
document.querySelectorAll(".door-btn[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    showScreen(targetId);
  });
});

// -------------------------------
// Denník – logika
// -------------------------------

const diaryDateInput = document.getElementById("diaryDate");
const diaryTextArea = document.getElementById("diaryText");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const diaryStatus = document.getElementById("diaryStatus");
const todayBtn = document.getElementById("todayBtn");
const clearDiaryBtn = document.getElementById("clearDiaryBtn");

const photoBtn = document.getElementById("photoBtn");
const photoInput = document.getElementById("photoInput");
const diaryPhotoPreview = document.getElementById("diaryPhotoPreview");
const stickersDisplay = document.getElementById("stickersDisplay");

const moodButtons = document.querySelectorAll(".mood-btn");
const placeButtons = document.querySelectorAll(".place-btn");
const stickerButtons = document.querySelectorAll(".sticker-btn");

function formatDateToInput(date) {
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

function getDiaryMoodKey(dateStr) {
  return `klarka-diary-mood-${dateStr}`;
}

function getDiaryPlaceKey(dateStr) {
  return `klarka-diary-place-${dateStr}`;
}

function getDiaryStickersKey(dateStr) {
  return `klarka-diary-stickers-${dateStr}`;
}

function setActiveButton(buttons, valueAttr, storedValue) {
  buttons.forEach((btn) => {
    const val = btn.getAttribute(valueAttr);
    if (val === storedValue) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function getActiveValue(buttons, valueAttr) {
  let value = null;
  buttons.forEach((btn) => {
    if (btn.classList.contains("active")) {
      value = btn.getAttribute(valueAttr);
    }
  });
  return value;
}

function renderStickers(stickersString) {
  stickersDisplay.textContent = stickersString || "";
}

function loadDiaryForDate(dateStr) {
  const key = getDiaryKey(dateStr);
  const content = localStorage.getItem(key) || "";
  diaryTextArea.value = content;

  const mood = localStorage.getItem(getDiaryMoodKey(dateStr));
  const place = localStorage.getItem(getDiaryPlaceKey(dateStr));
  const stickers = localStorage.getItem(getDiaryStickersKey(dateStr)) || "";

  setActiveButton(moodButtons, "data-mood", mood);
  setActiveButton(placeButtons, "data-place", place);
  renderStickers(stickers);

  const photoData = localStorage.getItem(getDiaryPhotoKey(dateStr));
  if (photoData) {
    diaryPhotoPreview.src = photoData;
    diaryPhotoPreview.classList.add("visible");
  } else {
    diaryPhotoPreview.src = "";
    diaryPhotoPreview.classList.remove("visible");
  }

  if (content || photoData || mood || place || stickers) {
    diaryStatus.textContent = "Na tento deň už máš uložené spomienky.";
  } else {
    diaryStatus.textContent = "";
  }
}

function saveDiary() {
  const dateStr = diaryDateInput.value;
  if (!dateStr) return;

  const text = diaryTextArea.value.trim();
  localStorage.setItem(getDiaryKey(dateStr), text);

  const mood = getActiveValue(moodButtons, "data-mood");
  const place = getActiveValue(placeButtons, "data-place");
  const stickers = stickersDisplay.textContent || "";

  if (mood) localStorage.setItem(getDiaryMoodKey(dateStr), mood);
  if (place) localStorage.setItem(getDiaryPlaceKey(dateStr), place);
  localStorage.setItem(getDiaryStickersKey(dateStr), stickers);

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
clearDiaryBtn.addEventListener("click", () => {
  diaryTextArea.value = "";
  diaryStatus.textContent = "Text bol vyčistený.";
  setTimeout(() => (diaryStatus.textContent = ""), 1500);
});

// Auto-save každé 2 sekundy
let autoSaveTimer = null;
diaryTextArea.addEventListener("input", () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveDiary();
  }, 2000);
});

// Mood a place
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    moodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const dateStr = diaryDateInput.value || todayStr;
    localStorage.setItem(getDiaryMoodKey(dateStr), btn.getAttribute("data-mood"));
  });
});

placeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    placeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const dateStr = diaryDateInput.value || todayStr;
    localStorage.setItem(getDiaryPlaceKey(dateStr), btn.getAttribute("data-place"));
  });
});

// Stickers – len pridávame textovo do spodného boxu
stickerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sticker = btn.getAttribute("data-sticker");
    stickersDisplay.textContent = (stickersDisplay.textContent || "") + " " + sticker;
    const dateStr = diaryDateInput.value || todayStr;
    localStorage.setItem(getDiaryStickersKey(dateStr), stickersDisplay.textContent.trim());
  });
});

// Fotka
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
    localStorage.setItem(getDiaryPhotoKey(dateStr), dataUrl);
    diaryPhotoPreview.src = dataUrl;
    diaryPhotoPreview.classList.add("visible");
    diaryStatus.textContent = "Fotka bola uložená ✔";
    setTimeout(() => (diaryStatus.textContent = ""), 2000);
  };
  reader.readAsDataURL(file);
});

// -------------------------------
// Text-to-Speech (čítanie denníka)
// -------------------------------

function speak(text, lang = "sk-SK") {
  if (!("speechSynthesis" in window)) {
    console.warn("Prehrávanie hlasu nie je v tomto prehliadači podporované.");
    return;
  }
  if (!text || !text.trim()) {
    alert("Denník je prázdny.");
    return;
  }

  // zruš prípadné staré hovorenie
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

const readDiaryBtn = document.getElementById("readDiaryBtn");
readDiaryBtn.addEventListener("click", () => {
  speak(diaryTextArea.value, "sk-SK");
});

// zavoláme hneď po načítaní skriptu
initVoices("sk-SK");

// keď sa appka načíta, po chvíľke pozdrav Klárku
setTimeout(() => {
  announceScreen("screen-home");
}, 800);

// -------------------------------
// Hlasové ovládanie – príkazy + diktovanie
// -------------------------------

voiceDiaryBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (listening && voiceMode === "dictation") {
      recognition.stop();
      return;
    }
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Hlasové ovládanie nie je v tomto prehliadači podporované.";
  voiceDiaryBtn.disabled = true;
}

function startListening(mode, button) {
  if (!recognition) return;
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
  const t = text.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  // Denník
  if (t.includes("dennik") || t.includes("diar")) {
    showScreen("screen-diary");
    diaryStatus.textContent = "Prepnuté hlasom na denník 🎤";
    setTimeout(() => (diaryStatus.textContent = ""), 2000);
    return;
  }

  // Domov
  if (t.includes("domov") || t.includes("hlavna")) {
    showScreen("screen-home");
    return;
  }

  // Späť
  if (t.includes("spat") || t.includes("zpat")) {
    if (lastScreenId) {
      showScreen(lastScreenId);
    } else {
      showScreen("screen-home");
    }
    return;
  }

  // Škola hrou
  if (t.includes("skola") || t.includes("skola hrou")) {
    showScreen("screen-school");
    return;
  }

  // Aplikácie
  if (t.includes("aplikacie") || t.includes("apky") || t.includes("aplikacii")) {
    showScreen("screen-apps");
    return;
  }

  // Médiá
  if (t.includes("media") || t.includes("rozpravky") || t.includes("pesnicky")) {
    showScreen("screen-media");
    return;
  }

  // Hravé počítanie
  if (t.includes("pocitanie") || t.includes("pocitame") || t.includes("matematika")) {
    showScreen("screen-math");
    return;
  }

  // Vybrané slová
  if (t.includes("vybrane slova") || t.includes("slovicka") || t.includes("slovicka")) {
    showScreen("screen-words");
    return;
  }

  // English
  if (t.includes("english") || t.includes("anglictina") || t.includes("lets talk")) {
    showScreen("screen-english");
    return;
  }

  // Ulož denník
  if (
    (t.includes("uloz") || t.includes("ulozit")) &&
    (t.includes("dennik") || t.includes("zapis"))
  ) {
    saveDiary();
    return;
  }

  // Prečítaj denník
  if (
    (t.includes("precitaj") || t.includes("precitat") || t.includes("precitaj mi")) &&
    t.includes("dennik")
  ) {
    speak(diaryTextArea.value, "sk-SK");
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
