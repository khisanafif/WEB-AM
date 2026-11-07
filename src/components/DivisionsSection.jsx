import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Share2,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { DIVISIONS } from '../data/ambuluData';

const DIVISION_ICONS = {
  hrd: Users,
  aml: GraduationCap,
  amf: HeartHandshake,
  kominfo: Share2,
};

export default function DivisionsSection() {
  const [selectedDivId, setSelectedDivId] = useState('hrd');

  const activeDivision =
    DIVISIONS.find((d) => d.id === selectedDivId) || DIVISIONS[0];

  return (
    <section className="am-section" id="divisiambulumengajar">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">Struktur Organisasi</span>
          <h2 id="text05" className="am-section-title">
            <span>DIVISI</span> AMBULU MENGAJAR
          </h2>
          <p className="am-section-desc">
            Empat pilar divisi fungsional sesuai struktur resmi{' '}
            <strong>Ambulu Mengajar</strong> yang menggerakkan pengembangan SDM,
            pembelajaran edukatif, penyelenggaraan beasiswa SMA, dan komunikasi
            publik.
          </p>
          <hr className="am-carrd-divider" />
        </div>

        {/* 4 Official Division Cards Grid (Matching Carrd #text02, #text09, #text10, #text11) */}
        <div className="am-divisions-grid">
          {DIVISIONS.map((div, index) => {
            const IconComponent = DIVISION_ICONS[div.id] || Users;
            const isSelected = div.id === selectedDivId;
            const textIds = ['text02', 'text09', 'text10', 'text11'];
            const listIds = ['list01', 'list02', 'list03', 'list04'];

            return (
              <article
                key={div.id}
                className={`am-card am-division-card ${
                  isSelected ? 'is-selected' : ''
                }`}
                onClick={() => setSelectedDivId(div.id)}
              >
                <div className="am-division-card-top">
                  <div
                    className="am-division-icon-box"
                    style={{ '--div-accent': div.accentColor }}
                  >
                    <IconComponent size={26} />
                  </div>
                  <span className="am-division-num">{div.number}</span>
                </div>

                <span className="am-division-code-badge">
                  Divisi {div.code} • {div.fullName}
                </span>

                <h3 id={textIds[index]} className="am-division-title">
                  {div.exactTitle}
                </h3>

                {/* Exact Bullet Points from ambulumengajar.carrd.co */}
                <div className="am-carrd-points-box">
                  <span className="am-carrd-points-label">
                    Fokus Tugas Resmi:
                  </span>
                  <ul id={listIds[index]} className="am-carrd-points-list">
                    {div.carrdPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <p className="am-division-desc">{div.description}</p>

                <div className="am-division-skills">
                  {div.skills.map((sk, i) => (
                    <span key={i} className="am-skill-chip">
                      {sk}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Division Deep-Dive Explorer */}
        <div className="am-card am-division-explorer">
          <div className="am-explorer-header">
            <div>
              <span className="am-explorer-eyebrow">
                <Sparkles size={14} /> Detail Program Kerja Divisi Aktif
              </span>
              <h4>
                {activeDivision.exactTitle} — {activeDivision.tagline}
              </h4>
            </div>
            <div className="am-explorer-pills">
              {DIVISIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`am-explorer-pill ${
                    d.id === selectedDivId ? 'is-active' : ''
                  }`}
                  onClick={() => setSelectedDivId(d.id)}
                >
                  {d.code}
                </button>
              ))}
            </div>
          </div>

          <div className="am-explorer-programs-grid">
            {activeDivision.programs.map((prog, idx) => (
              <div key={idx} className="am-explorer-prog-item">
                <Briefcase size={18} className="am-prog-icon" />
                <div>
                  <span className="am-prog-index">
                    Program Kerja 0{idx + 1}
                  </span>
                  <p>{prog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

