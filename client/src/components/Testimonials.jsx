import { useTranslation } from 'react-i18next';
import useApi from '../hooks/useApi';
import { pickLang } from '../lib/localized';

// Renders nothing unless real, permission-granted testimonials exist.
// Deliberately labelled "Client testimonial" — never styled as Google reviews.
export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { data } = useApi('/testimonials');

  if (!data?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 mt-14">
      <h2 className="text-2xl text-green">{t('testimonials.title')}</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <figure
            key={item._id}
            className="rounded-card border border-line bg-white p-5 shadow-card"
          >
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              {t('testimonials.label')}
            </p>
            <blockquote className="mt-2 text-[15px] leading-relaxed">
              {pickLang(item.text, lang)}
            </blockquote>
            <figcaption className="mt-3 text-sm font-medium">{item.authorName}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
