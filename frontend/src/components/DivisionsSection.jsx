import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Share2,
  Sparkles,
  Briefcase,
  CheckCircle2,
  Compass,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';
import { DIVISIONS, ALL_GALLERY_PHOTOS } from '../data/ambuluData';

const DIVISION_ICONS = {
  hrd: Users,
  aml: GraduationCap,
  amf: HeartHandshake,
  kominfo: Share2,
};

const QUIZ_OPTIONS = [
  {
    id: 'q-hrd',
    divId: 'hrd',
    label: 'Membangun tim, rekrutmen relawan & menjalin relasi sekolah/mitra',
    badge: 'Cocok ke Divisi HRD',
  },
  {
    id: 'q-aml',
    divId: 'aml',
    label: 'Mengajar di kelas, memotivasi siswa SMA & roadshow Goes To School',
    badge: 'Cocok ke Divisi AML',
  },
  {
    id: 'q-amf',
    divId: 'amf',
    label: 'Mengelola beasiswa SMA, info beasiswa & aksi bakti sosial panti',
    badge: 'Cocok ke Divisi AMF',
  },
  {
    id: 'q-kominfo',
    divId: 'kominfo',
    label: 'Desain grafis, dokumentasi foto/video & kelola medsos @ambulumengajar',
    badge: 'Cocok ke Divisi KOMINFO',
  },
];

