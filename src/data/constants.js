// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & MOCK DATA — Sagar-Manthan
// ══════════════════════════════════════════════════════════════════════════════

export const oceanTrendData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperature: +(26.5 + Math.sin(i / 4) * 2.3 + (Math.random() - 0.5) * 0.4).toFixed(1),
  salinity: +(34.8 + Math.cos(i / 5) * 0.8 + (Math.random() - 0.5) * 0.15).toFixed(2),
}));

export const kpiSparkData = {
  sensors: [12, 15, 14, 18, 22, 20, 24].map((v) => ({ v })),
  species: [30, 42, 38, 55, 48, 52, 57].map((v) => ({ v })),
  edna: [200, 280, 310, 350, 290, 380, 340].map((v) => ({ v })),
  energy: [8, 9, 9, 10, 11, 12, 14].map((v) => ({ v })),
};

export const initialAgentLogs = [
  { agent: 'Ingestion Agent', msg: '340 new records normalized from Buoy-12 (Arabian Sea)', color: 'cyan', time: '10:14:32' },
  { agent: 'Correlation Agent', msg: 'Flagged temperature anomaly (+2.1°C) near Site-7, cross-referencing ARGO data', color: 'amber', time: '10:13:58' },
  { agent: 'QA Agent', msg: 'Validated 98.2% of incoming eDNA reads from CMLRE Kochi station', color: 'teal', time: '10:13:21' },
  { agent: 'Taxonomy Agent', msg: 'Auto-classified 23 otolith specimens — 3 flagged for expert review', color: 'indigo', time: '10:12:47' },
  { agent: 'Energy Siting Agent', msg: 'Updated tidal suitability scores for 5 zones using latest current data', color: 'amber', time: '10:11:55' },
  { agent: 'Ingestion Agent', msg: 'Synced 1,204 species occurrence records from OBIS India node', color: 'cyan', time: '10:11:12' },
  { agent: 'Anomaly Detector', msg: 'Salinity drop at Station-14 (Lakshadweep) — possible freshwater intrusion', color: 'rose', time: '10:10:33' },
  { agent: 'Federated Agent', msg: 'Model aggregation complete — 3 institutes contributed, raw data intact', color: 'teal', time: '10:09:48' },
  { agent: 'QA Agent', msg: 'Rejected 12 duplicate entries from manual survey upload (Mandapam)', color: 'indigo', time: '10:09:02' },
  { agent: 'Correlation Agent', msg: 'Positive correlation (r=0.87): sardine density ↔ SST in Zone-3', color: 'cyan', time: '10:08:14' },
];

export const liveAgentMessages = [
  { agent: 'Ingestion Agent', msg: 'Processing real-time CTD data from INS Sarvekshak', color: 'cyan' },
  { agent: 'Correlation Agent', msg: 'Chlorophyll bloom correlates with upwelling near Site-3', color: 'amber' },
  { agent: 'QA Agent', msg: 'Batch validation: 847 records, 99.1% pass rate', color: 'teal' },
  { agent: 'Energy Siting Agent', msg: 'Wave height forecast integrated — Site-7 optimal: Mar–May', color: 'amber' },
  { agent: 'Taxonomy Agent', msg: 'Morphometric DB updated with 15 new reference specimens', color: 'indigo' },
];

