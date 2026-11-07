import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  History,
  Award,
  HeartHandshake,
  Users,
  Flag,
  CheckCircle,
} from 'lucide-react';
import { ORG_INFO } from '../data/ambuluData';

const VALUE_ICONS = {
  pendidikan: BookOpen,
  sosial: HeartHandshake,
  kolaborasi: Users,
  pengabdian: Flag,
};

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('profil');

  return (
    <section className="am-section am-section-alt" id="tentang">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">Tentang Organisasi</span>
          <h2 className="am-section-title">
            Profil & Dedikasi <span>Ambulu Mengajar</span>
          </h2>
          <p className="am-section-desc">
            Gerakan sosial-pendidikan non-profit yang didedikasikan untuk
            memperluas wawasan, akses perguruan tinggi, beasiswa SMA, dan
            kepedulian kemanusiaan di Kecamatan Ambulu, Kabupaten Jember.
          </p>
          <hr className="am-carrd-divider" />
        </div>

        {/* Interactive Profile Navigation Tabs */}
        <div className="am-tabs-bar" role="tablist" aria-label="Tab Profil">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profil'}
            className={`am-tab-btn ${activeTab === 'profil' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            <BookOpen size={17} /> Latar Belakang & Nilai
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'visimisi'}
            className={`am-tab-btn ${
              activeTab === 'visimisi' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('visimisi')}
          >
            <Target size={17} /> Visi & Misi Pengabdian
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sejarah'}
            className={`am-tab-btn ${
              activeTab === 'sejarah' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('sejarah')}
          >
            <History size={17} /> Jejak Langkah (2011–Kini)
          </button>
        </div>

        {/* TAB 1: PROFIL & NILAI UTAMA */}
        {activeTab === 'profil' && (
          <div className="am-about-panel">
            <div className="am-about-split">
              <div className="am-card am-about-narrative-card">
                <div className="am-card-badge">
                  <Award size={15} /> Identitas Organisasi
                </div>
                <h3>Mengapa Ambulu Mengajar Hadir?</h3>
                {ORG_INFO.extendedAbout.map((para, i) => (
                  <p key={i} className="am-narrative-p">
                    {para}
                  </p>
                ))}
                <div className="am-key-facts-row">
                  <div className="am-key-fact">
                    <span>Basis Wilayah</span>
                    <strong>Kec. Ambulu, Kab. Jember</strong>
                  </div>
                  <div className="am-key-fact">
                    <span>Bentuk Lembaga</span>
                    <strong>Organisasi Non-Profit (NGO)</strong>
                  </div>
                  <div className="am-key-fact">
                    <span>Bidang Gerak</span>
                    <strong>Pendidikan & Sosial</strong>
                  </div>
                </div>
              </div>

              <div className="am-values-grid">
                {ORG_INFO.coreValues.map((val) => {
                  const IconComponent = VALUE_ICONS[val.id] || BookOpen;
                  return (
                    <div key={val.id} className="am-card am-value-card">
                      <div className="am-value-icon">
                        <IconComponent size={22} />
                      </div>
                      <h4>{val.title}</h4>
                      <p>{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeTab === 'visimisi' && (
          <div className="am-about-panel">
            <div className="am-vm-layout">
              <div className="am-card am-vision-card">
                <span className="am-section-eyebrow">Visi Utama</span>
                <h3>Komitmen Pengabdian Pendidikan & Bangsa</h3>
                <p className="am-vision-quote">“{ORG_INFO.vision}”</p>
                <div className="am-vision-footer">
                  <span>— Semangat Pengabdian Ambulu Mengajar</span>
                </div>
              </div>

              <div className="am-missions-grid">
                {ORG_INFO.missions.map((m, idx) => (
                  <div key={idx} className="am-card am-mission-card">
                    <div className="am-mission-num">0{idx + 1}</div>
                    <div>
                      <h4>{m.title}</h4>
                      <p>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE SEJARAH */}
        {activeTab === 'sejarah' && (
          <div className="am-about-panel">
            <div className="am-timeline-container">
              {ORG_INFO.milestones.map((item, idx) => (
                <div key={idx} className="am-card am-timeline-card">
                  <div className="am-timeline-top">
                    <span className="am-timeline-year">{item.year}</span>
                    <span className="am-timeline-badge">{item.badge}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  <div className="am-timeline-check">
                    <CheckCircle size={15} /> Fase Terlaksana
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

