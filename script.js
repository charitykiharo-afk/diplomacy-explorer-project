const API_KEY = "o38qhogR6T53pI9x-GX139QxaaJDawmDF-fhOc2aa5ekkyT4"
const BASE_URL = "https://restcountries.com/v3.1/all";

// ===== COUNTRY DATA =====
// Will be populated from API
let COUNTRIES = [];


// ===== RELATIONS DATA =====
// Shows the relationship between two countries
const RELATIONS_DATA = {
  "US-UK": "allied",
  "US-FR": "allied",
  "US-DE": "allied",
  "UK-FR": "allied",
  "UK-DE": "allied",
  "FR-DE": "allied",
};

function getRelation(a, b) {
  const keys = [a + "-" + b, b + "-" + a];
  for (const k of keys) {
    if (RELATIONS_DATA[k]) return RELATIONS_DATA[k];
  }
  return "neutral";
}


// ===== KEY TREATIES =====
// Each one has a plain-English "why it matters" line
const TREATIES = [
  {
    name: "North Atlantic Treaty (NATO)",
    year: 1949,
    parties: "United States, United Kingdom, Canada + 26 others",
    type: "military",
    why: "Why it matters: A defence pact that keeps member countries aligned on security and collective defence.",
    desc: "NATO is a military alliance created after World War II to keep peace in Europe and protect member nations from attack. It still shapes Western security cooperation today."
  },
  {
    name: "Paris Climate Agreement",
    year: 2015,
    parties: "196 countries",
    type: "climate",
    why: "Why it matters: It is the main global plan for countries to fight climate change together.",
    desc: "Countries agreed to limit global warming and report on emissions progress. The agreement keeps climate diplomacy at the centre of international relations."
  },
  {
    name: "World Trade Organization Agreement (WTO)",
    year: 1994,
    parties: "164 countries",
    type: "trade",
    why: "Why it matters: It sets the rules for how countries buy and sell goods to each other.",
    desc: "The WTO agreement created a permanent organisation to manage international trade. It prevents countries from unfairly blocking imports and gives smaller nations a place to resolve trade disputes with powerful ones."
  },
  {
    name: "African Continental Free Trade Area (AfCFTA)",
    year: 2018,
    parties: "54 African nations",
    type: "trade",
    why: "Why it matters: It creates a single market across all of Africa — a huge step for the continent.",
    desc: "AfCFTA allows goods and services to move more freely between 54 African countries, cutting tariffs and boosting intra-Africa trade. It is the largest free trade area in the world by number of countries, and is especially important for East Africa including Kenya."
  },
];


// ===== TIMELINE DATA =====
const TIMELINE = [
  { year: 1945, event: "United Nations Charter signed", detail: "51 founding nations created the UN in San Francisco — the main global organisation for maintaining peace and cooperation.", tag: "peace" },
  { year: 1949, event: "NATO Alliance formed", detail: "12 Western nations signed the North Atlantic Treaty, creating a new military partnership for collective defence.", tag: "military" },
  { year: 2015, event: "Paris Climate Agreement", detail: "196 nations committed to limit global warming and cooperate on emissions reductions.", tag: "climate" },
];


