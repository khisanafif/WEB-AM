import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Layers,
  Play,
  Pause,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import {
  ORG_INFO,
  DIVISIONS,
  ALL_GALLERY_PHOTOS,
  SOCIAL_LINKS,
} from '../data/ambuluData';

export default function Hero({
  backendState,
  onOpenLightbox,
  onSelectDivision,
}) {
  const orgInfo = backendState?.orgInfo || {
    name: ORG_INFO.name,
    tagline: ORG_INFO.tagline,
    category: ORG_INFO.category,
    location: ORG_INFO.location,
    foundedYear: String(ORG_INFO.foundedYear),
    description: ORG_INFO.exactCarrdDescription,
    educationFocus:
      'Memfasilitasi siswa-siswi SMA/SMK/MA sederajat di wilayah Ambulu dengan bimbingan belajar, pengenalan dunia perkuliahan, bedah jurusan, serta motivasi studi lanjut bersama mahasiswa asal Ambulu dari berbagai perguruan tinggi di Indonesia.',
    socialFocus:
      'Menggerakkan kepedulian sosial masyarakat melalui penyelenggaraan beasiswa pendidikan tingkat SMA serta aksi bakti sosial kemanusiaan di panti asuhan dan masyarakat sekitar.',
    logoMain: ORG_INFO.logoMain,
  };

  const heroStats = backendState?.heroStats || [
    {
      id: 'stat-1',
      value: '2011',
      label: 'Tahun Inisiasi',
      detail: 'Lebih dari satu dekade mendampingi pelajar di Kecamatan Ambulu.',
    },
    {
      id: 'stat-2',
      value: '4 Divisi',
      label: 'Pilar Organisasi',
      detail: 'Sinergi divisi HRD, AML, AMF, dan KOMINFO yang terstruktur.',
    },
    {
      id: 'stat-3',
      value: '5+ Program',
      label: 'Agenda Utama',
      detail: 'Goes To School, Beasiswa SMA, Pembidik Misi, dan Bakti Sosial.',
    },
    {
      id: 'stat-4',
      value: 'Ambulu',
      label: 'Pusat Pengabdian',
      detail: 'Fokus berdampak nyata bagi pelajar & masyarakat Jember Selatan.',
    },
  ];

  const divisions = backendState?.divisions || DIVISIONS;
  const socialLinks = backendState?.socialLinks || SOCIAL_LINKS;

  const [focusMode, setFocusMode] = useState('profil');
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(true);
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const reelPhotos = ALL_GALLERY_PHOTOS.slice(0, 6);

  useEffect(() => {
    if (!reelPlaying || reelPhotos.length === 0) return;
    const timer = setInterval(() => {
      setActiveReelIdx((prev) => (prev + 1) % reelPhotos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [reelPlaying, reelPhotos.length]);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((relY * -8).toFixed(2)),
      y: Number((relX * 8).toFixed(2)),
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const currentReelPhoto = reelPhotos[activeReelIdx] || ALL_GALLERY_PHOTOS[0];

  const focusTabs = [
    {
      id: 'profil',
      label: 'Profil Organisasi',
      badge: 'Dedikasi Pendidikan & Sosial',
      text: orgInfo.description || ORG_INFO.exactCarrdDescription,
    },
    {
      id: 'pendidikan',
      label: 'Fokus Pendidikan',
      badge: 'Pendampingan & Goes To School',
      text:
        orgInfo.educationFocus ||
        'Memfasilitasi siswa-siswi SMA/SMK/MA sederajat di wilayah Ambulu dengan bimbingan belajar, pengenalan dunia perkuliahan, bedah jurusan, serta motivasi studi lanjut.',
    },
    {
      id: 'sosial',
      label: 'Beasiswa & Sosial',
      badge: 'Beasiswa SMA & Bakti Sosial',
      text:
        orgInfo.socialFocus ||
        'Menggerakkan kepedulian sosial masyarakat melalui penyelenggaraan beasiswa pendidikan tingkat SMA serta aksi bakti sosial kemanusiaan di panti asuhan dan masyarakat sekitar.',
    },
  ];

  const activeFocus =
    focusTabs.find((f) => f.id === focusMode) || focusTabs[0];

  const jumpToDivision = (divId) => {
    if (onSelectDivision) onSelectDivision(divId);
    const el = document.getElementById('divisiambulumengajar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="am-hero-bento-section" id="home">
      <div className="am-container">
        <div className="am-bento-grid">
          {/* TILE 1: MAIN EDITORIAL SHOWCASE */}
          <div className="am-bento-tile am-tile-editorial">
            <div className="am-tile-top-bar">
              <span className="am-pill-badge">
                <Sparkles size={13} /> {orgInfo.category}
              </span>
              <span className="am-location-chip">
                <MapPin size={13} /> {orgInfo.location}
              </span>
            </div>

            <h1 className="am-bento-hero-title">
              Membangun Mimpi Pelajar <span>Ambulu</span> Menuju Pendidikan
              Tinggi.
            </h1>

            <div className="am-focus-switcher">
              <div
                className="am-focus-tabs"
                role="tablist"
                aria-label="Fokus Gerakan Ambulu Mengajar"
              >
                {focusTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={focusMode === tab.id}
                    className={`am-focus-tab ${
                      focusMode === tab.id ? 'is-active' : ''
                    }`}
                    onClick={() => setFocusMode(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="am-focus-card" id="text04">
                <div className="am-focus-card-meta">
                  <CheckCircle2 size={14} />
                  <span>{activeFocus.badge}</span>
                </div>
                <p>{activeFocus.text}</p>
              </div>
            </div>

            <div className="am-bento-cta-row">
              <a href="#divisiambulumengajar" className="am-btn am-btn-primary">
                <GraduationCap size={17} /> Jelajahi 4 Divisi Utama
              </a>
              <a href="#eventambulumengajar" className="am-btn am-btn-secondary">
                <HeartHandshake size={17} /> Lihat Program & Kegiatan
              </a>
              <a href="#tentang" className="am-btn am-btn-outline">
                <Compass size={16} /> Jejak Sejarah
              </a>
            </div>
          </div>

          {/* TILE 2: 3D-TILT IDENTITY CARD + LIVE PHOTO REEL */}
          <div className="am-bento-tile am-tile-stage">
            <div
              className="am-identity-3d-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <div className="am-id-card-header">
                <div id="image01" className="am-id-logo-ring">
                  <img
                    src={orgInfo.logoMain || ORG_INFO.logoMain}
                    alt={`Logo ${orgInfo.name}`}
                  />
                </div>
                <div>
                  <span className="am-id-eyebrow">IDENTITAS ORGANISASI</span>
                  <h2 id="text01" className="am-id-title">
                    {orgInfo.name}
                  </h2>
                  <p className="am-id-sub">{orgInfo.tagline}</p>
                </div>
              </div>
            </div>

            <div className="am-live-reel-box">
              <div
                className="am-reel-frame"
                onClick={() =>
                  onOpenLightbox && onOpenLightbox(currentReelPhoto)
                }
              >
                <img
                  src={currentReelPhoto.src}
                  alt={currentReelPhoto.albumTitle}
                  className="am-reel-img"
                />
                <div className="am-reel-overlay">
                  <span className="am-reel-tag">
                    {currentReelPhoto.division} • {currentReelPhoto.year}
                  </span>
                  <strong>{currentReelPhoto.albumTitle}</strong>
                  <p>{currentReelPhoto.caption}</p>
                </div>
              </div>

              <div className="am-reel-controls">
                <button
                  type="button"
                  className="am-reel-play-btn"
                  onClick={() => setReelPlaying((p) => !p)}
                  aria-label={reelPlaying ? 'Jeda' : 'Putar'}
                >
                  {reelPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{reelPlaying ? 'Auto-Reel' : 'Dijeda'}</span>
                </button>

                <div className="am-reel-dots">
                  {reelPhotos.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`am-reel-dot ${
                        idx === activeReelIdx ? 'is-active' : ''
                      }`}
                      onClick={() => setActiveReelIdx(idx)}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TILE 3: INTERACTIVE IMPACT METRIC INSPECTOR */}
          <div className="am-bento-tile am-tile-stats">
            <div className="am-tile-header-mini">
              <span>PROFIL & SKALA GERAKAN</span>
              <small>Pilih metrik untuk detail</small>
            </div>

            <div className="am-stats-interactive-grid">
              {heroStats.map((st, idx) => (
                <button
                  key={st.id || idx}
                  type="button"
                  className={`am-stat-pill-btn ${
                    selectedStatIdx === idx ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedStatIdx(idx)}
                >
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>

            <div className="am-stat-inspector-callout">
              <p>
                {heroStats[selectedStatIdx]?.detail ||
                  heroStats[0]?.detail ||
                  ''}
              </p>
            </div>
          </div>

          {/* TILE 4: 4 DIVISIONS INTERACTIVE QUICK LAUNCHER */}
          <div className="am-bento-tile am-tile-div-launcher">
            <div className="am-tile-header-mini">
              <span>
                <Layers size={13} /> 4 DIVISI FUNGSIONAL
              </span>
              <small>Buka detail divisi</small>
            </div>

            <div className="am-div-launcher-grid">
              {divisions.map((div, idx) => (
                <button
                  key={div.id}
                  type="button"
                  className="am-div-launch-card"
                  onClick={() => jumpToDivision(div.id)}
                >
                  <div className="am-div-launch-top">
                    <span
                      className="am-div-launch-code"
                      style={{ color: div.accentColor }}
                    >
                      0{idx + 1} • {div.code}
                    </span>
                    <ArrowUpRight size={14} />
                  </div>
                  <strong>{div.fullName}</strong>
                  <span>{div.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TILE 5: OFFICIAL CHANNELS HUB */}
          <div className="am-bento-tile am-tile-socials-hub">
            <div className="am-tile-header-mini">
              <span>JEJARING & KANAL RESMI</span>
              <small>Terhubung langsung</small>
            </div>

            <div className="am-social-bento-pills">
              {socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="am-social-bento-item"
                >
                  <div className="am-social-bento-icon">
                    <svg>
                      <use xlinkHref={`#${soc.iconId || 'icon-b0b'}`} />
                    </svg>
                  </div>
                  <div className="am-social-bento-info">
                    <strong>{soc.name}</strong>
                    <span>{soc.handle}</span>
                  </div>
                  <ArrowUpRight size={14} className="am-social-bento-arrow" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
