import { useState, useEffect, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import {
  MapContainer, TileLayer, CircleMarker, Popup, Polyline, Circle, LayerGroup, Polygon, useMap
} from 'react-leaflet';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Waves, Activity, Fish, Dna, MessageCircle, Radio, FlaskConical, Zap,
  Upload, Send, Shield, X, Globe, Bot, Microscope, ScanLine,
  Wind, ArrowUpRight, CheckCircle2, Clock, Eye, Radar, RefreshCw, Sliders, Cpu, Layers,
  Copy, Check, RotateCcw, Sparkles, Search, Compass, SlidersHorizontal, Anchor, Thermometer,
  Droplets, AlertTriangle, Sun, ShieldAlert, Volume2
} from 'lucide-react';
import './App.css';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & MOCK DATA
// ══════════════════════════════════════════════════════════════════════════════

const GEMINI_SYSTEM_PROMPT = `You are Sagar-Manthan AI, an intelligent ocean analytics assistant built for India's Ministry of Earth Sciences (MoES). You serve as the conversational interface for the Sagar-Manthan platform — India's first AI-driven unified platform for oceanographic, fisheries, and molecular biodiversity data with marine renewable energy site optimization.

Your knowledge base includes:
- Real-time data from 247 active ocean sensors (buoys, ARGO floats, CTD stations) across India's Exclusive Economic Zone
- A catalogue of 1,842 marine species identified through otolith morphometry and eDNA analysis
- 6,391 processed eDNA samples from Indian coastal waters
- 14 identified potential marine renewable energy sites along India's coastline
- Digital twin simulation models for tidal and wave energy impact assessment
- Federated learning models trained across CMLRE (Kochi), Fishery Survey of India (Mumbai), and Agharkar Research Institute (Pune)

Key facts you know:
- Zone 7 (off Kerala coast) has 42 GW theoretical wave energy potential with biodiversity impact score of only 2.1/10 — the most favorable ratio
- Zone 3 (Gulf of Kutch) has 31 GW potential with 3.4/10 impact score
- Top species by eDNA detection: Sardinella longiceps (847 detections), Rastrelliger kanagurta (623), Stolephorus indicus (512), Decapterus russelli (389), Nemipterus japonicus (274)
- Sardine density positively correlates with SST in Zone-3 (r=0.87)
- Arabian Sea shows 0.3°C warming trend over past 6 months, causing 12% northward shift in sardine spawning grounds
- Federated model classification accuracy: 96.4% across all partner institutes
- West India Coastal Current (WICC) is 15% stronger than seasonal average
- Whale Shark (Rhincodon typus, Schedule I protected) detected near Kanyakumari Station
- India's target: 30 GW offshore renewable energy by 2030 under National Offshore Wind Energy Policy

Respond with specific data, scientific names (italicized with *), Indian coastal locations, and real institutional references (INCOIS, NIOT, CMLRE, NIO). Keep responses informative but concise (2-4 paragraphs max). Use numbered lists for comparisons. Always be authoritative and data-driven.`;

const oceanTrendData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperature: +(26.5 + Math.sin(i / 4) * 2.3 + (Math.random() - 0.5) * 0.4).toFixed(1),
  salinity: +(34.8 + Math.cos(i / 5) * 0.8 + (Math.random() - 0.5) * 0.15).toFixed(2),
}));

const kpiSparkData = {
  sensors: [12, 15, 14, 18, 22, 20, 24].map((v, i) => ({ v })),
  species: [30, 42, 38, 55, 48, 52, 57].map((v, i) => ({ v })),
  edna: [200, 280, 310, 350, 290, 380, 340].map((v, i) => ({ v })),
  energy: [8, 9, 9, 10, 11, 12, 14].map((v, i) => ({ v })),
};

const initialAgentLogs = [
  { agent: 'Ingestion Agent', msg: '340 new records normalized from Buoy-12 (Arabian Sea)', color: 'cyan', time: '10:14:32' },
  { agent: 'Correlation Agent', msg: 'Flagged temperature anomaly (+2.1°C) near Site-7, cross-referencing ARGO data', color: 'amber', time: '10:13:58' },
  { agent: 'QA Agent', msg: 'Validated 98.2% of incoming eDNA reads from CMLRE Kochi station', color: 'seafoam', time: '10:13:21' },
  { agent: 'Taxonomy Agent', msg: 'Auto-classified 23 otolith specimens — 3 flagged for expert review', color: 'purple', time: '10:12:47' },
  { agent: 'Energy Siting Agent', msg: 'Updated tidal suitability scores for 5 zones using latest current data', color: 'amber', time: '10:11:55' },
  { agent: 'Ingestion Agent', msg: 'Synced 1,204 species occurrence records from OBIS India node', color: 'cyan', time: '10:11:12' },
  { agent: 'Anomaly Detector', msg: 'Salinity drop at Station-14 (Lakshadweep) — possible freshwater intrusion', color: 'amber', time: '10:10:33' },
  { agent: 'Federated Agent', msg: 'Model aggregation complete — 3 institutes contributed, raw data intact', color: 'seafoam', time: '10:09:48' },
  { agent: 'QA Agent', msg: 'Rejected 12 duplicate entries from manual survey upload (Mandapam)', color: 'purple', time: '10:09:02' },
  { agent: 'Correlation Agent', msg: 'Positive correlation (r=0.87): sardine density ↔ SST in Zone-3', color: 'cyan', time: '10:08:14' },
];