// ===== LOAD DATA FROM API =====
async function loadCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    // Map API data to our format, only for US, UK, FR, DE
    const countryMap = {
      "United States": {
        key: "US", flag: "🇺🇸",
        allies: ["United Kingdom"],
        trade_partners: ["United Kingdom"],
        organizations: ["NATO", "UN", "G7", "G20", "WTO"]
      },
      "United Kingdom": {
        key: "UK", flag: "🇬🇧",
        allies: ["United States"],
        trade_partners: ["United States"],
        organizations: ["NATO", "UN", "G7", "G20", "Commonwealth", "WTO"]
      },
      "France": {
        key: "FR", flag: "🇫🇷",
        allies: ["United States", "United Kingdom", "Germany"],
        trade_partners: ["Germany", "United States", "Italy", "Spain", "Belgium"],
        organizations: ["NATO", "UN", "EU", "G7", "G20", "WTO"]
      },
      "Germany": {
        key: "DE", flag: "🇩🇪",
        allies: ["France", "United States", "United Kingdom", "Poland"],
        trade_partners: ["China", "United States", "France", "Netherlands", "Italy"],
        organizations: ["NATO", "UN", "EU", "G7", "G20", "WTO"]
      }
    };
    
    COUNTRIES = data
      .filter(country => country.name.common in countryMap)
      .map(country => ({
        key: countryMap[country.name.common].key,
        name: country.name.common,
        flag: countryMap[country.name.common].flag,
        capital: country.capital ? country.capital[0] : "N/A",
        region: country.region,
        subregion: country.subregion,
        population: country.population.toLocaleString(),
        area: country.area.toLocaleString() + " km²",
        currency: Object.values(country.currencies || {})[0]?.name || "N/A",
        language: Object.values(country.languages || {})[0] || "N/A",
        un_member: country.unMember,
        allies: countryMap[country.name.common].allies,
        trade_partners: countryMap[country.name.common].trade_partners,
        organizations: countryMap[country.name.common].organizations
      }));
    
    console.log('Countries loaded:', COUNTRIES);
  } catch (error) {
    console.error('Error loading countries:', error);
    // Fallback to static data if API fails
    COUNTRIES = [
      {
        key: "US", name: "United States", flag: "🇺🇸",
        capital: "Washington D.C.", region: "Americas", subregion: "North America",
        population: "331000000", area: "9833517 km²", currency: "United States dollar", language: "English",
        un_member: true,
        allies: ["United Kingdom"],
        trade_partners: ["United Kingdom"],
        organizations: ["NATO", "UN", "G7", "G20", "WTO"]
      },
      {
        key: "UK", name: "United Kingdom", flag: "🇬🇧",
        capital: "London", region: "Europe", subregion: "Northern Europe",
        population: "67000000", area: "243610 km²", currency: "British pound", language: "English",
        un_member: true,
        allies: ["United States"],
        trade_partners: ["United States"],
        organizations: ["NATO", "UN", "G7", "G20", "Commonwealth", "WTO"]
      },
      {
        key: "FR", name: "France", flag: "🇫🇷",
        capital: "Paris", region: "Europe", subregion: "Western Europe",
        population: "67000000", area: "551695 km²", currency: "Euro", language: "French",
        un_member: true,
        allies: ["United States", "United Kingdom", "Germany"],
        trade_partners: ["Germany", "United States", "Italy", "Spain", "Belgium"],
        organizations: ["NATO", "UN", "EU", "G7", "G20", "WTO"]
      },
      {
        key: "DE", name: "Germany", flag: "🇩🇪",
        capital: "Berlin", region: "Europe", subregion: "Western Europe",
        population: "83000000", area: "357022 km²", currency: "Euro", language: "German",
        un_member: true,
        allies: ["France", "United States", "United Kingdom", "Poland"],
        trade_partners: ["China", "United States", "France", "Netherlands", "Italy"],
        organizations: ["NATO", "UN", "EU", "G7", "G20", "WTO"]
      },
    ];
  }
}


// ===================================================
// NAVIGATION
// ===================================================
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 'treaties') renderTreaties();
  if (id === 'timeline') renderTimeline('all');
  if (id === 'compare')  populateCompareDropdowns();
}


// ===================================================
// SEARCH
// ===================================================
const searchInput = document.getElementById('searchInput');
const dropdown    = document.getElementById('dropdown');

searchInput.addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  if (!q) { dropdown.classList.remove('open'); return; }

  const matches = COUNTRIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  if (!matches.length) { dropdown.classList.remove('open'); return; }

  dropdown.innerHTML = matches.map(c => `
    <div class="dropdown-item" onclick="showCountry('${c.key}')">
      <span class="flag">${c.flag}</span>
      <div class="country-info">
        <span class="country-name">${c.name}</span>
        <span class="country-region">${c.subregion}</span>
      </div>
    </div>
  `).join('');
  dropdown.classList.add('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-bar')) dropdown.classList.remove('open');
});

