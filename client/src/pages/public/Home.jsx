import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import useApi from '../../hooks/useApi';
import PropertyCard from '../../components/property/PropertyCard';
import Testimonials from '../../components/Testimonials';
import GoogleReviews from '../../components/GoogleReviews';
import Button from '../../components/ui/Button';
import { Label, Input, Select } from '../../components/ui/Field';
import site from '../../config/site';
import { BUDGETS, budgetLabel, paramsFromBudget } from '../../lib/budgets';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon, PhoneIcon, SearchIcon } from '../../components/ui/icons';

function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const form = e.target.elements;
    const params = new URLSearchParams();
    if (form.purpose.value) params.set('purpose', form.purpose.value);
    if (form.type.value) params.set('type', form.type.value);
    if (form.area.value.trim()) params.set('area', form.area.value.trim());
    const { minPrice, maxPrice } = paramsFromBudget(form.budget.value);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/properties?${params}`);
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:items-end rounded-card bg-white p-4 shadow-card"
    >
      <div>
        <Label htmlFor="h-purpose">{t('filters.purpose')}</Label>
        <Select id="h-purpose" name="purpose" defaultValue="buy">
          <option value="buy">{t('purpose.buy')}</option>
          <option value="rent">{t('purpose.rent')}</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="h-type">{t('filters.type')}</Label>
        <Select id="h-type" name="type" defaultValue="">
          <option value="">{t('filters.any')}</option>
          {site.propertyTypes.map((type) => (
            <option key={type} value={type}>
              {t(`propertyType.${type}`)}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="h-area">{t('filters.area')}</Label>
        <Input id="h-area" name="area" placeholder={t('filters.areaPlaceholder')} />
      </div>
      <div>
        <Label htmlFor="h-budget">{t('filters.budget')}</Label>
        <Select id="h-budget" name="budget" defaultValue="">
          <option value="">{t('filters.any')}</option>
          {BUDGETS.map((budget) => (
            <option key={budget.key} value={budget.key}>
              {budgetLabel(budget, t)}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="lg" className="col-span-2 sm:col-span-1 shadow-card">
        <SearchIcon />
        {t('actions.search')}
      </Button>
    </form>
  );
}

function SectionHeading({ children, to, linkText }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-2xl text-green">{children}</h2>
      {to && (
        <Link to={to} className="text-sm text-green underline-offset-4 hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { data: featured } = useApi('/properties', { featured: 'true', limit: 3 });
  const { data: recent } = useApi('/properties', { limit: 6 });
  const { data: agent } = useApi('/agent');

  return (
    <>
      <Helmet>
        <title>{`${site.businessName} · ${site.city}`}</title>
      </Helmet>

      {/* One self-contained, screen-height module: photo, title, search. */}
      {/* Pulled up behind the floating navbar so the photo, not white page
          background, shows around it (negative margins match header height). */}
      <section className="relative -mt-[116px] sm:-mt-[74px] flex min-h-[100svh] max-h-[820px] items-center">
        <img
          src={site.heroPhoto.url}
          srcSet={site.heroPhoto.srcset}
          sizes="100vw"
          alt={t('home.heroAlt')}
          width="1280"
          height="853"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/50 to-ink/35" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-36 sm:pt-28">
          <h1 className="max-w-2xl text-3xl sm:text-5xl text-white leading-tight">
            {t('home.heroTitle', { city: site.city })}
          </h1>
          <p className="mt-3 max-w-xl text-white/85">{t('home.heroSub')}</p>
          <div className="mt-8 max-w-4xl">
            <SearchBar />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/75">{t('home.browse')}:</span>
            {site.propertyTypes.map((type) => (
              <Link
                key={type}
                to={`/properties?type=${type}`}
                className="rounded-full border border-white/35 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/25"
              >
                {t(`propertyType.${type}`)}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/75">
            {site.officeHours[lang] || site.officeHours.en}
            {' · '}
            <a href={`tel:${site.phone}`} dir="ltr" className="font-semibold text-white underline-offset-4 hover:underline">
              {site.phone}
            </a>
          </p>
        </div>
      </section>

      {featured?.items?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-16">
          <SectionHeading to="/properties" linkText={t('home.viewAll')}>
            {t('home.featured')}
          </SectionHeading>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.items.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>
      )}

      {agent && (
        <section className="mx-auto max-w-6xl px-4 mt-16">
          <div className="rounded-card bg-paper-2 p-6 sm:p-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            {agent.photoUrl ? (
              <img
                src={agent.photoUrl}
                alt={agent.name}
                width="112"
                height="112"
                loading="lazy"
                className="h-28 w-28 rounded-card object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-card bg-paper text-center text-[11px] text-ink-soft border border-line">
                [AGENT PHOTO]
              </div>
            )}
            <div>
              <h2 className="text-2xl text-green">{agent.name}</h2>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed">
                {(agent.bio && (agent.bio[lang] || agent.bio.en)) || ''}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                {t('home.serves')}: {agent.areasServed?.join(', ') || site.city}
              </p>
            </div>
          </div>
        </section>
      )}

      {recent?.items?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-16">
          <SectionHeading to="/properties" linkText={t('home.viewAll')}>
            {t('home.recent')}
          </SectionHeading>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.items.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>
      )}

      <GoogleReviews />
      <Testimonials />

      <section className="mt-16 bg-paper-2 border-y border-line">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-green">{t('home.contactStrip')}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {site.officeHours[lang] || site.officeHours.en}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button as="a" variant="whatsapp" href={whatsappLink(t('home.waGeneric'))} target="_blank" rel="noopener">
              <WhatsAppIcon />
              {t('actions.whatsapp')}
            </Button>
            <Button as="a" href={`tel:${site.phone}`}>
              <PhoneIcon />
              <span dir="ltr">{site.phone}</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
