const PARTS_PATH = 'parts/';

const categories = [
  { id:'symbol',      label:'💫',  folder:'symbols',     prefix:'symbol_',      count:10, optional:true  },
  { id:'eyebrow',    label:'✏️',  folder:'eyebrows',    prefix:'eyebrow_',    count:8,  optional:false },
  { id:'eyes',        label:'👁',  folder:'eyes',        prefix:'eyes_',        count:9,  optional:false },
  { id:'nose',        label:'👃',  folder:'nose',        prefix:'nose_',        count:4,  optional:true  },
  { id:'mouth',       label:'👄',  folder:'mouth',       prefix:'mouth_',       count:8,  optional:false },
  { id:'hairstyle',   label:'💇',  folder:'hairstyle',   prefix:'hairstyle_',   count:3,  optional:false },
  { id:'gesture',     label:'🤚',  folder:'gesture',     prefix:'gesture_',     count:5,  optional:false },
  { id:'body_top',    label:'👕',  folder:'body_top',    prefix:'body_top_',    count:3,  optional:false },
  { id:'face',        label:'🧑',  folder:'face',        prefix:'face_',        count:1,  optional:false },
  { id:'body_bottom', label:'👖',  folder:'body_bottom', prefix:'body_bottom_', count:2,  optional:false },
];

function imgPath(cat, n) {
  return `${PARTS_PATH}${cat.folder}/${cat.prefix}${String(n).padStart(2,'0')}.PNG`;
}

const selected = {};
categories.forEach(cat => {
  selected[cat.id] = (cat.optional || cat.count === 0) ? null : imgPath(cat, 1);
});

const library = { brows:[], eyes:[], nose:[], mouth:[] };

function updateLayer(catId) {
  const el = document.getElementById('layer-' + catId);
  if (!el) return;
  const val = selected[catId];
  if (val) { el.src = val; el.style.display = ''; }
  else      { el.src = '';  el.style.display = 'none'; }
}
categories.forEach(cat => updateLayer(cat.id));

// ── Panneau avec onglets ──────────────────────────────────────
const panel = document.getElementById('partsPanel');
if (panel) {
  panel.innerHTML = '';
  panel.style.cssText = `
    background: rgba(255,255,255,0.85);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
    gap: 0;
    width: 420px;
    flex-shrink: 0;
    align-self: center;
  `;

  // Barre d'onglets — une seule ligne, emojis grands
  const tabBar = document.createElement('div');
  tabBar.style.cssText = `
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    background: rgba(240,237,254,0.6);
    border-bottom: 2px solid #e0d8f8;
    padding: 8px 8px 0;
    gap: 2px;
    scrollbar-width: none;
  `;

  // Grille 4 colonnes avec grandes vignettes
  const gridArea = document.createElement('div');
  gridArea.style.cssText = `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 14px;
    overflow-y: auto;
    flex: 1;
  `;

  function renderGrid(catId) {
    gridArea.innerHTML = '';
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    if (cat.optional) {
      const noneBtn = document.createElement('button');
      noneBtn.style.cssText = `
        width:88px; height:88px; background:white;
        border:1.5px solid #ddd; border-radius:12px;
        cursor:pointer; font-size:12px; color:#aaa;
        font-family:'Caveat',cursive; display:flex;
        align-items:center; justify-content:center;
        transition:border-color 0.15s;
        ${selected[cat.id] === null ? 'border-color:#7f77dd;background:#eeedfe;' : ''}
      `;
      noneBtn.textContent = 'Aucun';
      noneBtn.onclick = () => { selected[cat.id] = null; updateLayer(cat.id); renderGrid(catId); };
      gridArea.appendChild(noneBtn);
    }

    for (let i = 1; i <= cat.count; i++) {
      const path = imgPath(cat, i);
      const isActive = selected[cat.id] === path;
      const btn = document.createElement('button');
      btn.style.cssText = `
        width:88px; height:88px; background:${isActive ? '#eeedfe' : 'white'};
        border:${isActive ? '2.5px solid #7f77dd' : '1.5px solid #ddd'};
        border-radius:12px; padding:6px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:border-color 0.15s;
      `;
      const img = document.createElement('img');
      img.src = path;
      img.alt = cat.label + ' ' + i;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      btn.appendChild(img);
      btn.onclick = () => { selected[cat.id] = path; updateLayer(cat.id); renderGrid(catId); };
      gridArea.appendChild(btn);
    }
  }

  function setActiveTab(catId) {
    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
      const isActive = btn.dataset.id === catId;
      btn.style.background         = isActive ? 'white' : 'transparent';
      btn.style.borderColor        = isActive ? '#e0d8f8 #e0d8f8 white' : 'transparent';
      btn.style.color              = isActive ? '#7f77dd' : '#999';
      btn.style.marginBottom       = isActive ? '-2px' : '0';
      btn.style.zIndex             = isActive ? '1' : '0';
    });
    renderGrid(catId);
  }

  categories.forEach(cat => {
    const tab = document.createElement('button');
    tab.className = 'tab-btn';
    tab.dataset.id = cat.id;
    tab.textContent = cat.label;
    tab.style.cssText = `
      flex-shrink: 0;
      border: 1.5px solid transparent;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 22px;
      background: transparent;
      color: #999;
      transition: 0.15s;
      line-height: 1;
      position: relative;
    `;
    tab.onclick = () => setActiveTab(cat.id);
    tabBar.appendChild(tab);
  });

  panel.appendChild(tabBar);
  panel.appendChild(gridArea);
  setActiveTab(categories[0].id);
}

// ── Bouton Answer ─────────────────────────────────────────────
const answerBtn = document.getElementById("answerBtn");
if (answerBtn) {
  answerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
      name:        document.getElementById("pname").value,
      story:       document.querySelector(".story-ta").value,
      symbol:      selected.symbol      || '',
      eyebrow:    selected.eyebrow    || '',
      eyes:        selected.eyes        || '',
      nose:        selected.nose        || '',
      mouth:       selected.mouth       || '',
      hairstyle:   selected.hairstyle   || '',
      gesture:     selected.gesture     || '',
      body_top:    selected.body_top    || '',
      face:        selected.face        || '',
      body_bottom: selected.body_bottom || '',
      joy:      document.querySelectorAll(".emotion-slider")[0].value,
      sadness:  document.querySelectorAll(".emotion-slider")[1].value,
      anger:    document.querySelectorAll(".emotion-slider")[2].value,
      fear:     document.querySelectorAll(".emotion-slider")[3].value,
      surprise: document.querySelectorAll(".emotion-slider")[4].value,
    };
    try {
      const response = await fetch("/save-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      window.location.href = `/guess.html?id=${result.insertedId}`;
    } catch(err) { console.log(err); }
  });
}