function showCountry(key) {
  const c = COUNTRIES.find(x => x.key === key);
  if (!c) return;
  dropdown.classList.remove('open');
  searchInput.value = c.name;

  const relCards = [
    { title: "&#9830; Allied Nations",    items: c.allies,        dot: 'dot-green' },
    { title: "&#127968; Trade Partners",  items: c.trade_partners, dot: 'dot-blue'  },
    { title: "&#9824; Organizations",     items: c.organizations,  dot: 'dot-gold'  },
  ];

  document.getElementById('countryResult').innerHTML = `
    <div class="country-card">
      <div class="country-header">
        <div class="flag-big">${c.flag}</div>
        <div class="country-title">
          <h2>${c.name}</h2>
          <div class="subtitle">${c.subregion} &bull; ${c.region}</div>
          <div class="country-badges">
            ${c.un_member                          ? '<span class="badge badge-blue">UN Member</span>'  : ''}
            ${c.organizations.includes('NATO')     ? '<span class="badge badge-gold">NATO</span>'       : ''}
            ${c.organizations.includes('G7')       ? '<span class="badge badge-gold">G7</span>'         : ''}
            ${c.organizations.includes('G20')      ? '<span class="badge badge-green">G20</span>'       : ''}
            ${c.organizations.includes('BRICS')    ? '<span class="badge badge-red">BRICS</span>'       : ''}
            ${c.organizations.includes('AU')       ? '<span class="badge badge-green">AU</span>'        : ''}
            ${c.organizations.includes('EAC')      ? '<span class="badge badge-blue">EAC</span>'        : ''}
          </div>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-label">Capital</div><div class="stat-value">${c.capital}</div></div>
        <div class="stat-box"><div class="stat-label">Population</div><div class="stat-value">${c.population}</div></div>
        <div class="stat-box"><div class="stat-label">Area</div><div class="stat-value">${c.area}</div></div>
        <div class="stat-box"><div class="stat-label">Currency</div><div class="stat-value">${c.currency}</div></div>
        <div class="stat-box"><div class="stat-label">Language</div><div class="stat-value">${c.language}</div></div>
        <div class="stat-box"><div class="stat-label">Organizations</div><div class="stat-value">${c.organizations.length} memberships</div></div>
      </div>
    </div>

    <div class="section-header" style="margin-top:2rem;">
      <h2>Diplomatic Relationships</h2>
      <div class="line"></div>
    </div>
    <div class="relations-grid">
      ${relCards.map(r => `
        <div class="relation-card">
          <h4>${r.title}</h4>
          ${r.items.map(i => `
            <div class="relation-item">
              <div class="dot ${r.dot}"></div>
              ${i}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}


// ===================================================
// TREATIES
// ===================================================
function renderTreaties() {
  document.getElementById('treatiesList').innerHTML = TREATIES.map(t => `
    <div class="treaty-card">
      <div class="treaty-top">
        <div class="treaty-name">${t.name}</div>
        <div class="treaty-year">${t.year}</div>
      </div>
      <div class="treaty-parties">&#127758; ${t.parties}</div>
      <div class="treaty-why">${t.why}</div>
      <div class="treaty-desc">${t.desc}</div>
      <span class="treaty-type-tag">${t.type}</span>
    </div>
  `).join('');
}


// ===================================================
// COMPARE
// ===================================================
function populateCompareDropdowns() {
  const opts = COUNTRIES.map(c => `<option value="${c.key}">${c.flag} ${c.name}</option>`).join('');
  document.getElementById('compareA').innerHTML = '<option value="">Select first country...</option>' + opts;
  document.getElementById('compareB').innerHTML = '<option value="">Select second country...</option>' + opts;
}

function runCompare() {
  const aKey = document.getElementById('compareA').value;
  const bKey = document.getElementById('compareB').value;
  if (!aKey || !bKey) return;

  const a   = COUNTRIES.find(c => c.key === aKey);
  const b   = COUNTRIES.find(c => c.key === bKey);
  const rel = getRelation(aKey, bKey);

  const relLabels = {
    allied:  "&#9830; Allied — These countries are strong partners or formal allies.",
    neutral: "&#9675; Neutral — Limited ties; no strong alliance or major conflict.",
    tension: "&#9888; Tensions — These countries have disagreements or a strained relationship."
  };

  document.getElementById('compareResult').innerHTML = `
    <div class="relation-status ${rel}">
      ${relLabels[rel]}
    </div>
    <div class="compare-result">
      ${[a, b].map(c => `
        <div class="compare-panel">
          <h3>${c.flag} ${c.name}</h3>
          <div class="compare-row"><span class="compare-label">Capital</span>        <span class="compare-val">${c.capital}</span></div>
          <div class="compare-row"><span class="compare-label">Region</span>         <span class="compare-val">${c.subregion}</span></div>
          <div class="compare-row"><span class="compare-label">Population</span>     <span class="compare-val">${c.population}</span></div>
          <div class="compare-row"><span class="compare-label">Area</span>           <span class="compare-val">${c.area}</span></div>
          <div class="compare-row"><span class="compare-label">Currency</span>       <span class="compare-val">${c.currency}</span></div>
          <div class="compare-row"><span class="compare-label">Language</span>       <span class="compare-val">${c.language}</span></div>
          <div class="compare-row"><span class="compare-label">Allies</span>         <span class="compare-val">${c.allies.length} key allies</span></div>
          <div class="compare-row"><span class="compare-label">Trade Partners</span> <span class="compare-val">${c.trade_partners.slice(0, 3).join(', ')}</span></div>
          <div class="compare-row"><span class="compare-label">Organizations</span>  <span class="compare-val">${c.organizations.slice(0, 3).join(', ')}</span></div>
        </div>
      `).join('')}
    </div>
  `;
}


// ===================================================
// TIMELINE
// ===================================================
function renderTimeline(filter) {
  const list = filter === 'all' ? TIMELINE : TIMELINE.filter(t => t.tag === filter);
  document.getElementById('timelineList').innerHTML = list.map(t => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-year">${t.year}</div>
      <div class="timeline-event">${t.event}</div>
      <div class="timeline-detail">${t.detail}</div>
      <span class="timeline-tag tag-${t.tag}">${t.tag}</span>
    </div>
  `).join('');
}

function filterTimeline(type, btn) {
  document.querySelectorAll('#section-timeline .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTimeline(type);
}


// ===================================================
// INIT — run when page loads
// ===================================================
async function init() {
  await loadCountries();
  renderTreaties();
  renderTimeline('all');
}

init();