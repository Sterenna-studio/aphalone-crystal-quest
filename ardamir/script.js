const emotes = [
  {
    "id": "surprise",
    "label": "Surprise",
    "image": "assets/surprise.png",
    "line": "Oh… je ne m’attendais pas à ça."
  },
  {
    "id": "joie",
    "label": "Joie",
    "image": "assets/joie.png",
    "line": "Parfait ! On avance."
  },
  {
    "id": "rire",
    "label": "Rire",
    "image": "assets/rire.png",
    "line": "D’accord, celle-là était vraiment bonne."
  },
  {
    "id": "amoureuse",
    "label": "Amoureuse",
    "image": "assets/amoureuse.png",
    "line": "Oh… je suis flattée."
  },
  {
    "id": "pensive",
    "label": "Pensive",
    "image": "assets/pensive.png",
    "line": "Hmm… laisse-moi réfléchir."
  },
  {
    "id": "perplexe",
    "label": "Perplexe",
    "image": "assets/perplexe.png",
    "line": "Attends… tu peux répéter ?"
  },
  {
    "id": "colere",
    "label": "Colère",
    "image": "assets/colere.png",
    "line": "Très bien. Là, ça suffit."
  },
  {
    "id": "triste",
    "label": "Triste",
    "image": "assets/triste.png",
    "line": "Je vois… c’est plus dur que prévu."
  },
  {
    "id": "panique",
    "label": "Paniquée",
    "image": "assets/panique.png",
    "line": "Non non non… mauvais plan !"
  },
  {
    "id": "degoutee",
    "label": "Dégoûtée",
    "image": "assets/degoutee.png",
    "line": "Beurk. Absolument pas."
  }
];

const portrait = document.querySelector("#portrait");
const line = document.querySelector("#line");
const buttons = document.querySelectorAll("[data-emote]");

function setEmote(id) {
  const emote = emotes.find(item => item.id === id);
  if (!emote) return;

  portrait.classList.add("swap");

  window.setTimeout(() => {
    portrait.src = emote.image;
    portrait.alt = `Réaction : ${emote.label}`;
    line.textContent = emote.line;
    portrait.classList.remove("swap");
  }, 120);

  buttons.forEach(button => {
    const active = button.dataset.emote === id;
    button.classList.toggle("active", active && button.classList.contains("emote"));
    button.classList.toggle("active-thumb", active && !button.classList.contains("emote"));
  });
}

buttons.forEach(button => {
  button.addEventListener("click", () => setEmote(button.dataset.emote));
});

setEmote("surprise");
