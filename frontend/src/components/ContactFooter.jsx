import React, { useState } from 'react';
import {
  Send,
  ExternalLink,
  MapPin,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { ORG_INFO, SOCIAL_LINKS, FEATURED_EVENT } from '../data/ambuluData';

export default function ContactFooter() {
  const [formState, setFormState] = useState({
    name: '',
    role: 'Pelajar SMA/SMK/MA',
    topic: 'Informasi Beasiswa SMA (AMF)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const text = encodeURIComponent(
      `Halo Admin Ambulu Mengajar!\n\nSaya *${formState.name}* (${formState.role}).\nKeperluan: *${formState.topic}*\n\nPesan:\n${formState.message}`
    );
    setTimeout(() => {
      window.open(
        `https://wa.me/6282257081262?text=${text}`,
        '_blank',
        'noopener,noreferrer'
      );
    }, 500);
  };

  return (
    <>
      {/* CONTACT & COLLABORATION SECTION (#kontak) */}
      <section className="am-section" id="kontak">
        <div className="am-container">
          <div className="am-section-header">
            <span className="am-section-eyebrow">Hubungi & Kolaborasi</span>
            <h2 className="am-section-title">
              Terhubung Bersama <span>Ambulu Mengajar</span>
            </h2>
            <p className="am-section-desc">
              Silakan hubungi kami melalui kanal sosial media resmi atau kirimkan
              pesan langsung untuk keperluan informasi beasiswa, undangan sekolah,
              rekrutmen relawan, maupun donasi sosial.
            </p>
            <hr className="am-carrd-divider" />
          </div>

          <div className="am-contact-grid">
            {/* Left: Official Channels from ambulumengajar.carrd.co */}
            <div className="am-card am-channels-card">
              <h3>Kanal Sosial Media Resmi</h3>
              <p className="am-channels-sub">
                Seluruh tautan resmi sesuai direktori{' '}
                <strong>ambulumengajar.carrd.co</strong>:
              </p>

              <div className="am-channel-list">
                {SOCIAL_LINKS.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-channel-item"
                  >
                    <div className="am-channel-icon-circle">
                      <svg className="am-carrd-svg-icon">
                        <use xlinkHref={`#${soc.iconId}`} />
                      </svg>
                    </div>
                    <div className="am-channel-text">
                      <div className="am-channel-title-row">
                        <strong>{soc.name}</strong>
                        <span className="am-channel-handle">{soc.handle}</span>
                      </div>
                      <p>{soc.desc}</p>
                    </div>
                    <ExternalLink size={16} className="am-channel-arrow" />
                  </a>
                ))}
              </div>

              <div className="am-direct-contacts-box">
                <div className="am-direct-item">
                  <MapPin size={17} />
                  <span>{ORG_INFO.location}</span>
                </div>
                {FEATURED_EVENT.contactPersons.map((cp) => (
                  <div key={cp.name} className="am-direct-item">
                    <PhoneCall size={17} />
                    <a
                      href={cp.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Narahubung: {cp.phoneDisplay} ({cp.name})
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Inquiry Form */}
            <div className="am-card am-form-card">
              <h3>Formulir Pesan & Sinergi</h3>
              <p className="am-channels-sub">
                Kirimkan pertanyaan atau ajakan kolaborasi langsung kepada tim
                narahubung Ambulu Mengajar:
              </p>

              <form onSubmit={handleSubmit} className="am-form">
                <div className="am-form-group">
                  <label htmlFor="amName">Nama Lengkap / Nama Sekolah</label>
                  <input
                    id="amName"
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Fauzi / SMAN Ambulu"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
                </div>

                <div className="am-form-row">
                  <div className="am-form-group">
                    <label htmlFor="amRole">Peran Anda</label>
                    <select
                      id="amRole"
                      value={formState.role}
                      onChange={(e) =>
                        setFormState({ ...formState, role: e.target.value })
                      }
                    >
                      <option value="Pelajar SMA/SMK/MA">
                        Pelajar SMA/SMK/MA
                      </option>
                      <option value="Mahasiswa / Calon Relawan">
                        Mahasiswa / Calon Relawan
                      </option>
                      <option value="Guru / Pihak Sekolah">
                        Guru / Pihak Sekolah
                      </option>
                      <option value="Donatur / Mitra Sosial">
                        Donatur / Mitra Sosial
                      </option>
                      <option value="Umum">Masyarakat Umum</option>
                    </select>
                  </div>

                  <div className="am-form-group">
                    <label htmlFor="amTopic">Topik Keperluan</label>
                    <select
                      id="amTopic"
                      value={formState.topic}
                      onChange={(e) =>
                        setFormState({ ...formState, topic: e.target.value })
                      }
                    >
                      <option value="Informasi Beasiswa SMA (AMF)">
                        Informasi Beasiswa SMA (AMF)
                      </option>
                      <option value="Undangan Goes To School (AML)">
                        Undangan Goes To School (AML)
                      </option>
                      <option value="Konfirmasi Donasi / Baksos (AMF)">
                        Konfirmasi Donasi / Baksos (AMF)
                      </option>
                      <option value="Rekrutmen Relawan (HRD)">
                        Rekrutmen Relawan (HRD)
                      </option>
                      <option value="Kerja Sama Media (KOMINFO)">
                        Kerja Sama Media (KOMINFO)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="am-form-group">
                  <label htmlFor="amMsg">Pesan Lengkap</label>
                  <textarea
                    id="amMsg"
                    rows={4}
                    required
                    placeholder="Tuliskan pesan, pertanyaan, atau rencana kolaborasi Anda..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="am-btn am-btn-primary am-btn-full"
                >
                  <Send size={17} /> Kirim Pesan ke WhatsApp Resmi
                </button>

                {submitted && (
                  <div className="am-form-alert">
                    <CheckCircle2 size={16} />
                    <span>
                      Pesan berhasil disiapkan! Membuka WhatsApp narahubung
                      Ambulu Mengajar...
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (#footer — Matching Carrd #image02, #buttons01, #icons04) */}
      <footer className="am-footer" id="footer">
        <div className="am-container">
          <div id="image02" className="am-footer-logo-wrap">
            <a
              href="https://www.instagram.com/ambulumengajar/?utm_medium=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @ambulumengajar"
            >
              <img
                src={ORG_INFO.logoFooter}
                alt="Banner Resmi Ambulu Mengajar"
              />
            </a>
          </div>

          <hr className="am-carrd-divider" />

          {/* Exact Navigation Buttons (#buttons01 from ambulumengajar.carrd.co) */}
          <ul id="buttons01" className="am-carrd-footer-buttons">
            <li>
              <a href="#home" className="am-carrd-btn">
                Home
              </a>
            </li>
            <li>
              <a href="#divisiambulumengajar" className="am-carrd-btn">
                Divisi
              </a>
            </li>
            <li>
              <a href="#eventambulumengajar" className="am-carrd-btn">
                Event
              </a>
            </li>
            <li>
              <a href="#dokumentasiambulumengajar" className="am-carrd-btn">
                Dokumentasi
              </a>
            </li>
          </ul>

          {/* Exact Social Media Icons (#icons04 from ambulumengajar.carrd.co) */}
          <ul id="icons04" className="am-carrd-footer-icons">
            {SOCIAL_LINKS.map((soc) => (
              <li key={soc.id}>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  title={`${soc.name} (${soc.handle})`}
                >
                  <svg>
                    <use xlinkHref={`#${soc.iconId}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="am-footer-copy">
            <p>
              <strong>{ORG_INFO.name}</strong> — {ORG_INFO.category} (
              {ORG_INFO.location})
            </p>
            <p>
              © {new Date().getFullYear()} Ambulu Mengajar. Disusun sesuai
              identitas dan isi resmi{' '}
              <a
                href={ORG_INFO.carrdUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                ambulumengajar.carrd.co
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

