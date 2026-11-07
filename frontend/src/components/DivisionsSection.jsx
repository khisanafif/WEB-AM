import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  HeartHandshake,
  Share2,
  CheckCircle2,
  Sparkles,
  Award,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { DIVISIONS, ALL_GALLERY_PHOTOS } from '../data/ambuluData';

const DIV_ICONS = {
  hrd: Users,
  aml: BookOpen,
  amf: HeartHandshake,
  kominfo: Share2,
};

const DIV_GALLERY_MAP = {
  hrd: [ALL_GALLERY_PHOTOS[3], ALL_GALLERY_PHOTOS[4]],
  aml: [ALL_GALLERY_PHOTOS[3], ALL_GALLERY_PHOTOS[4], ALL_GALLERY_PHOTOS[5]],
  amf: [
    ALL_GALLERY_PHOTOS[0],
    ALL_GALLERY_PHOTOS[1],
    ALL_GALLERY_PHOTOS[6],
    ALL_GALLERY_PHOTOS[8],
  ],
  kominfo: [ALL_GALLERY_PHOTOS[2], ALL_GALLERY_PHOTOS[10]],
};

const MATCHER_QUESTIONS = [
  {
    q: 'Aktivitas mana yang paling membuatmu bersemangat saat berkegiatan sosial?',
    options: [
      {
        label: 'Merekrut teman baru, menjaga kekompakan tim & membangun relasi',
        div: 'hrd',
      },
      {
        label: 'Mengajar di kelas, berbagi tips kuliah & memotivasi siswa SMA',
        div: 'aml',
      },
      {
        label: 'Mengelola program beasiswa pelajar & bakti sosial panti asuhan',
        div: 'amf',
      },
      {
        label: 'Mendesain konten kreatif, memotret kegiatan & mengelola medsos',
        div: 'kominfo',
      },
    ],
  },
  {
    q: 'Keahlian apa yang paling ingin kamu kembangkan di Ambulu Mengajar?',
    options: [
      { label: 'Leadership, manajemen SDM & komunikasi organisasi', div: 'hrd' },
      { label: 'Public speaking, kurikulum belajar & manajemen acara', div: 'aml' },
      { label: 'Fundraising sosial, manajemen beasiswa & empati sosial', div: 'amf' },
      { label: 'Desain grafis, fotografi/videografi & copywriting', div: 'kominfo' },
    ],
  },
  {
    q: 'Program mana yang paling ingin kamu ikuti secara langsung?',
    options: [
      { label: 'Open Recruitment, Upgrading & Gathering Relawan', div: 'hrd' },
      { label: 'Ambulu Mengajar Goes To School ke SMA/SMK/MA', div: 'aml' },
      { label: 'AMF X Pembidik Misi, Beasiswa SMA & Bakti Sosial', div: 'amf' },
      { label: 'Produksi Konten Instagram, YouTube & Dokumentasi', div: 'kominfo' },
    ],
  },
];

