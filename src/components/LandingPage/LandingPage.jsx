import { useState, useEffect, useRef } from 'react';
import {
  Waves, Activity, Globe, Microscope, Dna, MessageCircle,
  BarChart3, ArrowRight, Shield, Radio, Cpu, Satellite,
  ChevronRight, Clock, Anchor, Radar, Fish, Thermometer, Wind, Zap, ShieldCheck
} from 'lucide-react';
import './LandingPage.css';

// ══════════════════════════════════════════════════════════════════
// ANIMATED COUNTER HOOK
// ══════════════════════════════════════════════════════════════════

function useAnimatedCounter(target, suffix = '', duration = 1800) {
  const [display, setDisplay] = useState('0');
  const numTarget = typeof target === 'string'
    ? parseFloat(target.replace(/,/g, ''))
    : target;

  useEffect(() => {
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numTarget;

      if (Number.isInteger(numTarget)) {
        setDisplay(Math.round(current).toLocaleString() + suffix);
      } else {
        setDisplay(current.toFixed(2) + suffix);
      }

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [numTarget, suffix, duration]);

  return display;
}


// ══════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ══════════════════════════════════════════════════════════════════

function HeroParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${60 + Math.random() * 40}%`,
    size: 2 + Math.random() * 3,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 5,
    opacity: 0.15 + Math.random() * 0.2,
  }));

  return (
    <div className="lp-hero-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="lp-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════
// STATS DATA
// ══════════════════════════════════════════════════════════════════

const statsData = [
  {
    icon: Globe,
    value: '2.37M',
    unit: 'km²',
    label: 'Area Monitored',
    sublabel: "India's Exclusive Economic Zone",
    color: 'teal',
  },
  {
    icon: Radio,
    value: '10,000+',
    unit: '',
    label: 'Live Data Streams',
    sublabel: 'From Multiple Sources',
    color: 'cyan',
  },
  {
    icon: Activity,
    value: '99.8%',
    unit: '',
    label: 'Data Uptime',
    sublabel: 'Reliable. Always On.',
    color: 'emerald',
  },
  {
    icon: Cpu,
    value: '24/7',
    unit: '',
    label: 'Autonomous Monitoring',
    sublabel: 'AI-Powered Intelligence',
    color: 'indigo',
  },
  {
    icon: Shield,
    value: 'Secure & Compliant',
    unit: '',
    label: 'With Global Standards',
    sublabel: 'Trusted. Transparent. Secure.',
    color: 'amber',
    isText: true,
  },
];


// ══════════════════════════════════════════════════════════════════
// CAPABILITIES DATA
// ══════════════════════════════════════════════════════════════════

const capabilitiesData = [
  {
    id: 'overview',
    icon: Activity,
    title: 'Real-Time Monitoring',
    badge: '247 BUOY FEEDS',
    desc: 'Live CTD profilers, ARGO floats & INCOIS satellite telemetry.',
    tabId: 'overview',
    color: '#06B6D4'
  },
  {
    id: 'map',
    icon: Globe,
    title: '12-Layer GIS Map',
    badge: 'GEOSPATIAL EEZ',
    desc: 'Interactive thermal SST, current vectors & fish corridors.',
    tabId: 'map',
    color: '#0D9488'
  },
  {
    id: 'otolith',
    icon: Microscope,
    title: 'Otolith AI Taxonomy',
    badge: 'VISION v3.2',
    desc: 'Microscopic growth annuli measurements & species age estimation.',
    tabId: 'otolith',
    color: '#8B5CF6'
  },
  {
    id: 'edna',
    icon: Dna,
    title: 'eDNA & Digital Twin',
    badge: 'GENBANK MATCH',
    desc: 'Base-pair sequence alignment & 3D turbine impact simulation.',
    tabId: 'edna',
    color: '#3B82F6'
  },
  {
    id: 'sonar',
    icon: Radar,
    title: '3D Spatial Sonar',
    badge: 'ACOUSTIC HUD',
    desc: 'Underwater hydrophone radar sweep & 15km wildlife shield.',
    tabId: 'spatial-sonar',
    color: '#EC4899'
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'AI Decision Bot',
    badge: 'DUAL AI 2.0',
    desc: 'Google Gemini decision advisor for MNRE & MoES policy.',
    tabId: 'chat',
    color: '#6366F1'
  },
];


// ══════════════════════════════════════════════════════════════════
// TRUSTED BY DATA
// ══════════════════════════════════════════════════════════════════

const trustedByData = [
  { abbr: 'INCOIS', full: 'Indian National Centre for Ocean Information Services', icon: Radio, colorClass: 'incois' },
  { abbr: 'NIOT', full: 'National Institute of Ocean Technology', icon: Anchor, colorClass: 'niot' },
  { abbr: 'CMFRI', full: 'Central Marine Fisheries Research Institute', icon: Fish, colorClass: 'cmfri' },
  { abbr: 'NCCR', full: 'National Centre for Coastal Research', icon: ShieldCheck, colorClass: 'nccr' },
  { abbr: 'IITM', full: 'Indian Institute of Tropical Meteorology', icon: Wind, colorClass: 'iitm' },
  { abbr: 'ISRO', full: 'Indian Space Research Organisation', icon: Satellite, colorClass: 'isro' },
];

const featuredEcosystems = [
  {
    id: 'gulf-mannar',
    title: 'Gulf of Mannar Biosphere',
    category: 'BIODIVERSITY PROTECTED ZONE',
    badge: '412 SPECIES',
    img: '/images/gulf-mannar.png',
    desc: 'Coral sanctuary & Schedule I marine turtle nesting corridor.',
    tab: 'map'
  },
  {
    id: 'site-7',
    title: 'Zone-7 Kerala Coast',
    category: 'OFFSHORE WAVE ENERGY',
    badge: '42 GW POTENTIAL',
    img: '/images/kerala-coast.png',
    desc: 'Optimal 3.4m tidal amplitude with 2.1/10 minimal biodiversity score.',
    tab: 'edna'
  },
  {
    id: 'lakshadweep',
    title: 'Lakshadweep Coral Atolls',
    category: 'eDNA BARCODING STATION',
    badge: '347 TAXA',
    img: '/images/lakshadweep.png',
    desc: 'Molecular sequence monitoring & coral thermal stress early warning.',
    tab: 'edna'
  },
  {
    id: 'kutch',
    title: 'Gulf of Kutch Channel',
    category: 'TIDAL TURBINE SITE',
    badge: '31 GW ENERGY',
    img: '/images/gulf-kutch.png',
    desc: '2.8m tidal range with high velocity coastal current vector streams.',
    tab: 'map'
  }
];


// ══════════════════════════════════════════════════════════════════
// STAT ITEM COMPONENT
// ══════════════════════════════════════════════════════════════════

function StatItem({ stat, index }) {
  const Icon = stat.icon;

  return (
    <div className={`lp-stat-item lp-fade-in lp-fade-in-delay-${index + 1}`}>
      <div className={`lp-stat-icon ${stat.color}`}>
        <Icon />
      </div>
      <div className="lp-stat-content">
        {stat.isText ? (
          <div className="lp-stat-value" style={{ fontSize: '0.95rem' }}>{stat.value}</div>
        ) : (
          <div className="lp-stat-value">
            {stat.value}
            {stat.unit && <span className="lp-stat-unit">{stat.unit}</span>}
          </div>
        )}
        <div className="lp-stat-label">
          {stat.label}
          <br />
          {stat.sublabel}
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE COMPONENT (IRCTC-INSPIRED ARCHITECTURE)
// ══════════════════════════════════════════════════════════════════

export default function LandingPage({ onEnter, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [videoError, setVideoError] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Zone-7 (Kerala Coast)');
  const [selectedModule, setSelectedModule] = useState('map');
  const videoRef = useRef(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-IN', {
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });

  // Open in NEW TAB function
  const openInNewTab = (tabId, layerId = null) => {
    let url = `${window.location.origin}${window.location.pathname}?tab=${tabId}`;
    if (layerId) {
      url += `&layer=${layerId}`;
    }
    window.open(url, '_blank');
  };

  const handleExplore = () => {
    openInNewTab('overview');
  };

  const handleNavClick = (tabId) => {
    openInNewTab(tabId);
  };

  const handleCapabilityClick = (tabId) => {
    openInNewTab(tabId);
  };

  const handleQuerySearch = (e) => {
    e.preventDefault();
    openInNewTab(selectedModule);
  };

  const irctcServices = [
    { id: 'map', label: 'GIS MAP', icon: Globe, color: '#0D9488', desc: '12-Layer Map' },
    { id: 'overview', label: 'LIVE SENSORS', icon: Radio, color: '#06B6D4', desc: '247 Buoy Grid' },
    { id: 'otolith', label: 'OTOLITH SCAN', icon: Microscope, color: '#8B5CF6', desc: 'Species Taxonomy' },
    { id: 'edna', label: 'eDNA RADAR', icon: Dna, color: '#3B82F6', desc: 'GenBank Match' },
    { id: 'edna', label: 'WAVE ENERGY', icon: Satellite, color: '#EC4899', desc: 'Digital Twin' },
    { id: 'chat', label: 'AI BOT 2.0', icon: MessageCircle, color: '#6366F1', desc: 'AskDISHA Style' },
  ];

  const featuredEcosystems = [
    {
      id: 'gulf-mannar',
      title: 'Gulf of Mannar Biosphere',
      category: 'BIODIVERSITY PROTECTED ZONE',
      badge: '412 SPECIES',
      img: '/images/kerala-coastal.png',
      desc: 'Coral sanctuary & Schedule I marine turtle nesting corridor.',
      tab: 'map'
    },
    {
      id: 'site-7',
      title: 'Zone-7 Kerala Coast',
      category: 'OFFSHORE WAVE ENERGY',
      badge: '42 GW POTENTIAL',
      img: '/images/kerala-coastal.png',
      desc: 'Optimal 3.4m tidal amplitude with 2.1/10 minimal biodiversity score.',
      tab: 'edna'
    },
    {
      id: 'lakshadweep',
      title: 'Lakshadweep Coral Atolls',
      category: 'eDNA BARCODING STATION',
      badge: '347 TAXA',
      img: '/images/kerala-coastal.png',
      desc: 'Molecular sequence monitoring & coral thermal stress early warning.',
      tab: 'edna'
    },
    {
      id: 'kutch',
      title: 'Gulf of Kutch Channel',
      category: 'TIDAL TURBINE SITE',
      badge: '31 GW ENERGY',
      img: '/images/kerala-coastal.png',
      desc: '2.8m tidal range with high velocity coastal current vector streams.',
      tab: 'map'
    }
  ];

  return (
    <div className="landing-page" id="landing-page">

      {/* ── Navbar ── */}
      <nav className="lp-navbar" id="lp-navbar">
        <div className="lp-navbar-brand">
          <div className="lp-navbar-logo">
            <Waves />
          </div>
          <div className="lp-navbar-brand-text">
            <h1>Sagar-Manthan</h1>
            <span>Deep Ocean Data Analytics</span>
          </div>
        </div>

        <div className="lp-navbar-links">
          {[
            { label: 'Overview', tab: 'overview' },
            { label: 'GIS Map', tab: 'map' },
            { label: 'Otolith & Taxonomy', tab: 'otolith' },
            { label: 'eDNA & Digital Twin', tab: 'edna' },
            { label: 'AI Agents', tab: 'chat' },
            { label: 'Dashboard', tab: 'overview' },
          ].map((link) => (
            <button
              key={link.label}
              className="lp-nav-link"
              onClick={() => handleNavClick(link.tab)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="lp-navbar-right">
          <div className="lp-live-indicator">
            <div className="lp-live-dot" />
            LIVE DATA
          </div>
          <div className="lp-navbar-clock">{timeStr} IST</div>
          <div className="lp-ministry-badge">
            <div className="lp-ministry-icon">
              <Anchor size={14} />
            </div>
            <div className="lp-ministry-text">
              <strong>Ministry of Earth Sciences</strong>
              Government of India
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section with IRCTC-Inspired Ocean Query Box ── */}
      <section className="lp-hero" id="lp-hero">
        <HeroParticles />

        <div className="lp-hero-content lp-slide-in-left">
          <h2 className="lp-hero-heading">
            INTELLIGENCE BENEATH<br />
            THE <span className="lp-accent">SURFACE</span>
          </h2>
          <p className="lp-hero-subtitle">
            India's unified ocean intelligence platform combining AI,
            Oceanography, and Geospatial Analytics to predict, protect, and optimize our EEZ.
          </p>

          {/* Official Government Executive Command Console */}
          <div className="govt-command-box">
            <div className="command-box-header">
              <div className="gov-seal-icon"><Anchor size={16} /></div>
              <div>
                <div className="command-box-title">OFFICIAL MARITIME COMMAND CONSOLE</div>
                <div className="command-box-subtitle">Ministry of Earth Sciences • High-Level Decision Support</div>
              </div>
            </div>

            <div className="command-directives-grid">
              <div className="directive-field">
                <label>TARGET EEZ SECTOR</label>
                <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
                  <option value="Zone-7 (Kerala Coast)">Sector 1: Zone-7 Kerala (42 GW Potential)</option>
                  <option value="Zone-3 (Gulf of Kutch)">Sector 2: Zone-3 Gulf of Kutch (31 GW Potential)</option>
                  <option value="Site-9 (Kanyakumari)">Sector 3: Site-9 Kanyakumari (Protected Zone)</option>
                  <option value="Andaman & Nicobar">Sector 4: Andaman & Nicobar EEZ Boundary</option>
                  <option value="Lakshadweep Sea">Sector 5: Lakshadweep Coral Atoll Grid</option>
                </select>
              </div>

              <div className="directive-field">
                <label>OPERATIONAL MODULE</label>
                <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
                  <option value="map">12-Layer GIS Map</option>
                  <option value="spatial-sonar">3D Spatial Sonar Matrix</option>
                  <option value="otolith">Otolith AI Taxonomy</option>
                  <option value="edna">eDNA & Digital Twin</option>
                  <option value="chat">Ask Sagar-Manthan AI</option>
                  <option value="overview">Live Sensor Ingestion</option>
                </select>
              </div>
            </div>

            <div className="command-quick-actions">
              <span className="actions-label">QUICK DIRECTIVES:</span>
              <div className="actions-chips-row">
                <button type="button" onClick={() => handleNavClick('map')} className="cmd-chip">
                  🗺️ 12-Layer Map
                </button>
                <button type="button" onClick={() => handleNavClick('spatial-sonar')} className="cmd-chip highlight">
                  🔊 3D Sonar HUD
                </button>
                <button type="button" onClick={() => handleNavClick('edna')} className="cmd-chip">
                  ⚡ 42 GW Wave Siting
                </button>
                <button type="button" onClick={() => handleNavClick('otolith')} className="cmd-chip">
                  🔬 Otolith AI
                </button>
              </div>
            </div>

            <button type="button" className="launch-command-btn" onClick={() => handleNavClick(selectedModule)}>
              <Anchor size={16} /> LAUNCH EXECUTIVE COMMAND PLATFORM
            </button>
          </div>

          <div className="lp-hero-ctas" style={{ marginTop: '16px' }}>
            <button className="lp-btn-primary" onClick={handleExplore} id="explore-platform-btn">
              <BarChart3 size={16} />
              Open Command Workspace
            </button>
            <button
              className="lp-btn-secondary"
              onClick={() => handleNavClick('map')}
              id="view-gis-btn"
            >
              View GIS Map
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="lp-hero-media lp-slide-in-right">
          <div className="lp-hero-media-overlay" />
          <div className="lp-hero-media-overlay-bottom" />
          {!videoError ? (
            <video
              ref={videoRef}
              className="lp-hero-video"
              src="/videos/hero-ship.mp4"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="lp-hero-fallback">
              <div className="lp-hero-fallback-content">
                <Satellite size={60} />
                <p>Place your ship video at<br /><code style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>public/videos/hero-ship.mp4</code></p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Ministerial Decision & Intelligence Radar Section (5-5 Grid) ── */}
      <section className="govt-landing-radar-section">
        <div className="govt-radar-header">
          <h3 className="govt-radar-title">MINISTERIAL DECISION & INTELLIGENCE RADAR</h3>
          <p className="govt-radar-subtitle">Direct 1-Click Operational Access for Government Decision-Makers</p>
        </div>

        <div className="govt-radar-grid">
          {[
            { id: 'map', label: 'GIS MAP', icon: Globe, color: '#0D9488', desc: '12-Layer Map' },
            { id: 'map', layer: 'temperature', label: 'SEA TEMP', icon: Thermometer, color: '#F59E0B', desc: 'SST Satellite' },
            { id: 'map', layer: 'currents', label: 'CURRENTS', icon: Wind, color: '#06B6D4', desc: 'WICC Vector' },
            { id: 'map', layer: 'migration', label: 'FISH ROUTES', icon: Fish, color: '#10B981', desc: 'Sardine Path' },
            { id: 'otolith', label: 'OTOLITH SCAN', icon: Microscope, color: '#8B5CF6', desc: 'Taxonomy AI' },
            { id: 'edna', label: 'eDNA RADAR', icon: Dna, color: '#3B82F6', desc: 'GenBank Match' },
            { id: 'edna', label: 'WAVE ENERGY', icon: Zap, color: '#EC4899', desc: 'Digital Twin' },
            { id: 'spatial-sonar', label: '3D SONAR', icon: Radar, color: '#06B6D4', desc: 'Acoustic HUD' },
            { id: 'map', layer: 'biodiversity', label: 'EXCLUSION', icon: ShieldCheck, color: '#10B981', desc: 'Wildlife Shield' },
            { id: 'chat', label: 'AI ASSISTANT', icon: MessageCircle, color: '#6366F1', desc: 'Decision Bot' },
          ].map((s) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.label}
                className="govt-radar-item"
                onClick={() => openInNewTab(s.id, s.layer)}
                title={`Open ${s.label} in new tab`}
              >
                <div className="govt-radar-circle" style={{ '--radar-color': s.color }}>
                  <SIcon size={24} />
                </div>
                <span className="govt-radar-label">{s.label}</span>
                <span className="govt-radar-desc">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="lp-stats-bar" id="lp-stats-bar">
        {statsData.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ── IRCTC-Style Featured Ecosystems & Packages Grid ── */}
      <section className="featured-ecosystems-section">
        <div className="lp-section-label">KEY MARITIME ECOSYSTEMS</div>
        <h3 className="lp-section-title" style={{ marginBottom: '28px' }}>
          Priority Ocean Sanctuaries & Energy Candidates
        </h3>

        <div className="featured-grid">
          {featuredEcosystems.map((eco) => (
            <div
              key={eco.id}
              className="featured-card"
              onClick={() => handleNavClick(eco.tab)}
            >
              <div className="featured-img-box">
                <img src={eco.img} alt={eco.title} />
                <span className="eco-badge">{eco.badge}</span>
              </div>
              <div className="featured-card-body">
                <span className="eco-category">{eco.category}</span>
                <h4 className="eco-title">{eco.title}</h4>
                <p className="eco-desc">{eco.desc}</p>
                <div className="eco-action-row">
                  <span>Inspect Telemetry</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted By ── */}
      <div className="lp-trusted" id="lp-trusted">
        <div className="lp-trusted-label">Trusted By</div>
        <div className="lp-trusted-logos">
          {trustedByData.map((org) => {
            const OrgIcon = org.icon;
            return (
              <div key={org.abbr} className="lp-trusted-item">
                <div className={`lp-trusted-logo-icon ${org.colorClass}`}>
                  <OrgIcon size={18} />
                </div>
                <div className="lp-trusted-logo-text">
                  <div className="lp-trusted-name">{org.abbr}</div>
                  <div className="lp-trusted-full">{org.full}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── IRCTC AskDISHA Style Floating AI Assistant Badge ── */}
      <button
        className="irctc-ask-disha-floating-badge"
        onClick={() => handleNavClick('chat')}
        title="Open Ask Sagar-Manthan AI Assistant"
      >
        <div className="disha-icon-circle">
          <MessageCircle size={20} />
        </div>
        <div className="disha-text-group">
          <span className="disha-title">Ask Sagar-Manthan</span>
          <span className="disha-subtitle">AI Assistant 2.0</span>
        </div>
      </button>
    </div>
  );
}

