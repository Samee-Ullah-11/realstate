import { useState } from 'react';
import { apiSend } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Label, Input } from '../../components/ui/Field';

export default function AdminPassword() {
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setMessage('');
    try {
      await apiSend('/auth/password', 'PATCH', {
        currentPassword: form.elements.current.value,
        newPassword: form.elements.next.value,
      });
      setMessage('Password changed.');
      form.reset();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm">
      <h1 className="text-2xl">Change password</h1>
      <div className="mt-5">
        <Label htmlFor="current">Current password</Label>
        <Input id="current" name="current" type="password" required autoComplete="current-password" />
      </div>
      <div className="mt-4">
        <Label htmlFor="next">New password (min 8 characters)</Label>
        <Input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {message && <p className="mt-3 text-sm">{message}</p>}
      <Button type="submit" className="mt-5">
        Change password
      </Button>
    </form>
  );
}
