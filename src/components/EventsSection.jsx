import React, { useState, useEffect } from 'react';
import {
  Clock,
  Copy,
  Check,
  ZoomIn,
  ExternalLink,
  Gift,
  PhoneCall,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { FEATURED_EVENT } from '../data/ambuluData';

export default function EventsSection({ onOpenLightbox }) {
  const [timerMode, setTimerMode] = useState('upcoming');
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: '14',
    hours: '06',
    minutes: '45',
    seconds: '00',
  });

  // Target 14 days from page load for upcoming simulation
  const [upcomingTimestamp] = useState(
    () => Math.floor(Date.now() / 1000) + 14 * 86400 + 6 * 3600 + 45 * 60
  );

  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0');

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const target =
        timerMode === 'carrd'
          ? FEATURED_EVENT.carrdTimestamp
          : upcomingTimestamp;

      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400);
      diff -= d * 86400;
      const h = Math.floor(diff / 3600);
      diff -= h * 3600;
      const m = Math.floor(diff / 60);
      const s = diff - m * 60;

      setTimeLeft({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timerMode, upcomingTimestamp]);

  const handleCopy = (rawNumber, bankName) => {
    navigator.clipboard.writeText(rawNumber).then(() => {
      setCopiedAccount(bankName);
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  return (
    <section className="am-section am-section-alt" id="eventambulumengajar">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">Event & Aksi Filantropi</span>
          <h2 id="text07" className="am-section-title">
            <span>EVENT</span> AMBULU MENGAJAR
          </h2>
          <p className="am-section-desc">
            Program kepedulian sosial, penggalangan donasi pendidikan & panti
            asuhan, serta agenda kegiatan unggulan{' '}
            <strong>Ambulu Mengajar</strong>.
          </p>
          <hr className="am-carrd-divider" />
        </div>

        <div className="am-event-layout">
          {/* Left Column: Poster Showcase (#image03 & #image04 from Carrd) */}
          <div className="am-card am-event-poster-card">
            <a
              href={FEATURED_EVENT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="am-event-logo-pill"
              id="image03"
              title="Instagram Resmi @ambulumengajar"
            >
              <img
                src={FEATURED_EVENT.logoImg}
                alt="Logo Event Ambulu Mengajar"
              />
              <span>Official Event</span>
            </a>

            <div
              className="am-poster-wrapper"
              id="image04"
              onClick={() =>
                onOpenLightbox({
                  src: FEATURED_EVENT.posterImg,
                  albumTitle: FEATURED_EVENT.title,
                  caption: `${FEATURED_EVENT.subtitle} (${FEATURED_EVENT.period})`,
                  year: '2022',
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                onOpenLightbox({
                  src: FEATURED_EVENT.posterImg,
                  albumTitle: FEATURED_EVENT.title,
                  caption: `${FEATURED_EVENT.subtitle} (${FEATURED_EVENT.period})`,
                  year: '2022',
                })
              }
            >
              <img
                src={FEATURED_EVENT.posterImg}
                alt={`${FEATURED_EVENT.title} - ${FEATURED_EVENT.subtitle}`}
                className="am-poster-img"
              />
              <div className="am-poster-zoom-bar">
                <ZoomIn size={16} /> Klik untuk memperbesar poster resmi
              </div>
            </div>

            <a
              href={FEATURED_EVENT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="am-btn am-btn-outline am-btn-full"
            >
              Lihat Update Event di Instagram <ExternalLink size={15} />
            </a>
          </div>

          {/* Right Column: Timer (#timer01) + Event & Donation Details */}
          <div className="am-event-details-col">
            {/* Carrd Timer Box (#timer01) */}
            <div className="am-card am-timer-card" id="timer01">
              <div className="am-timer-header">
                <span className="am-timer-title">
                  <Clock size={16} /> Timer Kegiatan Ambulu Mengajar
                </span>
                <div className="am-timer-Toggle-group">
                  <button
                    type="button"
                    className={`am-timer-mode-btn ${
                      timerMode === 'upcoming' ? 'is-active' : ''
                    }`}
                    onClick={() => setTimerMode('upcoming')}
                  >
                    Agenda Berikutnya
                  </button>
                  <button
                    type="button"
                    className={`am-timer-mode-btn ${
                      timerMode === 'carrd' ? 'is-active' : ''
                    }`}
                    onClick={() => setTimerMode('carrd')}
                  >
                    Timer KURMA (Carrd)
                  </button>
                </div>
              </div>

              <div className="am-timer-grid">
                <div className="am-timer-box">
                  <span className="am-timer-digit">{timeLeft.days}</span>
                  <span className="am-timer-label">Hari</span>
                </div>
                <div className="am-timer-box">
                  <span className="am-timer-digit">{timeLeft.hours}</span>
                  <span className="am-timer-label">Jam</span>
                </div>
                <div className="am-timer-box">
                  <span className="am-timer-digit">{timeLeft.minutes}</span>
                  <span className="am-timer-label">Menit</span>
                </div>
                <div className="am-timer-box">
                  <span className="am-timer-digit">{timeLeft.seconds}</span>
                  <span className="am-timer-label">Detik</span>
                </div>
              </div>

              <p className="am-timer-note">
                {timerMode === 'carrd'
                  ? 'Status Periode KURMA (14 April – 22 April 2022): 00:00:00:00 — Donasi Telah Terlaksana & Tersalurkan'
                  : 'Hitung mundur menuju rangkaian kegiatan sosialisasi pendidikan & bakti sosial periode berikutnya'}
              </p>
            </div>

            {/* Event Details & Bank Accounts Card */}
            <div className="am-card am-event-info-card">
              <div className="am-event-info-top">
                <div>
                  <span className="am-badge-pill">
                    <Calendar size={13} /> Periode: {FEATURED_EVENT.period}
                  </span>
                  <h3>{FEATURED_EVENT.title}</h3>
                  <p className="am-event-subtitle">{FEATURED_EVENT.subtitle}</p>
                </div>
              </div>

              {/* Jenis Bantuan Donasi */}
              <div className="am-donation-types-wrap">
                <span className="am-sub-heading">
                  <Gift size={15} /> Menerima Bantuan Donasi Berupa:
                </span>
                <div className="am-donation-chips">
                  {FEATURED_EVENT.acceptedDonations.map((item, idx) => (
                    <span key={idx} className="am-donation-chip">
                      • {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rekening Donasi Resmi */}
              <div className="am-bank-section">
                <span className="am-sub-heading">
                  <CreditCard size={15} /> Rekening & Dompet Digital Resmi:
                </span>
                <div className="am-bank-grid">
                  {FEATURED_EVENT.bankAccounts.map((acc) => {
                    const isCopied = copiedAccount === acc.bank;
                    return (
                      <div key={acc.bank} className="am-bank-card">
                        <div className="am-bank-info">
                          <span className="am-bank-name">{acc.bank}</span>
                          <strong className="am-bank-num">{acc.number}</strong>
                          <span className="am-bank-holder">
                            a.n. {acc.holder}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`am-copy-btn ${
                            isCopied ? 'is-copied' : ''
                          }`}
                          onClick={() => handleCopy(acc.rawNumber, acc.bank)}
                        >
                          {isCopied ? (
                            <>
                              <Check size={14} /> Tersalin
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Salin
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Person */}
              <div className="am-cp-row">
                <span className="am-sub-heading">
                  <PhoneCall size={15} /> Contact Person Resmi:
                </span>
                <div className="am-cp-buttons">
                  {FEATURED_EVENT.contactPersons.map((cp) => (
                    <a
                      key={cp.name}
                      href={cp.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="am-cp-btn"
                    >
                      <PhoneCall size={14} />
                      <span>
                        {cp.phoneDisplay} ({cp.name})
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