const mapMarkers = [
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

const oceanCurrents = {
  wicc: [[22, 68.5], [20, 70], [18, 71.5], [16, 73], [14, 74], [12, 75], [10, 76], [8.5, 77]],
  eicc: [[8.5, 78], [10, 80], [12, 81], [14, 82], [16, 83], [18, 84], [20, 86]],
  equatorial: [[5, 66], [6, 72], [7, 78], [6, 84], [5, 90]],
};

const migrationPaths = {
  sardine: [[16, 73.5], [14, 74.5], [12, 75.5], [10, 76.5], [9, 77.5], [8.5, 78]],
  mackerel: [[20, 71], [18, 72.5], [16, 73.5], [14, 75], [12, 76]],
};

const biodiversityZones = [
  { center: [9.0, 79.0], radius: 55000, name: 'Gulf of Mannar' },
  { center: [10.5, 72.3], radius: 45000, name: 'Lakshadweep' },
  { center: [8.3, 77.2], radius: 30000, name: 'Kanyakumari' },
  { center: [11.5, 92.5], radius: 65000, name: 'Andaman & Nicobar' },
];

const specimenData = [
  {
    id: 0,
    name: 'Sardinella longiceps',
    commonName: 'Indian Oil Sardine',
    match: '94.3%',
    sampleId: 'SM-OTO-2024-0847',
    location: 'Kochi, Kerala',
    length: '4.82 mm',
    width: '2.37 mm',
    area: '8.94 mm²',
    perimeter: '13.21 mm',
    aspectRatio: '2.03',
    circularity: '0.644',
    age: '2–3 years',
    rx: 110,
    ry: 65,
  },
  {
    id: 1,
    name: 'Rastrelliger kanagurta',
    commonName: 'Indian Mackerel',
    match: '91.7%',
    sampleId: 'SM-OTO-2024-0912',
    location: 'Mangalore, Karnataka',
    length: '5.14 mm',
    width: '2.68 mm',
    area: '10.82 mm²',
    perimeter: '14.65 mm',
    aspectRatio: '1.92',
    circularity: '0.631',
    age: '3–4 years',
    rx: 118,
    ry: 72,
  },
  {
    id: 2,
    name: 'Stolephorus indicus',
    commonName: 'Indian Anchovy',
    match: '88.2%',
    sampleId: 'SM-OTO-2024-0734',
    location: 'Kochi, Kerala',
    length: '3.21 mm',
    width: '1.45 mm',
    area: '3.66 mm²',
    perimeter: '8.92 mm',
    aspectRatio: '2.21',
    circularity: '0.582',
    age: '1–2 years',
    rx: 85,
    ry: 48,
  },
  {
    id: 3,
    name: 'Nemipterus japonicus',
    commonName: 'Japanese Threadfin Bream',
    match: '85.6%',
    sampleId: 'SM-OTO-2024-1045',
    location: 'Visakhapatnam, AP',
    length: '6.42 mm',
    width: '3.88 mm',
    area: '19.56 mm²',
    perimeter: '18.41 mm',
    aspectRatio: '1.65',
    circularity: '0.724',
    age: '4–5 years',
    rx: 130,
    ry: 82,
  },
  {
    id: 4,
    name: 'Decapterus russelli',
    commonName: 'Indian Scad',
    match: '82.1%',
    sampleId: 'SM-OTO-2024-0621',
    location: 'Goa Coast',
    length: '4.15 mm',
    width: '2.10 mm',
    area: '6.84 mm²',
    perimeter: '11.45 mm',
    aspectRatio: '1.98',
    circularity: '0.650',
    age: '2 years',
    rx: 98,
    ry: 58,
  },
  {
    id: 5,
    name: 'Scomberomorus guttatus',
    commonName: 'Indo-Pacific King Mackerel',
    match: '79.4%',
    sampleId: 'SM-OTO-2024-1102',
    location: 'Mumbai, Maharashtra',
    length: '7.85 mm',
    width: '4.12 mm',
    area: '25.40 mm²',
    perimeter: '22.30 mm',
    aspectRatio: '1.90',
    circularity: '0.640',
    age: '5+ years',
    rx: 142,
    ry: 88,
  }
];

const dnaMatchResults = [
  {
    id: 0,
    species: 'Sardinella longiceps',
    commonName: 'Indian Oil Sardine',
    match: '98.7%',
    location: 'Off Kochi, Kerala',
    depth: '12m',
    sample: 'SM-eDNA-2024-1847',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Clupeiformes', 'Sardinella'],
    targetSeq: 'ATCGTTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGC',
    refSeq:    'ATCGTTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGC',
    depthProfile: [
      { depth: '5m', copies: 14200 },
      { depth: '15m', copies: 28900 },
      { depth: '30m', copies: 18500 },
      { depth: '50m', copies: 4200 },
      { depth: '100m', copies: 800 },
    ]
  },
  {
    id: 1,
    species: 'Rastrelliger kanagurta',
    commonName: 'Indian Mackerel',
    match: '95.2%',
    location: 'Malvan, Maharashtra',
    depth: '28m',
    sample: 'SM-eDNA-2024-1843',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Scombriformes', 'Rastrelliger'],
    targetSeq: 'TTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGCATCG',
    refSeq:    'TTAGGCCACTGAAATCGGTATACGCCTAATGCGAATTTCGCAGCTTCG',
    depthProfile: [
      { depth: '5m', copies: 8200 },
      { depth: '15m', copies: 19400 },
      { depth: '30m', copies: 31200 },
      { depth: '50m', copies: 14500 },
      { depth: '100m', copies: 2100 },
    ]
  },
  {
    id: 2,
    species: 'Thunnus albacares',
    commonName: 'Yellowfin Tuna',
    match: '89.1%',
    location: 'Lakshadweep Sea',
    depth: '85m',
    sample: 'SM-eDNA-2024-1839',
    taxonomy: ['Animalia', 'Chordata', 'Actinopterygii', 'Scombriformes', 'Thunnus'],
    targetSeq: 'GGTATACGCCTAATGCGAATTTCGCAGCATCGTTAGGCCACTGAAATC',
    refSeq:    'GGTATACGCCTAATGCGAATTTCGCAGCATCCTTAGGCCACTGAAACC',
    depthProfile: [
      { depth: '5m', copies: 1200 },
      { depth: '15m', copies: 4500 },
      { depth: '30m', copies: 12800 },
      { depth: '50m', copies: 24600 },
      { depth: '100m', copies: 38200 },
    ]
  },
];

const initialChat = [
  { role: 'user', text: 'Which zones have the highest wave energy potential with minimal biodiversity impact?' },
  { role: 'ai', text: 'Based on current data, Zone 7 (off Kerala coast) shows 42 GW theoretical potential with a biodiversity impact score of only 2.1/10 — the most favorable ratio in the dataset. Zone 3 (Gulf of Kutch) follows with 31 GW potential and a 3.4/10 impact score.\n\nI recommend prioritizing Site-7 for pilot assessments given the optimal energy-to-impact ratio.' },
  { role: 'user', text: 'What species are most frequently detected via eDNA near proposed energy sites?' },
  { role: 'ai', text: 'Across the 14 proposed sites, the top 5 species by eDNA detection frequency:\n\n1. *Sardinella longiceps* (Indian Oil Sardine) — 847 detections\n2. *Rastrelliger kanagurta* (Indian Mackerel) — 623 detections\n3. *Stolephorus indicus* (Indian Anchovy) — 512 detections\n4. *Decapterus russelli* (Indian Scad) — 389 detections\n5. *Nemipterus japonicus* (Japanese Threadfin Bream) — 274 detections\n\nSardine density shows positive correlation (r=0.87) with SST in Zone-3, suggesting seasonal migration patterns should inform turbine operational scheduling.' },
];

const promptSuggestions = [
  'Wave energy potential by zone',
  'Biodiversity near Kerala sites',
  'Latest eDNA detection trends',
  'Sardine migration forecast',
  'Federated learning model status',
  'Compare Site-7 vs Site-3',
];

const cannedResponses = [
  "Based on the latest satellite SST data and in-situ ARGO float measurements, the Arabian Sea has shown a 0.3°C warming trend over the past 6 months. This correlates with a 12% northward shift in sardine spawning grounds, which the Energy Siting Agent has flagged for Site-5 reassessment.\n\nThe thermal anomaly is most pronounced at 15–20m depth between latitudes 12°N and 16°N. INCOIS's seasonal outlook suggests this warming may persist through the northeast monsoon period.",
  "The federated model's latest aggregation shows improved species classification accuracy at 96.4% across all 3 partner institutes. Notably, the Agharkar Research Institute's coral reef habitat data improved shallow-water predictions without exposing raw biodiversity survey records.\n\nNext aggregation cycle is scheduled for 2026-08-25. The model currently covers 1,842 species with >85% confidence thresholds.",
  "Cross-referencing bathymetry data with tidal current models, 3 new potential micro-sites within Zone-7 have been identified that could support 50 MW tidal arrays with estimated capacity factors of 28–34%.\n\nThe digital twin simulation indicates minimal disruption to the existing *Sardinella longiceps* migration corridor, with marine traffic disruption projected at only 14.2% — well within the MoES acceptable threshold of 25%.",
  "The most recent eDNA analysis from Kanyakumari Station detected traces of *Rhincodon typus* (Whale Shark), a Schedule I protected species under the Wildlife Protection Act, 1972. This detection has been automatically flagged to the Biodiversity Impact Assessment module.\n\nExclusion zones for Site-9 have been updated accordingly, with a recommended 15 km buffer radius around the detection coordinates (8.08°N, 77.52°E).",
  "Current ocean current data from INCOIS shows the West India Coastal Current (WICC) is 15% stronger than the seasonal average. This improves energy yield projections for Sites 3, 5, and 7 by approximately 8–12%.\n\nHowever, increased current velocity also raises sediment transport rates, which may affect turbine maintenance schedules. The Digital Twin model recommends increasing maintenance intervals from quarterly to bi-monthly for the September–November period.",
];

// ══════════════════════════════════════════════════════════════════════════════
// DUAL BOT CONFIGURATIONS & SYSTEM PROMPTS
// ══════════════════════════════════════════════════════════════════════════════

const GEMINI_SYSTEM_PROMPTS = {
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

const BOT_CONFIG = {
  energy: {
    id: 'energy',
    name: 'Energy & Siting Advisor',
    tagline: 'Offshore Renewable Energy, Bathymetry & Digital Twin Siting',
    icon: Zap,
    color: '#f59e0b',
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
    icon: Dna,
    color: '#22d3ee',
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

// ══════════════════════════════════════════════════════════════════════════════
// GEMINI HELPER WITH MODEL FALLBACKS
// ══════════════════════════════════════════════════════════════════════════════

let geminiChat = null;
let activeGeminiModel = null;

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash-exp'
];

async function initGeminiChat(apiKey, botMode = 'energy') {
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: GEMINI_SYSTEM_PROMPTS[botMode] || GEMINI_SYSTEM_PROMPTS.energy,
      });
      geminiChat = model.startChat({ history: [] });
      activeGeminiModel = modelName;
      console.log(`Successfully initialized Gemini chat (${botMode}) with model: ${modelName}`);
      return geminiChat;
    } catch (err) {
      console.warn(`Model init failed for ${modelName}:`, err);
    }
  }
  throw new Error('Could not initialize Gemini model.');
}

