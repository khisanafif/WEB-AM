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
  Archive,
  Clock,
  MapPin,
  Lock,
  Unlock,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';
import { createDonationLogApi } from '../services/apiClient';

const DONATION_TYPES = [
  {
    id: 'uang',
    label: 'Donasi Dana Tunai',
    icon: Coins,
    desc: 'Transfer melalui rekening resmi BRI, BCA, BNI, atau Dompet Digital',
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
    label: 'Telah Terlaksana',
    badgeClass: 'is-completed',
    icon: CheckCircle2,
  },
  upcoming: {
    label: 'Agenda Berikutnya',
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
  const [copiedId, setCopiedId] = useState(null);

  const [donationType, setDonationType] = useState('uang');
  const [selectedNominal, setSelectedNominal] = useState(100000);
  const [donorName, setDonorName] = useState('');
  const [selectedBank, setSelectedBank] = useState('BRI');
  const [submittingLog, setSubmittingLog] = useState(false);

  const filteredEvents = events.filter((evt) =>
    statusFilter === 'all' ? true : evt.status === statusFilter
  );

  const handleCopy = (acc) => {
    navigator.clipboard.writeText(
      acc.numberClean || acc.rawNumber || acc.number
    );
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
    const msg = `Halo Kak ${cp.name} (Ambulu Mengajar),\n\nSaya *${nameStr}* ingin mengonfirmasi *${typeObj?.label}*${nominalStr} untuk program *${donationConfig.campaignTitle}*.\n\nTerima kasih!`;
    return `https://wa.me/${cp.phoneClean}?text=${encodeURIComponent(msg)}`;
  };

  const handleRecordAndOpenWa = async (cp) => {
    const waUrl = buildWhatsAppConfirmationUrl(cp);
    setSubmittingLog(true);
    try {
      const res = await createDonationLogApi({
        donorName: donorName.trim() || 'Hamba Allah',
        eventId: events[0]?.id || 'evt-general',
        eventTitle: donationConfig.campaignTitle,
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
      // ignore
    } finally {
      setSubmittingLog(false);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      className="am-section"
      id="eventambulumengajar"
      aria-labelledby="event-heading"
    >
      <div className="am-container">
        <div className="am-section-header am-header-split">
          <div>
            <div className="am-event-logo-pill" id="image03">
              <img
                src="assets/images/image03.png"
                alt="Identitas Program Ambulu Mengajar"
              />
              <span>Program & Filantropi Sosial</span>
            </div>
            <h2 className="am-section-title" id="event-heading">
              Agenda Kegiatan & <span>Penyaluran Sosial</span>
            </h2>
          </div>

          <p className="am-section-desc">
            Daftar pelaksanaan kegiatan pendidikan, bakti sosial kemanusiaan,
            serta transparansi penyaluran donasi melalui Ambulu Mengajar
            Filantropi (AMF).
          </p>
        </div>

        {/* FILTER PILLS */}
        <div className="am-event-selector-bar">
          <div className="am-event-filter-pills">
            {[
              { id: 'all', label: `Semua Kegiatan (${events.length})` },
              {
                id: 'completed',
                label: `Telah Terlaksana (${
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
                label: `Agenda Berikutnya (${
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
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* DIRECTLY OPEN EVENT CARDS (NO SEPARATE SELECTOR VS DETAIL CARD) */}
        <div className="am-events-open-grid">
          {filteredEvents.map((evt) => {
            const statusInfo =
              STATUS_META[evt.status] || STATUS_META.completed;
            const StatusIcon = statusInfo.icon;

            return (
              <article key={evt.id} className="am-card am-event-open-card">
                <div
                  className="am-event-open-media"
                  onClick={() =>
                    handlePreviewPhoto({
                      src: evt.poster || 'assets/images/image04.jpg',
                      albumTitle: `${evt.title} (${statusInfo.label})`,
                      caption: `${evt.subtitle} — Periode: ${evt.period}`,
                    })
                  }
                >
                  <img
                    src={evt.poster || 'assets/images/image04.jpg'}
                    alt={evt.title}
                  />
                  <div className="am-event-open-badges">
                    <span
                      className={`am-evt-status-badge ${statusInfo.badgeClass}`}
                    >
                      <StatusIcon size={13} /> {statusInfo.label}
                    </span>
                    <span className="am-evt-archive-pill">{evt.category}</span>
                  </div>
                </div>

                <div className="am-event-open-body">
                  <h3>{evt.title}</h3>
                  <p className="am-event-open-sub">{evt.subtitle}</p>

                  <div className="am-evt-meta-list">
                    <span>
                      <Calendar size={14} /> Periode:{' '}
                      <strong>{evt.period}</strong>
                    </span>
                    <span>
                      <MapPin size={14} /> Lokasi:{' '}
                      <strong>{evt.location}</strong>
                    </span>
                  </div>

                  <div className="am-evt-report-callout">
                    <div className="am-evt-report-head">
                      <CheckCircle2 size={15} />
                      <strong>
                        {evt.status === 'completed'
                          ? 'Laporan Pelaksanaan Kegiatan'
                          : 'Informasi Kegiatan'}
                      </strong>
                    </div>
                    <p>{evt.completionReport || evt.description}</p>
                  </div>

                  {evt.deliverables && evt.deliverables.length > 0 && (
                    <div className="am-evt-deliverables">
                      <h4>Cakupan & Realisasi Program:</h4>
                      <ul>
                        {evt.deliverables.map((item, i) => (
                          <li key={i}>
                            <CheckCircle2 size={14} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evt.registrationUrl && (
                    <a
                      href={evt.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="am-btn am-btn-primary am-btn-sm am-btn-full"
                    >
                      <span>Informasi & Pendaftaran</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* UNIFIED FILANTROPI & DONATION STATUS CARD */}
        <div className="am-card am-donation-studio-col am-donation-full-card">
          {!donationConfig.isOpen ? (
            <div className="am-donation-closed-studio">
              <div className="am-closed-hero-box">
                <div className="am-closed-badge-row">
                  <span className="am-closed-pill">
                    <Lock size={13} />{' '}
                    {donationConfig.statusBadgeText ||
                      'PROGRAM DONASI TELAH SELESAI'}
                  </span>
                  <span className="am-verified-pill">
                    <FileCheck2 size={13} /> 100% TERSALURKAN
                  </span>
                </div>

                <h3>
                  {donationConfig.closedNoticeTitle ||
                    'Penyaluran Donasi Program KURMA Telah Selesai Dilaksanakan'}
                </h3>
                <p>{donationConfig.closedNoticeDesc}</p>

                <div className="am-closed-stats-grid">
                  <div className="am-closed-stat-card">
                    <span>Status Kegiatan</span>
                    <strong>Telah Terlaksana</strong>
                    <small>Kecamatan Ambulu, Jember</small>
                  </div>
                  <div className="am-closed-stat-card">
                    <span>Penerima Manfaat</span>
                    <strong>Immamul Mutaqin</strong>
                    <small>Panti Asuhan • AMF Baksos</small>
                  </div>
                  <div className="am-closed-stat-card">
                    <span>Penyaluran Amanah</span>
                    <strong>100% Selesai</strong>
                    <small>Dana, Sembako & Pakaian</small>
                  </div>
                </div>
              </div>

              <div className="am-donation-bottom-split">
                <div className="am-archived-accounts-section">
                  <div className="am-archived-head">
                    <h4>
                      <Archive size={16} /> Kanal Rekening Resmi AMF
                    </h4>
                    <span className="am-archived-note">
                      Daftar rekening resmi Ambulu Mengajar Filantropi (AMF):
                    </span>
                  </div>

                  <div className="am-bank-studio-grid is-disabled-grid">
                    {(donationConfig.bankAccounts || []).map((acc) => (
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
                            <Lock size={12} /> Periode Selesai
                          </span>
                        </div>
                        <div className="am-bank-num">{acc.number}</div>
                        <div className="am-bank-holder">a.n {acc.holder}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="am-donations-history-box">
                  <h4>Jejak Penyaluran & Narahubung Resmi</h4>
                  <div className="am-donations-log-list">
                    {donationsLog.slice(0, 3).map((log) => (
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

                  <div className="am-wa-confirm-grid" style={{ marginTop: '1rem' }}>
                    {(donationConfig.contactPersons || []).map((cp) => (
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
              </div>
            </div>
          ) : (
            <>
              <div className="am-donation-studio-header">
                <span className="am-studio-badge">
                  <Unlock size={14} />{' '}
                  {donationConfig.statusBadgeText ||
                    'OPEN DONATION — SEDANG BERLANGSUNG'}
                </span>
                <h3>{donationConfig.campaignTitle}</h3>
                <p>{donationConfig.activeNoticeDesc}</p>
              </div>

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
                        className={`am-dtype-card ${active ? 'is-active' : ''}`}
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
                          selectedNominal === preset.value ? 'is-active' : ''
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

              <div className="am-config-step">
                <div className="am-step-label">
                  <span className="am-step-num">
                    {donationType === 'uang' ? '3' : '2'}
                  </span>
                  <span>
                    Salin Nomor Rekening Resmi Ambulu Mengajar (Klik untuk Salin)
                  </span>
                </div>
                <div className="am-bank-studio-grid">
                  {(donationConfig.bankAccounts || []).map((acc) => {
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
                        <div className="am-bank-holder">a.n {acc.holder}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="am-config-step am-wa-confirm-step">
                <div className="am-step-label">
                  <span className="am-step-num">
                    {donationType === 'uang' ? '4' : '3'}
                  </span>
                  <span>Konfirmasi Donasi via WhatsApp Narahubung Resmi</span>
                </div>
                <div className="am-wa-confirm-grid">
                  {(donationConfig.contactPersons || []).map((cp) => (
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
                        <span>{cp.phoneDisplay}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
