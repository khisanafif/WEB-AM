import React, { useState, useMemo, useEffect } from 'react';
import {
  Camera,
  LayoutGrid,
  FolderKanban,
  Film,
  Search,
  ZoomIn,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import {
  DOCUMENTATION_ALBUMS,
  ALL_GALLERY_PHOTOS,
} from '../data/ambuluData';

export default function DocumentationSection({
  selectedAlbumId,
  onSelectAlbum,
  onOpenLightbox,
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    selectedAlbumId || 'all'
  );
  const [viewMode, setViewMode] = useState('cinema'); // 'cinema', 'albums', 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [cinemaIdx, setCinemaIdx] = useState(0);
  const [autoPlayCinema, setAutoPlayCinema] = useState(false);

  useEffect(() => {
    if (selectedAlbumId) {
      setSelectedCategory(selectedAlbumId);
      setViewMode('albums');
    }
  }, [selectedAlbumId]);

  const filteredAlbums = useMemo(() => {
    return DOCUMENTATION_ALBUMS.filter((album) => {
      const matchesCat =
        selectedCategory === 'all' || album.id === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        album.exactTitle.toLowerCase().includes(q) ||
        album.summary.toLowerCase().includes(q) ||
        album.year.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const filteredPhotos = useMemo(() => {
    return ALL_GALLERY_PHOTOS.filter((photo) => {
      const matchesCat =
        selectedCategory === 'all' || photo.albumId === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        photo.albumTitle.toLowerCase().includes(q) ||
        photo.caption.toLowerCase().includes(q) ||
        photo.year.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setCinemaIdx(0);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!autoPlayCinema || filteredPhotos.length <= 1) return;
    const t = setInterval(() => {
      setCinemaIdx((prev) => (prev + 1) % filteredPhotos.length);
    }, 3500);
    return () => clearInterval(t);
  }, [autoPlayCinema, filteredPhotos.length]);

  const activeCinemaPhoto =
    filteredPhotos[cinemaIdx] ||
    filteredPhotos[0] ||
    ALL_GALLERY_PHOTOS[0];

  const carrdTitleIds = {
    gallery05: 'text06',
    gallery01: 'text17',
    gallery02: 'text13',
    gallery03: 'text14',
    gallery04: 'text15',
  };

  const handleCatClick = (id) => {
    setSelectedCategory(id);
    if (onSelectAlbum) onSelectAlbum(id);
  };

  return (
    <section className="am-section" id="dokumentasiambulumengajar">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">
            <Film size={13} /> Interactive Cinema & Portfolio
          </span>
          <h2 id="text08" className="am-section-title">
            CINEMA & <span>DOKUMENTASI</span> RESMI
          </h2>
          <p className="am-section-desc">
            Nikmati 13 dokumentasi resmi dari 5 kegiatan utama{' '}
            <strong>Ambulu Mengajar</strong> dalam 3 mode tampilan interaktif:{' '}
            <em>Mode Cinema Spotlight</em>, <em>Mode 5 Album Carrd</em>, dan{' '}
            <em>Mode Bento Masonry</em>.
          </p>
        </div>

        {/* Interactive Toolbar */}
        <div className="am-doc-controls-wrapper">
          <div
            className="am-doc-filter-pills"
            role="tablist"
            aria-label="Filter Album Dokumentasi"
          >
            <button
              type="button"
              className={`am-filter-pill ${
                selectedCategory === 'all' ? 'is-active' : ''
              }`}
              onClick={() => handleCatClick('all')}
            >
              Semua ({ALL_GALLERY_PHOTOS.length})
            </button>
            {DOCUMENTATION_ALBUMS.map((alb) => (
              <button
                key={alb.id}
                type="button"
                className={`am-filter-pill ${
                  selectedCategory === alb.id ? 'is-active' : ''
                }`}
                onClick={() => handleCatClick(alb.id)}
              >
                {alb.exactTitle} ({alb.photos.length})
              </button>
            ))}
          </div>

          <div className="am-doc-Subcontrols">
            <div className="am-search-box">
              <Search size={16} className="am-search-icon" />
              <input
                type="text"
                placeholder="Cari kegiatan (Goes To School, Pembidik Misi, Immamul Mutaqien, As Sofyan, 2022)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="am-search-input"
              />
            </div>

            <div className="am-view-switcher">
              <button
                type="button"
                className={`am-view-btn ${
                  viewMode === 'cinema' ? 'is-active' : ''
                }`}
                onClick={() => setViewMode('cinema')}
              >
                <Film size={15} /> Mode Cinema
              </button>
              <button
                type="button"
                className={`am-view-btn ${
                  viewMode === 'albums' ? 'is-active' : ''
                }`}
                onClick={() => setViewMode('albums')}
              >
                <FolderKanban size={15} /> 5 Album Carrd
              </button>
              <button
                type="button"
                className={`am-view-btn ${
                  viewMode === 'grid' ? 'is-active' : ''
                }`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={15} /> Bento Grid
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================
            MODE 1: INTERACTIVE CINEMA SPOTLIGHT STAGE + FILMSTRIP
            ================================================================== */}
        {viewMode === 'cinema' && filteredPhotos.length > 0 && (
          <div className="am-bento-tile am-cinema-stage-card">
            <div className="am-cinema-main-row">
              <div
                className="am-cinema-viewport"
                onClick={() => onOpenLightbox(activeCinemaPhoto)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && onOpenLightbox(activeCinemaPhoto)
                }
              >
                <img
                  src={activeCinemaPhoto.src}
                  alt={activeCinemaPhoto.caption}
                  className="am-cinema-main-img"
                />
                <div className="am-cinema-floating-top">
                  <span className="am-cinema-counter">
                    Slide {cinemaIdx + 1} dari {filteredPhotos.length}
                  </span>
                  <span className="am-cinema-zoom-hint">
                    <ZoomIn size={14} /> Layar Penuh
                  </span>
                </div>
              </div>

              <div className="am-cinema-info-sidebar">
                <div>
                  <div className="am-album-badges">
                    <span className="am-album-year">
                      <Calendar size={12} /> {activeCinemaPhoto.year}
                    </span>
                    <span className="am-album-div">
                      {activeCinemaPhoto.division}
                    </span>
                  </div>

                  <h3 className="am-cinema-title">
                    {activeCinemaPhoto.albumTitle}
                  </h3>
                  <p className="am-cinema-caption">
                    {activeCinemaPhoto.caption}
                  </p>
                  <span className="am-cinema-cat-tag">
                    Kategori: {activeCinemaPhoto.categoryBadge}
                  </span>
                </div>

                <div className="am-cinema-controls-bar">
                  <button
                    type="button"
                    className="am-cinema-nav-btn"
                    onClick={() =>
                      setCinemaIdx(
                        (prev) =>
                          (prev - 1 + filteredPhotos.length) %
                          filteredPhotos.length
                      )
                    }
                  >
                    <ChevronLeft size={18} /> Sebelumnya
                  </button>

                  <button
                    type="button"
                    className={`am-cinema-play-toggle ${
                      autoPlayCinema ? 'is-playing' : ''
                    }`}
                    onClick={() => setAutoPlayCinema((p) => !p)}
                  >
                    {autoPlayCinema ? (
                      <>
                        <Pause size={15} /> Jeda
                      </>
                    ) : (
                      <>
                        <Play size={15} /> Auto-Play
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="am-cinema-nav-btn"
                    onClick={() =>
                      setCinemaIdx((prev) => (prev + 1) % filteredPhotos.length)
                    }
                  >
                    Selanjutnya <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Filmstrip Thumbnails */}
            <div className="am-cinema-filmstrip">
              {filteredPhotos.map((ph, idx) => (
                <button
                  key={ph.id}
                  type="button"
                  className={`am-filmstrip-thumb ${
                    idx === cinemaIdx ? 'is-active' : ''
                  }`}
                  onClick={() => setCinemaIdx(idx)}
                >
                  <img src={ph.src} alt={ph.caption} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            MODE 2: 5 ALBUM RESMI SESUAI CARRD (#gallery05, #gallery01, etc.)
            ================================================================== */}
        {viewMode === 'albums' && (
          <div className="am-albums-stack">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                id={album.id}
                className="am-bento-tile am-album-card"
              >
                <div className="am-album-header">
                  <div>
                    <div className="am-album-badges">
                      <span className="am-album-year">
                        <Calendar size={12} /> {album.year}
                      </span>
                      <span className="am-album-div">{album.division}</span>
                      <span className="am-album-cat">
                        {album.categoryBadge}
                      </span>
                    </div>
                    <h3
                      id={carrdTitleIds[album.id]}
                      className="am-album-title"
                    >
                      {album.exactTitle}
                    </h3>
                    <p className="am-album-summary">{album.summary}</p>
                  </div>
                  <div className="am-album-count">
                    <Camera size={16} /> {album.photos.length} Dokumentasi
                  </div>
                </div>

                <div className="am-album-photos-grid">
                  {album.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="am-photo-card"
                      onClick={() =>
                        onOpenLightbox({
                          ...photo,
                          albumTitle: album.exactTitle,
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        onOpenLightbox({
                          ...photo,
                          albumTitle: album.exactTitle,
                        })
                      }
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        loading="lazy"
                      />
                      <div className="am-photo-overlay">
                        <span className="am-photo-tag">
                          {album.exactTitle}
                        </span>
                        <p className="am-photo-caption">{photo.caption}</p>
                        <span className="am-photo-zoom">
                          <ZoomIn size={14} /> Perbesar Foto
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================================
            MODE 3: BENTO MASONRY PHOTO GRID
            ================================================================== */}
        {viewMode === 'grid' && (
          <div className="am-bento-masonry-grid">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`am-photo-card ${
                  idx % 5 === 0 ? 'am-photo-wide' : ''
                }`}
                onClick={() => onOpenLightbox(photo)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenLightbox(photo)}
              >
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <div className="am-photo-overlay">
                  <span className="am-photo-tag">{photo.albumTitle}</span>
                  <p className="am-photo-caption">{photo.caption}</p>
                  <span className="am-photo-zoom">
                    <ZoomIn size={14} /> Perbesar Foto
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
