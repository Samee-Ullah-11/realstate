import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Label, Input, Textarea } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';

const EMPTY = {
  authorName: '',
  text: { en: '', ur: '' },
  permissionObtained: false,
  isVisible: true,
  order: 0,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => apiGet('/admin/testimonials').then(setItems);
  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await apiSend(`/admin/testimonials/${editingId}`, 'PATCH', form);
      else await apiSend('/admin/testimonials', 'POST', form);
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      authorName: item.authorName,
      text: { en: item.text.en, ur: item.text.ur || '' },
      permissionObtained: item.permissionObtained,
      isVisible: item.isVisible,
      order: item.order,
    });
  };

  const toggleVisible = async (item) => {
    await apiSend(`/admin/testimonials/${item._id}`, 'PATCH', { isVisible: !item.isVisible });
    load();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete testimonial by ${item.authorName}?`)) return;
    await apiSend(`/admin/testimonials/${item._id}`, 'DELETE');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl">Testimonials</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Real clients only. A testimonial shows on the site only when it is visible AND the
        client gave permission.
      </p>

      <form onSubmit={save} className="mt-4 max-w-xl rounded-card bg-white p-4 shadow-card">
        <h2 className="text-lg">{editingId ? 'Edit testimonial' : 'Add testimonial'}</h2>
        <div className="mt-3">
          <Label>Client name *</Label>
          <Input
            required
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <Label>Text (English) *</Label>
          <Textarea
            required
            rows={3}
            value={form.text.en}
            onChange={(e) => setForm({ ...form, text: { ...form.text, en: e.target.value } })}
          />
        </div>
        <div className="mt-3">
          <Label>Text (Urdu, optional)</Label>
          <Textarea
            dir="rtl"
            rows={3}
            value={form.text.ur}
            onChange={(e) => setForm({ ...form, text: { ...form.text, ur: e.target.value } })}
          />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.permissionObtained}
            onChange={(e) => setForm({ ...form, permissionObtained: e.target.checked })}
          />
          Client gave permission to publish this
        </label>
        {error && <p className="mt-2 text-sm text-accent">{error}</p>}
        <div className="mt-4 flex gap-2">
          <Button type="submit" size="sm">
            {editingId ? 'Save changes' : 'Add'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="mt-5 space-y-2">
        {items?.map((item) => (
          <div key={item._id} className="flex flex-wrap items-center gap-3 rounded-card bg-white p-3 shadow-card">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.authorName}</p>
              <p className="truncate text-sm text-ink-soft">{item.text.en}</p>
            </div>
            {!item.permissionObtained && <Badge variant="featured">No permission</Badge>}
            <Badge>{item.isVisible ? 'Visible' : 'Hidden'}</Badge>
            <div className="flex gap-2 text-sm">
              <button onClick={() => edit(item)} className="text-accent hover:underline">
                Edit
              </button>
              <button onClick={() => toggleVisible(item)} className="text-ink-soft hover:text-ink">
                {item.isVisible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => remove(item)} className="text-ink-soft hover:text-accent">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items?.length === 0 && <p className="text-ink-soft">None yet.</p>}
      </div>
    </div>
  );
}