export const mapMarkers = [
  { id: 1, lat: 22.5, lng: 69.5, type: 'energy', name: 'Site-3 (Gulf of Kutch)', depth: '15–30m', suitability: 8.4, species: 142, tidal: '2.8 m range' },
  { id: 2, lat: 18.9, lng: 71.5, type: 'energy', name: 'Site-4 (Mumbai Offshore)', depth: '20–40m', suitability: 6.9, species: 104, tidal: '2.1 m range' },
  { id: 3, lat: 16.2, lng: 72.8, type: 'energy', name: 'Site-5 (Konkan Coast)', depth: '20–45m', suitability: 7.2, species: 89, tidal: '1.9 m range' },
  { id: 4, lat: 15.2, lng: 73.5, type: 'sensor', name: 'Goa Coastal Station', depth: '0–50m', suitability: 5.5, species: 167, tidal: '1.4 m range' },
  { id: 5, lat: 12.8, lng: 74.0, type: 'energy', name: 'Site-6 (Mangalore)', depth: '25–55m', suitability: 7.6, species: 131, tidal: '1.6 m range' },
  { id: 6, lat: 9.5, lng: 75.5, type: 'energy', name: 'Site-7 (Kerala Coast)', depth: '25–50m', suitability: 9.1, species: 203, tidal: '3.4 m range' },
  { id: 7, lat: 9.0, lng: 79.0, type: 'biodiversity', name: 'Gulf of Mannar Biosphere', depth: '5–25m', suitability: 3.8, species: 412, tidal: '0.6 m range' },
  { id: 8, lat: 10.5, lng: 72.3, type: 'biodiversity', name: 'Lakshadweep Coral Reefs', depth: '10–40m', suitability: 4.1, species: 347, tidal: '1.1 m range' },
  { id: 9, lat: 15.0, lng: 82.5, type: 'sensor', name: 'Buoy-12 (Bay of Bengal)', depth: '0–200m', suitability: 6.5, species: 156, tidal: '1.5 m range' },
  { id: 10, lat: 14.0, lng: 67.5, type: 'sensor', name: 'ARGO Float NIO-7', depth: '0–2000m', suitability: 5.8, species: 67, tidal: '2.1 m range' },
  { id: 11, lat: 17.7, lng: 83.0, type: 'energy', name: 'Site-11 (Visakhapatnam)', depth: '30–60m', suitability: 7.8, species: 98, tidal: '1.7 m range' },
  { id: 12, lat: 8.1, lng: 77.5, type: 'energy', name: 'Site-9 (Kanyakumari)', depth: '15–45m', suitability: 8.7, species: 278, tidal: '2.9 m range' },
  { id: 13, lat: 11.5, lng: 92.5, type: 'sensor', name: 'Andaman Sea Station', depth: '0–300m', suitability: 6.2, species: 389, tidal: '1.8 m range' },
  { id: 14, lat: 20.5, lng: 87.0, type: 'energy', name: 'Site-12 (Odisha Coast)', depth: '20–50m', suitability: 6.8, species: 112, tidal: '1.4 m range' },
];

export const oceanCurrents = {
  wicc: [[22, 68.5], [20, 70], [18, 71.5], [16, 73], [14, 74], [12, 75], [10, 76], [8.5, 77]],
  eicc: [[8.5, 78], [10, 80], [12, 81], [14, 82], [16, 83], [18, 84], [20, 86]],
  equatorial: [[5, 66], [6, 72], [7, 78], [6, 84], [5, 90]],
};

export const migrationPaths = {
  sardine: [[16, 73.5], [14, 74.5], [12, 75.5], [10, 76.5], [9, 77.5], [8.5, 78]],
  mackerel: [[20, 71], [18, 72.5], [16, 73.5], [14, 75], [12, 76]],
};

export const biodiversityZones = [
  { center: [9.0, 79.0], radius: 55000, name: 'Gulf of Mannar' },
  { center: [10.5, 72.3], radius: 45000, name: 'Lakshadweep' },
  { center: [8.3, 77.2], radius: 30000, name: 'Kanyakumari' },
  { center: [11.5, 92.5], radius: 65000, name: 'Andaman & Nicobar' },
];

export const eezPolygon = [
  [23.5, 68.0], [22.2, 67.5], [20.0, 67.5], [17.5, 68.0], [15.0, 69.0],
  [12.0, 70.0], [9.5, 71.5], [7.5, 74.0], [5.8, 77.0], [6.2, 80.0],
  [8.5, 82.5], [11.5, 84.5], [14.5, 86.5], [17.8, 88.5], [20.5, 89.2],
  [21.5, 89.0], [21.5, 87.2], [20.0, 86.5], [17.8, 83.5], [15.5, 81.0],
  [12.5, 80.0], [9.8, 79.5], [8.1, 77.5], [9.5, 75.5], [12.8, 74.0],
  [15.2, 73.5], [18.9, 71.5], [22.5, 69.5], [23.5, 68.0]
];

