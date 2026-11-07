import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  MapPin,
  Play,
  Pause,
  ZoomIn,
  Layers,
  HeartHandshake,
  Camera,
  ChevronRight,
} from 'lucide-react';
import {
  ORG_INFO,
  DIVISIONS,
  ALL_GALLERY_PHOTOS,
  SOCIAL_LINKS,
} from '../data/ambuluData';

export default function Hero({ onOpenLightbox, onSelectDivision }) {
  const [slideIdx, setSlideIdx] = useState(3); // Starts with Goes To School 2022
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStatIdx, setActiveStatIdx] = useState(0);
  const [missionMode, setMissionMode] = useState('carrd');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % ALL_GALLERY_PHOTOS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentPhoto = ALL_GALLERY_PHOTOS[slideIdx] || ALL_GALLERY_PHOTOS[0];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleJumpDivision = (divId) => {
    if (onSelectDivision) onSelectDivision(divId);
    const el = document.getElementById('divisiambulumengajar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="am-bento-hero-section" id="home">
      <div className="am-hero-bg-orb am-orb-1" />
      <div className="am-hero-bg-orb am-orb-2" />

      <div className="am-container">
        <div className="am-bento-grid">
          {/* ================================================================
              TILE 1: MAIN EDITORIAL & INTERACTIVE MISSION TILE (7 Cols)
              ================================================================ */}
          <div className="am-bento-tile am-tile-editorial">
            <div className="am-tile-top-bar">
              <div className="am-eyebrow-pill">
                <span className="am-pulse-dot" />
                <span>{ORG_INFO.category}</span>
              </div>
              <span className="am-loc-tag">
                <MapPin size={13} /> Kec. Ambulu, Kab. Jember
              </span>
            </div>

            <h1 className="am-bento-hero-title">
              Gerakan Pemuda & Pendidikan{' '}
              <span className="am-text-gradient">{ORG_INFO.name}</span>
            </h1>

            {/* Interactive Mission Mode Switcher */}
            <div className="am-mission-interactive-box">
              <div className="am-mission-tabs">
                <button
                  type="button"
                  className={missionMode === 'carrd' ? 'is-active' : ''}
                  onClick={() => setMissionMode('carrd')}
                >
                  <Sparkles size={13} /> Teks Resmi Carrd
                </button>
                <button
                  type="button"
                  className={missionMode === 'edukasi' ? 'is-active' : ''}
                  onClick={() => setMissionMode('edukasi')}
                >
                  Fokus Pendidikan
                </button>
                <button
                  type="button"
                  className={missionMode === 'sosial' ? 'is-active' : ''}
                  onClick={() => setMissionMode('sosial')}
                >
                  Fokus Beasiswa & Sosial
                </button>
              </div>

              {missionMode === 'carrd' && (
                <p id="text04" className="am-carrd-statement-text">
                  <strong>Ambulu Mengajar</strong> adalah sebuah organisasi
                  non-profit yang bergerak di bidang pendidikan dan sosial.
                  Tekad Ambulu Mengajar untuk membantu pelajar di Ambulu dan
                  sekitarnya agar dapat melanjutkan pendidikan setinggi mungkin
                  demi kemajuan bangsa sebagai bentuk pengabdian diri pada tanah
                  air Indonesia.
                </p>
              )}

              {missionMode === 'edukasi' && (
                <p className="am-carrd-statement-text">
                  Melalui <strong>Divisi AML (Ambulu Mengajar Learning)</strong>
                  , kami menyelenggarakan kegiatan belajar mengajar, bimbingan
                  masuk PTN, dan <em>Ambulu Mengajar Goes To School</em> ke
                  sekolah-sekolah SMA/SMK/MA di Kecamatan Ambulu agar pelajar
                  memiliki motivasi dan kesiapan menembus perguruan tinggi.
                </p>
              )}

              {missionMode === 'sosial' && (
                <p className="am-carrd-statement-text">
                  Melalui{' '}
                  <strong>Divisi AMF (Ambulu Mengajar Foundation)</strong>, kami
                  membawahi penyelenggaraan beasiswa tingkat SMA, memfasilitasi
                  informasi beasiswa pelajar (
                  <em>AMF X Pembidik Misi & Pembidik Mimpi</em>), serta
                  menggelar aksi <em>AMF Baksos</em> dan donasi panti asuhan.
                </p>
              )}
            </div>

            <div className="am-bento-cta-row">
              <a href="#divisiambulumengajar" className="am-btn am-btn-primary">
                <Layers size={17} /> Buka Studio 4 Divisi
              </a>
              <a
                href="#eventambulumengajar"
                className="am-btn am-btn-secondary"
              >
                <HeartHandshake size={17} /> Simulator Donasi KURMA
              </a>
              <a
                href="#dokumentasiambulumengajar"
                className="am-btn am-btn-outline"
              >
                <Camera size={17} /> Cinema 13 Foto
              </a>
            </div>
          </div>

          {/* ================================================================
              TILE 2: 3D-TILT IDENTITY & LIVE REEL STAGE (5 Cols)
              ================================================================ */}
          <div
            className="am-bento-tile am-tile-stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            }}
          >
            <div className="am-stage-identity-header">
              <div className="am-logo-ring" id="image01">
                <img
                  src={ORG_INFO.logoMain}
                  alt="Logo Resmi Ambulu Mengajar"
                />
              </div>
              <div className="am-stage-identity-meta">
                <span className="am-showcase-tag">
                  Official Identity • Carrd Verified
                </span>
                <h2 id="text01" className="am-showcase-title">
                  {ORG_INFO.name}
                </h2>
                <p className="am-showcase-sub">{ORG_INFO.tagline}</p>
              </div>
            </div>

            {/* Interactive Live Reel Player */}
            <div className="am-live-reel-box">
              <div
                className="am-reel-viewport"
                onClick={() => onOpenLightbox(currentPhoto)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && onOpenLightbox(currentPhoto)
                }
              >
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.caption}
                  className="am-reel-img"
                />
                <div className="am-reel-top-chips">
                  <span className="am-reel-counter">
                    Foto {slideIdx + 1} / {ALL_GALLERY_PHOTOS.length}
                  </span>
                  <span className="am-reel-zoom-pill">
                    <ZoomIn size={13} /> Perbesar
                  </span>
                </div>
                <div className="am-reel-bottom-bar">
                  <span className="am-reel-album-tag">
                    {currentPhoto.albumTitle} ({currentPhoto.year})
                  </span>
                  <p className="am-reel-caption">{currentPhoto.caption}</p>
                </div>
              </div>

              <div className="am-reel-scrubber">
                <button
                  type="button"
                  className="am-reel-play-btn"
                  onClick={() => setIsPlaying((p) => !p)}
                  title={isPlaying ? 'Jeda Slideshow' : 'Putar Slideshow'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <div className="am-reel-thumbs">
                  {ALL_GALLERY_PHOTOS.slice(0, 7).map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`am-reel-thumb-dot ${
                        idx === slideIdx ? 'is-active' : ''
                      }`}
                      onClick={() => setSlideIdx(idx)}
                      aria-label={`Pilih foto ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="am-reel-next-text"
                  onClick={() =>
                    setSlideIdx((prev) => (prev + 1) % ALL_GALLERY_PHOTOS.length)
                  }
                >
                   Foto Berikutnya <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================
              TILE 3: INTERACTIVE IMPACT INSPECTOR TILE (4 Cols)
              ================================================================ */}
          <div className="am-bento-tile am-tile-stats">
            <div className="am-tile-label-row">
              <span>Indikator Dampak Organisasi</span>
              <span className="am-hint-tag">Klik angka untuk detail</span>
            </div>

            <div className="am-interactive-stats-grid">
              {ORG_INFO.stats.map((st, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`am-stat-select-btn ${
                    activeStatIdx === idx ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveStatIdx(idx)}
                >
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>

            <div className="am-stat-detail-callout">
              <strong>{ORG_INFO.stats[activeStatIdx].label}:</strong>{' '}
              {ORG_INFO.stats[activeStatIdx].sub}
            </div>
          </div>

          {/* ================================================================
              TILE 4: INTERACTIVE 4-DIVISION QUICK LAUNCHER (4 Cols)
              ================================================================ */}
          <div className="am-bento-tile am-tile-div-launcher">
            <div className="am-tile-label-row">
              <span>4 Divisi Inti Ambulu Mengajar</span>
              <a href="#divisiambulumengajar">Studio Penuh →</a>
            </div>

            <div className="am-div-launcher-grid">
              {DIVISIONS.map((div) => (
                <button
                  key={div.id}
                  type="button"
                  className="am-div-launch-card"
                  onClick={() => handleJumpDivision(div.id)}
                >
                  <div className="am-div-launch-top">
                    <span className="am-div-launch-num">{div.number}</span>
                    <ArrowUpRight size={15} />
                  </div>
                  <strong>Divisi {div.code}</strong>
                  <span>{div.fullName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ================================================================
              TILE 5: OFFICIAL SOCIALS & LINKTREE HUB TILE (4 Cols)
              ================================================================ */}
          <div className="am-bento-tile am-tile-socials-hub">
            <div className="am-tile-label-row">
              <span>Ekosistem Digital Resmi</span>
              <span>4 Kanal Aktif</span>
            </div>

            <div className="am-bento-socials-list">
              {SOCIAL_LINKS.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="am-bento-social-row"
                >
                  <div className="am-bento-soc-left">
                    <div className="am-bento-soc-icon">
                      <svg className="am-carrd-svg-icon">
                        <use xlinkHref={`#${soc.iconId}`} />
                      </svg>
                    </div>
                    <div>
                      <strong>{soc.name}</strong>
                      <span>{soc.handle}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="am-bento-soc-arrow" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
