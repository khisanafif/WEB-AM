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
  aml: [ALL_GALLERY_PHOTOS[3], ALL_GALLERY_PHOTOS[5]],
  amf: [ALL_GALLERY_PHOTOS[0], ALL_GALLERY_PHOTOS[6]],
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
  onOpenLightbox,
}) {
  const divisions =
    backendState?.divisions && backendState.divisions.length > 0
      ? backendState.divisions
      : DIVISIONS;

  const [highlightedId, setHighlightedId] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (selectedDivId) {
      setHighlightedId(selectedDivId);
      const targetEl = document.getElementById(`divisi-card-${selectedDivId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const timer = setTimeout(() => setHighlightedId(null), 2600);
      return () => clearTimeout(timer);
    }
  }, [selectedDivId]);

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
      setHighlightedId(winner);
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
            Empat pilar divisi fungsional yang bersinergi menjalankan pengembangan
            relawan, kegiatan belajar mengajar, penyelenggaraan beasiswa & bakti
            sosial, serta publikasi kreatif.
          </p>
        </div>

        {/* DIRECTLY OPEN UNIFIED CARDS FOR ALL 4 DIVISIONS (MOBILE & DESKTOP FRIENDLY) */}
        <div className="am-divisions-open-grid">
          {divisions.map((div, idx) => {
            const IconComp = DIV_ICONS[div.id] || Users;
            const relatedPhotos =
              DIV_GALLERY_MAP[div.id] || ALL_GALLERY_PHOTOS.slice(0, 2);
            const isHighlighted = highlightedId === div.id;

            return (
              <article
                key={div.id}
                id={`divisi-card-${div.id}`}
                className={`am-card am-div-unified-card ${
                  isHighlighted ? 'is-highlighted' : ''
                }`}
                style={{ '--div-accent': div.accentColor || '#FF8CA8' }}
              >
                {/* Top Header Inside Single Card */}
                <div className="am-div-ucard-head">
                  <div className="am-div-ucard-badges">
                    <span
                      className="am-stage-code-pill"
                      style={{
                        background: `${div.accentColor || '#FF8CA8'}22`,
                        color: div.accentColor || '#FF8CA8',
                        borderColor: `${div.accentColor || '#FF8CA8'}55`,
                      }}
                    >
                      0{idx + 1} • DIVISI {div.code}
                    </span>
                    <span className="am-div-ucard-tagline">{div.tagline}</span>
                  </div>

                  <div className="am-div-ucard-title-row">
                    <div
                      className="am-stage-icon-big"
                      style={{
                        background: `${div.accentColor || '#FF8CA8'}1f`,
                        color: div.accentColor || '#FF8CA8',
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <div>
                      <h3 className="am-div-ucard-title">{div.exactTitle}</h3>
                      <span className="am-div-ucard-sub">{div.fullName}</span>
                    </div>
                  </div>

                  <p className="am-div-ucard-desc">{div.description}</p>
                </div>

                {/* Fokus & Tanggung Jawab Utama (Directly Open) */}
                <div className="am-div-ucard-section">
                  <div className="am-stage-subhead">
                    <CheckCircle2 size={15} />
                    <span>Fokus & Tanggung Jawab Utama</span>
                  </div>
                  <ul className="am-div-ucard-points">
                    {(div.carrdPoints || []).map((pt, i) => (
                      <li key={i}>
                        <span className="am-carrd-bullet">0{i + 1}</span>
                        <p>{pt}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Program Kerja Unggulan (Directly Open) */}
                <div className="am-div-ucard-section">
                  <div className="am-stage-subhead">
                    <Award size={15} />
                    <span>Program Kerja Unggulan</span>
                  </div>
                  <div className="am-div-ucard-progs">
                    {(div.programs || []).map((prog, i) => {
                      const label =
                        typeof prog === 'string'
                          ? prog
                          : `${prog.name}${prog.desc ? ` — ${prog.desc}` : ''}`;
                      return (
                        <div key={i} className="am-div-ucard-prog-item">
                          <strong>0{i + 1}</strong>
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Inside Same Card: Skills & Related Photos */}
                <div className="am-div-ucard-footer">
                  <div className="am-skill-tags">
                    {(div.skills || []).map((sk) => (
                      <span key={sk} className="am-skill-tag">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="am-div-ucard-thumbs">
                    {relatedPhotos.map((ph) => (
                      <button
                        key={ph.id}
                        type="button"
                        className="am-stage-photo-thumb"
                        onClick={() => onOpenLightbox && onOpenLightbox(ph)}
                        title={ph.albumTitle}
                      >
                        <img src={ph.src} alt={ph.albumTitle} />
                        <span>Lihat Foto</span>
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* INTERACTIVE VOLUNTEER DIVISION MATCHER */}
        <div className="am-card am-matcher-card">
          <div className="am-matcher-header">
            <div>
              <span className="am-pill-badge">
                <Compass size={13} /> Simulasi Calon Relawan
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
                  <a
                    href={`#divisi-card-${matchedDivObj.id}`}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    Lihat Kartu {matchedDivObj.shortTitle || matchedDivObj.code}
                  </a>
                  <a href="#kontak" className="am-btn am-btn-outline am-btn-sm">
                    Hubungi Tim Kami
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
