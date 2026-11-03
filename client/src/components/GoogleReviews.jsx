import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '../hooks/useApi';

function Stars({ rating, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5 text-[#F4B400]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={`${className} ${i <= Math.round(rating) ? 'fill-current' : 'fill-line'}`}>
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 220;

  return (
    <figure className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <figcaption className="text-sm font-semibold">{review.author}</figcaption>
        <span className="text-xs text-ink-soft">{review.date}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <Stars rating={review.rating} />
        <span className="sr-only">{review.rating}/5</span>
      </div>
      {review.text && (
        <blockquote className={`mt-2.5 text-[15px] leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
          {review.text}
        </blockquote>
      )}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-sm font-medium text-accent hover:underline"
        >
          {expanded ? t('actions.readLess') : t('actions.readMore')}
        </button>
      )}
    </figure>
  );
}

// Renders nothing when reviews are unavailable: no placeholders, no empty box.
export default function GoogleReviews() {
  const { t, i18n } = useTranslation();
  const { data } = useApi('/reviews/google', { lang: i18n.resolvedLanguage });

  if (!data?.available) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 mt-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl text-green">{t('reviews.title')}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
            <span className="text-lg font-bold text-ink">{data.rating}</span>
            <Stars rating={data.rating} />
            {t('reviews.count', { count: data.total })} · {t('reviews.onGoogle')}
          </p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <a
            href={data.googleMapsUri}
            target="_blank"
            rel="noopener"
            className="text-accent hover:underline"
          >
            {t('reviews.seeAll')}
          </a>
          <a
            href={data.writeReviewUrl}
            target="_blank"
            rel="noopener"
            className="text-accent hover:underline"
          >
            {t('reviews.write')}
          </a>
        </div>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.reviews.map((review, i) => (
          <ReviewCard key={`${review.author}-${i}`} review={review} />
        ))}
      </div>
    </section>
  );
}
