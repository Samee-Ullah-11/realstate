import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import InquiryForm from '../../components/InquiryForm';
import Button from '../../components/ui/Button';
import site from '../../config/site';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon, PhoneIcon } from '../../components/ui/icons';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{`${t('nav.contact')} · ${site.businessName}`}</title>
      </Helmet>

      <h1 className="text-3xl">{t('contact.title')}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <dl className="space-y-4 text-[15px]">
            <div>
              <dt className="text-sm text-ink-soft">{t('contact.phone')}</dt>
              <dd className="mt-0.5 font-medium" dir="ltr">
                <a href={`tel:${site.phone}`} className="hover:underline">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">{t('contact.email')}</dt>
              <dd className="mt-0.5 font-medium" dir="ltr">
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">{t('contact.hours')}</dt>
              <dd className="mt-0.5">{site.officeHours[lang] || site.officeHours.en}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">{t('contact.address')}</dt>
              <dd className="mt-0.5">{site.officeAddress}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button as="a" variant="whatsapp" href={whatsappLink(t('home.waGeneric'))} target="_blank" rel="noopener">
              <WhatsAppIcon />
              {t('actions.whatsapp')}
            </Button>
            <Button as="a" href={`tel:${site.phone}`}>
              <PhoneIcon />
              <span dir="ltr">{site.phone}</span>
            </Button>
          </div>

          <iframe
            title={t('contact.mapTitle')}
            src={site.googleMapsEmbedSrc}
            className="mt-8 h-72 w-full rounded-card border border-line"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div>
          <h2 className="text-xl text-green">{t('inquiry.title')}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t('contact.formHint')}</p>
          <div className="mt-4">
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
