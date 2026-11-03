import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import useApi from '../../hooks/useApi';
import Gallery from '../../components/property/Gallery';
import InquiryForm from '../../components/InquiryForm';
import PropertyCard from '../../components/property/PropertyCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import NotFound from './NotFound';
import site from '../../config/site';
import { formatPrice, formatArea } from '../../lib/format';
import { pickLang } from '../../lib/localized';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon, PhoneIcon } from '../../components/ui/icons';

function Fact({ label, value }) {
  return (
    <div className="border-b border-line py-2.5 flex justify-between gap-4 text-[15px]">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-end">{value}</dd>
    </div>
  );
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const [copied, setCopied] = useState(false);

  const { data: property, loading, error } = useApi(`/properties/${slug}`);
  const { data: related } = useApi(`/properties/${slug}/related`);

  if (loading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-ink-soft">{t('common.loading')}</p>;
  }
  if (error?.status === 404) return <NotFound />;
  if (error) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-ink-soft">{t('common.loadFailed')}</p>;
  }

  const title = pickLang(property.title, lang);
  const description = pickLang(property.description, lang);
  const pageUrl = `${window.location.origin}/properties/${property.slug}`;
  const waMessage = t('detail.waMessage', { title, url: pageUrl });

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: pageUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasCoords = property.location?.lat != null && property.location?.lng != null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{`${title} · ${site.businessName}`}</title>
      </Helmet>

      <Gallery photos={property.photos || []} title={title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              {t(`purpose.${property.purpose}`)} · {t(`propertyType.${property.type}`)}
            </Badge>
            {property.status !== 'available' && (
              <Badge variant={property.status}>{t(`status.${property.status}`)}</Badge>
            )}
          </div>
          <h1 className="mt-3 text-3xl leading-snug">{title}</h1>
          <p className="mt-1 text-ink-soft">
            {property.area}, {property.city}
          </p>

          {description && (
            <section className="mt-6 max-w-prose whitespace-pre-line text-[15px] leading-relaxed">
              {description}
            </section>
          )}

          {property.features?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl text-green">{t('detail.features')}</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 max-w-lg text-[15px]">
                {property.features.map((feature) => (
                  <li key={feature} className="border-s-2 border-green/40 ps-3">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasCoords && (
            <section className="mt-8">
              <h2 className="text-xl text-green">{t('detail.location')}</h2>
              <iframe
                title={t('detail.location')}
                src={`https://maps.google.com/maps?q=${property.location.lat},${property.location.lng}&z=15&output=embed`}
                className="mt-3 h-72 w-full rounded-card border border-line"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </section>
          )}
        </div>

        <aside className="lg:border-s lg:border-line lg:ps-8 h-fit">
          <p className="text-3xl font-bold text-green tracking-tight">
            {formatPrice(property.priceOnCall ? null : property.price, { t })}
            {property.purpose === 'rent' && !property.priceOnCall && (
              <span className="font-sans text-base text-ink-soft"> {t('price.perMonth')}</span>
            )}
          </p>

          <dl className="mt-4">
            <Fact label={t('property.size')} value={formatArea(property.areaSqFt, { t })} />
            {property.bedrooms != null && (
              <Fact label={t('units.beds')} value={property.bedrooms} />
            )}
            {property.bathrooms != null && (
              <Fact label={t('units.baths')} value={property.bathrooms} />
            )}
            <Fact label={t('filters.area')} value={property.area} />
            <Fact label={t('detail.status')} value={t(`status.${property.status}`)} />
          </dl>

          <div className="mt-5 grid gap-2.5">
            <Button as="a" variant="whatsapp" href={whatsappLink(waMessage)} target="_blank" rel="noopener">
              <WhatsAppIcon />
              {t('actions.whatsapp')}
            </Button>
            <Button as="a" href={`tel:${site.phone}`}>
              <PhoneIcon />
              <span dir="ltr">{site.phone}</span>
            </Button>
            <Button variant="ghost" onClick={share}>
              {copied ? t('detail.linkCopied') : t('actions.share')}
            </Button>
          </div>

          <p className="mt-5 text-xs text-ink-soft">{t('disclaimer.listing')}</p>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="text-lg text-green">{t('inquiry.title')}</h2>
            <div className="mt-3">
              <InquiryForm propertyId={property._id} />
            </div>
          </div>
        </aside>
      </div>

      {related?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl text-green">{t('detail.related')}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PropertyCard key={item.slug} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
