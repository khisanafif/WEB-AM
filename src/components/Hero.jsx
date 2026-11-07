import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Sparkles,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ORG_INFO,
  ALL_GALLERY_PHOTOS,
  SOCIAL_LINKS,
} from '../data/ambuluData';

const HERO_SLIDES = [
  ALL_GALLERY_PHOTOS[3], // Goes To School 2022 - Foto 1
  ALL_GALLERY_PHOTOS[5], // Goes To School 2022 - Foto 3 (Classroom)
  ALL_GALLERY_PHOTOS[2], // AMF X Pembidik Misi 2022 - Foto 3
  ALL_GALLERY_PHOTOS[7], // AMF Baksos Immamul Mutaqien 2021
];

export default function Hero({ onOpenLightbox }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentPhoto = HERO_SLIDES[activeSlide];

  return (
    <section className="am-hero" id="home">
      <div className="am-hero-bg-orb am-orb-1" />
      <div className="am-hero-bg-orb am-orb-2" />

      <div className="am-container">
        <div className="am-hero-grid">
          {/* Left Narrative Column */}
          <div className="am-hero-content">
            <div className="am-eyebrow-pill">
              <span className="am-pulse-dot" />
              <span>{ORG_INFO.category}</span>
              <span className="am-pill-sep">•</span>
              <span className="am-pill-loc">
                <MapPin size={13} /> Kec. Ambulu, Jember
              </span>
            </div>

            <h1 className="am-hero-title">
              Membangun Mimpi Pelajar Bersama{' '}
              <span className="am-text-gradient">{ORG_INFO.name}</span>
            </h1>

            {/* Exact statement from ambulumengajar.carrd.co (#text04) */}
            <div className="am-carrd-statement-box">
              <div className="am-statement-badge">
                <Sparkles size={14} /> Profil Resmi Ambulu Mengajar
              </div>
              <p id="text04" className="am-carrd-statement-text">
                <strong>Ambulu Mengajar</strong> adalah sebuah organisasi
                non-profit yang bergerak di bidang pendidikan dan sosial. Tekad
                Ambulu Mengajar untuk membantu pelajar di Ambulu dan sekitarnya
                agar dapat melanjutkan pendidikan setinggi mungkin demi kemajuan
                bangsa sebagai bentuk pengabdian diri pada tanah air Indonesia.
              </p>
            </div>

            <div className="am-hero-highlights">
              <div className="am-highlight-chip">
                <CheckCircle2 size={16} /> Roadshow Goes To School
              </div>
              <div className="am-highlight-chip">
                <CheckCircle2 size={16} /> Beasiswa SMA (AMF)
              </div>
              <div className="am-highlight-chip">
                <CheckCircle2 size={16} /> Pembidik Misi & Mimpi
              </div>
              <div className="am-highlight-chip">
                <CheckCircle2 size={16} /> Bakti Sosial Panti Asuhan
              </div>
            </div>

            <div className="am-hero-cta-group">
              <a href="#divisiambulumengajar" className="am-btn am-btn-primary">
                Jelajahi 4 Divisi Kami <ArrowRight size={18} />
              </a>
              <a href="#eventambulumengajar" className="am-btn am-btn-secondary">
                <HeartHandshake size={18} /> Event & Open Donation
              </a>
              <a
                href="#dokumentasiambulumengajar"
                className="am-btn am-btn-outline"
              >
                <Camera size={18} /> 13 Foto Dokumentasi
              </a>
            </div>

            {/* Social Media Strip */}
            <div className="am-hero-socials">
              <span className="am-socials-label">Kanal Resmi:</span>
              <div className="am-social-icons-row">
                {SOCIAL_LINKS.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-social-pill"
                    title={`${soc.name} (${soc.handle})`}
                  >
                    <svg className="am-carrd-svg-icon">
                      <use xlinkHref={`#${soc.iconId}`} />
                    </svg>
                    <span>{soc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Interactive Showcase Column */}
          <div className="am-hero-showcase">
            <div className="am-showcase-card">
              {/* Official Identity Header matching Carrd #image01 & #text01 */}
              <div className="am-showcase-brand-top">
                <div className="am-logo-ring" id="image01">
                  <img
                    src={ORG_INFO.logoMain}
                    alt="Logo Resmi Ambulu Mengajar"
                  />
                </div>
                <div>
                  <span className="am-showcase-tag">Official Identity</span>
                  <h2 id="text01" className="am-showcase-title">
                    {ORG_INFO.name}
                  </h2>
                  <p className="am-showcase-sub">{ORG_INFO.tagline}</p>
                </div>
              </div>

              {/* Interactive Photo Carousel from Real Documentation */}
              <div className="am-showcase-slider">
                <div
                  className="am-slider-image-wrap"
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
                    className="am-slider-img"
                  />
                  <div className="am-slider-overlay">
                    <span className="am-slider-badge">
                      {currentPhoto.albumTitle}
                    </span>
                    <p className="am-slider-caption">{currentPhoto.caption}</p>
                  </div>
                </div>

                <div className="am-slider-controls">
                  <button
                    type="button"
                    className="am-slider-btn"
                    onClick={() =>
                      setActiveSlide(
                        (prev) =>
                          (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                      )
                    }
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="am-slider-dots">
                    {HERO_SLIDES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`am-slider-dot ${
                          idx === activeSlide ? 'is-active' : ''
                        }`}
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Pilih slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="am-slider-btn"
                    onClick={() =>
                      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
                    }
                    aria-label="Slide selanjutnya"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* 4 Division Pills */}
              <div className="am-showcase-div-pills">
                <a href="#divisiambulumengajar" className="am-div-mini-pill">
                  <strong>01</strong> HRD
                </a>
                <a href="#divisiambulumengajar" className="am-div-mini-pill">
                  <strong>02</strong> AML
                </a>
                <a href="#divisiambulumengajar" className="am-div-mini-pill">
                  <strong>03</strong> AMF
                </a>
                <a href="#divisiambulumengajar" className="am-div-mini-pill">
                  <strong>04</strong> KOMINFO
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Key Statistics Row */}
        <div className="am-stats-grid">
          {ORG_INFO.stats.map((st, idx) => (
            <div key={idx} className="am-stat-card">
              <div className="am-stat-value">{st.value}</div>
              <div className="am-stat-label">{st.label}</div>
              <p className="am-stat-sub">{st.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