export default function DivisionsSection({
  selectedDivId,
  onSelectDivision,
  onOpenLightbox,
}) {
  const [activeDivId, setActiveDivId] = useState(selectedDivId || 'hrd');
  const [quizSelected, setQuizSelected] = useState(null);

  // Sync if parent CommandPalette changes selectedDivId
  React.useEffect(() => {
    if (selectedDivId) setActiveDivId(selectedDivId);
  }, [selectedDivId]);

  const handleChooseDiv = (id) => {
    setActiveDivId(id);
    if (onSelectDivision) onSelectDivision(id);
  };

  const activeDivision =
    DIVISIONS.find((d) => d.id === activeDivId) || DIVISIONS[0];
  const ActiveIcon = DIVISION_ICONS[activeDivision.id] || Users;

  // Related documentation photos for the active division
  const relatedPhotos = React.useMemo(() => {
    if (activeDivision.id === 'aml') {
      return ALL_GALLERY_PHOTOS.filter((p) => p.albumId === 'gallery01');
    }
    if (activeDivision.id === 'amf') {
      return ALL_GALLERY_PHOTOS.filter((p) =>
        ['gallery05', 'gallery02', 'gallery03', 'gallery04'].includes(p.albumId)
      ).slice(0, 3);
    }
    return ALL_GALLERY_PHOTOS.slice(0, 3);
  }, [activeDivision.id]);

  const textIds = {
    hrd: 'text02',
    aml: 'text09',
    amf: 'text10',
    kominfo: 'text11',
  };
  const listIds = {
    hrd: 'list01',
    aml: 'list02',
    amf: 'list03',
    kominfo: 'list04',
  };

  return (
    <section className="am-section" id="divisiambulumengajar">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">
            <Compass size={13} /> Interactive Division Studio
          </span>
          <h2 id="text05" className="am-section-title">
            STUDIO 4 <span>DIVISI</span> RESMI
          </h2>
          <p className="am-section-desc">
            Klik salah satu dari empat divisi utama{' '}
            <strong>Ambulu Mengajar</strong> di sebelah kiri untuk membuka
            rincian tugas resmi Carrd, program kerja, serta dokumentasi terkait
            di panggung interaktif sebelah kanan.
          </p>
        </div>

        {/* ==================================================================
            MASTER-DETAIL INTERACTIVE DIVISION COMMAND STUDIO
            ================================================================== */}
        <div className="am-studio-layout">
          {/* LEFT RAIL: 4 Official Divisions Selector (Retains all Carrd IDs) */}
          <div className="am-studio-rail">
            {DIVISIONS.map((div) => {
              const IconComp = DIVISION_ICONS[div.id] || Users;
              const isSelected = div.id === activeDivision.id;
              return (
                <div
                  key={div.id}
                  className={`am-rail-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleChooseDiv(div.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleChooseDiv(div.id)
                  }
                >
                  <div className="am-rail-card-top">
                    <div className="am-rail-icon">
                      <IconComp size={20} />
                    </div>
                    <span className="am-rail-code">
                      {div.number} • DIVISI {div.code}
                    </span>
                  </div>

                  <h3 id={textIds[div.id]} className="am-rail-title">
                    {div.exactTitle}
                  </h3>

                  {/* Exact Carrd Bullet Points (#list01 - #list04) */}
                  <ul id={listIds[div.id]} className="am-rail-carrd-list">
                    {div.carrdPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* RIGHT STAGE: Active Division Deep-Dive Workspace */}
          <div className="am-studio-stage">
            <div className="am-stage-banner">
              <div className="am-stage-banner-left">
                <div className="am-stage-big-icon">
                  <ActiveIcon size={30} />
                </div>
                <div>
                  <span className="am-stage-badge">
                    Divisi Aktif • {activeDivision.fullName}
                  </span>
                  <h3>{activeDivision.exactTitle}</h3>
                  <p className="am-stage-tagline">{activeDivision.tagline}</p>
                </div>
              </div>
              <span className="am-stage-watermark">
                {activeDivision.number}
              </span>
            </div>

            <p className="am-stage-description">{activeDivision.description}</p>

            {/* Exact Carrd Responsibilities Highlight */}
            <div className="am-stage-carrd-box">
              <span className="am-stage-sub-label">
                <Sparkles size={14} /> Mandat Utama Divisi (Sesuai
                ambulumengajar.carrd.co):
              </span>
              <div className="am-stage-carrd-grid">
                {activeDivision.carrdPoints.map((pt, idx) => (
                  <div key={idx} className="am-stage-mandate-pill">
                    <CheckCircle2 size={17} />
                    <strong>{pt}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Key Programs of Selected Division */}
            <div className="am-stage-programs-block">
              <span className="am-stage-sub-label">
                <Briefcase size={14} /> Rincian Program Kerja & Aktivitas{' '}
                {activeDivision.shortTitle}:
              </span>
              <div className="am-stage-prog-grid">
                {activeDivision.programs.map((prog, idx) => (
                  <div key={idx} className="am-stage-prog-card">
                    <span className="am-prog-num">0{idx + 1}</span>
                    <p>{prog}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Documentation Preview Strip */}
            <div className="am-stage-photos-block">
              <div className="am-stage-sub-row">
                <span className="am-stage-sub-label">
                  Sorotan Dokumentasi Terkait {activeDivision.shortTitle}:
                </span>
                <div className="am-stage-skill-chips">
                  {activeDivision.skills.map((s, i) => (
                    <span key={i} className="am-mini-skill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="am-stage-photo-strip">
                {relatedPhotos.map((ph) => (
                  <div
                    key={ph.id}
                    className="am-stage-photo-thumb"
                    onClick={() => onOpenLightbox && onOpenLightbox(ph)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      onOpenLightbox &&
                      onOpenLightbox(ph)
                    }
                  >
                    <img src={ph.src} alt={ph.caption} />
                    <div className="am-stage-thumb-overlay">
                      <span>{ph.albumTitle}</span>
                      <ZoomIn size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            INTERACTIVE VOLUNTEER DIVISION MATCHER ("KUIS COCOK DIVISI MANA?")
            ================================================================== */}
        <div className="am-bento-tile am-matcher-quiz-bar">
          <div className="am-matcher-header">
            <div>
              <span className="am-tm-eyebrow">
                <Sparkles size={13} /> Simulasi Interaktif Calon Relawan
              </span>
              <h4>Ingin Bergabung? Pilih Aktivitas yang Paling Kamu Sukai:</h4>
            </div>
            {quizSelected && (
              <a href="#kontak" className="am-btn am-btn-primary am-btn-sm">
                Daftar Relawan Divisi {quizSelected.toUpperCase()}{' '}
                <ArrowRight size={14} />
              </a>
            )}
          </div>

          <div className="am-matcher-options-grid">
            {QUIZ_OPTIONS.map((opt) => {
              const isChosen = quizSelected === opt.divId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`am-matcher-option-btn ${
                    isChosen ? 'is-chosen' : ''
                  }`}
                  onClick={() => {
                    setQuizSelected(opt.divId);
                    handleChooseDiv(opt.divId);
                  }}
                >
                  <span className="am-matcher-badge">{opt.badge}</span>
                  <p>{opt.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
