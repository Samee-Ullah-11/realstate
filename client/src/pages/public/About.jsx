import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Testimonials from '../../components/Testimonials';
import GoogleReviews from '../../components/GoogleReviews';
import Button from '../../components/ui/Button';
import site from '../../config/site';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../../components/ui/icons';

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { data: agent, loading } = useApi('/agent');

  return (
    <div className="py-8">
      <Helmet>
        <title>{`${t('nav.about')} · ${site.businessName}`}</title>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl">{t('about.title')}</h1>

        {loading && <p className="mt-8 text-ink-soft">{t('common.loading')}</p>}

        {agent && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            {agent.photoUrl ? (
              <img
                src={agent.photoUrl}
                alt={agent.name}
                width="280"
                height="340"
                className="w-full max-w-[280px] rounded-card object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full max-w-[280px] items-center justify-center rounded-card border border-line bg-paper-2 text-sm text-ink-soft">
                [AGENT PHOTO]
              </div>
            )}

            <div>
              <h2 className="text-2xl text-green">{agent.name}</h2>
              <p className="text-ink-soft">{site.businessName}</p>

              <p className="mt-4 max-w-prose text-[15px] leading-relaxed whitespace-pre-line">
                {(agent.bio && (agent.bio[lang] || agent.bio.en)) || ''}
              </p>

              <dl className="mt-6 max-w-md space-y-3 text-[15px]">
                <div>
                  <dt className="text-sm text-ink-soft">{t('home.serves')}</dt>
                  <dd className="mt-0.5 font-medium">
                    {agent.areasServed?.join(', ') || site.city}
                  </dd>
                </div>
                {agent.licenseInfo && (
                  <div>
                    <dt className="text-sm text-ink-soft">{t('about.license')}</dt>
                    <dd className="mt-0.5 font-medium">{agent.licenseInfo}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button as="a" variant="whatsapp" href={whatsappLink(t('home.waGeneric'))} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  {t('actions.whatsapp')}
                </Button>
                <Button as={Link} to="/properties" variant="secondary">
                  {t('about.browseProperties')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <GoogleReviews />
      <Testimonials />
    </div>
  );
}
