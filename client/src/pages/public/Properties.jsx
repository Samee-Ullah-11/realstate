import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import useApi from '../../hooks/useApi';
import Filters from '../../components/property/Filters';
import PropertyCard from '../../components/property/PropertyCard';
import Pagination from '../../components/ui/Pagination';
import { Select, Label } from '../../components/ui/Field';
import site from '../../config/site';

const FILTER_KEYS = [
  'purpose',
  'type',
  'area',
  'minPrice',
  'maxPrice',
  'beds',
  'status',
  'sort',
  'page',
];

export default function Properties() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {};
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) params[key] = value;
  }

  const { data, loading, error } = useApi('/properties', params);

  const patchParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { preventScrollReset: false });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{`${t('nav.properties')} · ${site.businessName}`}</title>
      </Helmet>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl">{t('propertiesPage.title')}</h1>
        <div className="w-44">
          <Label htmlFor="f-sort">{t('filters.sort')}</Label>
          <Select
            id="f-sort"
            value={params.sort || 'newest'}
            onChange={(e) =>
              patchParams({ sort: e.target.value === 'newest' ? '' : e.target.value })
            }
          >
            <option value="newest">{t('filters.sortNewest')}</option>
            <option value="priceAsc">{t('filters.sortPriceAsc')}</option>
            <option value="priceDesc">{t('filters.sortPriceDesc')}</option>
          </Select>
        </div>
      </div>

      <div className="mt-5 rounded-card border border-line bg-paper-2/60 p-4">
        <Filters params={params} onChange={patchParams} />
      </div>

      {loading && <p className="mt-10 text-ink-soft">{t('common.loading')}</p>}
      {error && <p className="mt-10 text-ink-soft">{t('common.loadFailed')}</p>}

      {data && (
        <>
          <p className="mt-6 text-sm text-ink-soft">
            {t('propertiesPage.count', { count: data.total })}
          </p>
          {data.items.length === 0 ? (
            <p className="mt-6 max-w-prose">{t('propertiesPage.empty')}</p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}
          <Pagination
            page={data.page}
            pages={data.pages}
            onPage={(page) => patchParams({ page: page === 1 ? '' : String(page) })}
          />
          <p className="mt-10 text-xs text-ink-soft">{t('disclaimer.listing')}</p>
        </>
      )}
    </div>
  );
}
