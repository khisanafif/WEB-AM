import React, { useState, useMemo } from 'react';
import {
  Camera,
  LayoutGrid,
  FolderKanban,
  Search,
  ZoomIn,
  Calendar,
} from 'lucide-react';
import {
  DOCUMENTATION_ALBUMS,
  ALL_GALLERY_PHOTOS,
} from '../data/ambuluData';

export default function DocumentationSection({ onOpenLightbox }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('albums'); // 'albums' (Sesuai Carrd) or 'grid'
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered albums for 'albums' view
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

  // Filtered flat photos for 'grid' view
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

  // Map original Carrd text IDs for each album title
  const carrdTitleIds = {
    gallery05: 'text06',
    gallery01: 'text17',
    gallery02: 'text13',
    gallery03: 'text14',
    gallery04: 'text15',
  };

  return (
    <section className="am-section" id="dokumentasiambulumengajar">
      <div className="am-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">Portofolio & Galeri Aksi</span>
          <h2 id="text08" className="am-section-title">
            <span>DOKUMENTASI</span> KEGIATAN
          </h2>
          <p className="am-section-desc">
            Rekam jejak visual pelaksanaan program beasiswa, sosialisasi sekolah,
            dan bakti sosial <strong>Ambulu Mengajar</strong> (2021–2022). Klik
            pada foto mana pun untuk melihat tampilan layar penuh.
          </p>
          <hr className="am-carrd-divider" />
        </div>

        {/* Controls Bar: Filter Pills + Search + View Switcher */}
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
              onClick={() => setSelectedCategory('all')}
            >
              Semua Kegiatan ({ALL_GALLERY_PHOTOS.length} Foto)
            </button>
            {DOCUMENTATION_ALBUMS.map((alb) => (
              <button
                key={alb.id}
                type="button"
                className={`am-filter-pill ${
                  selectedCategory === alb.id ? 'is-active' : ''
                }`}
                onClick={() => setSelectedCategory(alb.id)}
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
                placeholder="Cari dokumentasi (misal: Goes To School, Baksos, 2022)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="am-search-input"
              />
            </div>

            <div className="am-view-switcher">
              <button
                type="button"
                className={`am-view-btn ${
                  viewMode === 'albums' ? 'is-active' : ''
                }`}
                onClick={() => setViewMode('albums')}
                title="Tampilan per Album Kegiatan (Sesuai Carrd)"
              >
                <FolderKanban size={16} /> Per Kegiatan
              </button>
              <button
                type="button"
                className={`am-view-btn ${
                  viewMode === 'grid' ? 'is-active' : ''
                }`}
                onClick={() => setViewMode('grid')}
                title="Tampilan Grid Galeri Penuh"
              >
                <LayoutGrid size={16} /> Grid Semua
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: GROUPED BY ALBUM (Matching Carrd #gallery05, #gallery01, #gallery02, #gallery03, #gallery04) */}
        {viewMode === 'albums' ? (
          <div className="am-albums-stack">
            {filteredAlbums.map((album) => (
              <div key={album.id} id={album.id} className="am-card am-album-card">
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
                    <Camera size={16} /> {album.photos.length} Foto
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
        ) : (
          /* VIEW 2: UNIFIED PHOTO GRID */
          <div className="am-unified-photo-grid">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="am-photo-card"
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

