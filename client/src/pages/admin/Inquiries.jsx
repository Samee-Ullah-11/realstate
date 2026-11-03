import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiSend } from '../../lib/api';
import { Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';

const STATUSES = ['new', 'contacted', 'closed'];

export default function AdminInquiries() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    apiGet('/admin/inquiries', { status: filter || undefined, page }).then(setData);
  }, [filter, page]);

  useEffect(load, [load]);

  const setStatus = async (id, status) => {
    await apiSend(`/admin/inquiries/${id}`, 'PATCH', { status });
    load();
  };

  if (!data) return <p className="text-ink-soft">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl">Inquiries ({data.total})</h1>
        <Select
          className="w-36"
          value={filter}
          onChange={(e) => {
            setPage(1);
            setFilter(e.target.value);
          }}
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 space-y-2">
        {data.items.map((inquiry) => (
          <div key={inquiry._id} className="rounded-card bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {inquiry.name}
                <a href={`tel:${inquiry.phone}`} className="ms-3 text-sm font-normal text-accent hover:underline">
                  {inquiry.phone}
                </a>
                {inquiry.email && <span className="ms-3 text-sm font-normal text-ink-soft">{inquiry.email}</span>}
              </p>
              <Select
                className="w-32 h-9"
                value={inquiry.status}
                onChange={(e) => setStatus(inquiry._id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              {new Date(inquiry.createdAt).toLocaleString()} · language: {inquiry.language}
              {inquiry.propertyId && (
                <>
                  {' · about: '}
                  <Link
                    to={`/properties/${inquiry.propertyId.slug}`}
                    target="_blank"
                    className="text-accent hover:underline"
                  >
                    {inquiry.propertyId.title?.en}
                  </Link>
                </>
              )}
            </p>
            {inquiry.message && <p className="mt-2 text-sm whitespace-pre-line">{inquiry.message}</p>}
          </div>
        ))}
        {data.items.length === 0 && <p className="text-ink-soft">No inquiries.</p>}
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
