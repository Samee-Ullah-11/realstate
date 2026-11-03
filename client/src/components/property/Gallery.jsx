import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Photo grid with a keyboard-accessible lightbox.
export default function Gallery({ photos, title }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta) =>
      setOpenIndex((current) =>
        current == null ? null : (current + delta + photos.length) % photos.length
      ),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, step]);

  if (!photos.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-card bg-paper-2 text-ink-soft">
        {t('property.noPhoto')}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className={`relative overflow-hidden rounded-card ${
            photos.length > 1 ? 'col-span-4 sm:col-span-3' : 'col-span-4'
          }`}
          aria-label={t('gallery.open')}
        >
          <img
            src={photos[0].url}
            alt={title}
            width={photos[0].width || 1200}
            height={photos[0].height || 750}
            className="aspect-[16/10] w-full object-cover"
          />
        </button>
        {photos.length > 1 && (
          <div className="col-span-4 sm:col-span-1 grid grid-cols-4 sm:grid-cols-1 gap-2">
            {photos.slice(1, 4).map((photo, i) => (
              <button
                key={photo.publicId || photo.url}
                type="button"
                onClick={() => setOpenIndex(i + 1)}
                className="overflow-hidden rounded-card"
                aria-label={t('gallery.open')}
              >
                <img
                  src={photo.url}
                  alt=""
                  width={photo.width || 300}
                  height={photo.height || 200}
                  loading="lazy"
                  className="aspect-[4/3] sm:aspect-auto sm:h-full w-full object-cover"
                />
              </button>
            ))}
            {photos.length > 4 && (
              <button
                type="button"
                onClick={() => setOpenIndex(4)}
                className="flex items-center justify-center rounded-card bg-paper-2 text-sm font-medium"
              >
                +{photos.length - 4}
              </button>
            )}
          </div>
        )}
      </div>

      {openIndex != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <img
            src={photos[openIndex].url}
            alt={`${title} — ${openIndex + 1}/${photos.length}`}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={close}
            aria-label={t('gallery.close')}
            className="absolute top-4 end-4 rounded-card bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
          >
            ✕
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => (e.stopPropagation(), step(-1))}
                aria-label={t('gallery.prev')}
                className="absolute start-4 top-1/2 -translate-y-1/2 rounded-card bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => (e.stopPropagation(), step(1))}
                aria-label={t('gallery.next')}
                className="absolute end-4 top-1/2 -translate-y-1/2 rounded-card bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              >
                ›
              </button>
              <p className="absolute bottom-4 text-sm text-white/80">
                {openIndex + 1} / {photos.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
