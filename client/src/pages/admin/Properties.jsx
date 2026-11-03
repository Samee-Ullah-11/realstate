import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiSend } from '../../lib/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../lib/format';

export default function AdminProperties() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    apiGet('/admin/properties', { page }).then(setData).catch((e) => setError(e.message));
  }, [page]);

  useEffect(load, [load]);

  const remove = async (property) => {
    if (!window.confirm(`Delete "${property.title.en}"? It will disappear from the site.`)) return;
    await apiSend(`/admin/properties/${property._id}`, 'DELETE');
    load();
  };

  if (error) return <p className="text-accent">{error}</p>;
  if (!data) return <p className="text-ink-soft">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Properties ({data.total})</h1>
        <Button as={Link} to="/admin/properties/new" size="sm">
          New property
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {data.items.map((property) => (
          <div
            key={property._id}
            className="flex flex-wrap items-center gap-3 rounded-card bg-white p-3 shadow-card"
          >
            {property.photos?.[0] ? (
              <img
                src={property.photos[0].url}
                alt=""
                className="h-12 w-16 rounded object-cover"
              />
            ) : (
              <div className="h-12 w-16 rounded bg-paper-2 text-[10px] text-ink-soft flex items-center justify-center">
                no photo
              </div>
            )}
            <div className="min-w-0 flex-1 basis-44">
              <p className="truncate text-sm font-medium">{property.title.en}</p>
              <p className="text-xs text-ink-soft">
                {formatPrice(property.priceOnCall ? null : property.price)} · {property.area}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {property.isDraft && <Badge>Draft</Badge>}
              {property.isFeatured && <Badge variant="featured">Featured</Badge>}
              <Badge variant={property.status === 'available' ? 'available' : property.status === 'hidden' ? 'neutral' : property.status}>
                {property.status}
              </Badge>
            </div>
            <div className="flex gap-2 text-sm">
              <Link to={`/admin/properties/${property._id}`} className="text-accent hover:underline">
                Edit
              </Link>
              <button onClick={() => remove(property)} className="text-ink-soft hover:text-accent">
                Delete
              </button>
            </div>
          </div>
        ))}
        {data.items.length === 0 && <p className="text-ink-soft">No properties yet.</p>}
      </div>

      {data.pages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>
            {data.page} / {data.pages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
