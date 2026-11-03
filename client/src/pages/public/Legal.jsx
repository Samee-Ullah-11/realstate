import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import site from '../../config/site';

// Draft legal text. English-only drafts are acceptable here; the visible
// banner marks them as unreviewed until a lawyer signs off.

const PRIVACY_SECTIONS = [
  {
    heading: 'What we collect',
    body: `When you send an inquiry, we collect the name, phone number, and optional email and message you type in. The server also keeps standard technical logs (IP address, time, requested page) for security and troubleshooting.`,
  },
  {
    heading: 'How we use it',
    body: `Inquiry details are used only to respond to you about the property or question you asked about. We do not sell or share your details with third parties for marketing.`,
  },
  {
    heading: 'Third-party services',
    body: `Property photos are served from Cloudinary. Maps are embedded from Google Maps, and the reviews section loads data from Google; those services may set their own cookies when their content loads. WhatsApp links open WhatsApp with a message you can edit before sending.`,
  },
  {
    heading: 'Data retention and contact',
    body: `Inquiries are kept while they are being handled and for reasonable business records afterwards. To ask about or request deletion of your details, contact us using the details on the Contact page.`,
  },
];

const TERMS_SECTIONS = [
  {
    heading: 'Listing information',
    body: `Property details, prices, and availability are provided by owners and can change or contain errors. Nothing on this site is an offer or contract; confirm every detail directly with us before making a decision or payment.`,
  },
  {
    heading: 'No professional advice',
    body: `Content on this site is general information, not legal, financial, or investment advice.`,
  },
  {
    heading: 'Use of the site',
    body: `Do not misuse the site, attempt to access the admin area, or submit false inquiries. Photos and text belong to the business or their owners and may not be reused without permission.`,
  },
];

function LegalPage({ title, sections }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>{`${title} · ${site.businessName}`}</title>
      </Helmet>
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-3 inline-block rounded-card border border-accent/40 bg-accent/5 px-3 py-1.5 text-sm text-accent">
        {t('legal.draftNotice')}
      </p>
      <div className="mt-6 space-y-6" dir="ltr">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl text-green">{section.heading}</h2>
            <p className="mt-2 text-[15px] leading-relaxed">{section.body}</p>
          </section>
        ))}
        <p className="text-sm text-ink-soft">
          {site.businessName}, {site.city}. Last updated: November 2026 (draft).
        </p>
      </div>
    </div>
  );
}

export function Privacy() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.privacyTitle')} sections={PRIVACY_SECTIONS} />;
}

export function Terms() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.termsTitle')} sections={TERMS_SECTIONS} />;
}
