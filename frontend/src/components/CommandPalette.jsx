import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Compass,
  Layers,
  HeartHandshake,
  Camera,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  DIVISIONS,
  FEATURED_EVENT,
  DOCUMENTATION_ALBUMS,
  SOCIAL_LINKS,
} from '../data/ambuluData';

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectDivision,
  onSelectAlbum,
  onOpenAdmin,
  isDonationOpen,
}) {
  const [query, setQuery] = useState('');
  const [copiedBank, setCopiedBank] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const jumpTo = (hash) => {
    onClose();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyBank = (raw, bank) => {
    navigator.clipboard.writeText(raw).then(() => {
      setCopiedBank(bank);
      setTimeout(() => setCopiedBank(null), 1800);
    });
  };

  const filteredDivisions = DIVISIONS.filter(
    (d) =>
      !q ||
      d.exactTitle.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q)
  );

  const filteredAlbums = DOCUMENTATION_ALBUMS.filter(
    (a) =>
      !q ||
      a.exactTitle.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.year.includes(q)
  );

  return (
    <div
      className="am-cmd-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Eksplorasi Cepat"
    >
      <div className="am-cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-cmd-search-bar">
          <Search size={18} className="am-cmd-search-icon" />
          <input
            type="text"
            autoFocus
            placeholder="Ketik divisi (HRD, AML, AMF, KOMINFO), album dokumentasi, atau rekening donasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="am-cmd-input"
          />
          <button
            type="button"
            className="am-cmd-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="am-cmd-body">
          {/* Quick Navigation */}
          <div className="am-cmd-group">
            <span className="am-cmd-group-title">
              <Compass size={13} /> Navigasi Cepat Bagian
            </span>
            <div className="am-cmd-chips">
              <button type="button" onClick={() => jumpTo('#home')}>
                Bento Hero
              </button>
              <button type="button" onClick={() => jumpTo('#tentang')}>
                Time-Machine Sejarah & Visi
              </button>
              <button
                type="button"
                onClick={() => jumpTo('#divisiambulumengajar')}
              >
                Studio 4 Divisi & Kuis Relawan
              </button>
              <button
                type="button"
                onClick={() => jumpTo('#eventambulumengajar')}
              >
                Status Event & Arsip KURMA (Selesai)
              </button>
              <button
                type="button"
                onClick={() => jumpTo('#dokumentasiambulumengajar')}
              >
                Cinema 13 Dokumentasi
              </button>
              <button type="button" onClick={() => jumpTo('#kontak')}>
                Formulir Kolaborasi WA
              </button>
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                >
                  <ShieldCheck size={13} /> Login / Panel Admin
                </button>
              )}
            </div>
          </div>

          {/* 4 Divisions Quick Jump */}
          {filteredDivisions.length > 0 && (
            <div className="am-cmd-group">
              <span className="am-cmd-group-title">
                <Layers size={13} /> Lompat ke Studio Divisi
              </span>
              <div className="am-cmd-list">
                {filteredDivisions.map((div) => (
                  <button
                    key={div.id}
                    type="button"
                    className="am-cmd-item"
                    onClick={() => {
                      onSelectDivision(div.id);
                      jumpTo('#divisiambulumengajar');
                    }}
                  >
                    <div>
                      <strong>{div.exactTitle}</strong>
                      <span>{div.carrdPoints.join(' • ')}</span>
                    </div>
                    <span className="am-cmd-badge">{div.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5 Documentation Albums Quick Jump */}
          {filteredAlbums.length > 0 && (
            <div className="am-cmd-group">
              <span className="am-cmd-group-title">
                <Camera size={13} /> Buka Album Dokumentasi
              </span>
              <div className="am-cmd-list">
                {filteredAlbums.map((alb) => (
                  <button
                    key={alb.id}
                    type="button"
                    className="am-cmd-item"
                    onClick={() => {
                      onSelectAlbum(alb.id);
                      jumpTo('#dokumentasiambulumengajar');
                    }}
                  >
                    <div>
                      <strong>{alb.exactTitle}</strong>
                      <span>
                        {alb.division} • {alb.photos.length} Foto Dokumentasi
                      </span>
                    </div>
                    <span className="am-cmd-badge">{alb.year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Copy Bank Accounts */}
          <div className="am-cmd-group">
            <span className="am-cmd-group-title">
              <HeartHandshake size={13} />{' '}
              {isDonationOpen
                ? 'Salin Cepat Rekening Donasi (Open Donation Aktif)'
                : 'Arsip Rekening Resmi AMF (Event KURMA Telah Selesai — Ditutup)'}
            </span>
            <div className="am-cmd-bank-row">
              {FEATURED_EVENT.bankAccounts.map((acc) => (
                <div key={acc.bank} className="am-cmd-bank-pill">
                  <div>
                    <strong>
                      {acc.bank}: {acc.number}
                    </strong>
                    <span>a.n. {acc.holder}</span>
                  </div>
                  {isDonationOpen ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyBank(
                          acc.numberClean || acc.rawNumber,
                          acc.bank
                        )
                      }
                    >
                      {copiedBank === acc.bank ? (
                        <>
                          <Check size={13} /> Tersalin
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="am-cmd-badge">
                      <Lock size={11} /> Selesai
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Official Social Links */}
          <div className="am-cmd-group">
            <span className="am-cmd-group-title">
              <Sparkles size={13} /> Kanal Sosial Media Resmi
            </span>
            <div className="am-cmd-chips">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.name} ({s.handle}) <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

