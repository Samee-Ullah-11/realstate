import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <Helmet>
        <title>{t('notFound.title')}</title>
      </Helmet>
      <p className="text-6xl font-bold text-green tracking-tight">404</p>
      <h1 className="mt-3 text-2xl">{t('notFound.title')}</h1>
      <p className="mt-2 text-ink-soft">{t('notFound.body')}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button as={Link} to="/" variant="secondary">
          {t('nav.home')}
        </Button>
        <Button as={Link} to="/properties" variant="ghost">
          {t('nav.properties')}
        </Button>
      </div>
    </div>
  );
}
