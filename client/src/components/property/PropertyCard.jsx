import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from '../ui/Badge';
import { formatPrice, formatArea } from '../../lib/format';
import { pickLang } from '../../lib/localized';

export default function PropertyCard({ property }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const title = pickLang(property.title, lang);
  const cover = property.photos?.[0];

  return (
    <article className="group bg-white rounded-card shadow-card overflow-hidden border border-line/60">
      <Link to={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
          {cover ? (
            <img
              src={cover.url}
              alt={title}
              width={cover.width || 640}
              height={cover.height || 480}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-soft">
              {t('property.noPhoto')}
            </div>
          )}
          <div className="absolute top-2.5 start-2.5 flex gap-1.5">
            {property.status !== 'available' && (
              <Badge variant={property.status}>{t(`status.${property.status}`)}</Badge>
            )}
            {property.isFeatured && property.status === 'available' && (
              <Badge variant="featured">{t('property.featured')}</Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xl font-bold text-green leading-none tracking-tight">
            {formatPrice(property.priceOnCall ? null : property.price, { t })}
            {property.purpose === 'rent' && !property.priceOnCall && (
              <span className="font-sans text-sm text-ink-soft"> {t('price.perMonth')}</span>
            )}
          </p>
          <h3 className="mt-1.5 font-sans text-[15px] font-medium leading-snug line-clamp-1">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            {property.area}, {property.city}
          </p>

          <ul className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap border-t border-line pt-2.5 text-sm text-ink-soft">
            <li className="font-medium text-ink">
              <span className="sr-only">{t('property.size')}: </span>
              {formatArea(property.areaSqFt, { t })}
            </li>
            {property.bedrooms != null && (
              <li>
                <span className="font-medium text-ink">{property.bedrooms}</span>{' '}
                {t('units.beds')}
              </li>
            )}
            {property.bathrooms != null && (
              <li>
                <span className="font-medium text-ink">{property.bathrooms}</span>{' '}
                {t('units.baths')}
              </li>
            )}
            <li className="ms-auto">
              <Badge>
                {t(`purpose.${property.purpose}`)} · {t(`propertyType.${property.type}`)}
              </Badge>
            </li>
          </ul>
        </div>
      </Link>
    </article>
  );
}
