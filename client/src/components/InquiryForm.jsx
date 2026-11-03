import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import { Label, Input, Textarea } from './ui/Field';
import { apiSend } from '../lib/api';

export default function InquiryForm({ propertyId = null }) {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState('idle'); // idle | sending | sent | failed

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setState('sending');
    try {
      await apiSend('/inquiries', 'POST', {
        propertyId,
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
        language: i18n.resolvedLanguage,
        website: form.elements.website.value,
      });
      setState('sent');
      form.reset();
    } catch {
      setState('failed');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-card border border-green/40 bg-green/5 p-5">
        <p className="font-medium text-green">{t('inquiry.sentTitle')}</p>
        <p className="mt-1 text-sm text-ink-soft">{t('inquiry.sentBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="inq-name">{t('inquiry.name')} *</Label>
        <Input id="inq-name" name="name" required minLength={2} autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="inq-phone">{t('inquiry.phone')} *</Label>
        <Input
          id="inq-phone"
          name="phone"
          type="tel"
          required
          pattern="[0-9+][0-9\s\-]{6,}"
          autoComplete="tel"
          dir="ltr"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="inq-email">{t('inquiry.email')}</Label>
        <Input id="inq-email" name="email" type="email" autoComplete="email" dir="ltr" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="inq-message">{t('inquiry.message')}</Label>
        <Textarea id="inq-message" name="message" maxLength={2000} />
      </div>
      {/* Honeypot: hidden from people, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t('inquiry.sending') : t('actions.send')}
        </Button>
        {state === 'failed' && (
          <p className="text-sm text-accent">{t('inquiry.failed')}</p>
        )}
      </div>
    </form>
  );
}
