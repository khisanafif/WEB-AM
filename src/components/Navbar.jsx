import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { ORG_INFO } from '../data/ambuluData';

const NAV_ITEMS = [
  { id: 'home', label: 'Beranda' },
  { id: 'tentang', label: 'Profil & Visi' },
  { id: 'divisiambulumengajar', label: 'Divisi' },
  { id: 'eventambulumengajar', label: 'Event & Donasi' },
  { id: 'dokumentasiambulumengajar', label: 'Dokumentasi' },
  { id: 'faq', label: 'FAQ' },
  { id: 'kontak', label: 'Kontak' },
];

export default function Navbar({ theme, onToggleTheme, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

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

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`am-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      {/* Top Scroll Progress Indicator */}
      <div
        className="am-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="am-container am-nav-inner">
        <a href="#home" className="am-brand" onClick={handleNavClick}>
          <div className="am-brand-logo-wrap">
            <img
              src={ORG_INFO.logoMain}
              alt="Logo Ambulu Mengajar"
              className="am-brand-logo"
            />
          </div>
          <div className="am-brand-text">
            <span className="am-brand-name">{ORG_INFO.name}</span>
            <span className="am-brand-meta">
              <Sparkles size={11} /> Pendidikan & Sosial • Jember
            </span>
          </div>
        </a>

        <nav
          className={`am-nav-links ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Navigasi Utama"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`am-nav-link ${
                activeSection === item.id ? 'is-active' : ''
              }`}
              onClick={handleNavClick}
            >
              {item.label}
            </a>
          ))}

          <div className="am-mobile-only-cta">
            <a
              href="#eventambulumengajar"
              className="am-btn am-btn-primary am-btn-sm"
              onClick={handleNavClick}
            >
              <HeartHandshake size={16} /> Donasi & Event
            </a>
            <a
              href="https://linktr.ee/AmbuluMengajar"
              target="_blank"
              rel="noopener noreferrer"
              className="am-btn am-btn-outline am-btn-sm"
            >
              Linktree Resmi <ExternalLink size={14} />
            </a>
          </div>
        </nav>

        <div className="am-nav-actions">
          <button
            type="button"
            className="am-icon-toggle"
            onClick={onToggleTheme}
            title={
              theme === 'light'
                ? 'Beralih ke Mode Gelap Khas Carrd (#363657)'
                : 'Beralih ke Mode Terang'
            }
            aria-label="Ubah Mode Tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a
            href="#eventambulumengajar"
            className="am-btn am-btn-ghost am-btn-sm am-desktop-only"
          >
            <HeartHandshake size={16} /> Program & Donasi
          </a>

          <a
            href="https://linktr.ee/AmbuluMengajar"
            target="_blank"
            rel="noopener noreferrer"
            className="am-btn am-btn-primary am-btn-sm am-desktop-only"
          >
            Linktree <ExternalLink size={14} />
          </a>

          <button
            type="button"
            className="am-mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Buka atau tutup menu navigasi"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