async function sendGeminiMessage(message, botMode = 'energy') {
  if (!geminiChat) return null;
  try {
    const result = await geminiChat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    console.error('Gemini sendMessage error:', err);
    const pool = BOT_CONFIG[botMode].canned;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT MARKDOWN RENDERER
// ══════════════════════════════════════════════════════════════════════════════

function formatInlineMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 5px;border-radius:4px;font-family:var(--font-mono);font-size:0.75rem">$1</code>');
}

function FormattedChatText({ text }) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return (
    <div className="chat-formatted">
      {paragraphs.map((p, i) => {
        if (p.includes('\n1. ') || p.includes('\n- ') || p.startsWith('1. ') || p.startsWith('- ')) {
          const lines = p.split('\n');
          return (
            <ul key={i}>
              {lines.map((line, j) => {
                const cleanLine = line.replace(/^(\d+\.|\-)\s*/, '');
                return <li key={j} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleanLine) }} />;
              })}
            </ul>
          );
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(p) }} />;
      })}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER HOOK
// ══════════════════════════════════════════════════════════════════════════════

function useAnimatedCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const numTarget = typeof target === 'string' ? parseInt(target.replace(/,/g, '')) : target;

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * numTarget));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [numTarget, duration]);

  return count.toLocaleString();
}


// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGuideModal, setShowGuideModal] = useState(true);
  const [mapLayers, setMapLayers] = useState({
    temperature: true,
    currents: true,
    migration: true,
    biodiversity: true,
    traffic: true,
    energy: true,
    eez: true,
  });
  const [turbineCapacity, setTurbineCapacity] = useState(50);
  const [activeBot, setActiveBot] = useState('energy'); // 'energy' or 'bio'
  const [energyMessages, setEnergyMessages] = useState(BOT_CONFIG.energy.initialMessages);
  const [bioMessages, setBioMessages] = useState(BOT_CONFIG.bio.initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logEntries, setLogEntries] = useState(initialAgentLogs);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const chatEndRef = useRef(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Handle Tab Switch & trigger Official Guide popup
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowGuideModal(true);
  };

  // Init Gemini from env key
  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (key && !geminiConnected) {
      initGeminiChat(key, activeBot).then(() => setGeminiConnected(true)).catch(() => {});
    }
  }, [activeBot]);

  // Live agent log
  useEffect(() => {
    const msgs = [
      { agent: 'Ingestion Agent', msg: 'Processing real-time CTD data from INS Sarvekshak', color: 'cyan' },
      { agent: 'Correlation Agent', msg: 'Chlorophyll bloom correlates with upwelling near Site-3', color: 'amber' },
      { agent: 'QA Agent', msg: 'Batch validation: 847 records, 99.1% pass rate', color: 'seafoam' },
      { agent: 'Energy Siting Agent', msg: 'Wave height forecast integrated — Site-7 optimal: Mar–May', color: 'amber' },
      { agent: 'Taxonomy Agent', msg: 'Morphometric DB updated with 15 new reference specimens', color: 'purple' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLogEntries(prev => [{ ...msgs[i % msgs.length], time: ts }, ...prev.slice(0, 14)]);
      i++;
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [energyMessages, bioMessages, isTyping, activeBot]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setIsTyping(true);

    if (activeBot === 'energy') {
      setEnergyMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    } else {
      setBioMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    }

    if (geminiConnected) {
      const resp = await sendGeminiMessage(userMsg, activeBot);
      const reply = resp || 'No response received from model.';
      if (activeBot === 'energy') {
        setEnergyMessages(prev => [...prev, { role: 'ai', text: reply }]);
      } else {
        setBioMessages(prev => [...prev, { role: 'ai', text: reply }]);
      }
      setIsTyping(false);
    } else {
      setTimeout(() => {
        const pool = BOT_CONFIG[activeBot].canned;
        const text = pool[Math.floor(Math.random() * pool.length)];
        if (activeBot === 'energy') {
          setEnergyMessages(prev => [...prev, { role: 'ai', text }]);
        } else {
          setBioMessages(prev => [...prev, { role: 'ai', text }]);
        }
        setIsTyping(false);
      }, 1000 + Math.random() * 600);
    }
  }, [chatInput, isTyping, geminiConnected, activeBot]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); }
  };

  const toggleLayer = (layer) => setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  // Digital Twin formulas
  const trafficDisruption = Math.min(95, (turbineCapacity * 0.38 + Math.sin(turbineCapacity / 20) * 5)).toFixed(1);
  const biodiversityImpact = Math.min(9.9, (turbineCapacity * 0.042 + Math.log(turbineCapacity + 1) * 0.3)).toFixed(1);
  const annualEnergy = Math.round(turbineCapacity * 2628 * (0.28 + turbineCapacity * 0.0005));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'map', label: 'GIS Map', icon: Globe },
    { id: 'otolith', label: 'Otolith & Taxonomy', icon: Microscope },
    { id: 'edna', label: 'eDNA & Digital Twin', icon: Dna },
    { id: 'chat', label: 'Ask Sagar-Manthan', icon: MessageCircle },
  ];

  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' });

  // Landing page handlers
  const handleLandingEnter = () => {
    setShowLanding(false);
    setShowGuideModal(true);
  };

  const handleLandingNavigate = (tabId) => {
    setActiveTab(tabId);
    setShowLanding(false);
    setShowGuideModal(true);
  };

  // Show landing page
  if (showLanding) {
    return <LandingPage onEnter={handleLandingEnter} onNavigate={handleLandingNavigate} />;
  }

  return (
    <>
      <div className="ocean-bg" />

      {/* Official Page Guide Modal Popup for Govt Officials */}
      {showGuideModal && (
        <GovtOfficialGuideModal
          tabId={activeTab}
          onClose={() => setShowGuideModal(false)}
        />
      )}

      {/* ── Navbar ── */}
      <nav className="navbar" id="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo"><Waves size={20} /></div>
          <div>
            <div className="navbar-title">Sagar-Manthan</div>
            <div className="navbar-tagline">Deep Ocean Data Analytics</div>
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-clock">{timeStr} IST</div>
          <div className="status-badge green"><div className="status-pulse" /> Online</div>
          <div className="navbar-team"><Radar size={13} /> <span>Team Orbit</span>&nbsp;• SIH2026 Internal Hackathon</div>
        </div>
      </nav>

      {/* ── Tabs & Official Guide Trigger Button ── */}
      <div className="tab-nav" id="tab-nav">
        <div className="tab-buttons-group">
          {tabs.map(tab => (
            <button key={tab.id} id={`tab-${tab.id}`}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}>
              <tab.icon />{tab.label}
            </button>
          ))}
        </div>

        <button
          className="govt-guide-trigger-btn"
          onClick={() => setShowGuideModal(true)}
          title="Open Official Module Briefing & Guidance"
        >
          <Anchor size={14} /> Official Page Briefing
        </button>
      </div>

      {/* ── Content ── */}
      <main className="main-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewDashboard logEntries={logEntries} />}
        {activeTab === 'map' && <GISMap layers={mapLayers} toggleLayer={toggleLayer} />}
        {activeTab === 'otolith' && <OtolithModule />}
        {activeTab === 'edna' && <EDNAModule tc={turbineCapacity} setTc={setTurbineCapacity} td={trafficDisruption} bi={biodiversityImpact} ae={annualEnergy} />}
        {activeTab === 'chat' && (
          <ChatModule
            activeBot={activeBot}
            setActiveBot={setActiveBot}
            messages={activeBot === 'energy' ? energyMessages : bioMessages}
            input={chatInput}
            setInput={setChatInput}
            onSend={handleSendChat}
            onKeyDown={handleKeyDown}
            isTyping={isTyping}
            chatEndRef={chatEndRef}
            geminiConnected={geminiConnected}
            setMessages={activeBot === 'energy' ? setEnergyMessages : setBioMessages}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <span>Sagar-Manthan</span> — Developed by Team Orbit for SIH2026 Internal Hackathon &nbsp;•&nbsp;
        Ministry of Earth Sciences &nbsp;•&nbsp; INCOIS &nbsp;•&nbsp; Government of India
      </footer>
    </>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 1. OVERVIEW DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

function MiniSparkline({ data, color }) {
  return (
    <div className="kpi-sparkline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, color, change, sparkData, sparkColor }) {
  const animated = useAnimatedCounter(value);
  return (
    <div className={`kpi-card ${color}`} id={`kpi-${color}`}>
      <div className="kpi-top">
        <div className={`kpi-icon ${color}`}><Icon /></div>
        {sparkData && <MiniSparkline data={sparkData} color={sparkColor} />}
      </div>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`}>{animated}</div>
      <div className="kpi-change up"><ArrowUpRight size={11} />{change}</div>
    </div>
  );
}

function OverviewDashboard({ logEntries }) {
  return (
    <div className="tab-content" id="overview-dashboard">
      <div className="section-header">
        <h2>Platform Overview</h2>
        <p>Real-time monitoring of India's ocean data infrastructure</p>
      </div>

      <div className="kpi-grid">
        <KPICard label="Active Sensors" value="247" icon={Radio} color="cyan" change="+12 this week" sparkData={kpiSparkData.sensors} sparkColor="#22d3ee" />
        <KPICard label="Species Catalogued" value="1842" icon={Fish} color="seafoam" change="+57 this month" sparkData={kpiSparkData.species} sparkColor="#2dd4bf" />
        <KPICard label="eDNA Samples Processed" value="6391" icon={FlaskConical} color="purple" change="+340 today" sparkData={kpiSparkData.edna} sparkColor="#a78bfa" />
        <KPICard label="Energy Sites Identified" value="14" icon={Zap} color="amber" change="+2 this quarter" sparkData={kpiSparkData.energy} sparkColor="#f59e0b" />
      </div>

      <div className="dashboard-grid">
        <div className="card" id="agent-log-card">
          <div className="card-header">
            <div className="card-title"><Bot size={15} /> AI Agent Activity Log</div>
            <div className="status-badge green"><div className="status-pulse" /> Live</div>
          </div>
          <div className="agent-log">
            {logEntries.map((entry, i) => (
              <div key={`${entry.time}-${i}`} className="log-entry">
                <div className={`log-dot ${entry.color}`} />
                <div className="log-content">
                  <div className={`log-agent ${entry.color}`}>{entry.agent}</div>
                  <div className="log-message">{entry.msg}</div>
                </div>
                <div className="log-time">{entry.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" id="ocean-trends-chart">
          <div className="card-header">
            <div className="card-title"><Activity size={15} /> Ocean Temperature & Salinity</div>
            <div className="status-badge amber"><Clock size={10} /> 24h</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oceanTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="tG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" stroke="#4a5568" fontSize={10} tickLine={false} />
                <YAxis yAxisId="t" stroke="#4a5568" fontSize={10} tickLine={false} domain={[23, 30]} />
                <YAxis yAxisId="s" orientation="right" stroke="#4a5568" fontSize={10} tickLine={false} domain={[33.5, 36]} />
                <Tooltip contentStyle={{ background: 'rgba(6,14,24,0.95)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '8px', fontSize: '11px', color: '#e2e8f0' }} />
                <Legend iconType="line" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Area yAxisId="t" type="monotone" dataKey="temperature" stroke="#22d3ee" fill="url(#tG)" strokeWidth={1.5} name="Temp (°C)" dot={false} />
                <Area yAxisId="s" type="monotone" dataKey="salinity" stroke="#2dd4bf" fill="url(#sG)" strokeWidth={1.5} name="Salinity (PSU)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 2. GIS MAP (React-Leaflet + Station Telemetry Inspector)
// ══════════════════════════════════════════════════════════════════════════════

const eezPolygon = [
  [23.5, 68.0], [22.2, 67.5], [20.0, 67.5], [17.5, 68.0], [15.0, 69.0],
  [12.0, 70.0], [9.5, 71.5], [7.5, 74.0], [5.8, 77.0], [6.2, 80.0],
  [8.5, 82.5], [11.5, 84.5], [14.5, 86.5], [17.8, 88.5], [20.5, 89.2],
  [21.5, 89.0], [21.5, 87.2], [20.0, 86.5], [17.8, 83.5], [15.5, 81.0],
  [12.5, 80.0], [9.8, 79.5], [8.1, 77.5], [9.5, 75.5], [12.8, 74.0],
  [15.2, 73.5], [18.9, 71.5], [22.5, 69.5], [23.5, 68.0]
];

function MapInit() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

function MapFlyTo({ center, flyCount }) {
  const map = useMap();
  useEffect(() => {
    if (center && flyCount > 0) {
      map.flyTo(center, 7, { duration: 1.2 });
    }
  }, [flyCount]);
  return null;
}

// ══════════════════════════════════════════════════════════════════════════════
// GOVT OFFICIAL PAGE GUIDANCE MODAL
// ══════════════════════════════════════════════════════════════════════════════

const PAGE_BRIEFINGS = {
  overview: {
    title: 'Platform Overview & Live Ocean Ingestion',
    target: 'Ministry of Earth Sciences (MoES) & Operational Command',
    purpose: 'Provides executive-level situational awareness across India’s 2.37M km² Exclusive Economic Zone (EEZ).',
    expectations: [
      'Monitor 247 real-time buoy stations, CTD profilers, and ARGO float feeds.',
      'Track automated AI Agent Activity Logs (Ingestion, Anomaly, QA, Correlation agents).',
      'Inspect 24-hour sea surface temperature trends and salinity anomalies.',
      'Evaluate overall platform uptime (99.8%) and cross-institutional synchronization.'
    ],
    action: 'Review live log alerts for thermal anomalies before issuing marine advisories.'
  },
  map: {
    title: 'GIS Geospatial Ocean Intelligence Map',
    target: 'Offshore Renewable Siting & Maritime Planning Committee',
    purpose: 'Interactive geospatial analysis combining bathymetry, ocean current velocity, fish corridors, and renewable siting suitability.',
    expectations: [
      'Toggle 7 multi-spectral data layers (Sea Temp, Currents, Migration, Biodiversity, Traffic, Wave Energy, Bathymetry).',
      'Click any coastal station pin to inspect real-time telemetry (SST, Tidal amplitude, Energy suitability score).',
      'Analyze the West India Coastal Current (WICC) velocity vectors alongside candidate energy sites.',
      'Identify 15 km protected wildlife exclusion zones around Schedule I species detections.'
    ],
    action: 'Use the Data Layers toggle panel to cross-reference Wave Energy potential with Biodiversity indices.'
  },
  otolith: {
    title: 'Otolith Morphometry & AI Taxonomy Classifier',
    target: 'Centre for Marine Living Resources (CMLRE) & Fisheries Authorities',
    purpose: 'Automated AI classification of fish species and age cohort estimation via ear-stone shape analysis.',
    expectations: [
      'Upload specimen scans or select catalogued specimens (e.g. Sardinella longiceps).',
      'Inspect computer-vision morphometric parameters (Major axis length, circularity, area, aspect ratio).',
      'Review AI confidence scores (SAGAR-VISION v3.2 model) and secondary species matches.',
      'Trace full taxonomic lineage from Kingdom down to species rank.'
    ],
    action: 'Verify otolith morphometric variance before confirming commercial stock quota limits.'
  },
  edna: {
    title: 'eDNA Barcoding & Digital Twin Hydrodynamic Simulator',
    target: 'National Biodiversity Authority & Environmental Assessment Board',
    purpose: 'Molecular eDNA species barcoding coupled with 3D hydrodynamic digital twin impact simulation.',
    expectations: [
      'Compare target eDNA base-pair sequences against GenBank reference barcodes.',
      'Simulate proposed tidal turbine capacity (10 MW – 200 MW) using the slider.',
      'Evaluate simulated marine traffic disruption %, noise level (dB), and benthic footprint (ha).',
      'Monitor differential-privacy federated learning aggregations across CMLRE, FSI, and ARI.'
    ],
    action: 'Adjust turbine capacity to ensure biodiversity impact score remains under acceptable 4.0/10 threshold.'
  },
  chat: {
    title: 'Ask Sagar-Manthan Dual AI Decision Support',
    target: 'Policy Officers, Researchers & Regional Directorate Staff',
    purpose: 'Conversational natural-language interface trained on oceanographic datasets and federal policy directives.',
    expectations: [
      'Switch between Energy & Siting Advisor bot and Biodiversity Specialist bot.',
      'Query real-time wave potential ratios, species migration shifts, or Schedule I alerts.',
      'Leverage Gemini 1.5 Pro / Flash models for data synthesis and official report drafts.',
      'Click prompt suggestion chips for quick policy comparisons (e.g. Site-7 vs Site-3).'
    ],
    action: 'Ask specific quantitative queries for immediate inclusion in Ministerial briefing notes.'
  }
};

function GovtOfficialGuideModal({ tabId, onClose }) {
  const briefing = PAGE_BRIEFINGS[tabId] || PAGE_BRIEFINGS.overview;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="guide-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-gov-header">
          <div className="gov-emblem">
            <Anchor size={16} />
          </div>
          <div>
            <div className="gov-agency">OFFICIAL BRIEFING & USER GUIDE</div>
            <div className="gov-ministry">Ministry of Earth Sciences • Government of India</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <h3 className="module-title">{briefing.title}</h3>
          <div className="target-badge">
            <strong>Target Audience:</strong> {briefing.target}
          </div>

          <div className="briefing-section">
            <h4>🏛️ Primary Purpose</h4>
            <p>{briefing.purpose}</p>
          </div>

          <div className="briefing-section">
            <h4>🎯 What You Can Inspect & Perform On This Page</h4>
            <ul>
              {briefing.expectations.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>

          <div className="action-callout">
            <strong>💡 Recommended Directive:</strong> {briefing.action}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn" onClick={onClose}>
            Understood • Proceed to Module
          </button>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 2. GIS MAP
// ══════════════════════════════════════════════════════════════════════════════

function GISMap({ layers, toggleLayer }) {
  const [selectedStation, setSelectedStation] = useState(mapMarkers[5]); // Default to Site-7 (Kerala Coast)
  const [flyCount, setFlyCount] = useState(0);

  const markerColor = (type) => {
    if (type === 'energy') return '#F59E0B'; // Amber for Energy
    if (type === 'biodiversity') return '#10B981'; // Emerald for Bio
    return '#06B6D4'; // Cyan for Sensors
  };

  const layerConfig = [
    { key: 'temperature', label: 'Sea Temperature (SST)', icon: Thermometer, color: '#F59E0B', desc: 'Satellite SST thermal contours' },
    { key: 'currents', label: 'Ocean Currents (WICC/EICC)', icon: Wind, color: '#06B6D4', desc: 'Velocity vector streamlines' },
    { key: 'migration', label: 'Fish Migration Corridors', icon: Fish, color: '#10B981', desc: 'Sardinella seasonal routes' },
    { key: 'biodiversity', label: 'Biodiversity Sanctuaries', icon: Eye, color: '#2DD4BF', desc: 'Protected marine exclusion zones' },
    { key: 'traffic', label: 'Marine Traffic & Shipping', icon: Anchor, color: '#6366F1', desc: 'Commercial vessel transits' },
    { key: 'energy', label: 'Wave Energy Siting', icon: Zap, color: '#F59E0B', desc: 'Offshore turbine candidate sites' },
    { key: 'eez', label: 'Bathymetry & 200 NM EEZ', icon: Compass, color: '#0D9488', desc: 'Maritime boundary limits' },
    { key: 'chlorophyll', label: 'Chlorophyll-a & Plankton', icon: FlaskConical, color: '#84CC16', desc: 'Potential Fishing Zones (PFZ)' },
    { key: 'salinity', label: 'Salinity & River Plumes', icon: Droplets, color: '#3B82F6', desc: 'Ganga & Godavari plume runoff' },
    { key: 'cyclone', label: 'Cyclone Alert Warning', icon: AlertTriangle, color: '#EF4444', desc: 'INCOIS storm surge tracks' },
    { key: 'coral', label: 'Coral Thermal Stress', icon: Sun, color: '#EC4899', desc: 'Degree Heating Weeks (DHW)' },
    { key: 'acoustic', label: 'Subsurface Hydrophone Grid', icon: Radio, color: '#8B5CF6', desc: 'Acoustic listening nodes' },
  ];

  return (
    <div className="tab-content" id="gis-map-section">
      <div className="map-section-header">
        <h2>EXPLORE INDIA'S OCEAN</h2>
        <p>Interactive Ocean Intelligence Map • Real-time Hydrodynamic Data & EEZ Monitoring</p>
      </div>

      <div className="gis-map-container">
        {/* Left Side Data Layers Toggle Panel */}
        <div className="map-side-panel left-panel">
          <div className="panel-title">DATA LAYERS ({layerConfig.length})</div>
          <div className="layer-toggle-list">
            {layerConfig.map(l => {
              const LIcon = l.icon;
              const isChecked = layers[l.key] ?? true;
              return (
                <div key={l.key} className="layer-toggle-row">
                  <div className="layer-info-group">
                    <LIcon size={14} style={{ color: l.color, marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span className="layer-label">{l.label}</span>
                      <span className="layer-desc">{l.desc}</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleLayer(l.key)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              );
            })}
          </div>

          <button
            className="reset-view-btn"
            onClick={() => {
              setSelectedStation(mapMarkers[5]);
              setFlyCount(c => c + 1);
            }}
          >
            RESET VIEW & FILTERS
          </button>
        </div>

        {/* Center Map View */}
        <div className="map-view-center">
          <MapContainer
            center={[15.5, 77.5]}
            zoom={4.8}
            minZoom={4.2}
            maxZoom={12}
            maxBounds={[[0, 45], [32, 105]]}
            maxBoundsViscosity={0.8}
            style={{ height: '540px', width: '100%', borderRadius: '14px' }}
            zoomControl={true}
            attributionControl={false}
            id="leaflet-map"
          >
            <MapInit />
            {/* CARTO Light Voyager Basemap for clean light theme GIS mapping */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd" maxZoom={19}
            />

            <MapFlyTo center={selectedStation ? [selectedStation.lat, selectedStation.lng] : null} flyCount={flyCount} />

            {/* EEZ Polygon */}
            {layers.eez && (
              <Polygon
                positions={eezPolygon}
                pathOptions={{ color: '#0D9488', weight: 1.5, opacity: 0.7, dashArray: '6 6', fillColor: '#0D9488', fillOpacity: 0.04 }}
              />
            )}

            {/* Ocean Currents */}
            {(layers.currents ?? true) && (
              <LayerGroup>
                <Polyline positions={oceanCurrents.wicc} pathOptions={{ color: '#06B6D4', weight: 2.5, opacity: 0.7, dashArray: '8 6' }} />
                <Polyline positions={oceanCurrents.eicc} pathOptions={{ color: '#06B6D4', weight: 2, opacity: 0.6, dashArray: '8 6' }} />
              </LayerGroup>
            )}

            {/* Migration Paths */}
            {(layers.migration ?? true) && (
              <LayerGroup>
                <Polyline positions={migrationPaths.sardine} pathOptions={{ color: '#10B981', weight: 2.5, opacity: 0.7, dashArray: '4 8' }} />
              </LayerGroup>
            )}

            {/* Chlorophyll-a / PFZ Corridors */}
            {layers.chlorophyll && (
              <LayerGroup>
                <Polyline positions={[[12.0, 74.0], [14.0, 73.0], [16.5, 72.0]]} pathOptions={{ color: '#84CC16', weight: 3, opacity: 0.7, dashArray: '6 6' }} />
              </LayerGroup>
            )}

            {/* Salinity / River Plumes */}
            {layers.salinity && (
              <LayerGroup>
                <Circle center={[16.5, 82.5]} radius={60000} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.15, weight: 1 }} />
              </LayerGroup>
            )}

            {/* Cyclone Alert Track */}
            {layers.cyclone && (
              <LayerGroup>
                <Polyline positions={[[11.0, 88.0], [14.0, 85.0], [17.5, 83.0]]} pathOptions={{ color: '#EF4444', weight: 3, opacity: 0.8, dashArray: '4 4' }} />
              </LayerGroup>
            )}

            {/* Coral Bleaching Stress */}
            {layers.coral && (
              <LayerGroup>
                <Circle center={[9.0, 78.8]} radius={45000} pathOptions={{ color: '#EC4899', fillColor: '#EC4899', fillOpacity: 0.2, weight: 1.5 }} />
              </LayerGroup>
            )}

            {/* Biodiversity Hotspots */}
            {(layers.biodiversity ?? true) && (
              <LayerGroup>
                {biodiversityZones.map((zone, i) => (
                  <Circle key={i} center={zone.center} radius={zone.radius}
                    pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.12, weight: 1.5, opacity: 0.4 }} />
                ))}
              </LayerGroup>
            )}

            {/* Markers */}
            {mapMarkers.map(marker => (
              <CircleMarker
                key={marker.id}
                center={[marker.lat, marker.lng]}
                radius={selectedStation?.id === marker.id ? 10 : 7}
                pathOptions={{
                  color: markerColor(marker.type),
                  fillColor: selectedStation?.id === marker.id ? '#F59E0B' : markerColor(marker.type),
                  fillOpacity: selectedStation?.id === marker.id ? 1 : 0.85,
                  weight: selectedStation?.id === marker.id ? 3 : 2
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedStation(marker);
                    setFlyCount(c => c + 1);
                  }
                }}
              >
                <Popup>
                  <div className="map-popup-content">
                    <h3>{marker.name}</h3>
                    <div className="popup-row"><span className="popup-label">Depth</span><span className="popup-value">{marker.depth}</span></div>
                    <div className="popup-row"><span className="popup-label">Tidal</span><span className="popup-value">{marker.tidal}</span></div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Interactive Map Color Legend Explanation Box */}
          <div className="map-color-explanation">
            <div className="exp-title">EXPLANATION OF MAP COLOR CODES & MARKERS</div>
            <div className="exp-grid">
              <div className="exp-item">
                <span className="exp-dot amber"></span>
                <span><strong>Amber Marker:</strong> High Wave/Tidal Energy Site (&gt;8.0 Suitability)</span>
              </div>
              <div className="exp-item">
                <span className="exp-dot green"></span>
                <span><strong>Emerald Zone:</strong> Marine Biodiversity & Protected Hotspot Area</span>
              </div>
              <div className="exp-item">
                <span className="exp-dot cyan"></span>
                <span><strong>Bright Cyan Point:</strong> Real-time CTD Sensor / ARGO Buoy Station</span>
              </div>
              <div className="exp-item">
                <span className="exp-line cyan"></span>
                <span><strong>Cyan Streamlines:</strong> WICC / EICC Velocity Current Flow Vectors</span>
              </div>
              <div className="exp-item">
                <span className="exp-line green"></span>
                <span><strong>Lime Dashlines:</strong> Sardinella Migration & Potential Fishing Zone</span>
              </div>
              <div className="exp-item">
                <span className="exp-line red"></span>
                <span><strong>Red Dashlines:</strong> Cyclone Storm Surge Early Warning Track</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Station Details Card Panel */}
        <div className="map-side-panel right-panel">
          <div className="detail-header">
            <h3>{selectedStation.name.toUpperCase()}</h3>
            <span className="detail-country">INDIA</span>
          </div>

          <div className="detail-media-box">
            <img
              src="/images/kerala-coastal.png"
              alt="Kerala Coastline & Lighthouse"
              className="coastal-view-img"
            />
            <span className="sea-badge">COASTAL VIEW</span>
          </div>

          <div className="detail-stats-list">
            <div className="detail-stat-block">
              <div className="d-label">SEA SURFACE TEMP</div>
              <div className="d-value font-mono">28.4 °C</div>
            </div>

            <div className="detail-stat-block">
              <div className="d-label">BIODIVERSITY INDEX</div>
              <div className="d-value-row">
                <span className="d-value font-mono">{(selectedStation.suitability * 0.85).toFixed(1)} / 10</span>
                <span className="d-tag high">High</span>
              </div>
            </div>

            <div className="detail-stat-block">
              <div className="d-label">WAVE ENERGY POTENTIAL</div>
              <div className="d-value font-mono">{selectedStation.suitability > 8 ? '42 GW' : '28 GW'}</div>
            </div>

            <div className="detail-stat-block">
              <div className="d-label">MARINE TRAFFIC</div>
              <div className="d-value font-mono">Low</div>
            </div>

            <div className="detail-stat-block">
              <div className="d-label">SPECIES DETECTED</div>
              <div className="d-value font-mono">{selectedStation.species}</div>
            </div>
          </div>

          <button className="view-analytics-btn">
            VIEW DETAILED ANALYTICS
          </button>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 3. OTOLITH & TAXONOMY
// ══════════════════════════════════════════════════════════════════════════════

function OtolithModule() {
  const [selectedSpecimen, setSelectedSpecimen] = useState(specimenData[0]);

  const taxonomyHierarchy = [
    { rank: 'KINGDOM', name: 'Animalia' },
    { rank: 'PHYLUM', name: 'Chordata' },
    { rank: 'CLASS', name: 'Actinopterygii' },
    { rank: 'ORDER', name: 'Clupeiformes' },
    { rank: 'FAMILY', name: 'Clupeidae' },
    { rank: 'GENUS', name: 'Sardinella' },
    { rank: 'SPECIES', name: 'S. longiceps', isSelected: true },
  ];

  return (
    <div className="tab-content" id="otolith-module">
      {/* Top Search Bar */}
      <div className="otolith-top-bar">
        <div className="otolith-search">
          <Search size={15} />
          <input type="text" placeholder="Search parameters, specimen..." />
        </div>
      </div>

      {/* Main Grid */}
      <div className="otolith-main-grid">
        {/* Left Column: Specimen Imagery + Morphometric Parameters */}
        <div className="otolith-col-left">
          {/* Specimen Imagery Card */}
          <div className="otolith-card specimen-imagery-card">
            <div className="otolith-card-header">
              <span className="card-title-text">SPECIMEN IMAGERY</span>
              <button className="new-scan-btn">
                <Upload size={13} /> New Scan
              </button>
            </div>
            <div className="specimen-view-box">
              <OtolithSVG specimen={selectedSpecimen} />
            </div>
          </div>

          {/* Morphometric Parameters Card */}
          <div className="otolith-card morph-parameters-card">
            <div className="otolith-card-header">
              <span className="card-title-text">MORPHOMETRIC PARAMETERS</span>
            </div>

            <table className="morph-table">
              <thead>
                <tr>
                  <th>PARAMETER</th>
                  <th>VALUE</th>
                  <th>VARIANCE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Length (OL)</td>
                  <td className="font-mono">14.22 mm</td>
                  <td className="font-mono">+0.04</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
                <tr>
                  <td>Width (OW)</td>
                  <td className="font-mono">6.81 mm</td>
                  <td className="font-mono">-0.12</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
                <tr>
                  <td>Area (OA)</td>
                  <td className="font-mono">74.5 mm²</td>
                  <td className="font-mono">+1.20</td>
                  <td><span className="dot-status orange"></span></td>
                </tr>
                <tr>
                  <td>Perimeter (OP)</td>
                  <td className="font-mono">36.4 mm</td>
                  <td className="font-mono">-0.05</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
                <tr>
                  <td>Form Factor</td>
                  <td className="font-mono">0.71</td>
                  <td className="font-mono">--</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
                <tr>
                  <td>Circularity</td>
                  <td className="font-mono">0.68</td>
                  <td className="font-mono">+0.15</td>
                  <td><span className="dot-status red"></span></td>
                </tr>
                <tr>
                  <td>Rectangularity</td>
                  <td className="font-mono">0.77</td>
                  <td className="font-mono">-0.01</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
                <tr>
                  <td>Eccentricity</td>
                  <td className="font-mono">0.88</td>
                  <td className="font-mono">+0.02</td>
                  <td><span className="dot-status green"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Classification + Taxonomic Hierarchy */}
        <div className="otolith-col-right">
          {/* AI Classification Card */}
          <div className="otolith-card ai-classification-card">
            <div className="otolith-card-header">
              <span className="card-title-text">AI CLASSIFICATION</span>
              <Bot size={18} className="ai-icon-badge" />
            </div>

            <h3 className="classified-species-title">{selectedSpecimen.name}</h3>
            <p className="classified-common-name">{selectedSpecimen.commonName}</p>

            <div className="confidence-score-block">
              <div className="confidence-label-row">
                <span>CONFIDENCE SCORE</span>
                <span className="font-mono">{selectedSpecimen.match}</span>
              </div>
              <div className="confidence-progress-bar">
                <div
                  className="confidence-fill"
                  style={{ width: selectedSpecimen.match }}
                ></div>
              </div>
            </div>

            <div className="classification-meta-row">
              <div>
                <span className="meta-label">SECONDARY MATCH</span>
                <p className="meta-val font-mono">Sardinella gibbosa (4.1%)</p>
              </div>
              <div>
                <span className="meta-label">MODEL VERSION</span>
                <p className="meta-val font-mono">SAGAR-VISION v3.2</p>
              </div>
            </div>
          </div>

          {/* Taxonomic Hierarchy Card */}
          <div className="otolith-card taxonomy-hierarchy-card">
            <div className="otolith-card-header">
              <span className="card-title-text">TAXONOMIC HIERARCHY</span>
            </div>

            <div className="taxonomy-list">
              {taxonomyHierarchy.map((tax) => (
                <div
                  key={tax.rank}
                  className={`taxonomy-row ${tax.isSelected ? 'selected' : ''}`}
                >
                  <span className="tax-bullet"></span>
                  <span className="tax-rank">{tax.rank}</span>
                  <span className="tax-name font-mono">{tax.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Comparative Specimen Database */}
      <div className="otolith-card comparative-database-card">
        <div className="otolith-card-header">
          <span className="card-title-text">COMPARATIVE SPECIMEN DATABASE</span>
        </div>

        <div className="database-cards-row">
          {specimenData.slice(0, 4).map((sp, i) => (
            <div
              key={sp.id}
              className={`db-specimen-item ${selectedSpecimen.id === sp.id ? 'active' : ''}`}
              onClick={() => setSelectedSpecimen(sp)}
            >
              <div className="db-specimen-img">
                <SpecimenSVG index={i} />
              </div>
              <div className="db-specimen-meta">
                <div className="db-id font-mono">ID: {sp.sampleId.replace('SM-OTO-2024-', 'SM-OT-')}</div>
                <div className="db-name">{sp.name}</div>
                <div className="db-match">
                  <CheckCircle2 size={11} /> Match: {sp.match}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// DIGITAL TWIN TURBINE VISUALIZER
// ══════════════════════════════════════════════════════════════════════════════

function DigitalTwinTurbineSVG({ capacity }) {
  const duration = Math.max(0.6, (4 - (capacity / 200) * 3.2)).toFixed(1);
  const turbineCount = capacity > 130 ? 4 : capacity > 75 ? 3 : capacity > 30 ? 2 : 1;

  return (
    <div style={{ position: 'relative', width: '100%', height: '170px', background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', margin: '14px 0' }}>
      <svg viewBox="0 0 500 170" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Water background */}
        <path d="M 0 30 Q 125 25, 250 30 T 500 30 L 500 170 L 0 170 Z" fill="url(#waterGrad)" />
        <line x1="0" y1="30" x2="500" y2="30" stroke="#0D9488" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
        <text x="15" y="22" fill="#0D9488" fontSize="9" fontFamily="Inter" fontWeight="700">Surface Waves</text>
        <text x="15" y="160" fill="#64748B" fontSize="8" fontFamily="Inter" fontWeight="600">Seabed (35m)</text>

        {/* Turbines */}
        {[...Array(turbineCount)].map((_, i) => {
          const cx = (500 / (turbineCount + 1)) * (i + 1);
          return (
            <g key={i}>
              <line x1={cx} y1="150" x2={cx} y2="75" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <circle cx={cx} cy="75" r="7" fill="#f59e0b" />
              <g transform={`translate(${cx}, 75)`}>
                <g style={{ animation: `spin ${duration}s linear infinite`, transformOrigin: '0px 0px' }}>
                  <line x1="0" y1="0" x2="0" y2="-28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="24" y2="14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="-24" y2="14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </g>
              <path d={`M ${cx + 10} 75 C ${cx + 35} 65, ${cx + 55} 85, ${cx + 75} 75`} fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.2" strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Fish migration detour */}
        <path d="M 15 110 C 120 110, 180 135, 300 130 C 380 125, 440 105, 485 110" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.75">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
        </path>
        <text x="320" y="145" fill="#2dd4bf" fontSize="8" fontFamily="Inter" opacity="0.85">Fish Migration Corridor Detour</text>
      </svg>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 4. eDNA & DIGITAL TWIN
// ══════════════════════════════════════════════════════════════════════════════

function EDNAModule({ tc, setTc, td, bi, ae }) {
  const [selectedDna, setSelectedDna] = useState(dnaMatchResults[0]);
  const [syncing, setSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('2026-08-19 10:45 IST');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const presets = [
    { label: '25 MW Pilot', val: 25 },
    { label: '50 MW Optimal', val: 50 },
    { label: '100 MW Medium', val: 100 },
    { label: '175 MW Commercial', val: 175 },
  ];

  const handleSyncFederated = () => {
    setSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      const now = new Date();
      setSyncTime(`${now.toISOString().slice(0,10)} ${now.toLocaleTimeString('en-IN', { hour12: false })} IST`);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="tab-content" id="edna-module">
      <div className="section-header">
        <h2>eDNA Analysis & Digital Twin Simulation</h2>
        <p>Environmental DNA species matching and marine energy impact modelling</p>
      </div>

      <div className="edna-grid">
        {/* Left Column: eDNA Match Results + Sequence Inspector */}
        <div>
          <div className="section-title">eDNA Sequence Match Results (Click to inspect)</div>
          {dnaMatchResults.map((r) => (
            <div
              key={r.id}
              className={`card dna-match-card ${selectedDna.id === r.id ? 'active' : ''}`}
              onClick={() => setSelectedDna(r)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2dd4bf', fontStyle: 'italic' }}>{r.species}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{r.commonName} • <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{r.sample}</span></div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>{r.match}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px' }}>
                <span>📍 {r.location}</span><span>🌊 Depth: {r.depth}</span>
              </div>
            </div>
          ))}

          {/* Sequence Inspector Panel */}
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title"><Dna size={15} /> Sequence Alignment & Taxonomy Inspector</div>
              <div className="status-badge green"><CheckCircle2 size={10} /> GenBank Verified</div>
            </div>

            {/* Taxonomy Lineage Chain */}
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>Taxonomic Lineage:</div>
            <div className="taxonomy-chain">
              {selectedDna.taxonomy.map((t, i) => (
                <span key={i} className="tax-badge">{t}</span>
              ))}
            </div>

            {/* Alignment Box */}
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>Base Pair Alignment (Target vs Ref):</div>
            <div className="seq-align-box">
              <div className="seq-line">
                <span className="seq-label">Target:</span>
                <span className="seq-bases">
                  {selectedDna.targetSeq.split('').map((char, i) => (
                    <span key={i} className={char === selectedDna.refSeq[i] ? 'base-match' : 'base-mismatch'}>{char}</span>
                  ))}
                </span>
              </div>
              <div className="seq-line">
                <span className="seq-label">Ref:</span>
                <span className="seq-bases">
                  {selectedDna.refSeq.split('').map((char, i) => (
                    <span key={i} style={{ color: '#94a3b8' }}>{char}</span>
                  ))}
                </span>
              </div>
            </div>

            {/* Depth Profile Copy Count Chart */}
            <div style={{ fontSize: '0.72rem', color: '#64748b', margin: '10px 0 6px' }}>eDNA Concentration Profile (Copies / Liter by Depth):</div>
            <div style={{ width: '100%', height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedDna.depthProfile} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="depth" stroke="#4a5568" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4a5568" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(6,14,24,0.95)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                  <Bar dataKey="copies" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
                    {selectedDna.depthProfile.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 || index === 2 ? '#22d3ee' : '#2dd4bf'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Twin Simulator + Underwater Visualizer + Federated Learning */}
        <div>
          <div className="section-title">Digital Twin Turbine Simulator</div>
          <div className="card" id="digital-twin-panel" style={{ padding: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title"><ScanLine size={15} /> Tidal Turbine Hydrodynamic Impact Model</div>
              <div className="status-badge amber"><Sliders size={10} /> Live Simulation</div>
            </div>

            <div className="slider-container">
              <div className="slider-header">
                <span className="slider-label">Proposed Turbine Capacity</span>
                <span className="slider-value">{tc} MW</span>
              </div>
              <input type="range" min="10" max="200" value={tc} onChange={e => setTc(+e.target.value)} id="turbine-slider" />
              
              {/* Presets */}
              <div className="preset-group">
                {presets.map(p => (
                  <button
                    key={p.val}
                    className={`preset-btn ${tc === p.val ? 'active' : ''}`}
                    onClick={() => setTc(p.val)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Underwater Turbine Visualizer SVG */}
            <DigitalTwinTurbineSVG capacity={tc} />

            {/* Metrics Breakdown */}
            <div className="impact-metrics" id="impact-metrics">
              <div className={`impact-card ${td > 40 ? 'warning' : td > 20 ? 'caution' : 'safe'}`}>
                <div className="impact-value">{td}%</div>
                <div className="impact-label">Marine Traffic Disruption</div>
              </div>
              <div className={`impact-card ${bi > 5 ? 'warning' : bi > 3 ? 'caution' : 'safe'}`}>
                <div className="impact-value">{bi}/10</div>
                <div className="impact-label">Biodiversity Impact Score</div>
              </div>
              <div className="impact-card safe">
                <div className="impact-value">{ae.toLocaleString()}</div>
                <div className="impact-label">Est. Annual Energy (MWh)</div>
              </div>
            </div>

            {/* Multi-Factor Sub Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '10px', fontSize: '0.7rem', color: '#94a3b8', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px' }}>
              <div>🔊 Noise: <strong style={{ color: '#e2e8f0' }}>{(tc * 0.6 + 65).toFixed(1)} dB</strong></div>
              <div>🏗️ Benthic Footprint: <strong style={{ color: '#e2e8f0' }}>{(tc * 0.12).toFixed(1)} ha</strong></div>
              <div>🌱 CO₂ Offset: <strong style={{ color: '#4ade80' }}>{Math.round(ae * 0.82).toLocaleString()} t/yr</strong></div>
            </div>
          </div>

          {/* Federated Learning Hub */}
          <div style={{ marginTop: '1.25rem' }}>
            <div className="section-title">Federated Learning Hub</div>
            <div className="card" id="federated-widget">
              <div className="card-header">
                <div className="card-title"><Shield size={15} /> Privacy-Preserving Model Aggregation</div>
                <button className={`sync-btn ${syncing ? 'syncing' : ''}`} onClick={handleSyncFederated} disabled={syncing}>
                  <RefreshCw size={13} /> {syncing ? 'Aggregating...' : 'Sync Gradients'}
                </button>
              </div>

              {syncSuccess && (
                <div style={{ padding: '6px 12px', background: 'var(--green-dim)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '6px', fontSize: '0.72rem', color: '#4ade80', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} /> Model gradients aggregated successfully across 3 partner institutes!
                </div>
              )}

              {[
                { name: 'CMLRE, Kochi', sync: syncTime, samples: '14,820 reads', dp: 'ε = 0.45' },
                { name: 'Fishery Survey of India, Mumbai', sync: syncTime, samples: '22,410 reads', dp: 'ε = 0.50' },
                { name: 'Agharkar Research Institute, Pune', sync: syncTime, samples: '9,650 reads', dp: 'ε = 0.40' },
              ].map((p, i) => (
                <div key={i} className="partner-card">
                  <div>
                    <div className="partner-name">{p.name}</div>
                    <div className="partner-sync">Last synced: {p.sync} • {p.samples} • {p.dp}</div>
                  </div>
                  <div className="partner-badge"><CheckCircle2 size={11} /> Model updated · Raw data intact</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 5. CHAT MODULE (Dual Bot Architecture)
// ══════════════════════════════════════════════════════════════════════════════

function ChatModule({
  activeBot, setActiveBot,
  messages, input, setInput,
  onSend, onKeyDown, isTyping,
  chatEndRef, geminiConnected, setMessages
}) {
  const currentConfig = BOT_CONFIG[activeBot];
  const IconComponent = currentConfig.icon;
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClear = () => {
    setMessages(currentConfig.initialMessages);
  };

  return (
    <div className="tab-content chat-container" id="chat-module">
      <div className="chat-header">
        <div className="chat-header-title">
          <h2>Ask Sagar-Manthan</h2>
          <p>{currentConfig.tagline}</p>
        </div>

        <div className="chat-header-actions">
          {/* Dual Bot Segmented Switcher */}
          <div className="bot-mode-selector">
            <button
              className={`bot-mode-btn energy ${activeBot === 'energy' ? 'active' : ''}`}
              onClick={() => setActiveBot('energy')}
            >
              <Zap size={13} /> Energy & Siting
            </button>
            <button
              className={`bot-mode-btn bio ${activeBot === 'bio' ? 'active' : ''}`}
              onClick={() => setActiveBot('bio')}
            >
              <Dna size={13} /> Biodiversity & eDNA
            </button>
          </div>

          {geminiConnected && (
            <div className="status-badge green"><Sparkles size={11} /> Gemini Live</div>
          )}
          <button className="chat-action-btn" onClick={handleClear} title="Clear conversation history">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Suggested prompt chips */}
      <div className="prompt-chips">
        {currentConfig.suggestions.map((s, i) => (
          <button
            key={i}
            className="prompt-chip"
            onClick={() => setInput(s.replace(/^[^\w\s]+\s*/, ''))}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role === 'user' ? 'user' : `ai ${activeBot}`}`}>
            <div className="chat-avatar">
              {msg.role === 'ai' ? <IconComponent size={15} /> : 'You'}
            </div>
            <div className="chat-bubble-wrapper">
              <div className="chat-bubble">
                <FormattedChatText text={msg.text} />
              </div>
              {msg.role === 'ai' && (
                <button className="copy-msg-btn" onClick={() => handleCopy(msg.text, i)}>
                  {copiedIdx === i ? <Check size={12} style={{ color: '#4ade80' }} /> : <Copy size={12} />}
                  <span>{copiedIdx === i ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`chat-msg ai ${activeBot}`}>
            <div className="chat-avatar"><IconComponent size={15} /></div>
            <div className="chat-bubble">
              <div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder={currentConfig.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            id="chat-input"
          />
          <button className="chat-send-btn" onClick={onSend} disabled={isTyping} id="chat-send-btn">
            <Send size={15} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function OtolithSVG({ specimen }) {
  const currentSpecimen = specimen || specimenData[0];
  const rx = Number(currentSpecimen?.rx) || 110;
  const ry = Number(currentSpecimen?.ry) || 65;

  return (
    <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', background: '#040c14' }}>
      <defs>
        <radialGradient id="oG" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4c5a0" /><stop offset="40%" stopColor="#b8a67c" />
          <stop offset="70%" stopColor="#8c7a58" /><stop offset="100%" stopColor="#5a4e38" />
        </radialGradient>
        <filter id="oS"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" /></filter>
      </defs>
      <line x1="30" y1="270" x2="100" y2="270" stroke="#22d3ee" strokeWidth="1.5" />
      <text x="55" y="285" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="Inter">2 mm</text>
      <ellipse cx="200" cy="140" rx={rx} ry={ry} fill="url(#oG)" filter="url(#oS)" transform="rotate(-8, 200, 140)" />
      {[0.85, 0.65, 0.45, 0.3].map((s, i) => (
        <ellipse key={i} cx="200" cy="140" rx={rx * s} ry={ry * s} fill="none" stroke="rgba(90,78,56,0.5)" strokeWidth="0.8" transform="rotate(-8, 200, 140)" />
      ))}
      <ellipse cx="195" cy="142" rx="12" ry="8" fill="#a39070" transform="rotate(-8, 195, 142)" />
      <line x1={200 - rx + 15} y1="140" x2={200 + rx + 15} y2="140" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.6" />
      <line x1="200" y1={140 - ry - 10} x2="200" y2={140 + ry + 10} stroke="#2dd4bf" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.6" />
      <text x="200" y="22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600">Sample {currentSpecimen?.sampleId}</text>
      <text x={Math.min(375, 200 + rx + 15)} y="138" fill="#22d3ee" fontSize="8" fontFamily="Inter">{currentSpecimen?.length}</text>
      <text x="208" y={Math.min(270, 140 + ry + 18)} fill="#2dd4bf" fontSize="8" fontFamily="Inter">{currentSpecimen?.width}</text>
    </svg>
  );
}

function SpecimenSVG({ index }) {
  const colors = ['#b8a67c', '#c4b08a', '#a89868', '#c0a878', '#b09060'];
  const s = [0.8, 0.9, 0.75, 0.85, 0.95];
  return (
    <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
      <rect width="160" height="90" fill="#0a1420" />
      <ellipse cx="80" cy="45" rx={50 * s[index]} ry={28 * s[index]} fill={colors[index]} opacity="0.8" transform={`rotate(${-5 + index * 3}, 80, 45)`} />
      {[0.7, 0.45].map((sc, i) => (
        <ellipse key={i} cx="80" cy="45" rx={50 * s[index] * sc} ry={28 * s[index] * sc} fill="none" stroke="rgba(90,78,56,0.4)" strokeWidth="0.5" transform={`rotate(${-5 + index * 3}, 80, 45)`} />
      ))}
    </svg>
  );
}
