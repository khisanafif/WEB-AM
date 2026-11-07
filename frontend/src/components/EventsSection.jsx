import React, { useState } from 'react';
import {
  Calendar,
  Copy,
  Check,
  MessageCircle,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Gift,
  Coins,
  Shirt,
  ShieldAlert,
  Archive,
  Clock,
  MapPin,
  Lock,
  Unlock,
  Settings,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';
import { createDonationLogApi } from '../services/apiClient';

const DONATION_TYPES = [
  {
    id: 'uang',
    label: 'Donasi Dana Tunai',
    icon: Coins,
    desc: 'Transfer via BRI, BCA, BNI, atau Dompet Digital resmi',
  },
  {
    id: 'sembako',
    label: 'Sembako / Kebutuhan Pokok',
    icon: Gift,
    desc: 'Beras, minyak, gula, atau paket santunan sosial',
  },
  {
    id: 'barang',
    label: 'Pakaian Layak Pakai & Buku',
    icon: Shirt,
    desc: 'Pakaian layak pakai, buku bacaan & alat tulis sekolah',
  },
];

const NOMINAL_PRESETS = [
  { value: 50000, label: 'Rp 50.000', impact: 'Paket Alat Tulis & Buku Pelajar' },
  { value: 100000, label: 'Rp 100.000', impact: 'Paket Sembako Santunan Panti' },
  { value: 250000, label: 'Rp 250.000', impact: 'Bantuan Pendidikan & Santunan' },
  { value: 500000, label: 'Rp 500.000', impact: 'Dukungan Penuh Program Baksos AMF' },
];

const STATUS_META = {
  completed: {
    label: 'Selesai / Terlaksana',
    badgeClass: 'is-completed',
    icon: CheckCircle2,
  },
  upcoming: {
    label: 'Segera Hadir',
    badgeClass: 'is-upcoming',
    icon: Clock,
  },
  ongoing: {
    label: 'Sedang Berlangsung',
    badgeClass: 'is-ongoing',
    icon: Sparkles,
  },
};

export default function EventsSection({
  backendState,
  onSelectPhoto,
  onOpenLightbox,
  onOpenAdmin,
  isAdminLoggedIn,
  onStateChange,
}) {
  const handlePreviewPhoto = onSelectPhoto || onOpenLightbox || (() => {});
  const events = backendState?.events || [];
  const donationConfig = backendState?.donationConfig || {
    isOpen: false,
    bankAccounts: [],
    contactPersons: [],
  };
  const donationsLog = backendState?.donationsLog || [];

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-kurma-2022'
  );
  const [copiedId, setCopiedId] = useState(null);

  // Interactive Donation Form State (Active when Admin opens donation)
  const [donationType, setDonationType] = useState('uang');
  const [selectedNominal, setSelectedNominal] = useState(100000);
  const [donorName, setDonorName] = useState('');
  const [selectedBank, setSelectedBank] = useState('BRI');
  const [submittingLog, setSubmittingLog] = useState(false);

  const filteredEvents = events.filter((evt) =>
    statusFilter === 'all' ? true : evt.status === statusFilter
  );

  const activeEvent =
    events.find((e) => e.id === selectedEventId) ||
    filteredEvents[0] ||
    events[0];

  const handleCopy = (acc) => {
    navigator.clipboard.writeText(acc.numberClean);
    setCopiedId(acc.id || acc.bank);
    setSelectedBank(acc.bank.split(' ')[0]);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const buildWhatsAppConfirmationUrl = (cp) => {
    const typeObj = DONATION_TYPES.find((t) => t.id === donationType);
    const nominalStr =
      donationType === 'uang'
        ? ` sebesar *Rp ${selectedNominal.toLocaleString('id-ID')}* (Tujuan: *${selectedBank}*)`
        : '';
    const nameStr = donorName.trim() ? donorName.trim() : 'Hamba Allah';
    const msg = `Halo Kak ${cp.name} (Panitia Ambulu Mengajar),\n\nSaya *${nameStr}* ingin mengonfirmasi *${typeObj?.label}*${nominalStr} untuk program *${donationConfig.campaignTitle}*.\n\nTerima kasih!`;
    return `https://wa.me/${cp.phoneClean}?text=${encodeURIComponent(msg)}`;
  };

  const handleRecordAndOpenWa = async (cp) => {
    const waUrl = buildWhatsAppConfirmationUrl(cp);
    setSubmittingLog(true);
    try {
      const res = await createDonationLogApi({
        donorName: donorName.trim() || 'Hamba Allah',
        eventId: activeEvent?.id || 'evt-general',
        eventTitle: activeEvent?.title || donationConfig.campaignTitle,
        type:
          DONATION_TYPES.find((t) => t.id === donationType)?.label ||
          'Donasi Dana Tunai',
        amount: donationType === 'uang' ? selectedNominal : 0,
        bankTarget: selectedBank,
        message: `Konfirmasi via WA ke ${cp.name}`,
      });
      if (res.state && onStateChange) {
        onStateChange(res.state);
      }
    } catch {
      // ignore error
    } finally {
      setSubmittingLog(false);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const statusInfo =
    STATUS_META[activeEvent?.status] || STATUS_META.completed;
  const StatusIcon = statusInfo.icon;

  return (
    <section
      className="am-section am-section-alt"
      id="eventambulumengajar"
      aria-labelledby="event-heading"
    >
      <div className="am-container">
        {/* SECTION HEADER WITH ADMIN QUICK ACCESS */}
        <div className="am-section-header am-header-split">
          <div>
            <div className="am-event-logo-pill" id="image03">
              <img
                src="assets/images/image03.png"
                alt="Badge Resmi Event Ambulu Mengajar"
              />
              <span>Arsip & Status Event Resmi • Terintegrasi Backend</span>
            </div>
            <h2 className="am-section-title" id="event-heading">
              Event & Status <span>Donasi Sosial</span>
            </h2>
          </div>

          <div className="am-event-header-actions">
            <p className="am-section-desc">
              Event <strong>KURMA (Kunjungan Ramadhan)</strong> dan penyaluran
              donasinya telah <strong>Selesai / Terlaksana</strong>. Pengurus
              dapat memperbarui status event atau membuka kampanye donasi baru
              melalui <strong>Panel Admin</strong>.
            </p>
            <button
              type="button"
              className="am-btn am-btn-outline am-btn-sm am-admin-quick-btn"
              onClick={onOpenAdmin}
            >
              <Settings size={15} />
              <span>
                {isAdminLoggedIn
                  ? 'Buka Dashboard Admin (Aktif)'
                  : 'Login Admin — Kelola Event & Donasi'}
              </span>
            </button>
          </div>
        </div>

        {/* GLOBAL EVENT & DONATION STATUS BANNER */}
        <div
          className={`am-card am-event-status-banner ${
            donationConfig.isOpen ? 'is-open-banner' : 'is-closed-banner'
          }`}
        >
          <div className="am-status-banner-left">
            <div className="am-status-banner-icon">
              {donationConfig.isOpen ? (
                <Unlock size={24} />
              ) : (
                <FileCheck2 size={24} />
              )}
            </div>
            <div className="am-status-banner-text">
              <div className="am-status-pill-row">
                <span
                  className={`am-live-status-pill ${
                    donationConfig.isOpen ? 'is-open' : 'is-closed'
                  }`}
                >
                  {donationConfig.statusBadgeText ||
                    (donationConfig.isOpen
                      ? 'OPEN DONATION — SEDANG BERLANGSUNG'
                      : 'DONASI DITUTUP — EVENT TELAH SELESAI')}
                </span>
                <span className="am-status-sub-tag">
                  Divisi AMF (Ambulu Mengajar Filantropi)
                </span>
              </div>
              <h3>
                {donationConfig.isOpen
                  ? donationConfig.campaignTitle
                  : donationConfig.closedNoticeTitle ||
                    'Event & Donasi KURMA Telah Selesai Dilaksanakan'}
              </h3>
              <p>
                {donationConfig.isOpen
                  ? donationConfig.activeNoticeDesc
                  : donationConfig.closedNoticeDesc}
              </p>
            </div>
          </div>

          <div className="am-status-banner-right">
            <div className="am-status-stat-Mini">
              <span>Status Penyaluran KURMA</span>
              <strong>100% Tersalurkan</strong>
              <small>Panti Asuhan Immamul Mutaqin</small>
            </div>
            <button
              type="button"
              className="am-btn am-btn-secondary am-btn-sm"
              onClick={onOpenAdmin}
            >
              <Settings size={14} />
              <span>Ubah Status di Admin</span>
            </button>
          </div>
        </div>

        {/* EVENT FILTER TABS & SELECTOR BAR */}
        <div className="am-event-selector-bar">
          <div className="am-event-filter-pills">
            {[
              { id: 'all', label: `Semua Program (${events.length})` },
              {
                id: 'completed',
                label: `Selesai / Terlaksana (${
                  events.filter((e) => e.status === 'completed').length
                })`,
              },
              {
                id: 'ongoing',
                label: `Sedang Berlangsung (${
                  events.filter((e) => e.status === 'ongoing').length
                })`,
              },
              {
                id: 'upcoming',
                label: `Segera Hadir (${
                  events.filter((e) => e.status === 'upcoming').length
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`am-filter-pill ${
                  statusFilter === tab.id ? 'is-active' : ''
                }`}
                onClick={() => {
                  setStatusFilter(tab.id);
                  const firstMatch =
                    tab.id === 'all'
                      ? events[0]
                      : events.find((e) => e.status === tab.id);
                  if (firstMatch) setSelectedEventId(firstMatch.id);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="am-event-cards-strip">
            {filteredEvents.map((evt) => {
              const meta = STATUS_META[evt.status] || STATUS_META.completed;
              const Icon = meta.icon;
              const isSelected = activeEvent?.id === evt.id;
              return (
                <button
                  key={evt.id}
                  type="button"
                  className={`am-event-Select-card ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedEventId(evt.id)}
                >
                  <span className={`am-evt-mini-badge ${meta.badgeClass}`}>
                    <Icon size={12} /> {meta.label}
                  </span>
                  <strong>{evt.title}</strong>
                  <small>{evt.period}</small>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN EVENT & DONATION BENTO WORKSPACE */}
        {activeEvent && (
          <div className="am-event-studio-grid">
            {/* LEFT COLUMN: EVENT POSTER & REALIZATION REPORT */}
            <div className="am-card am-event-showcase-col">
              <div className="am-event-poster-stage" id="image04">
                <div className="am-poster-status-overlay">
                  <span className={`am-evt-status-badge ${statusInfo.badgeClass}`}>
                    <StatusIcon size={14} /> {statusInfo.label}
                  </span>
                  {activeEvent.status === 'completed' && (
                    <span className="am-evt-archive-pill">
                      <Archive size={13} /> Dokumentasi Arsip Resmi
                    </span>
                  )}
                </div>

                <img
                  src={activeEvent.poster || 'assets/images/image04.jpg'}
                  alt={activeEvent.title}
                  className="am-event-poster-img"
                  onClick={() =>
                    handlePreviewPhoto({
                      src: activeEvent.poster || 'assets/images/image04.jpg',
                      albumTitle: `${activeEvent.title} (${statusInfo.label})`,
                      caption: `${activeEvent.subtitle} — Periode: ${activeEvent.period}. ${activeEvent.completionReport}`,
                    })
                  }
                />
                <button
                  type="button"
                  className="am-poster-zoom-chip"
                  onClick={() =>
                    handlePreviewPhoto({
                      src: activeEvent.poster || 'assets/images/image04.jpg',
                      albumTitle: `${activeEvent.title} (${statusInfo.label})`,
                      caption: `${activeEvent.subtitle} — Periode: ${activeEvent.period}`,
                    })
                  }
                >
                  Perbesar Poster Event
                </button>
              </div>

              {/* Event Metadata & Completion Report Box */}
              <div className="am-card am-timer-studio-box" id="timer01">
                <div className="am-timer-studio-head">
                  <span className="am-timer-label">
                    <Calendar size={14} /> Detail Pelaksanaan Event
                  </span>
                  <span className={`am-evt-inline-tag ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <h3 className="am-evt-detail-title">{activeEvent.title}</h3>
                <div className="am-evt-meta-list">
                  <span>
                    <Calendar size={14} /> Periode: <strong>{activeEvent.period}</strong>
                  </span>
                  <span>
                    <MapPin size={14} /> Lokasi: <strong>{activeEvent.location}</strong>
                  </span>
                </div>

                {/* Completion Report Box */}
                <div
                  className={`am-evt-report-callout ${
                    activeEvent.status === 'completed'
                      ? 'is-completed'
                      : 'is-active'
                  }`}
                >
                  <div className="am-evt-report-head">
                    <CheckCircle2 size={16} />
                    <strong>
                      {activeEvent.status === 'completed'
                        ? 'Laporan Penyelesaian Kegiatan & Donasi'
                        : 'Informasi Status Kegiatan'}
                    </strong>
                  </div>
                  <p>
                    {activeEvent.completionReport || activeEvent.description}
                  </p>
                </div>

                {activeEvent.deliverables &&
                  activeEvent.deliverables.length > 0 && (
                    <div className="am-evt-deliverables">
                      <h4>Realisasi & Cakupan Program:</h4>
                      <ul>
                        {activeEvent.deliverables.map((item, i) => (
                          <li key={i}>
                            <CheckCircle2 size={14} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {activeEvent.registrationUrl && (
                  <a
                    href={activeEvent.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-btn am-btn-primary am-btn-sm am-btn-full"
                  >
                    <span>Buka Link Pendaftaran / Informasi</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC DONATION PANEL (CLOSED NOTICE VS ACTIVE CONFIGURATOR) */}
            <div className="am-card am-donation-studio-col">
              {!donationConfig.isOpen ? (
                /* MODE 1: DONATION CLOSED / COMPLETED ARCHIVE VIEW */
                <div className="am-donation-closed-studio">
                  <div className="am-closed-hero-box">
                    <div className="am-closed-badge-row">
                      <span className="am-closed-pill">
                        <Lock size={13} /> PENGGALANGAN DONASI DITUTUP
                      </span>
                      <span className="am-verified-pill">
                        <CheckCircle2 size={13} /> 100% TERSALURKAN
                      </span>
                    </div>

                    <h3>
                      Terima Kasih! Program Open Donation KURMA Telah Selesai
                    </h3>
                    <p>
                      Penggalangan donasi untuk{' '}
                      <strong>
                        Panti Asuhan &ldquo;Immamul Mutaqin&rdquo; (14 – 22 April
                        2022)
                      </strong>{' '}
                      telah resmi berakhir dan seluruh donasi uang tunai,
                      sembako, serta pakaian layak pakai telah diserahterimakan
                      kepada pengurus panti asuhan.
                    </p>

                    <div className="am-closed-stats-grid">
                      <div className="am-closed-stat-card">
                        <span>Status Kegiatan</span>
                        <strong>Telah Terlaksana</strong>
                        <small>22 April 2022 • Ambulu</small>
                      </div>
                      <div className="am-closed-stat-card">
                        <span>Penerima Manfaat</span>
                        <strong>Immamul Mutaqin</strong>
                        <small>Panti Asuhan • AMF Baksos</small>
                      </div>
                      <div className="am-closed-stat-card">
                        <span>Status Rekening Donasi</span>
                        <strong>Nonaktif Sementara</strong>
                        <small>Menunggu Event AMF Berikutnya</small>
                      </div>
                    </div>
                  </div>

                  {/* Archived Bank Reference (Disabled Copy to prevent accidental transfers) */}
                  <div className="am-archived-accounts-section">
                    <div className="am-archived-head">
                      <h4>
                        <Archive size={16} /> Arsip Rekening Resmi AMF (Tidak
                        Menerima Transfer Saat Ini)
                      </h4>
                      <span className="am-archived-note">
                        Rekening di bawah ini hanya ditampilkan sebagai arsip
                        transparansi poster resmi Carrd dan akan diaktifkan
                        kembali oleh Admin saat event donasi baru dibuka.
                      </span>
                    </div>

                    <div className="am-bank-studio-grid is-disabled-grid">
                      {donationConfig.bankAccounts.map((acc) => (
                        <div
                          key={acc.id || acc.bank}
                          className="am-bank-studio-card is-archived-card"
                        >
                          <div className="am-bank-top-row">
                            <span
                              className="am-bank-badge"
                              style={{ backgroundColor: acc.badgeColor }}
                            >
                              {acc.bank}
                            </span>
                            <span className="am-bank-closed-tag">
                              <Lock size={12} /> Ditutup
                            </span>
                          </div>
                          <div className="am-bank-num">{acc.number}</div>
                          <div className="am-bank-holder">a.n {acc.holder}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Verified Donations History */}
                  <div className="am-donations-history-box">
                    <h4>Riwayat Penyaluran & Apresiasi Donatur Terverifikasi</h4>
                    <div className="am-donations-log-list">
                      {donationsLog.slice(0, 4).map((log) => (
                        <div key={log.id} className="am-donation-log-item">
                          <div className="am-log-left">
                            <strong>{log.donorName}</strong>
                            <span>
                              {log.type} • {log.eventTitle}
                            </span>
                          </div>
                          <div className="am-log-right">
                            {log.amount > 0 && (
                              <strong>
                                Rp {Number(log.amount).toLocaleString('id-ID')}
                              </strong>
                            )}
                            <span className="am-log-verified-badge">
                              <CheckCircle2 size={12} /> Tersalurkan
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Persons & Admin Trigger */}
                  <div className="am-closed-footer-actions">
                    <div className="am-cp-info-box">
                      <span>
                        Ingin berkolaborasi untuk program Bakti Sosial / Beasiswa
                        AMF berikutnya? Hubungi Narahubung Resmi:
                      </span>
                      <div className="am-wa-confirm-grid">
                        {donationConfig.contactPersons.map((cp) => (
                          <a
                            key={cp.name}
                            href={cp.waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="am-wa-confirm-btn"
                          >
                            <MessageCircle size={18} />
                            <div>
                              <strong>Hubungi Kak {cp.name}</strong>
                              <span>{cp.phoneDisplay}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="am-admin-callout-bar">
                      <div>
                        <strong>Pengurus Ambulu Mengajar?</strong>
                        <span>
                          Anda dapat membuka kembali Open Donation atau menambah
                          event baru dari Panel Admin.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="am-btn am-btn-primary am-btn-sm"
                        onClick={onOpenAdmin}
                      >
                        <Settings size={14} /> Kelola via Admin
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODE 2: ACTIVE SMART DONATION CONFIGURATOR (When Admin opens donation) */
                <>
                  <div className="am-donation-studio-header">
                    <span className="am-studio-badge">
                      <HeartHandshake size={14} /> Smart Donation Configurator
                      (Aktif)
                    </span>
                    <h3>{donationConfig.campaignTitle}</h3>
                    <p>{donationConfig.activeNoticeDesc}</p>
                  </div>

                  {/* STEP 1: CHOOSE DONATION TYPE */}
                  <div className="am-config-step">
                    <div className="am-step-label">
                      <span className="am-step-num">1</span>
                      <span>Pilih Bentuk Kontribusi / Bantuan</span>
                    </div>
                    <div className="am-dtype-grid">
                      {DONATION_TYPES.map((t) => {
                        const Icon = t.icon;
                        const active = donationType === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`am-dtype-card ${
                              active ? 'is-active' : ''
                            }`}
                            onClick={() => setDonationType(t.id)}
                          >
                            <Icon size={20} />
                            <strong>{t.label}</strong>
                            <span>{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: NOMINAL PRESETS */}
                  {donationType === 'uang' && (
                    <div className="am-config-step">
                      <div className="am-step-label">
                        <span className="am-step-num">2</span>
                        <span>Pilih Estimasi Nominal & Nama Donatur</span>
                      </div>
                      <div className="am-nominal-grid">
                        {NOMINAL_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            className={`am-nominal-pill ${
                              selectedNominal === preset.value
                                ? 'is-active'
                                : ''
                            }`}
                            onClick={() => setSelectedNominal(preset.value)}
                          >
                            <strong>{preset.label}</strong>
                            <span>{preset.impact}</span>
                          </button>
                        ))}
                      </div>
                      <div className="am-donor-input-row">
                        <input
                          type="text"
                          className="am-admin-input"
                          placeholder="Nama Donatur (Opsional, kosongkan untuk Hamba Allah)"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: OFFICIAL BANK ACCOUNTS */}
                  <div className="am-config-step">
                    <div className="am-step-label">
                      <span className="am-step-num">
                        {donationType === 'uang' ? '3' : '2'}
                      </span>
                      <span>
                        Salin Nomor Rekening Resmi Ambulu Mengajar (Klik untuk
                        Salin)
                      </span>
                    </div>
                    <div className="am-bank-studio-grid">
                      {donationConfig.bankAccounts.map((acc) => {
                        const isCopied = copiedId === (acc.id || acc.bank);
                        return (
                          <div
                            key={acc.id || acc.bank}
                            className={`am-bank-studio-card ${
                              isCopied ? 'is-copied' : ''
                            }`}
                            onClick={() => handleCopy(acc)}
                          >
                            <div className="am-bank-top-row">
                              <span
                                className="am-bank-badge"
                                style={{ backgroundColor: acc.badgeColor }}
                              >
                                {acc.bank}
                              </span>
                              <button
                                type="button"
                                className={`am-copy-chip ${
                                  isCopied ? 'is-copied' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(acc);
                                }}
                              >
                                {isCopied ? (
                                  <>
                                    <Check size={13} /> Tersalin!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={13} /> Salin
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="am-bank-num">{acc.number}</div>
                            <div className="am-bank-holder">
                              a.n {acc.holder}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: WHATSAPP CONFIRMATION GENERATOR */}
                  <div className="am-config-step am-wa-confirm-step">
                    <div className="am-step-label">
                      <span className="am-step-num">
                        {donationType === 'uang' ? '4' : '3'}
                      </span>
                      <span>
                        Konfirmasi Donasi Otomatis via WhatsApp Narahubung Resmi
                      </span>
                    </div>
                    <div className="am-wa-confirm-grid">
                      {donationConfig.contactPersons.map((cp) => (
                        <button
                          key={cp.name}
                          type="button"
                          disabled={submittingLog}
                          onClick={() => handleRecordAndOpenWa(cp)}
                          className="am-wa-confirm-btn"
                        >
                          <MessageCircle size={18} />
                          <div>
                            <strong>Konfirmasi ke Kak {cp.name}</strong>
                            <span>{cp.phoneDisplay} (Pesan Otomatis)</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