export default function DivisionsSection({
  backendState,
  selectedDivId,
  onSelectDivision,
  onOpenLightbox,
}) {
  const divisions =
    backendState?.divisions && backendState.divisions.length > 0
      ? backendState.divisions
      : DIVISIONS;

  const [activeId, setActiveId] = useState(selectedDivId || divisions[0]?.id || 'hrd');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (selectedDivId) {
      setActiveId(selectedDivId);
    }
  }, [selectedDivId]);

  const activeDiv =
    divisions.find((d) => d.id === activeId) || divisions[0];
  const ActiveIcon = DIV_ICONS[activeDiv?.id] || Users;
  const relatedPhotos =
    DIV_GALLERY_MAP[activeDiv?.id] || ALL_GALLERY_PHOTOS.slice(0, 2);

  const handleSelectDiv = (id) => {
    setActiveId(id);
    if (onSelectDivision) onSelectDivision(id);
  };

  const handleAnswerQuiz = (divCode) => {
    const next = [...quizAnswers, divCode];
    if (quizStep + 1 < MATCHER_QUESTIONS.length) {
      setQuizAnswers(next);
      setQuizStep(quizStep + 1);
    } else {
      const counts = next.reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {});
      const winner = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a]
      )[0];
      setQuizResult(winner);
      handleSelectDiv(winner);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const matchedDivObj = quizResult
    ? divisions.find((d) => d.id === quizResult)
    : null;

  return (
    <section
      className="am-section am-section-alt"
      id="divisiambulumengajar"
      aria-labelledby="divisi-heading"
    >
      <div className="am-container">
        <div className="am-section-header am-header-split">
          <div>
            <span className="am-section-eyebrow">
              <Sparkles size={13} /> Struktur Organisasi
            </span>
            <h2 className="am-section-title" id="divisi-heading">
              Empat Divisi <span>Ambulu Mengajar</span>
            </h2>
          </div>
          <p className="am-section-desc">
            Pilih masing-masing divisi pada panel di bawah untuk melihat mandat
            utama, fokus tanggung jawab, serta program kerja unggulannya.
          </p>
        </div>

        {/* MASTER-DETAIL COMMAND STUDIO */}
        {activeDiv && (
          <div className="am-studio-layout">
            <div
              className="am-studio-rail"
              role="tablist"
              aria-label="Pilih Divisi Ambulu Mengajar"
            >
              <span className="am-studio-rail-label">PILIH DIVISI UTAMA</span>
              {divisions.map((div, idx) => {
                const IconComp = DIV_ICONS[div.id] || Users;
                const isSelected = div.id === activeDiv.id;
                return (
                  <button
                    key={div.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`am-rail-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleSelectDiv(div.id)}
                    style={{ '--div-color': div.accentColor }}
                  >
                    <div className="am-rail-icon">
                      <IconComp size={20} />
                    </div>
                    <div className="am-rail-info">
                      <span className="am-rail-code">
                        0{idx + 1} • {div.code}
                      </span>
                      <strong>{div.fullName}</strong>
                      <small>{div.tagline}</small>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="am-card am-studio-stage" role="tabpanel">
              <div className="am-stage-top">
                <div className="am-stage-badge-row">
                  <span
                    className="am-stage-code-pill"
                    style={{
                      background: `${activeDiv.accentColor}22`,
                      color: activeDiv.accentColor,
                      borderColor: `${activeDiv.accentColor}55`,
                    }}
                  >
                    DIVISI {activeDiv.code}
                  </span>
                  <span className="am-stage-tagline">{activeDiv.tagline}</span>
                </div>

                <div className="am-stage-title-row">
                  <div
                    className="am-stage-icon-big"
                    style={{
                      background: `${activeDiv.accentColor}1f`,
                      color: activeDiv.accentColor,
                    }}
                  >
                    <ActiveIcon size={28} />
                  </div>
                  <div>
                    <h3 className="am-stage-title">{activeDiv.exactTitle}</h3>
                    <p className="am-stage-desc">{activeDiv.description}</p>
                  </div>
                </div>
              </div>

              <div className="am-stage-carrd-box">
                <div className="am-stage-subhead">
                  <CheckCircle2 size={16} />
                  <span>Fokus & Tanggung Jawab Utama Divisi {activeDiv.code}</span>
                </div>
                <ul className="am-stage-carrd-grid">
                  {(activeDiv.carrdPoints || []).map((pt, i) => (
                    <li key={i} className="am-stage-carrd-item">
                      <span className="am-carrd-bullet">0{i + 1}</span>
                      <p>{pt}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="am-stage-programs-box">
                <div className="am-stage-subhead">
                  <Award size={16} />
                  <span>Program Kerja & Implementasi Lapangan</span>
                </div>
                <div className="am-stage-prog-grid">
                  {(activeDiv.programs || []).map((prog, i) => {
                    const label =
                      typeof prog === 'string'
                        ? prog
                        : `${prog.name}${prog.desc ? ` — ${prog.desc}` : ''}`;
                    return (
                      <div key={i} className="am-stage-prog-card">
                        <strong>Program 0{i + 1}</strong>
                        <p>{label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="am-stage-bottom-row">
                <div className="am-stage-skills">
                  <span className="am-stage-mini-label">
                    Kompetensi & Keahlian Divisi:
                  </span>
                  <div className="am-skill-tags">
                    {(activeDiv.skills || []).map((sk) => (
                      <span key={sk} className="am-skill-tag">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="am-stage-photos">
                  <span className="am-stage-mini-label">
                    Dokumentasi Terkait Divisi {activeDiv.code}:
                  </span>
                  <div className="am-stage-photo-strip">
                    {relatedPhotos.map((ph) => (
                      <button
                        key={ph.id}
                        type="button"
                        className="am-stage-photo-thumb"
                        onClick={() => onOpenLightbox && onOpenLightbox(ph)}
                        title={ph.albumTitle}
                      >
                        <img src={ph.src} alt={ph.albumTitle} />
                        <span>Perbesar</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE VOLUNTEER DIVISION MATCHER */}
        <div className="am-card am-matcher-card">
          <div className="am-matcher-header">
            <div>
              <span className="am-pill-badge">
                <Compass size={13} /> Simulasi Interaktif Calon Relawan
              </span>
              <h3>Ingin Bergabung? Cek Divisi yang Paling Cocok Untukmu!</h3>
              <p>
                Jawab 3 pertanyaan singkat berikut untuk melihat rekomendasi
                divisi yang paling sesuai dengan minat dan keahlianmu.
              </p>
            </div>
            {quizResult && (
              <button
                type="button"
                onClick={resetQuiz}
                className="am-btn am-btn-outline am-btn-sm"
              >
                <RotateCcw size={14} /> Ulangi Simulasi
              </button>
            )}
          </div>

          {!quizResult ? (
            <div className="am-matcher-body">
              <div className="am-matcher-progress">
                <span>
                  Pertanyaan {quizStep + 1} dari {MATCHER_QUESTIONS.length}
                </span>
                <div className="am-matcher-bar">
                  <div
                    style={{
                      width: `${
                        ((quizStep + 1) / MATCHER_QUESTIONS.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <h4 className="am-matcher-q">
                {MATCHER_QUESTIONS[quizStep].q}
              </h4>

              <div className="am-matcher-options-grid">
                {MATCHER_QUESTIONS[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="am-matcher-opt-btn"
                    onClick={() => handleAnswerQuiz(opt.div)}
                  >
                    <span className="am-opt-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            matchedDivObj && (
              <div className="am-matcher-result">
                <div className="am-result-badge">REKOMENDASI DIVISI</div>
                <h4>
                  Kamu Sangat Cocok di{' '}
                  <span>{matchedDivObj.exactTitle}</span>!
                </h4>
                <p>{matchedDivObj.description}</p>
                <div className="am-result-actions">
                  <a href="#kontak" className="am-btn am-btn-primary am-btn-sm">
                    Hubungi Tim Kami untuk Bergabung
                  </a>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="am-btn am-btn-outline am-btn-sm"
                  >
                    Coba Pilihan Lain
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
