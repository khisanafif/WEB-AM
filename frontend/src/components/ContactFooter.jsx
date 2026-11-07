import React, { useState } from 'react';
import {
  Send,
  ExternalLink,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ORG_INFO, SOCIAL_LINKS, FEATURED_EVENT } from '../data/ambuluData';

export default function ContactFooter({ backendState }) {
  const orgInfo = backendState?.orgInfo || ORG_INFO;
  const socialLinks =
    backendState?.socialLinks && backendState.socialLinks.length > 0
      ? backendState.socialLinks
      : SOCIAL_LINKS;
  const contactPersons =
    backendState?.donationConfig?.contactPersons &&
    backendState.donationConfig.contactPersons.length > 0
      ? backendState.donationConfig.contactPersons
      : FEATURED_EVENT.contactPersons;

  const [formState, setFormState] = useState({
    name: '',
    role: 'Pelajar SMA/SMK/MA',
    topic: 'Informasi Beasiswa SMA (AMF)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const primaryPhone =
    contactPersons[0]?.phoneClean || '6282257081262';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const text = encodeURIComponent(
      `Halo Tim ${orgInfo.name}!\n\nSaya *${formState.name}* (${formState.role}).\nKeperluan: *${formState.topic}*\n\nPesan:\n${formState.message}`
    );
    setTimeout(() => {
      window.open(
        `https://wa.me/${primaryPhone}?text=${text}`,
        '_blank',
        'noopener,noreferrer'
      );
    }, 400);
  };

  return (
    <>
      <section className="am-section" id="kontak">
        <div className="am-container">
          <div className="am-section-header am-header-split">
            <div>
              <span className="am-section-eyebrow">
                <Sparkles size={13} /> Hubungi & Kolaborasi
              </span>
              <h2 className="am-section-title">
                Terhubung Bersama <span>{orgInfo.name}</span>
              </h2>
            </div>
            <p className="am-section-desc">
              Hubungi kami melalui kanal media sosial resmi atau kirimkan pesan
              langsung untuk keperluan informasi beasiswa, undangan kunjungan
              sekolah, rekrutmen relawan, maupun kolaborasi sosial.
            </p>
          </div>

          <div className="am-contact-grid">
            <div className="am-card am-channels-card">
              <h3>Kanal Media Sosial & Narahubung</h3>
              <p className="am-channels-sub">
                Ikuti perkembangan program terbaru dan terhubung langsung dengan
                tim resmi <strong>{orgInfo.name}</strong>:
              </p>

              <div className="am-channel-list">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-channel-item"
                  >
                    <div className="am-channel-icon-circle">
                      <svg className="am-carrd-svg-icon">
                        <use xlinkHref={`#${soc.iconId || 'icon-b0b'}`} />
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
                  <span>{orgInfo.location}</span>
                </div>
                {contactPersons.map((cp) => (
                  <div key={cp.id || cp.name} className="am-direct-item">
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

            <div className="am-card am-form-card">
              <h3>Formulir Pesan & Sinergi</h3>
              <p className="am-channels-sub">
                Kirimkan pertanyaan, undangan sekolah, atau ajakan kolaborasi
                langsung kepada tim narahubung kami:
              </p>

              <form onSubmit={handleSubmit} className="am-form">
                <div className="am-form-group">
                  <label htmlFor="amName">Nama Lengkap / Instansi Sekolah</label>
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
                      <option value="Kolaborasi Bakti Sosial (AMF)">
                        Kolaborasi Bakti Sosial (AMF)
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
                  <Send size={17} /> Kirim Pesan via WhatsApp Resmi
                </button>

                {submitted && (
                  <div className="am-form-alert">
                    <CheckCircle2 size={16} />
                    <span>
                      Pesan berhasil disiapkan! Membuka WhatsApp narahubung
                      resmi...
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="am-footer" id="footer">
        <div className="am-container">
          <div id="image02" className="am-footer-logo-wrap">
            <a href="#home" title={orgInfo.name}>
              <img
                src={orgInfo.logoFooter || ORG_INFO.logoFooter}
                alt={`Identitas ${orgInfo.name}`}
              />
            </a>
          </div>

          <ul id="buttons01" className="am-carrd-footer-buttons">
            <li>
              <a href="#home" className="am-carrd-btn">
                Beranda
              </a>
            </li>
            <li>
              <a href="#tentang" className="am-carrd-btn">
                Tentang
              </a>
            </li>
            <li>
              <a href="#divisiambulumengajar" className="am-carrd-btn">
                Divisi
              </a>
            </li>
            <li>
              <a href="#eventambulumengajar" className="am-carrd-btn">
                Program
              </a>
            </li>
            <li>
              <a href="#dokumentasiambulumengajar" className="am-carrd-btn">
                Dokumentasi
              </a>
            </li>
          </ul>

          <ul id="icons04" className="am-carrd-footer-icons">
            {socialLinks.map((soc) => (
              <li key={soc.id}>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  title={`${soc.name} (${soc.handle})`}
                >
                  <svg>
                    <use xlinkHref={`#${soc.iconId || 'icon-b0b'}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="am-footer-copy">
            <p>
              <strong>{orgInfo.name}</strong> — {orgInfo.category} (
              {orgInfo.location})
            </p>
            <p>
              © {new Date().getFullYear()} {orgInfo.name}. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
