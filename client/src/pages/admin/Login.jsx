import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSend } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Label, Input } from '../../components/ui/Field';
import site from '../../config/site';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiSend('/auth/login', 'POST', {
        email: e.target.elements.email.value.trim(),
        password: e.target.elements.password.value,
      });
      navigate('/admin/properties');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-paper-2 flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-card bg-white p-6 shadow-card">
        <h1 className="text-xl">{site.businessName} — Admin</h1>
        <div className="mt-5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {error && <p className="mt-3 text-sm text-accent">{error}</p>}
        <Button type="submit" disabled={busy} className="mt-5 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
