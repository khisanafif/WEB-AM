import React from 'react';
import {
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  Users,
  BookOpen,
  Award,
} from 'lucide-react';
import { ORG_INFO, ALL_GALLERY_PHOTOS } from '../data/ambuluData';

const VALUE_ICONS = {
  pendidikan: BookOpen,
  sosial: Heart,
  kolaborasi: Users,
  pengabdian: Award,
};

const MILESTONE_PHOTOS = [
  ALL_GALLERY_PHOTOS[3],
  ALL_GALLERY_PHOTOS[10],
  ALL_GALLERY_PHOTOS[4],
  ALL_GALLERY_PHOTOS[6],
  ALL_GALLERY_PHOTOS[0],
];

export default function AboutSection({ backendState, onOpenLightbox }) {
  const milestones =
    backendState?.milestones && backendState.milestones.length > 0
      ? backendState.milestones
      : ORG_INFO.milestones;
  const vision = backendState?.visionMission?.vision || ORG_INFO.vision;
  const missions =
    backendState?.visionMission?.missions &&
    backendState.visionMission.missions.length > 0
      ? backendState.visionMission.missions
      : ORG_INFO.missions;

  return (
    <section className="am-section" id="tentang">
      <div className="am-container">
        <div className="am-section-header am-header-split">
          <div>
            <span className="am-section-eyebrow">
              <Sparkles size={13} /> Sejarah & Fondasi Gerakan
            </span>
            <h2 className="am-section-title">
              Perjalanan & Visi <span>Ambulu Mengajar</span>
            </h2>
          </div>
          <p className="am-section-desc">
            Jejak perjalanan gerakan dari masa ke masa serta empat pilar misi
            utama yang menjadi landasan pengabdian kami di Kecamatan Ambulu.
          </p>
        </div>

        {/* VISION & ALL 4 MISSIONS DIRECTLY OPEN IN UNIFIED BENTO LAYOUT */}
        <div className="am-vm-bento-row">
          <div className="am-card am-vision-interactive-box">
            <div className="am-card-icon-badge">
              <Target size={22} />
            </div>
            <span className="am-box-tag">VISI & MISI ORGANISASI</span>
            <h3>Cita-Cita Utama Ambulu Mengajar</h3>
            <p className="am-vision-lead">{vision}</p>

            <div className="am-mission-selector-title">
              Empat Pilar Misi Utama:
            </div>
            <div className="am-missions-open-list">
              {missions.map((m, idx) => (
                <div key={m.id || idx} className="am-mission-open-card">
                  <div className="am-mission-open-head">
                    <span className="am-mpill-num">0{idx + 1}</span>
                    <strong>{m.title}</strong>
                  </div>
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="am-values-bento-col">
            {ORG_INFO.coreValues.map((val) => {
              const IconComp = VALUE_ICONS[val.id] || Sparkles;
              return (
                <div key={val.id} className="am-card am-value-bento-card">
                  <div className="am-val-top">
                    <div className="am-value-icon">
                      <IconComp size={19} />
                    </div>
                    <h4>{val.title}</h4>
                  </div>
                  <p>{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MILESTONES / TIMELINE DIRECTLY OPEN CARDS */}
        <div className="am-card am-timemachine-card">
          <div className="am-tm-header">
            <div className="am-tm-label">
              <Calendar size={16} />
              <span>Jejak Perjalanan Organisasi (2011 – Kini)</span>
            </div>
          </div>

          <div className="am-milestones-open-grid">
            {milestones.map((ms, idx) => {
              const photo =
                MILESTONE_PHOTOS[idx % MILESTONE_PHOTOS.length] ||
                ALL_GALLERY_PHOTOS[0];
              return (
                <div key={ms.id || ms.year || idx} className="am-milestone-open-item">
                  <div className="am-ms-open-top">
                    <span className="am-ms-year-pill">{ms.year}</span>
                    <span className="am-ms-badge-text">
                      {ms.badge || `Tahap 0${idx + 1}`}
                    </span>
                  </div>
                  <h4>{ms.title}</h4>
                  <p>{ms.desc}</p>
                  <button
                    type="button"
                    className="am-ms-photo-preview"
                    onClick={() => onOpenLightbox && onOpenLightbox(photo)}
                  >
                    <img src={ms.image || photo.src} alt={ms.title} />
                    <span>
                      <CheckCircle2 size={12} /> {photo.albumTitle}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
