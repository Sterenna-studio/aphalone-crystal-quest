/* ============================================================
   Aphalone — Asset Browser · assets.js
   ============================================================ */

'use strict';

// ---------------------------------------------------------------------------
// Asset manifest — ajouter ici tout nouvel asset
// ---------------------------------------------------------------------------
const ASSETS = [
  // Portraits Ardamir
  { id: 'portrait-amoureuse',  category: 'portraits', label: 'Amoureuse',  file: 'assets/portraits/amoureuse.png',  pixel: false },
  { id: 'portrait-colere',     category: 'portraits', label: 'Colère',     file: 'assets/portraits/colere.png',     pixel: false },
  { id: 'portrait-degoutee',   category: 'portraits', label: 'Dégoûtée',   file: 'assets/portraits/degoutee.png',   pixel: false },
  { id: 'portrait-joie',       category: 'portraits', label: 'Joie',       file: 'assets/portraits/joie.png',       pixel: false },
  { id: 'portrait-panique',    category: 'portraits', label: 'Panique',    file: 'assets/portraits/panique.png',    pixel: false },
  { id: 'portrait-pensive',    category: 'portraits', label: 'Pensive',    file: 'assets/portraits/pensive.png',    pixel: false },
  { id: 'portrait-perplexe',   category: 'portraits', label: 'Perplexe',   file: 'assets/portraits/perplexe.png',   pixel: false },
  { id: 'portrait-rire',       category: 'portraits', label: 'Rire',       file: 'assets/portraits/rire.png',       pixel: false },
  { id: 'portrait-surprise',   category: 'portraits', label: 'Surprise',   file: 'assets/portraits/surprise.png',   pixel: false },
  { id: 'portrait-triste',     category: 'portraits', label: 'Triste',     file: 'assets/portraits/triste.png',     pixel: false },
  // Walk frames Ardamir
  { id: 'walk-01', category: 'walk', label: 'Walk 01', file: 'assets/walk/ardamir_walk_01.png', pixel: true },
  { id: 'walk-02', category: 'walk', label: 'Walk 02', file: 'assets/walk/ardamir_walk_02.png', pixel: true },
  { id: 'walk-03', category: 'walk', label: 'Walk 03', file: 'assets/walk/ardamir_walk_03.png', pixel: true },
  { id: 'walk-04', category: 'walk', label: 'Walk 04', file: 'assets/walk/ardamir_walk_04.png', pixel: true },
  { id: 'walk-05', category: 'walk', label: 'Walk 05', file: 'assets/walk/ardamir_walk_05.png', pixel: true },
  { id: 'walk-06', category: 'walk', label: 'Walk 06', file: 'assets/walk/ardamir_walk_06.png', pixel: true },
  { id: 'walk-07', category: 'walk', label: 'Walk 07', file: 'assets/walk/ardamir_walk_07.png', pixel: true },
  { id: 'walk-08', category: 'walk', label: 'Walk 08', file: 'assets/walk/ardamir_walk_08.png', pixel: true },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  category: 'all',
  query: '',
  lightboxIndex: -1,
  filteredAssets: [],
};

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const grid          = document.getElementById('grid');
const assetCount    = document.getElementById('asset-count');
const searchInput   = document.getElementById('search');
const filterBtns    = document.querySelectorAll('.filter-btn');
const lightbox      = document.getElementById('lightbox');
const lightboxBg    = document.getElementById('lightbox-backdrop');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxMeta  = document.getElementById('lightbox-meta');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');
const walkCanvas    = document.getElementById('walk-canvas');
const walkPlayBtn   = document.getElementById('walk-play');
const walkFpsRange  = document.getElementById('walk-fps');
const walkFpsVal    = document.getElementById('walk-fps-val');

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------
function getFiltered() {
  const q = state.query.toLowerCase();
  return ASSETS.filter(a => {
    const matchCat = state.category === 'all' || a.category === state.category;
    const matchQ   = !q || a.label.toLowerCase().includes(q) || a.file.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

// ---------------------------------------------------------------------------
// Render grid
// ---------------------------------------------------------------------------
function renderGrid() {
  state.filteredAssets = getFiltered();
  grid.innerHTML = '';

  assetCount.textContent = `${state.filteredAssets.length} asset${state.filteredAssets.length !== 1 ? 's' : ''}`;

  if (state.filteredAssets.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Aucun asset trouvé.';
    grid.appendChild(empty);
    return;
  }

  state.filteredAssets.forEach((asset, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Ouvrir ${asset.label}`);

    const img = document.createElement('img');
    img.src = asset.file;
    img.alt = asset.label;
    img.className = 'card__thumb' + (asset.pixel ? ' card__thumb--pixel' : '');
    img.loading = 'lazy';

    const meta = document.createElement('div');
    meta.className = 'card__meta';

    const name = document.createElement('span');
    name.className = 'card__name';
    name.textContent = asset.label;

    const badge = document.createElement('div');
    badge.className = 'card__badge';

    const tag = document.createElement('span');
    tag.className = `badge-tag badge-tag--${asset.category}`;
    tag.textContent = asset.category;

    badge.appendChild(tag);
    meta.appendChild(name);
    meta.appendChild(badge);
    card.appendChild(img);
    card.appendChild(meta);

    card.addEventListener('click', () => openLightbox(index));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function openLightbox(index) {
  state.lightboxIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lightboxBg.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxBg.hidden = true;
  document.body.style.overflow = '';
}

function updateLightbox() {
  const asset = state.filteredAssets[state.lightboxIndex];
  if (!asset) return;

  lightboxImg.src = asset.file;
  lightboxImg.alt = asset.label;
  lightboxImg.className = 'lightbox__img' + (asset.pixel ? ' lightbox__img--pixel' : '');

  const filename = asset.file.split('/').pop();
  const dir      = asset.file.substring(0, asset.file.lastIndexOf('/') + 1);

  lightboxMeta.innerHTML = '';
  const rows = [
    ['Nom',        asset.label],
    ['Catégorie',  asset.category],
    ['Fichier',    filename],
    ['Chemin',     dir],
    ['Rendu',      asset.pixel ? 'Pixel art' : 'Standard'],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'lightbox__meta-row';
    row.innerHTML = `<span class="lightbox__meta-label">${label}</span><span class="lightbox__meta-value">${value}</span>`;
    lightboxMeta.appendChild(row);
  });

  lightboxPrev.disabled = state.lightboxIndex === 0;
  lightboxNext.disabled = state.lightboxIndex === state.filteredAssets.length - 1;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBg.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
  if (state.lightboxIndex > 0) {
    state.lightboxIndex--;
    updateLightbox();
  }
});

lightboxNext.addEventListener('click', () => {
  if (state.lightboxIndex < state.filteredAssets.length - 1) {
    state.lightboxIndex++;
    updateLightbox();
  }
});

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   { if (state.lightboxIndex > 0) { state.lightboxIndex--; updateLightbox(); } }
  if (e.key === 'ArrowRight')  { if (state.lightboxIndex < state.filteredAssets.length - 1) { state.lightboxIndex++; updateLightbox(); } }
});

// ---------------------------------------------------------------------------
// Walk animation preview
// ---------------------------------------------------------------------------
const walkFrames = ASSETS.filter(a => a.category === 'walk');
const walkImages = walkFrames.map(a => {
  const img = new Image();
  img.src = a.file;
  return img;
});

const walkCtx   = walkCanvas.getContext('2d');
let walkFrame   = 0;
let walkPlaying = true;
let walkFps     = 10;
let walkLast    = 0;

function walkTick(timestamp) {
  if (walkPlaying && walkImages.length > 0) {
    const interval = 1000 / walkFps;
    if (timestamp - walkLast >= interval) {
      walkLast = timestamp;
      walkCtx.clearRect(0, 0, walkCanvas.width, walkCanvas.height);
      const img = walkImages[walkFrame % walkImages.length];
      if (img.complete) {
        walkCtx.imageSmoothingEnabled = false;
        walkCtx.drawImage(img, 0, 0, walkCanvas.width, walkCanvas.height);
      }
      walkFrame = (walkFrame + 1) % walkImages.length;
    }
  }
  requestAnimationFrame(walkTick);
}

requestAnimationFrame(walkTick);

walkPlayBtn.addEventListener('click', () => {
  walkPlaying = !walkPlaying;
  walkPlayBtn.textContent = walkPlaying ? '⏸ Pause' : '▶ Play';
});

walkFpsRange.addEventListener('input', () => {
  walkFps = parseInt(walkFpsRange.value, 10);
  walkFpsVal.textContent = walkFps;
});

// ---------------------------------------------------------------------------
// Filters & search
// ---------------------------------------------------------------------------
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    state.category = btn.dataset.category;
    renderGrid();
  });
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderGrid();
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
renderGrid();
