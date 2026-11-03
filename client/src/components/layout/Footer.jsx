import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import site from '../../config/site';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  return (
    <footer className="mt-16 bg-green text-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">{site.businessName}</p>
          <p className="mt-1 text-sm text-paper/80">
            {site.agentName} · {site.city}
          </p>
          <p className="mt-3 text-sm text-paper/80">{site.officeAddress}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium mb-2">{t('nav.contact')}</p>
          <p>
            <a href={`tel:${site.phone}`} className="hover:underline">
              {site.phone}
            </a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${site.email}`} className="hover:underline">
              {site.email}
            </a>
          </p>
          <p className="mt-3 text-paper/80">{site.officeHours[lang] || site.officeHours.en}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium mb-2">{t('footer.browse')}</p>
          <ul className="space-y-1">
            <li>
              <Link to="/properties?purpose=buy" className="hover:underline">
                {t('purpose.buy')}
              </Link>
            </li>
            <li>
              <Link to="/properties?purpose=rent" className="hover:underline">
                {t('purpose.rent')}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-paper/70 hover:underline">
                {t('footer.privacy')}
              </Link>
              {' · '}
              <Link to="/terms" className="text-paper/70 hover:underline">
                {t('footer.terms')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