export const specimenData = [
  {
    id: 0, name: 'Sardinella longiceps', commonName: 'Indian Oil Sardine',
    match: '94.3%', sampleId: 'SM-OTO-2024-0847', location: 'Kochi, Kerala',
    length: '4.82 mm', width: '2.37 mm', area: '8.94 mm²', perimeter: '13.21 mm',
    aspectRatio: '2.03', circularity: '0.644', age: '2–3 years', weight: '0.034g', rx: 110, ry: 65,
  },
  {
    id: 1, name: 'Rastrelliger kanagurta', commonName: 'Indian Mackerel',
    match: '91.7%', sampleId: 'SM-OTO-2024-0912', location: 'Mangalore, Karnataka',
    length: '5.14 mm', width: '2.68 mm', area: '10.82 mm²', perimeter: '14.65 mm',
    aspectRatio: '1.92', circularity: '0.631', age: '3–4 years', weight: '0.042g', rx: 118, ry: 72,
  },
  {
    id: 2, name: 'Stolephorus indicus', commonName: 'Indian Anchovy',
    match: '88.2%', sampleId: 'SM-OTO-2024-0734', location: 'Kochi, Kerala',
    length: '3.21 mm', width: '1.45 mm', area: '3.66 mm²', perimeter: '8.92 mm',
    aspectRatio: '2.21', circularity: '0.582', age: '1–2 years', weight: '0.018g', rx: 85, ry: 48,
  },
  {
    id: 3, name: 'Nemipterus japonicus', commonName: 'Japanese Threadfin Bream',
    match: '85.6%', sampleId: 'SM-OTO-2024-1045', location: 'Visakhapatnam, AP',
    length: '6.42 mm', width: '3.88 mm', area: '19.56 mm²', perimeter: '18.41 mm',
    aspectRatio: '1.65', circularity: '0.724', age: '4–5 years', weight: '0.065g', rx: 130, ry: 82,
  },
  {
    id: 4, name: 'Decapterus russelli', commonName: 'Indian Scad',
    match: '82.1%', sampleId: 'SM-OTO-2024-0621', location: 'Goa Coast',
    length: '4.15 mm', width: '2.10 mm', area: '6.84 mm²', perimeter: '11.45 mm',
    aspectRatio: '1.98', circularity: '0.650', age: '2 years', weight: '0.029g', rx: 98, ry: 58,
  },
  {
    id: 5, name: 'Scomberomorus guttatus', commonName: 'Indo-Pacific King Mackerel',
    match: '79.4%', sampleId: 'SM-OTO-2024-1102', location: 'Mumbai, Maharashtra',
    length: '7.85 mm', width: '4.12 mm', area: '25.40 mm²', perimeter: '22.30 mm',
    aspectRatio: '1.90', circularity: '0.640', age: '5+ years', weight: '0.088g', rx: 142, ry: 88,
  }
];

