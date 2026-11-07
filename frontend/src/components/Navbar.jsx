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
  { id: 'home', label: 'Bento Hero', icon: Home },
  { id: 'tentang', label: 'Time-Machine', icon: Compass },
  { id: 'divisiambulumengajar', label: 'Studio Divisi', icon: Layers },
  { id: 'eventambulumengajar', label: 'Event & Arsip', icon: HeartHandshake },
  { id: 'dokumentasiambulumengajar', label: 'Cinema Galeri', icon: Camera },
  { id: 'faq', label: 'Tanya Jawab', icon: HelpCircle },
  { id: 'kontak', label: 'Sinergi WA', icon: MessageSquareHeart },
];

export default function Navbar({
  theme,
  onToggleTheme,
  activeSection,
  onOpenCommandPalette,
  onOpenAdmin,
  adminUser,
  isDonationOpen,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

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
      {/* TOP EXECUTIVE COMMAND HEADER */}
      <header className="am-exec-header">
        <div
          className="am-scroll-progress"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="am-container am-exec-header-inner">
          <a href="#home" className="am-brand">
            <div className="am-brand-logo-wrap">
              <img
                src={ORG_INFO.logoMain}
                alt="Logo Ambulu Mengajar"
                className="am-brand-logo"
              />
            </div>
            <div className="am-brand-text">
              <div className="am-brand-title-row">
                <span className="am-brand-name">{ORG_INFO.name}</span>
                <span className="am-live-pill">
                  <span className="am-live-dot" />
                  {isDonationOpen ? 'OPEN DONATION AKTIF' : 'EVENT KURMA SELESAI'}
                </span>
              </div>
              <span className="am-brand-meta">
                <Sparkles size={11} /> Non-Profit Pendidikan & Sosial • Kec.
                Ambulu, Jember
              </span>
            </div>
          </a>

          {/* Interactive Command Search Pill */}
          <button
            type="button"
            className="am-cmd-trigger"
            onClick={onOpenCommandPalette}
          >
            <Search size={15} />
            <span>Eksplorasi Cepat Divisi, Album, atau Event...</span>
            <kbd>Ctrl K</kbd>
          </button>

          <div className="am-exec-actions">
            <button
              type="button"
              className="am-theme-pill-btn"
              onClick={onToggleTheme}
              title="Ubah Atmosfer Tampilan"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={15} /> <span>Mode Carrd</span>
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
              <span>{isDonationOpen ? 'Donasi Aktif' : 'Arsip Event'}</span>
            </a>

            <button
              type="button"
              onClick={onOpenAdmin}
              className={`am-btn am-btn-sm ${
                adminUser ? 'am-btn-admin-active' : 'am-btn-primary'
              }`}
            >
              <ShieldCheck size={15} />
              <span>{adminUser ? 'Dashboard Admin' : 'Login Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING INTERACTIVE MACOS-STYLE GLASS DOCK */}
      <nav
        className="am-floating-dock"
        aria-label="Navigasi Interaktif Melayang"
      >
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
          onClick={onOpenAdmin}
          title="Portal Login Admin"
        >
          <ShieldCheck size={18} />
          <span className="am-dock-label">Admin</span>
        </button>
      </nav>
    </>
  );
}
