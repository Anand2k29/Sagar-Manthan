import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import {
  MapContainer, TileLayer, CircleMarker, Popup, Polyline, Circle, LayerGroup
} from 'react-leaflet';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Waves, Activity, Fish, Dna, MessageCircle, Radio, FlaskConical, Zap,
  Upload, Send, Shield, X, Globe, Bot, Microscope, ScanLine,
  Wind, ArrowUpRight, CheckCircle2, Clock, Eye, Radar
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
  { species: 'Sardinella longiceps', match: '98.7%', location: 'Off Kochi, Kerala', depth: '12m', sample: 'SM-eDNA-2024-1847' },
  { species: 'Rastrelliger kanagurta', match: '95.2%', location: 'Malvan, Maharashtra', depth: '28m', sample: 'SM-eDNA-2024-1843' },
  { species: 'Thunnus albacares', match: '89.1%', location: 'Lakshadweep Sea', depth: '85m', sample: 'SM-eDNA-2024-1839' },
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
// GEMINI HELPER
// ══════════════════════════════════════════════════════════════════════════════

let geminiChat = null;

async function initGeminiChat(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: GEMINI_SYSTEM_PROMPT,
  });
  geminiChat = model.startChat({ history: [] });
  return geminiChat;
}

async function sendGeminiMessage(message) {
  if (!geminiChat) return null;
  try {
    const result = await geminiChat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    console.error('Gemini error:', err);
    return `I encountered an issue processing your request. Error: ${err.message}`;
  }
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
  const [activeTab, setActiveTab] = useState('overview');
  const [mapLayers, setMapLayers] = useState({
    currents: true,
    migration: false,
    biodiversity: true,
    energy: true,
    digitalTwin: false,
  });
  const [turbineCapacity, setTurbineCapacity] = useState(50);
  const [chatMessages, setChatMessages] = useState(initialChat);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logEntries, setLogEntries] = useState(initialAgentLogs);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const chatEndRef = useRef(null);
  const responseIdxRef = useRef(0);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Init Gemini from env key
  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (key && !geminiConnected) {
      initGeminiChat(key).then(() => setGeminiConnected(true)).catch(() => {});
    }
  }, []);

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
  }, [chatMessages, isTyping]);



  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    if (geminiConnected) {
      const resp = await sendGeminiMessage(userMsg);
      setChatMessages(prev => [...prev, { role: 'ai', text: resp || 'No response received.' }]);
      setIsTyping(false);
    } else {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', text: cannedResponses[responseIdxRef.current % cannedResponses.length] }]);
        responseIdxRef.current++;
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    }
  }, [chatInput, isTyping, geminiConnected]);

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

  return (
    <>
      <div className="ocean-bg" />

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

      {/* ── Tabs ── */}
      <div className="tab-nav" id="tab-nav">
        {tabs.map(tab => (
          <button key={tab.id} id={`tab-${tab.id}`}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            <tab.icon />{tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <main className="main-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewDashboard logEntries={logEntries} />}
        {activeTab === 'map' && <GISMap layers={mapLayers} toggleLayer={toggleLayer} />}
        {activeTab === 'otolith' && <OtolithModule />}
        {activeTab === 'edna' && <EDNAModule tc={turbineCapacity} setTc={setTurbineCapacity} td={trafficDisruption} bi={biodiversityImpact} ae={annualEnergy} />}
        {activeTab === 'chat' && (
          <ChatModule
            messages={chatMessages} input={chatInput} setInput={setChatInput}
            onSend={handleSendChat} onKeyDown={handleKeyDown} isTyping={isTyping}
            chatEndRef={chatEndRef} geminiConnected={geminiConnected}
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
// 2. GIS MAP (React-Leaflet)
// ══════════════════════════════════════════════════════════════════════════════

function GISMap({ layers, toggleLayer }) {
  const markerColor = (type) => {
    if (type === 'energy') return '#f59e0b';
    if (type === 'biodiversity') return '#2dd4bf';
    return '#22d3ee';
  };

  const layerConfig = [
    { key: 'currents', label: 'Ocean Currents', icon: Wind },
    { key: 'migration', label: 'Fish Migration', icon: Fish },
    { key: 'biodiversity', label: 'Biodiversity Hotspots', icon: Eye },
    { key: 'energy', label: 'Energy Sites', icon: Zap },
    { key: 'digitalTwin', label: 'Digital Twin Zone', icon: ScanLine },
  ];

  return (
    <div className="tab-content" id="gis-map-section">
      <div className="section-header">
        <h2>Geospatial Intelligence</h2>
        <p>Interactive visualization of the Indian Exclusive Economic Zone</p>
      </div>

      <div className="map-wrapper">
        <MapContainer center={[13, 76]} zoom={5} style={{ height: '580px', width: '100%' }}
          zoomControl={true} attributionControl={true} id="leaflet-map">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            subdomains="abcd" maxZoom={19}
          />

          {/* Ocean Currents */}
          {layers.currents && (
            <LayerGroup>
              <Polyline positions={oceanCurrents.wicc} pathOptions={{ color: '#22d3ee', weight: 2, opacity: 0.5, dashArray: '8 6' }} />
              <Polyline positions={oceanCurrents.eicc} pathOptions={{ color: '#22d3ee', weight: 2, opacity: 0.4, dashArray: '8 6' }} />
              <Polyline positions={oceanCurrents.equatorial} pathOptions={{ color: '#22d3ee', weight: 1.5, opacity: 0.3, dashArray: '6 8' }} />
            </LayerGroup>
          )}

          {/* Migration Paths */}
          {layers.migration && (
            <LayerGroup>
              <Polyline positions={migrationPaths.sardine} pathOptions={{ color: '#2dd4bf', weight: 2.5, opacity: 0.5, dashArray: '4 8' }} />
              <Polyline positions={migrationPaths.mackerel} pathOptions={{ color: '#2dd4bf', weight: 2, opacity: 0.4, dashArray: '4 8' }} />
            </LayerGroup>
          )}

          {/* Biodiversity Hotspots */}
          {layers.biodiversity && (
            <LayerGroup>
              {biodiversityZones.map((zone, i) => (
                <Circle key={i} center={zone.center} radius={zone.radius}
                  pathOptions={{ color: '#2dd4bf', fillColor: '#2dd4bf', fillOpacity: 0.08, weight: 1, opacity: 0.3 }} />
              ))}
            </LayerGroup>
          )}

          {/* Energy Site Zones */}
          {layers.energy && (
            <LayerGroup>
              {mapMarkers.filter(m => m.type === 'energy').map(m => (
                <Circle key={`ez-${m.id}`} center={[m.lat, m.lng]} radius={25000}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.06, weight: 1, opacity: 0.25 }} />
              ))}
            </LayerGroup>
          )}

          {/* Digital Twin Zone */}
          {layers.digitalTwin && (
            <Circle center={[9.5, 75.5]} radius={80000}
              pathOptions={{ color: '#a78bfa', fillColor: '#a78bfa', fillOpacity: 0.06, weight: 1.5, opacity: 0.4, dashArray: '6 4' }} />
          )}

          {/* All markers */}
          {mapMarkers.map(marker => (
            <CircleMarker key={marker.id} center={[marker.lat, marker.lng]}
              radius={6} pathOptions={{ color: markerColor(marker.type), fillColor: markerColor(marker.type), fillOpacity: 0.8, weight: 1.5 }}>
              <Popup>
                <div className="map-popup-content">
                  <h3>{marker.name}</h3>
                  <div className="popup-row"><span className="popup-label">Depth Range</span><span className="popup-value">{marker.depth}</span></div>
                  <div className="popup-row"><span className="popup-label">Species Density</span><span className="popup-value">{marker.species} species</span></div>
                  <div className="popup-row"><span className="popup-label">Tidal Range</span><span className="popup-value">{marker.tidal}</span></div>
                  <div className="popup-row">
                    <span className="popup-label">Energy Suitability</span>
                    <span className="popup-value" style={{ color: marker.suitability > 7 ? '#4ade80' : marker.suitability > 5 ? '#f59e0b' : '#f87171' }}>
                      {marker.suitability}/10
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Custom layer controls */}
        <div className="map-controls" id="map-controls">
          {layerConfig.map(l => (
            <label key={l.key} className={`map-layer-toggle ${layers[l.key] ? 'active' : ''}`} id={`layer-${l.key}`}>
              <input type="checkbox" checked={layers[l.key]} onChange={() => toggleLayer(l.key)} />
              <l.icon size={13} />{l.label}
            </label>
          ))}
        </div>

        {/* Legend */}
        <div className="map-legend" id="map-legend">
          <h4>Legend</h4>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#f59e0b' }} /> Energy Site</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#2dd4bf' }} /> Biodiversity Hotspot</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#22d3ee' }} /> Sensor / Buoy</div>
          <div className="legend-item"><div className="legend-line" style={{ background: '#22d3ee' }} /> Ocean Current</div>
          <div className="legend-item"><div className="legend-line" style={{ background: '#2dd4bf' }} /> Migration Path</div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 3. OTOLITH & TAXONOMY
// ══════════════════════════════════════════════════════════════════════════════

function OtolithModule() {
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [selectedSpecimen, setSelectedSpecimen] = useState(specimenData[0]);

  return (
    <div className="tab-content" id="otolith-module">
      <div className="section-header">
        <h2>Otolith Morphometry & Taxonomy</h2>
        <p>AI-powered fish species identification through ear-stone analysis</p>
      </div>

      <div className="otolith-grid">
        <div>
          <div className="section-title">Otolith Image Analysis</div>
          <div className={`upload-zone ${showAnalysis ? 'has-image' : ''}`} onClick={() => setShowAnalysis(true)} id="otolith-upload">
            {showAnalysis ? <OtolithSVG specimen={selectedSpecimen} /> : (
              <>
                <div className="upload-icon"><Upload /></div>
                <div className="upload-text"><strong>Drag & drop</strong> an otolith image or click to upload</div>
                <div className="upload-hint">Supports JPEG, PNG, TIFF • Max 50MB</div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="section-title">Morphometric Analysis Result</div>
          <div className="card">
            <div className="prediction-card" style={{ marginBottom: '14px' }}>
              <div className="prediction-label">Predicted Species</div>
              <div className="prediction-species"><em>{selectedSpecimen.name}</em></div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 8px' }}>{selectedSpecimen.commonName}</div>
              <div className="prediction-confidence">{selectedSpecimen.match}</div>
              <div className="prediction-label">Confidence Score</div>
            </div>
            <div className="morph-results">
              {[
                ['Length (Major Axis)', selectedSpecimen.length],
                ['Width (Minor Axis)', selectedSpecimen.width],
                ['Area', selectedSpecimen.area],
                ['Perimeter', selectedSpecimen.perimeter],
                ['Aspect Ratio', selectedSpecimen.aspectRatio],
                ['Circularity Index', selectedSpecimen.circularity],
                ['Estimated Age', selectedSpecimen.age],
                ['Collection Site', selectedSpecimen.location],
              ].map(([label, value], i) => (
                <div key={i} className="morph-row">
                  <span className="morph-label">{label}</span>
                  <span className="morph-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="section-title">Similar Specimens in Database (Click to view analysis)</div>
        <div className="specimens-scroll" id="specimens-scroll">
          {specimenData.map((sp, i) => (
            <div
              key={sp.id}
              className={`specimen-card ${selectedSpecimen.id === sp.id ? 'active' : ''}`}
              onClick={() => setSelectedSpecimen(sp)}
            >
              <div className="specimen-img"><SpecimenSVG index={i} /></div>
              <div className="specimen-name">{sp.name}</div>
              <div className="specimen-match">Match: {sp.match}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{sp.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 4. eDNA & DIGITAL TWIN
// ══════════════════════════════════════════════════════════════════════════════

function EDNAModule({ tc, setTc, td, bi, ae }) {
  return (
    <div className="tab-content" id="edna-module">
      <div className="section-header">
        <h2>eDNA Analysis & Digital Twin Simulation</h2>
        <p>Environmental DNA species matching and marine energy impact modelling</p>
      </div>

      <div className="edna-grid">
        <div>
          <div className="section-title">eDNA Sequence Match Results</div>
          {dnaMatchResults.map((r, i) => (
            <div key={i} className="card dna-match-card">
              <div className="dna-sequence">
                <span className="highlight-a">ATCG</span><span className="highlight-t">TTAG</span><span className="highlight-g">GCCA</span><span className="highlight-c">CTGA</span>{' '}
                <span className="highlight-a">AATC</span><span className="highlight-g">GGTA</span><span className="highlight-t">TACG</span><span className="highlight-c">CCTA</span>{' '}
                <span className="highlight-a">ATGC</span><span className="highlight-g">GAAT</span><span className="highlight-t">TTCG</span><span className="highlight-c">CAGC</span>...
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2dd4bf', fontStyle: 'italic' }}>{r.species}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{r.sample}</div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>{r.match}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: '#94a3b8' }}>
                <span>📍 {r.location}</span><span>🌊 {r.depth}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="section-title">Digital Twin Simulator</div>
          <div className="card" id="digital-twin-panel" style={{ padding: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title"><ScanLine size={15} /> Tidal Turbine Impact Model</div>
            </div>
            <div className="slider-container">
              <div className="slider-header">
                <span className="slider-label">Proposed Turbine Capacity</span>
                <span className="slider-value">{tc} MW</span>
              </div>
              <input type="range" min="10" max="200" value={tc} onChange={e => setTc(+e.target.value)} id="turbine-slider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>
                <span>10 MW</span><span>200 MW</span>
              </div>
            </div>
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
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div className="section-title">Federated Learning Status</div>
            <div className="card" id="federated-widget">
              <div className="card-header">
                <div className="card-title"><Shield size={15} /> Privacy-Preserving Model Sync</div>
              </div>
              {[
                { name: 'CMLRE, Kochi', sync: '2026-08-19 09:47 IST' },
                { name: 'Fishery Survey of India, Mumbai', sync: '2026-08-19 09:32 IST' },
                { name: 'Agharkar Research Institute, Pune', sync: '2026-08-19 08:58 IST' },
              ].map((p, i) => (
                <div key={i} className="partner-card">
                  <div>
                    <div className="partner-name">{p.name}</div>
                    <div className="partner-sync">Last synced: {p.sync}</div>
                  </div>
                  <div className="partner-badge"><CheckCircle2 size={11} /> Model updated · Data never left premises</div>
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
// 5. CHAT MODULE (Gemini-powered)
// ══════════════════════════════════════════════════════════════════════════════

function ChatModule({ messages, input, setInput, onSend, onKeyDown, isTyping, chatEndRef, geminiConnected }) {
  return (
    <div className="tab-content chat-container" id="chat-module">
      <div className="chat-header">
        <h2>Ask Sagar-Manthan</h2>
        <p>Natural language interface to India's ocean intelligence platform</p>
      </div>

      {/* Gemini connection status */}
      {geminiConnected && (
        <div className="api-key-connected"><CheckCircle2 size={13} /> Gemini AI Connected — Live responses enabled</div>
      )}

      {/* Suggested prompts */}
      <div className="prompt-chips">
        {promptSuggestions.map((s, i) => (
          <button key={i} className="prompt-chip" onClick={() => setInput(s)}>{s}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
            <div className="chat-avatar">{msg.role === 'ai' ? <Waves size={14} /> : 'You'}</div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-msg ai">
            <div className="chat-avatar"><Waves size={14} /></div>
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
          <input type="text" className="chat-input" placeholder="Ask about ocean data, energy sites, biodiversity..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} id="chat-input" />
          <button className="chat-send-btn" onClick={onSend} disabled={isTyping} id="chat-send-btn"><Send size={15} /> Send</button>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function OtolithSVG({ specimen = specimenData[0] }) {
  const rx = specimen.rx || 110;
  const ry = specimen.ry || 65;

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
      <text x="200" y="22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600">Sample {specimen.sampleId}</text>
      <text x={Math.min(375, 200 + rx + 15)} y="138" fill="#22d3ee" fontSize="8" fontFamily="Inter">{specimen.length}</text>
      <text x="208" y={Math.min(270, 140 + ry + 18)} fill="#2dd4bf" fontSize="8" fontFamily="Inter">{specimen.width}</text>
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
