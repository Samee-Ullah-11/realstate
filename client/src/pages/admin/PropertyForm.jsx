import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiSend, apiUpload } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Label, Input, Select, Textarea } from '../../components/ui/Field';
import site from '../../config/site';

const EMPTY = {
  title: { en: '', ur: '' },
  description: { en: '', ur: '' },
  purpose: 'buy',
  type: 'house',
  status: 'available',
  isDraft: false,
  price: '',
  priceOnCall: false,
  areaValue: '',
  areaUnit: 'marla',
  bedrooms: '',
  bathrooms: '',
  city: site.city,
  area: '',
  lat: '',
  lng: '',
  features: '',
  isFeatured: false,
};

function toForm(property) {
  return {
    ...EMPTY,
    ...property,
    price: property.price ?? '',
    bedrooms: property.bedrooms ?? '',
    bathrooms: property.bathrooms ?? '',
    // Show the area in the unit it was entered in.
    areaValue:
      property.areaUnitEntered === 'kanal'
        ? +(property.areaSqFt / (site.marlaSqFt * site.kanalMarlas)).toFixed(2)
        : property.areaUnitEntered === 'marla'
          ? +(property.areaSqFt / site.marlaSqFt).toFixed(2)
          : property.areaSqFt,
    areaUnit: property.areaUnitEntered || 'marla',
    lat: property.location?.lat ?? '',
    lng: property.location?.lng ?? '',
    features: (property.features || []).join(', '),
  };
}

