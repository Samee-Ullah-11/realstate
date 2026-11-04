import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { apiGet, apiSend } from '../../lib/api';
import site from '../../config/site';

// Admin is deliberately plain, functional, and English-only.
const links = [
  { to: '/admin/properties', label: 'Properties' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/password', label: 'Password' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    apiGet('/auth/me')
      .then(() => setChecked(true))
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  const logout = async () => {
    await apiSend('/auth/logout', 'POST');
    navigate('/admin/login');
  };

  if (!checked) return null;

  return (
    <div dir="ltr" className="min-h-screen bg-paper-2">
      <header className="sticky top-3 z-40 px-3 pt-3 sm:px-4">
        <div className="mx-auto max-w-5xl rounded-lg bg-green text-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
            <span className="text-lg font-semibold">{site.businessName} — Admin</span>
            <button onClick={logout} className="text-sm text-white/80 hover:text-white">
              Log out
            </button>
          </div>
          <nav className="flex gap-6 overflow-x-auto px-5 pb-3 pt-3 text-base">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap border-b-2 pb-1 ${
                    isActive ? 'border-white text-white' : 'border-transparent text-white/70 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
