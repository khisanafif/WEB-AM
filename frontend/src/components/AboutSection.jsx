import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  History,
  HeartHandshake,
  Users,
  Flag,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { ORG_INFO, ALL_GALLERY_PHOTOS } from '../data/ambuluData';

const VALUE_ICONS = {
  pendidikan: BookOpen,
  sosial: HeartHandshake,
  kolaborasi: Users,
  pengabdian: Flag,
};

const MILESTONE_PHOTOS = [
  ALL_GALLERY_PHOTOS[4], // 2011: Classroom inspiration
  ALL_GALLERY_PHOTOS[10], // 2017: Scholarship / Pembidik Mimpi
  ALL_GALLERY_PHOTOS[3], // 2019: Team & formal organization
  ALL_GALLERY_PHOTOS[6], // 2021: AMF Baksos Immamul Mutaqien
  ALL_GALLERY_PHOTOS[2], // 2022: AMF X Pembidik Misi 2022
];

export default function AboutSection({ onOpenLightbox }) {
  const [selectedYearIdx, setSelectedYearIdx] = useState(4); // Default to latest 2022–Kini
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);

  const currentMilestone = ORG_INFO.milestones[selectedYearIdx];
  const currentMilestonePhoto =
    MILESTONE_PHOTOS[selectedYearIdx] || ALL_GALLERY_PHOTOS[0];

  return (
    <section className="am-section am-section-alt" id="tentang">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">
            <History size={13} /> Interactive Organization Story
          </span>
          <h2 className="am-section-title">
            Time-Machine & Visi <span>Ambulu Mengajar</span>
          </h2>
          <p className="am-section-desc">
            Telusuri perjalanan gerakan pengabdian pemuda Kecamatan Ambulu sejak
            tahun 2011 hingga aksi nyata beasiswa dan bakti sosial hari ini.
          </p>
        </div>

        {/* ==================================================================
            PART 1: INTERACTIVE TIME-MACHINE EXPLORER (2011 -> KINI)
            ================================================================== */}
        <div className="am-timemachine-card">
          <div className="am-tm-header">
            <div>
              <span className="am-tm-eyebrow">
                <Sparkles size={13} /> Mesin Waktu Perjalanan Organisasi
              </span>
              <h3>Pilih Tahun untuk Melihat Tonggak Sejarah</h3>
            </div>
            <div className="am-tm-nav-arrows">
              <button
                type="button"
                onClick={() =>
                  setSelectedYearIdx(
                    (prev) =>
                      (prev - 1 + ORG_INFO.milestones.length) %
                      ORG_INFO.milestones.length
                  )
                }
                aria-label="Tahun sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedYearIdx(
                    (prev) => (prev + 1) % ORG_INFO.milestones.length
                  )
                }
                aria-label="Tahun berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Year Track */}
          <div className="am-tm-track">
            {ORG_INFO.milestones.map((ms, idx) => {
              const isActive = idx === selectedYearIdx;
              return (
                <button
                  key={ms.year}
                  type="button"
                  className={`am-tm-node ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedYearIdx(idx)}
                >
                  <span className="am-tm-node-year">{ms.year}</span>
                  <span className="am-tm-node-badge">{ms.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Stage */}
          <div className="am-tm-stage">
            <div className="am-tm-stage-text">
              <div className="am-tm-stage-pills">
                <span className="am-tm-year-pill">{currentMilestone.year}</span>
                <span className="am-tm-phase-pill">
                  {currentMilestone.badge}
                </span>
              </div>
              <h4>{currentMilestone.title}</h4>
              <p>{currentMilestone.desc}</p>

              <div className="am-tm-story-quote">
                <strong>Dampak Berkelanjutan:</strong>{' '}
                {ORG_INFO.extendedAbout[selectedYearIdx % 3]}
              </div>
            </div>

            <div
              className="am-tm-stage-visual"
              onClick={() =>
                onOpenLightbox && onOpenLightbox(currentMilestonePhoto)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                onOpenLightbox &&
                onOpenLightbox(currentMilestonePhoto)
              }
            >
              <img
                src={currentMilestonePhoto.src}
                alt={currentMilestonePhoto.caption}
              />
              <div className="am-tm-visual-caption">
                <div>
                  <strong>{currentMilestonePhoto.albumTitle}</strong>
                  <span>{currentMilestonePhoto.caption}</span>
                </div>
                <span className="am-tm-zoom-icon">
                  <ZoomIn size={15} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            PART 2: INTERACTIVE VISION, MISSION & CORE VALUES BENTO
            ================================================================== */}
        <div className="am-vm-bento-row">
          {/* Left: Vision + Interactive Mission Selector */}
          <div className="am-bento-tile am-vm-interactive-tile">
            <div className="am-vision-banner">
              <span className="am-vision-tag">
                <Target size={14} /> Visi Utama Ambulu Mengajar
              </span>
              <p className="am-vision-statement">“{ORG_INFO.vision}”</p>
            </div>

            <div className="am-mission-selector-wrap">
              <span className="am-sub-label">
                4 Pilar Misi (Klik untuk melihat rincian fokus):
              </span>
              <div className="am-mission-pills-row">
                {ORG_INFO.missions.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`am-mission-pill-btn ${
                      activeMissionIdx === idx ? 'is-active' : ''
                    }`}
                    onClick={() => setActiveMissionIdx(idx)}
                  >
                    <span>Misi 0{idx + 1}</span>
                    <strong>{m.title}</strong>
                  </button>
                ))}
              </div>

              <div className="am-mission-active-detail">
                <h4>
                  Pilar Misi 0{activeMissionIdx + 1}:{' '}
                  {ORG_INFO.missions[activeMissionIdx].title}
                </h4>
                <p>{ORG_INFO.missions[activeMissionIdx].desc}</p>
              </div>
            </div>
          </div>

          {/* Right: 4 Core Values Grid */}
          <div className="am-values-bento-col">
            {ORG_INFO.coreValues.map((val) => {
              const IconComponent = VALUE_ICONS[val.id] || BookOpen;
              return (
                <div key={val.id} className="am-bento-tile am-val-tile">
                  <div className="am-val-tile-icon">
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h4>{val.title}</h4>
                    <p>{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