export const dnaMatchResults = [
  {
    id: 0, species: 'Sardinella longiceps', commonName: 'Indian Oil Sardine',
    match: '98.7%', location: 'Off Kochi, Kerala', depth: '12m',
    sample: 'SM-eDNA-2024-1847',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Clupeiformes', 'Sardinella'],
    targetSeq: 'ATCGTTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGC',
    refSeq:    'ATCGTTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGC',
    depthProfile: [
      { depth: '5m', copies: 14200 }, { depth: '15m', copies: 28900 },
      { depth: '30m', copies: 18500 }, { depth: '50m', copies: 4200 },
      { depth: '100m', copies: 800 },
    ]
  },
  {
    id: 1, species: 'Rastrelliger kanagurta', commonName: 'Indian Mackerel',
    match: '95.2%', location: 'Malvan, Maharashtra', depth: '28m',
    sample: 'SM-eDNA-2024-1843',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Scombriformes', 'Rastrelliger'],
    targetSeq: 'TTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGCATCG',
    refSeq:    'TTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGCTTCG',
    depthProfile: [
      { depth: '5m', copies: 8200 }, { depth: '15m', copies: 19400 },
      { depth: '30m', copies: 31200 }, { depth: '50m', copies: 14500 },
      { depth: '100m', copies: 2100 },
    ]
  },
  {
    id: 2, species: 'Thunnus albacares', commonName: 'Yellowfin Tuna',
    match: '89.1%', location: 'Lakshadweep Sea', depth: '85m',
    sample: 'SM-eDNA-2024-1839',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Scombriformes', 'Thunnus'],
    targetSeq: 'GGTATACGCCTAATGCGAATTTCGCAGCATCGTTAGGCCACTGAAATC',
    refSeq:    'GGTATACGCCTAATGCGAATTTCGCAGCATCCTTAGGCCACTGAAACC',
    depthProfile: [
      { depth: '5m', copies: 1200 }, { depth: '15m', copies: 4500 },
      { depth: '30m', copies: 12800 }, { depth: '50m', copies: 24600 },
      { depth: '100m', copies: 38200 },
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// GEMINI / CHAT CONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════

export const GEMINI_SYSTEM_PROMPTS = {
  energy: `You are Sagar-Manthan Energy & Siting AI Advisor, built for India's Ministry of Earth Sciences (MoES) and MNRE. You specialize in marine renewable energy site optimization, bathymetry, tidal current velocity, wave energy potential, digital twin impact simulation, and turbine array capacity factors along India's coastline.

Key Knowledge:
- 14 identified marine energy sites in India's EEZ
- Zone 7 (Kerala Coast): 42 GW theoretical wave energy potential, 2.1/10 biodiversity impact score
- Zone 3 (Gulf of Kutch): 31 GW potential, 3.4/10 impact score, 2.8m tidal range
- Digital Twin models: capacity factor (28-34%), marine traffic disruption %, noise level (dB), benthic footprint (ha)
- West India Coastal Current (WICC) velocity data from INCOIS
- India's 30 GW offshore renewable energy target by 2030

Style: Quantitative, data-driven, authoritative government advisor. Use bold metrics, concise bullet lists, and precise technical terms. Do not include raw API error strings.`,

  bio: `You are Sagar-Manthan Marine Biodiversity & eDNA Specialist AI, built for India's Centre for Marine Living Resources and Ecology (CMLRE) and National Biodiversity Authority. You specialize in molecular biodiversity (eDNA barcoding), fish migration corridors, otolith morphometry species taxonomy, and Schedule I wildlife protection.

Key Knowledge:
- Catalogue of 1,842 marine species identified via otolith morphometry & eDNA
- 6,391 processed eDNA samples from Indian coastal waters
- Top detected species: Sardinella longiceps (847 reads), Rastrelliger kanagurta (623 reads), Stolephorus indicus (512 reads), Decapterus russelli (389 reads), Nemipterus japonicus (274 reads)
- Schedule I Protected species: Rhincodon typus (Whale Shark) near Kanyakumari (8.08°N, 77.52°E) - triggers 15km exclusion zone
- Sardine migration corridor shifts 12% northwards per 0.3°C Arabian Sea SST rise (r=0.87)
- Privacy-preserving Federated Learning models across CMLRE (Kochi), FSI (Mumbai), and Agharkar (Pune)

Style: Ecological and taxonomical expertise. Always italicize scientific names (*Sardinella longiceps*), cite specific sample IDs, and highlight conservation status. Do not include raw API error strings.`
};

export const BOT_CONFIG = {
  energy: {
    id: 'energy',
    name: 'Energy & Siting Advisor',
    tagline: 'Offshore Renewable Energy, Bathymetry & Digital Twin Siting',
    color: '#F59E0B',
    badgeClass: 'amber',
    placeholder: 'Ask about wave energy, Site-7 vs Site-3, capacity factors, tidal currents...',
    suggestions: [
      '⚡ Wave energy potential by zone',
      '📊 Compare Site-7 vs Site-3',
      '🌀 Tidal turbine capacity factors',
      '🖥️ Digital Twin simulation details'
    ],
    initialMessages: [
      { role: 'user', text: 'Which zones have the highest wave energy potential with minimal biodiversity impact?' },
      { role: 'ai', text: 'Based on current INCOIS hydrodynamic data, **Zone 7** (off Kerala coast) shows **42 GW theoretical potential** with a biodiversity impact score of only **2.1/10** — the most favorable ratio in the dataset.\n\n**Top Energy Zones Comparison:**\n1. **Zone 7 (Kerala Coast)**: 42 GW Potential • 2.1/10 Impact Score • 3.4m Tidal Range\n2. **Zone 3 (Gulf of Kutch)**: 31 GW Potential • 3.4/10 Impact Score • 2.8m Tidal Range\n3. **Site-9 (Kanyakumari)**: 28 GW Potential • 4.2/10 Impact Score • 2.9m Tidal Range\n\nI recommend prioritizing **Site-7** for pilot 50 MW tidal turbine array deployment.' }
    ],
    canned: [
      "Cross-referencing bathymetry data with tidal current models, 3 new potential micro-sites within Zone-7 have been identified that could support 50 MW tidal arrays with estimated capacity factors of 28–34%.\n\nThe digital twin simulation indicates minimal disruption to the existing *Sardinella longiceps* migration corridor, with marine traffic disruption projected at only 14.2% — well within the MoES acceptable threshold of 25%.",
      "Current ocean current data from INCOIS shows the West India Coastal Current (WICC) is 15% stronger than the seasonal average. This improves energy yield projections for Sites 3, 5, and 7 by approximately 8–12%.\n\nHowever, increased current velocity also raises sediment transport rates, which may affect turbine maintenance schedules. The Digital Twin model recommends increasing maintenance intervals from quarterly to bi-monthly for the September–November period.",
      "Based on 10-year wave climate hindcasts from INCOIS, Site-3 (Gulf of Kutch) offers high energy density (24.2 kW/m wave crest), but extreme monsoon wave heights (>4.2m) require heavy gravity-based turbine foundations.\n\nSite-7 requires 35% lower structural steel per MW capacity while maintaining 87% of the annual energy production."
    ]
  },
  bio: {
    id: 'bio',
    name: 'Biodiversity & eDNA Specialist',
    tagline: 'Molecular Taxonomy, eDNA Species Matching & Migration Tracking',
    color: '#06B6D4',
    badgeClass: 'cyan',
    placeholder: 'Ask about eDNA reads, sardine migration, otolith morphometry, whale shark alerts...',
    suggestions: [
      '🧬 Latest eDNA detection trends',
      '🐟 Sardine migration forecast',
      '🔬 Otolith age estimation method',
      '🦈 Whale shark exclusion zones'
    ],
    initialMessages: [
      { role: 'user', text: 'What species are most frequently detected via eDNA near proposed energy sites?' },
      { role: 'ai', text: 'Across the 14 proposed marine energy sites, the top species catalogued via eDNA barcoding are:\n\n1. *Sardinella longiceps* (Indian Oil Sardine) — **847 detections** (Sample SM-eDNA-2024-1847)\n2. *Rastrelliger kanagurta* (Indian Mackerel) — **623 detections** (Sample SM-eDNA-2024-1843)\n3. *Stolephorus indicus* (Indian Anchovy) — **512 detections**\n4. *Decapterus russelli* (Indian Scad) — **389 detections**\n5. *Nemipterus japonicus* (Japanese Threadfin Bream) — **274 detections**\n\nSardine density shows a strong positive correlation (**r=0.87**) with Sea Surface Temperature (SST) in Zone-3.' }
    ],
    canned: [
      "The most recent eDNA analysis from Kanyakumari Station detected traces of *Rhincodon typus* (Whale Shark), a Schedule I protected species under the Wildlife Protection Act, 1972. This detection has been automatically flagged to the Biodiversity Impact Assessment module.\n\nExclusion zones for Site-9 have been updated accordingly, with a recommended 15 km buffer radius around the detection coordinates (8.08°N, 77.52°E).",
      "The federated model's latest aggregation shows improved species classification accuracy at 96.4% across all 3 partner institutes. Notably, the Agharkar Research Institute's coral reef habitat data improved shallow-water predictions without exposing raw biodiversity survey records.\n\nNext aggregation cycle is scheduled for 2026-08-25. The model currently covers 1,842 species with >85% confidence thresholds.",
      "Otolith morphometry analysis on *Sardinella longiceps* specimens collected off Kochi indicates a major axis length of 4.82 mm and aspect ratio of 2.03, corresponding to a 2–3 year age cohort. Morphometric growth curves indicate healthy population recruitment in Kerala coastal waters."
    ]
  }
};