function toPayload(form) {
  return {
    title: { en: form.title.en.trim(), ur: form.title.ur.trim() },
    description: { en: form.description.en.trim(), ur: form.description.ur.trim() },
    purpose: form.purpose,
    type: form.type,
    status: form.status,
    isDraft: form.isDraft,
    price: form.priceOnCall || form.price === '' ? null : Number(form.price),
    priceOnCall: form.priceOnCall,
    areaValue: Number(form.areaValue),
    areaUnit: form.areaUnit,
    bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
    bathrooms: form.bathrooms === '' ? null : Number(form.bathrooms),
    city: form.city.trim(),
    area: form.area.trim(),
    location:
      form.lat !== '' && form.lng !== ''
        ? { lat: Number(form.lat), lng: Number(form.lng) }
        : null,
    features: form.features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean),
    isFeatured: form.isFeatured,
  };
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export default function PropertyForm() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState(''); // '', saving, uploading
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    apiGet(`/admin/properties/${id}`)
      .then((property) => {
        setForm(toForm(property));
        setPhotos(property.photos || []);
      })
      .catch((e) => setError(e.message));
  }, [id, isNew]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      if (isNew) {
        const created = await apiSend('/admin/properties', 'POST', toPayload(form));
        navigate(`/admin/properties/${created._id}`, { replace: true });
      } else {
        await apiSend(`/admin/properties/${id}`, 'PATCH', toPayload(form));
      }
      setStatus('');
    } catch (err) {
      setError(err.message + (err.status === 400 ? ' — check required fields' : ''));
      setStatus('');
    }
  };

  const upload = async (files) => {
    if (!files.length) return;
    setStatus('uploading');
    setError('');
    try {
      const data = new FormData();
      for (const file of files) data.append('photos', file);
      const updated = await apiUpload(`/admin/properties/${id}/photos`, data);
      setPhotos(updated.photos);
    } catch (err) {
      setError(err.message);
    }
    setStatus('');
  };

  const reorder = async (from, to) => {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    [next[from], next[to]] = [next[to], next[from]];
    setPhotos(next);
    await apiSend(`/admin/properties/${id}/photos/order`, 'PATCH', {
      publicIds: next.map((photo) => photo.publicId),
    }).catch((e) => setError(e.message));
  };

  const removePhoto = async (publicId) => {
    const updated = await apiSend(
      `/admin/properties/${id}/photos/${encodeURIComponent(publicId)}`,
      'DELETE'
    );
    setPhotos(updated.photos);
  };

  return (
    <form onSubmit={save} className="max-w-3xl">
      <h1 className="text-2xl">{isNew ? 'New property' : 'Edit property'}</h1>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title (English) *</Label>
          <Input
            required
            value={form.title.en}
            onChange={(e) => set({ title: { ...form.title, en: e.target.value } })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Title (Urdu, optional)</Label>
          <Input
            dir="rtl"
            value={form.title.ur}
            onChange={(e) => set({ title: { ...form.title, ur: e.target.value } })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Description (English)</Label>
          <Textarea
            value={form.description.en}
            onChange={(e) => set({ description: { ...form.description, en: e.target.value } })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Description (Urdu, optional)</Label>
          <Textarea
            dir="rtl"
            value={form.description.ur}
            onChange={(e) => set({ description: { ...form.description, ur: e.target.value } })}
          />
        </div>

        <div>
          <Label>Purpose</Label>
          <Select value={form.purpose} onChange={(e) => set({ purpose: e.target.value })}>
            <option value="buy">For sale</option>
            <option value="rent">For rent</option>
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select value={form.type} onChange={(e) => set({ type: e.target.value })}>
            {site.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
            {['available', 'sold', 'rented', 'hidden'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end gap-5 pb-2">
          <Check label="Draft" checked={form.isDraft} onChange={(v) => set({ isDraft: v })} />
          <Check label="Featured" checked={form.isFeatured} onChange={(v) => set({ isFeatured: v })} />
        </div>

        <div>
          <Label>Price (PKR)</Label>
          <Input
            type="number"
            min="0"
            value={form.price}
            disabled={form.priceOnCall}
            onChange={(e) => set({ price: e.target.value })}
          />
          <div className="mt-1.5">
            <Check
              label="Price on call"
              checked={form.priceOnCall}
              onChange={(v) => set({ priceOnCall: v })}
            />
          </div>
        </div>
        <div>
          <Label>Size *</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              step="any"
              required
              value={form.areaValue}
              onChange={(e) => set({ areaValue: e.target.value })}
            />
            <Select
              className="w-28"
              value={form.areaUnit}
              onChange={(e) => set({ areaUnit: e.target.value })}
            >
              <option value="marla">marla</option>
              <option value="kanal">kanal</option>
              <option value="sqft">sq ft</option>
            </Select>
          </div>
        </div>

        <div>
          <Label>Bedrooms</Label>
          <Input type="number" min="0" value={form.bedrooms} onChange={(e) => set({ bedrooms: e.target.value })} />
        </div>
        <div>
          <Label>Bathrooms</Label>
          <Input type="number" min="0" value={form.bathrooms} onChange={(e) => set({ bathrooms: e.target.value })} />
        </div>

        <div>
          <Label>City *</Label>
          <Input required value={form.city} onChange={(e) => set({ city: e.target.value })} />
        </div>
        <div>
          <Label>Area / locality *</Label>
          <Input required value={form.area} onChange={(e) => set({ area: e.target.value })} placeholder="e.g. Hayatabad Phase 3" />
        </div>

        <div>
          <Label>Latitude (optional)</Label>
          <Input type="number" step="any" value={form.lat} onChange={(e) => set({ lat: e.target.value })} />
        </div>
        <div>
          <Label>Longitude (optional)</Label>
          <Input type="number" step="any" value={form.lng} onChange={(e) => set({ lng: e.target.value })} />
        </div>

        <div className="sm:col-span-2">
          <Label>Features (comma separated)</Label>
          <Input
            value={form.features}
            onChange={(e) => set({ features: e.target.value })}
            placeholder="corner, parking, solar wiring"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-accent">{error}</p>}

      <div className="mt-5 flex gap-3">
        <Button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/admin/properties')}>
          Back to list
        </Button>
      </div>

      {!isNew && (
        <section className="mt-8 border-t border-line pt-5">
          <h2 className="text-lg">Photos</h2>
          <p className="text-sm text-ink-soft">First photo is the cover. JPEG, PNG, or WebP, max 5 MB each.</p>
          <label
            className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-accent/40 bg-accent/5 px-4 py-8 text-center transition-colors hover:border-accent hover:bg-accent/10 ${status === 'uploading' ? 'pointer-events-none opacity-60' : ''}`}
          >
            <span className="text-3xl leading-none text-accent">+</span>
            <span className="font-medium text-accent">
              {status === 'uploading' ? 'Uploading…' : 'Click to add photos'}
            </span>
            <span className="text-xs text-ink-soft">You can select several at once</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => {
                upload([...e.target.files]);
                e.target.value = '';
              }}
            />
          </label>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <div key={photo.publicId} className="rounded-card bg-white p-2 shadow-card">
                <img src={photo.url} alt="" className="aspect-[4/3] w-full rounded object-cover" />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-ink-soft">{i === 0 ? 'Cover' : `#${i + 1}`}</span>
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => reorder(i, i - 1)} aria-label="Move earlier">←</button>
                    <button type="button" onClick={() => reorder(i, i + 1)} aria-label="Move later">→</button>
                    <button type="button" onClick={() => removePhoto(photo.publicId)} className="text-accent" aria-label="Remove">✕</button>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {photos.length === 0 && <p className="mt-2 text-sm text-ink-soft">No photos yet.</p>}
        </section>
      )}
    </form>
  );
}
