import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
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
  const vision =
    backendState?.visionMission?.vision || ORG_INFO.vision;
  const missions =
    backendState?.visionMission?.missions &&
    backendState.visionMission.missions.length > 0
      ? backendState.visionMission.missions
      : ORG_INFO.missions;

  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(
    Math.max(0, milestones.length - 1)
  );
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);

  const safeIdx = Math.min(activeMilestoneIdx, milestones.length - 1);
  const currentMilestone = milestones[safeIdx] || milestones[0];
  const currentMilestonePhoto =
    MILESTONE_PHOTOS[safeIdx % MILESTONE_PHOTOS.length] || ALL_GALLERY_PHOTOS[0];

  const handlePrevYear = () => {
    setActiveMilestoneIdx(
      (prev) => (prev - 1 + milestones.length) % milestones.length
    );
  };

  const handleNextYear = () => {
    setActiveMilestoneIdx((prev) => (prev + 1) % milestones.length);
  };

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
            Telusuri perkembangan gerakan dari tahun ke tahun serta empat pilar
            misi utama yang menjadi landasan pengabdian kami di Kecamatan Ambulu.
          </p>
        </div>

        {/* INTERACTIVE TIME-MACHINE EXPLORER */}
        <div className="am-card am-timemachine-card">
          <div className="am-tm-header">
            <div className="am-tm-label">
              <Calendar size={16} />
              <span>Jejak Perjalanan Organisasi</span>
            </div>

            <div className="am-tm-nav-arrows">
              <button
                type="button"
                onClick={handlePrevYear}
                className="am-tm-arrow"
                aria-label="Era sebelumnya"
              >
                <ChevronLeft size={17} /> Sebelumnya
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                className="am-tm-arrow"
                aria-label="Era selanjutnya"
              >
                Selanjutnya <ChevronRight size={17} />
              </button>
            </div>
          </div>

          <div className="am-tm-track" role="tablist">
            {milestones.map((ms, idx) => {
              const isActive = idx === safeIdx;
              return (
                <button
                  key={ms.id || ms.year || idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`am-tm-node ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveMilestoneIdx(idx)}
                >
                  <span className="am-tm-year">{ms.year}</span>
                  <span className="am-tm-badge">
                    {ms.badge || `Tahap 0${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>

          {currentMilestone && (
            <div className="am-tm-stage">
              <div className="am-tm-stage-text">
                <div className="am-tm-stage-pill">
                  Tonggak Sejarah • {currentMilestone.year}
                </div>
                <h3>{currentMilestone.title}</h3>
                <p>{currentMilestone.desc}</p>

                <div className="am-tm-story-quote">
                  <p>{ORG_INFO.extendedAbout[safeIdx % 3]}</p>
                </div>
              </div>

              <div
                className="am-tm-stage-media"
                onClick={() =>
                  onOpenLightbox && onOpenLightbox(currentMilestonePhoto)
                }
              >
                <img
                  src={currentMilestone.image || currentMilestonePhoto.src}
                  alt={currentMilestone.title}
                />
                <div className="am-tm-media-caption">
                  <span>Arsip Dokumentasi Kegiatan</span>
                  <strong>{currentMilestonePhoto.albumTitle}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VISION & INTERACTIVE MISSION PILLARS */}
        <div className="am-vm-bento-row">
          <div className="am-card am-vision-interactive-box">
            <div className="am-card-icon-badge">
              <Target size={22} />
            </div>
            <span className="am-box-tag">VISI ORGANISASI</span>
            <h3>Cita-Cita Utama Ambulu Mengajar</h3>
            <p className="am-vision-lead">{vision}</p>

            <div className="am-mission-selector-title">
              Pilih Pilar Misi Utama:
            </div>
            <div className="am-mission-pills">
              {missions.map((m, idx) => (
                <button
                  key={m.id || idx}
                  type="button"
                  className={`am-mission-pill ${
                    activeMissionIdx === idx ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveMissionIdx(idx)}
                >
                  <span className="am-mpill-num">0{idx + 1}</span>
                  <span>{m.title}</span>
                </button>
              ))}
            </div>

            <div className="am-mission-active-detail">
              <CheckCircle2 size={18} />
              <p>
                {missions[activeMissionIdx]?.desc || missions[0]?.desc || ''}
              </p>
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
      </div>
    </section>
  );
}
