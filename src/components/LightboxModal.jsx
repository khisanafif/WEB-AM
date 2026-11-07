import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({
  photo,
  allPhotos,
  onClose,
  onSelectPhoto,
}) {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (!allPhotos || allPhotos.length === 0) return;

      const currentIdx = allPhotos.findIndex((p) => p.src === photo.src);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIdx - 1 + allPhotos.length) % allPhotos.length;
        onSelectPhoto(allPhotos[prevIdx]);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (currentIdx + 1) % allPhotos.length;
        onSelectPhoto(allPhotos[nextIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [photo, allPhotos, onClose, onSelectPhoto]);

  if (!photo) return null;

  const currentIdx = allPhotos.findIndex((p) => p.src === photo.src);
  const canNavigate = currentIdx !== -1 && allPhotos.length > 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!canNavigate) return;
    const prevIdx = (currentIdx - 1 + allPhotos.length) % allPhotos.length;
    onSelectPhoto(allPhotos[prevIdx]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!canNavigate) return;
    const nextIdx = (currentIdx + 1) % allPhotos.length;
    onSelectPhoto(allPhotos[nextIdx]);
  };

  return (
    <div
      className="am-lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau Gambar Dokumentasi"
    >
      <div
        className="am-lightbox-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="am-lightbox-close"
          onClick={onClose}
          aria-label="Tutup Pratinjau"
        >
          <X size={20} />
        </button>

        <div className="am-lightbox-stage">
          {canNavigate && (
            <button
              type="button"
              className="am-lightbox-nav am-lightbox-prev"
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <img
            src={photo.src}
            alt={photo.caption || photo.albumTitle}
            className="am-lightbox-img"
          />

          {canNavigate && (
            <button
              type="button"
              className="am-lightbox-nav am-lightbox-next"
              onClick={handleNext}
              aria-label="Foto selanjutnya"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        <div className="am-lightbox-meta">
          <span className="am-lightbox-badge">
            {photo.albumTitle || 'Ambulu Mengajar'}{' '}
            {canNavigate ? `• ${currentIdx + 1} / ${allPhotos.length}` : ''}
          </span>
          <p className="am-lightbox-caption">{photo.caption}</p>
        </div>
      </div>
    </div>
  );
}

