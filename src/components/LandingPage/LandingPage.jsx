import { useState, useEffect, useRef } from 'react';
import {
  Waves, Activity, Globe, Microscope, Dna, MessageCircle,
  BarChart3, ArrowRight, Shield, Radio, Cpu, Satellite,
  ChevronRight, Clock, Anchor
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
    title: 'Real-time Monitoring',
    desc: 'Monitor ocean conditions in real time using satellites, buoys, and in-situ sensors.',
    tabId: 'overview',
  },
  {
    id: 'map',
    icon: Globe,
    title: 'GIS Map',
    desc: 'Interactive geospatial visualization of oceanographic, climatic & resource data.',
    tabId: 'map',
  },
  {
    id: 'otolith',
    icon: Microscope,
    title: 'Otolith & Taxonomy',
    desc: 'Species identification and advanced taxonomy for sustainable fisheries.',
    tabId: 'otolith',
  },
  {
    id: 'edna',
    icon: Dna,
    title: 'eDNA & Digital Twin',
    desc: 'Environmental DNA analysis and digital twin models for ecosystem health.',
    tabId: 'edna',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'AI Agents',
    desc: 'Intelligent agents for anomaly detection, forecasting and decision support.',
    tabId: 'chat',
  },
  {
    id: 'dashboard',
    icon: BarChart3,
    title: 'Dashboard',
    desc: 'Custom dashboards and reports for stakeholders and policymakers.',
    tabId: 'overview',
  },
];


// ══════════════════════════════════════════════════════════════════
// TRUSTED BY DATA
// ══════════════════════════════════════════════════════════════════

const trustedByData = [
  { abbr: 'INCOIS', full: 'Indian National Centre for Ocean Information Services', colorClass: 'incois' },
  { abbr: 'NIOT', full: 'National Institute of Ocean Technology', colorClass: 'niot' },
  { abbr: 'CMFRI', full: 'Central Marine Fisheries Research Institute', colorClass: 'cmfri' },
  { abbr: 'NCCR', full: 'National Centre for Coastal Research', colorClass: 'nccr' },
  { abbr: 'IITM', full: 'Indian Institute of Tropical Meteorology', colorClass: 'iitm' },
  { abbr: 'ISRO', full: 'Indian Space Research Organisation', colorClass: 'isro' },
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
// MAIN LANDING PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════

export default function LandingPage({ onEnter, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [videoError, setVideoError] = useState(false);
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

  const handleExplore = () => {
    if (onEnter) onEnter();
  };

  const handleNavClick = (tabId) => {
    if (onNavigate) onNavigate(tabId);
  };

  const handleCapabilityClick = (tabId) => {
    if (onNavigate) onNavigate(tabId);
  };

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

      {/* ── Hero Section ── */}
      <section className="lp-hero" id="lp-hero">
        <HeroParticles />

        <div className="lp-hero-content lp-slide-in-left">
          <h2 className="lp-hero-heading">
            INTELLIGENCE BENEATH<br />
            THE <span className="lp-accent">SURFACE</span>
          </h2>
          <p className="lp-hero-subtitle">
            A unified ocean intelligence platform combining AI,
            Oceanography, and Geospatial Analytics to understand,
            predict and protect our oceans.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-primary" onClick={handleExplore} id="explore-platform-btn">
              <BarChart3 size={16} />
              Explore Platform
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

      {/* ── Stats Bar ── */}
      <div className="lp-stats-bar" id="lp-stats-bar">
        {statsData.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ── Core Capabilities ── */}
      <section className="lp-capabilities" id="lp-capabilities">
        <div className="lp-section-label lp-fade-in">OUR CORE CAPABILITIES</div>
        <h3 className="lp-section-title lp-fade-in lp-fade-in-delay-1">
          Integrated. Intelligent. Impactful.
        </h3>

        <div className="lp-capabilities-grid">
          {capabilitiesData.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className={`lp-capability-card lp-fade-in lp-fade-in-delay-${Math.min(i + 1, 6)}`}
                onClick={() => handleCapabilityClick(cap.tabId)}
                id={`capability-${cap.id}`}
              >
                <div className="lp-capability-icon">
                  <Icon />
                </div>
                <div className="lp-capability-title">{cap.title}</div>
                <div className="lp-capability-desc">{cap.desc}</div>
                <div className="lp-capability-link">
                  <ArrowRight />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trusted By ── */}
      <div className="lp-trusted" id="lp-trusted">
        <div className="lp-trusted-label">Trusted By</div>
        <div className="lp-trusted-logos">
          {trustedByData.map((org) => (
            <div key={org.abbr} className="lp-trusted-item">
              <div className={`lp-trusted-logo-icon ${org.colorClass}`}>
                {org.abbr.slice(0, 2)}
              </div>
              <div className="lp-trusted-logo-text">
                <div className="lp-trusted-name">{org.abbr}</div>
                <div className="lp-trusted-full">{org.full}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
