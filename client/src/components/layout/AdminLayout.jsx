import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { apiGet, apiSend } from '../../lib/api';
import site from '../../config/site';
import useHideOnScroll from '../../hooks/useHideOnScroll';
import { MenuIcon, CloseIcon } from '../ui/icons';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = useHideOnScroll();

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
      <header
        className={`sticky top-3 z-40 px-3 pt-3 sm:px-4 transition-transform duration-200 motion-reduce:transition-none ${
          hidden ? '-translate-y-[120%]' : ''
        }`}
      >
        <div className="mx-auto max-w-5xl rounded-lg bg-green text-white shadow-md">
          <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-4 sm:pb-0">
            <span className="text-lg font-semibold">{site.businessName} — Admin</span>
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="rounded-card border border-white/40 px-3 py-1.5 text-sm font-medium text-white hover:bg-white hover:text-green transition-colors duration-150"
              >
                Log out
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="rounded-card border border-white/40 p-2 text-white hover:bg-white hover:text-green transition-colors duration-150 sm:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          {/* Desktop: one inline row. Mobile: links live behind the hamburger. */}
          <nav className="hidden gap-x-6 px-5 pb-3 pt-3 text-base sm:flex">
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
          {menuOpen && (
            <nav className="border-t border-white/15 px-5 py-2 sm:hidden">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 text-base ${
                      isActive ? 'font-semibold text-white' : 'text-white/75 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
