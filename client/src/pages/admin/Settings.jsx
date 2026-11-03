import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Label, Input } from '../../components/ui/Field';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiGet('/admin/settings').then(setForm);
  }, []);

  if (!form) return <p className="text-ink-soft">Loading…</p>;

  const set = (patch) => setForm({ ...form, ...patch });

  const save = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const updated = await apiSend('/admin/settings', 'PATCH', {
        ...form,
        marlaSqFt: Number(form.marlaSqFt),
      });
      setForm(updated);
      setMessage('Saved. The public site shows the new values on next load.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={save} className="max-w-xl">
      <h1 className="text-2xl">Site settings</h1>
      <p className="mt-1 text-sm text-ink-soft">
        These override the defaults from the config file.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
        </div>
        <div>
          <Label>WhatsApp (international, e.g. 923159924831)</Label>
          <Input value={form.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Office address</Label>
          <Input value={form.officeAddress} onChange={(e) => set({ officeAddress: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Google Maps share link</Label>
          <Input value={form.googleMapsLink} onChange={(e) => set({ googleMapsLink: e.target.value })} />
        </div>
        <div>
          <Label>Office hours (English)</Label>
          <Input
            value={form.officeHours.en}
            onChange={(e) => set({ officeHours: { ...form.officeHours, en: e.target.value } })}
          />
        </div>
        <div>
          <Label>Office hours (Urdu)</Label>
          <Input
            dir="rtl"
            value={form.officeHours.ur}
            onChange={(e) => set({ officeHours: { ...form.officeHours, ur: e.target.value } })}
          />
        </div>
        <div>
          <Label>Google Place ID</Label>
          <Input
            value={form.googlePlaceId}
            onChange={(e) => set({ googlePlaceId: e.target.value })}
            placeholder="ChIJ…"
          />
        </div>
        <div>
          <Label>Marla size (sq ft)</Label>
          <Input
            type="number"
            step="any"
            min="100"
            max="500"
            value={form.marlaSqFt}
            onChange={(e) => set({ marlaSqFt: e.target.value })}
          />
        </div>
      </div>

      {message && <p className="mt-4 text-sm">{message}</p>}
      <Button type="submit" className="mt-5">
        Save settings
      </Button>
    </form>
  );
}
