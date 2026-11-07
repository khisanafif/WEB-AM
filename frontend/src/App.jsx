import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import DivisionsSection from './components/DivisionsSection';
import EventsSection from './components/EventsSection';
import DocumentationSection from './components/DocumentationSection';
import FaqSection from './components/FaqSection';
import ContactFooter from './components/ContactFooter';
import LightboxModal from './components/LightboxModal';
import CommandPalette from './components/CommandPalette';
import AdminPortalModal from './components/AdminPortalModal';
import {
  ALL_GALLERY_PHOTOS,
  FEATURED_EVENT,
  DEFAULT_BACKEND_STATE,
} from './data/ambuluData';
import {
  fetchPublicState,
  getStoredAdminUser,
} from './services/apiClient';

const LIGHTBOX_ITEMS = [
  ...ALL_GALLERY_PHOTOS,
  {
    id: 'event-poster',
    src: FEATURED_EVENT.posterImg,
    albumTitle: FEATURED_EVENT.title,
    caption: `${FEATURED_EVENT.subtitle} (${FEATURED_EVENT.period})`,
    year: '2022',
  },
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('am_react_theme') || 'dark';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedDivId, setSelectedDivId] = useState('hrd');
  const [selectedAlbumId, setSelectedAlbumId] = useState('all');

  // Backend & Admin State
  const [backendState, setBackendState] = useState(DEFAULT_BACKEND_STATE);
  const [backendStatus, setBackendStatus] = useState('fallback');
  const [adminUser, setAdminUser] = useState(() => getStoredAdminUser());

  useEffect(() => {
    let mounted = true;
    fetchPublicState().then((res) => {
      if (!mounted) return;
      if (res.state) setBackendState(res.state);
      if (res.backendStatus) setBackendStatus(res.backendStatus);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('am_react_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const sectionIds = [
      'home',
      'tentang',
      'divisiambulumengajar',
      'eventambulumengajar',
      'dokumentasiambulumengajar',
      'faq',
      'kontak',
    ];

    const onScroll = () => {
      const scrollPos = window.scrollY + 200;
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="am-app-root">
      {/* Hidden SVG Sprite Definitions from ambulumengajar.carrd.co */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 40 40"
        style={{ display: 'none', width: 0, height: 0 }}
      >
        <symbol id="icon-910" viewBox="0 0 40 40">
          <path d="M20,7c4.2,0,4.7,0,6.3,0.1c1.5,0.1,2.3,0.3,3,0.5C30,8,30.5,8.3,31.1,8.9c0.5,0.5,0.9,1.1,1.2,1.8c0.2,0.5,0.5,1.4,0.5,3 C33,15.3,33,15.8,33,20s0,4.7-0.1,6.3c-0.1,1.5-0.3,2.3-0.5,3c-0.3,0.7-0.6,1.2-1.2,1.8c-0.5,0.5-1.1,0.9-1.8,1.2 c-0.5,0.2-1.4,0.5-3,0.5C24.7,33,24.2,33,20,33s-4.7,0-6.3-0.1c-1.5-0.1-2.3-0.3-3-0.5C10,32,9.5,31.7,8.9,31.1 C8.4,30.6,8,30,7.7,29.3c-0.2-0.5-0.5-1.4-0.5-3C7,24.7,7,24.2,7,20s0-4.7,0.1-6.3c0.1-1.5,0.3-2.3,0.5-3C8,10,8.3,9.5,8.9,8.9 C9.4,8.4,10,8,10.7,7.7c0.5-0.2,1.4-0.5,3-0.5C15.3,7.1,15.8,7,20,7z M20,4.3c-4.3,0-4.8,0-6.5,0.1c-1.6,0-2.8,0.3-3.8,0.7 C8.7,5.5,7.8,6,6.9,6.9C6,7.8,5.5,8.7,5.1,9.7c-0.4,1-0.6,2.1-0.7,3.8c-0.1,1.7-0.1,2.2-0.1,6.5s0,4.8,0.1,6.5 c0,1.6,0.3,2.8,0.7,3.8c0.4,1,0.9,1.9,1.8,2.8c0.9,0.9,1.7,1.4,2.8,1.8c1,0.4,2.1,0.6,3.8,0.7c1.6,0.1,2.2,0.1,6.5,0.1 s4.8,0,6.5-0.1c1.6-0.1,2.9-0.3,3.8-0.7c1-0.4,1.9-0.9,2.8-1.8c0.9-0.9,1.4-1.7,1.8-2.8c0.4-1,0.6-2.1,0.7-3.8 c0.1-1.6,0.1-2.2,0.1-6.5s0-4.8-0.1-6.5c-0.1-1.6-0.3-2.9-0.7-3.8c-0.4-1-0.9-1.9-1.8-2.8c-0.9-0.9-1.7-1.4-2.8-1.8 c-1-0.4-2.1-0.6-3.8-0.7C24.8,4.3,24.3,4.3,20,4.3L20,4.3L20,4.3z" />
          <path d="M20,11.9c-4.5,0-8.1,3.7-8.1,8.1s3.7,8.1,8.1,8.1s8.1-3.7,8.1-8.1S24.5,11.9,20,11.9z M20,25.2c-2.9,0-5.2-2.3-5.2-5.2 s2.3-5.2,5.2-5.2s5.2,2.3,5.2,5.2S22.9,25.2,20,25.2z" />
          <path d="M30.6,11.6c0,1-0.8,1.9-1.9,1.9c-1,0-1.9-0.8-1.9-1.9s0.8-1.9,1.9-1.9C29.8,9.7,30.6,10.5,30.6,11.6z" />
        </symbol>
        <symbol id="icon-90b" viewBox="0 0 40 40">
          <path d="M12.1,13.8v19.1H5.7V13.8C5.7,13.8,12.1,13.8,12.1,13.8z M12.5,7.9c0,0.9-0.3,1.7-1,2.4c-0.7,0.6-1.5,0.9-2.6,0.9h0 c-1.1,0-1.9-0.3-2.5-0.9c-0.6-0.6-1-1.4-1-2.4c0-1,0.3-1.7,1-2.4S7.9,4.6,9,4.6s1.9,0.3,2.6,0.9S12.5,6.9,12.5,7.9z M35,22v11h-6.4 V22.7c0-1.4-0.3-2.4-0.8-3.2c-0.5-0.8-1.3-1.1-2.4-1.1c-0.8,0-1.5,0.2-2,0.7c-0.5,0.4-1,1-1.2,1.7c-0.1,0.4-0.2,0.9-0.2,1.6v10.7 h-6.4c0-5.1,0-9.3,0-12.5s0-5.1,0-5.7l0-0.9H22v2.8h0c0.3-0.4,0.5-0.8,0.8-1.1c0.3-0.3,0.6-0.6,1.1-1c0.5-0.4,1-0.6,1.7-0.8 c0.7-0.2,1.4-0.3,2.2-0.3c2.2,0,4,0.7,5.3,2.2C34.4,17,35,19.1,35,22L35,22z" />
        </symbol>
        <symbol id="icon-b0b" viewBox="0 0 40 40">
          <path d="M38.2,25.9c-0.3,0.6-0.8,0.9-1.5,0.9c-2.2,0-4.4,0-6.7,0c-0.2,0-0.3,0-0.3,0.3c0,0.9,0,1.7,0,2.6 c0,1.4,0,2.9,0,4.3c0,0.7-0.3,1.1-0.9,1.4c0,0-0.1,0.1-0.1,0.1c-1.7,0-3.4,0-5.2,0c0,0-0.1-0.1-0.1-0.1c-0.6-0.3-0.9-0.7-0.9-1.4 c0-2.3,0-4.7,0-7c0-0.2,0.1-0.3,0.3-0.2c0.6,0,1.2,0,1.8,0c1.2,0,1.9-1.2,1.3-2.3c-1.9-3.4-3.8-6.9-5.7-10.4c-0.1-0.2-0.1-0.3,0-0.4 c1.4-2.7,2.9-5.4,4.3-8.1c0.2-0.5,0.5-0.9,1.1-1c0,0,0-0.1,0.1-0.1c0.3,0,0.6,0,0.9,0c0,0,0,0.1,0.1,0.1c0.5,0.2,0.8,0.5,1,0.9 c1.4,2.6,2.9,5.2,4.3,7.8c2.1,3.8,4.1,7.5,6.2,11.3C38.4,25,38.4,25.5,38.2,25.9z M13.9,24.6c-0.2,0.4-0.3,0.8-0.1,1.2 c0.3,0.7,0.8,1,1.5,1.1c0.6,0,1.1,0,1.7,0c0.2,0,0.3,0.1,0.3,0.3c0,0.6,0,1.3,0,1.9c0,1.7,0,3.3,0,5c0,0.7-0.3,1.2-0.9,1.5 c0,0-0.1,0.1-0.1,0.1c-1.6,0-3.2,0-4.9,0c0,0,0-0.1-0.1-0.1c-0.8-0.3-1-0.9-1-1.6c0-2.2,0-4.5,0-6.7c0-0.3-0.1-0.3-0.3-0.3 c-0.9,0-1.8,0-2.7,0c-1.4,0-2.8,0-4.1,0c-0.6,0-1-0.3-1.3-0.8c-0.1-0.1-0.1-0.2-0.2-0.3c0-0.3,0-0.5,0-0.8c0.1-0.1,0.1-0.2,0.2-0.3 C3.4,21.8,5,18.9,6.6,16c1.9-3.5,3.9-7,5.8-10.5c0.2-0.4,0.5-0.8,1-0.9c0,0,0.1-0.1,0.1-0.1c.3,0,.6,0,.9,0c0,0,0.1,0.1,0.1,0.1 c0.4,0.2,0.7,0.5,0.9,0.9c1.4,2.7,2.9,5.5,4.3,8.2c0.1,0.1,0.1,0.3,0,0.4C17.7,17.6,15.8,21.1,13.9,24.6z" />
        </symbol>
        <symbol id="icon-90d" viewBox="0 0 40 40">
          <path d="M24.3,27v4.2c0,0.9-0.3,1.3-0.8,1.3c-0.3,0-0.6-0.1-0.9-0.4v-6c0.3-0.3,0.6-0.4,0.9-0.4C24,25.6,24.3,26.1,24.3,27L24.3,27z M31.1,27v0.9h-1.8V27c0-0.9,0.3-1.4,0.9-1.4C30.8,25.6,31.1,26.1,31.1,27L31.1,27z M11.7,22.6h2.1v-1.9H7.6v1.9h2.1v11.4h2 L11.7,22.6L11.7,22.6z M17.5,34.1h1.8v-9.9h-1.8v7.6c-0.4,0.6-0.8,0.8-1.1,0.8c-0.2,0-0.4-0.1-0.4-0.4c0,0,0-0.3,0-0.7v-7.3h-1.8V32 c0,0.7,0.1,1.1,0.2,1.5c0.2,0.5,0.5,0.7,1.2,0.7c0.6,0,1.3-0.4,2-1.2L17.5,34.1L17.5,34.1z M26.1,31.1v-4c0-1-0.1-1.6-0.2-2 c-0.2-0.7-0.7-1.1-1.4-1.1c-0.7,0-1.3,0.4-1.9,1.1v-4.4h-1.8v13.3h1.8v-1c0.6,0.7,1.2,1.1,1.9,1.1c0.7,0,1.2-0.4,1.4-1.1 C26,32.7,26.1,32.1,26.1,31.1L26.1,31.1z M32.9,30.9v-0.3H31c0,0.7,0,1.1,0,1.2c-0.1,0.5-0.4,0.7-0.8,0.7c-0.6,0-0.9-0.5-0.9-1.4 v-1.7h3.6v-2.1c0-1.1-0.2-1.8-0.5-2.3c-0.5-0.7-1.2-1-2.1-1c-0.9,0-1.6,0.3-2.1,1c-0.4,0.5-0.6,1.3-0.6,2.3v3.5 c0,1.1,0.2,1.8,0.6,2.3c0.5,0.7,1.2,1,2.2,1c1,0,1.7-0.4,2.2-1.1c0.2-0.4,0.4-0.7,0.4-1.1C32.9,31.9,32.9,31.5,32.9,30.9L32.9,30.9z M20.7,12.5V8.3c0-0.9-0.3-1.4-0.9-1.4c-0.6,0-0.9,0.5-0.9,1.4v4.2c0,0.9,0.3,1.4,0.9,1.4C20.4,14,20.7,13.5,20.7,12.5z M35.1,27.6 c0,3.1-0.2,5.5-0.5,7c-0.2,0.8-0.6,1.5-1.2,2c-0.6,0.5-1.3,0.8-2,0.9c-2.5,0.3-6.2,0.4-11.1,0.4s-8.7-0.1-11.1-0.4 c-0.8-0.1-1.5-0.4-2.1-0.9c-0.6-0.5-1-1.2-1.2-2c-0.3-1.5-0.5-3.8-0.5-7c0-3.1,0.2-5.5,0.5-7c0.2-0.8,0.6-1.5,1.2-2 c0.6-0.5,1.3-0.9,2.1-0.9c2.5-0.3,6.2-0.4,11.1-0.4s8.7,0.1,11.1,0.4c0.8,0.1,1.5,0.4,2.1,0.9c0.6,0.5,1,1.2,1.2,2 C34.9,22.1,35.1,24.4,35.1,27.6z M15.1,2h2l-2.4,8v5.4h-2V10c-0.2-1-0.6-2.4-1.2-4.3c-0.5-1.4-0.9-2.6-1.3-3.8h2.1l1.4,5.3L15.1,2z M22.5,8.7v3.5c0,1.1-0.2,1.9-0.6,2.4c-0.5,0.7-1.2,1-2.1,1c-0.9,0-1.6-0.3-2.1-1c-0.4-0.5-0.6-1.3-0.6-2.4V8.7 c0-1.1,0.2-1.9,0.6-2.3c0.5-0.7,1.2-1,2.1-1c0.9,0,1.6,0.3,2.1,1C22.3,6.8,22.5,7.6,22.5,8.7z M29.2,5.4v10h-1.8v-1.1 c-0.7,0.8-1.4,1.2-2.1,1.2c-0.6,0-1-0.2-1.2-0.7C24,14.5,24,14,24,13.4V5.4h1.8v7.4c0,0.4,0,0.7,0,0.7c0,0.3,0.2,0.4,0.4,0.4 c0.4,0,0.7-0.3,1.1-0.9V5.4C27.4,5.4,29.2,5.4,29.2,5.4z" />
        </symbol>
      </svg>

      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        adminUser={adminUser}
        isDonationOpen={Boolean(backendState?.donationConfig?.isOpen)}
      />

      <main>
        <Hero
          onOpenLightbox={setLightboxPhoto}
          onSelectDivision={setSelectedDivId}
        />
        <AboutSection onOpenLightbox={setLightboxPhoto} />
        <DivisionsSection
          selectedDivId={selectedDivId}
          onSelectDivision={setSelectedDivId}
          onOpenLightbox={setLightboxPhoto}
        />
        <EventsSection
          backendState={backendState}
          onOpenLightbox={setLightboxPhoto}
          onSelectPhoto={setLightboxPhoto}
          onOpenAdmin={() => setAdminOpen(true)}
          isAdminLoggedIn={Boolean(adminUser)}
          onStateChange={setBackendState}
        />
        <DocumentationSection
          selectedAlbumId={selectedAlbumId}
          onSelectAlbum={setSelectedAlbumId}
          onOpenLightbox={setLightboxPhoto}
          customPhotos={backendState?.customPhotos || []}
        />
        <FaqSection />
        <ContactFooter />
      </main>

      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelectDivision={setSelectedDivId}
        onSelectAlbum={setSelectedAlbumId}
        onOpenAdmin={() => setAdminOpen(true)}
        isDonationOpen={Boolean(backendState?.donationConfig?.isOpen)}
      />

      <AdminPortalModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        adminUser={adminUser}
        onAdminAuthChange={setAdminUser}
        backendState={backendState}
        backendStatus={backendStatus}
        onStateChange={setBackendState}
        onBackendStatusChange={setBackendStatus}
      />

      <LightboxModal
        photo={lightboxPhoto}
        allPhotos={LIGHTBOX_ITEMS}
        onClose={() => setLightboxPhoto(null)}
        onSelectPhoto={setLightboxPhoto}
      />
    </div>
  );
}
