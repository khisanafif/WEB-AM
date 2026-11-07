import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Search,
  HeartHandshake,
  Home,
  Compass,
  Layers,
  Camera,
  HelpCircle,
  MessageSquareHeart,
  ShieldCheck,
} from 'lucide-react';
import { ORG_INFO } from '../data/ambuluData';

const DOCK_ITEMS = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'tentang', label: 'Tentang', icon: Compass },
  { id: 'divisiambulumengajar', label: 'Divisi', icon: Layers },
  { id: 'eventambulumengajar', label: 'Program', icon: HeartHandshake },
  { id: 'dokumentasiambulumengajar', label: 'Dokumentasi', icon: Camera },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'kontak', label: 'Kontak', icon: MessageSquareHeart },
];

export default function Navbar({
  theme,
  onToggleTheme,
  activeSection,
  onOpenCommandPalette,
  onOpenAdmin,
  adminUser,
  orgInfo,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const info = orgInfo || ORG_INFO;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, (y / docHeight) * 100));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="am-exec-header">
        <div
          className="am-scroll-progress"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="am-container am-exec-header-inner">
          <a href="#home" className="am-brand">
            <div className="am-brand-logo-wrap">
              <img
                src={info.logoMain || ORG_INFO.logoMain}
                alt={`Logo ${info.name}`}
                className="am-brand-logo"
              />
            </div>
            <div className="am-brand-text">
              <div className="am-brand-title-row">
                <span className="am-brand-name">{info.name}</span>
                <span className="am-live-pill">
                  <span className="am-live-dot" />
                  EST. {info.foundedYear || '2011'}
                </span>
              </div>
              <span className="am-brand-meta">
                <Sparkles size={11} /> {info.category} • {info.location}
              </span>
            </div>
          </a>

          <button
            type="button"
            className="am-cmd-trigger"
            onClick={onOpenCommandPalette}
          >
            <Search size={15} />
            <span>Cari divisi, kegiatan, atau dokumentasi...</span>
            <kbd>Ctrl K</kbd>
          </button>

          <div className="am-exec-actions">
            <button
              type="button"
              className="am-theme-pill-btn"
              onClick={onToggleTheme}
              title="Ubah Tema Tampilan"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={15} /> <span>Mode Gelap</span>
                </>
              ) : (
                <>
                  <Sun size={15} /> <span>Mode Terang</span>
                </>
              )}
            </button>

            <a
              href="#eventambulumengajar"
              className="am-btn am-btn-outline am-btn-sm am-hide-sm"
            >
              <HeartHandshake size={15} />
              <span>Program & Sosial</span>
            </a>

            <button
              type="button"
              onClick={onOpenAdmin}
              className={`am-btn am-btn-sm ${
                adminUser ? 'am-btn-admin-active' : 'am-btn-primary'
              }`}
            >
              <ShieldCheck size={15} />
              <span>{adminUser ? 'Panel Admin' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="am-floating-dock" aria-label="Navigasi Utama">
        {DOCK_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`am-dock-item ${isActive ? 'is-active' : ''}`}
            >
              <IconComponent size={18} />
              <span className="am-dock-label">{item.label}</span>
              {isActive && <span className="am-dock-indicator" />}
            </a>
          );
        })}
        <button
          type="button"
          className="am-dock-item am-dock-search-btn"
          onClick={onOpenCommandPalette}
          title="Pencarian Cepat (Ctrl+K)"
        >
          <Search size={18} />
          <span className="am-dock-label">Cari</span>
        </button>
      </nav>
    </>
  );
}
