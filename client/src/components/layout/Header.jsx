import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import site from '../../config/site';
import useHideOnScroll from '../../hooks/useHideOnScroll';

const links = [
  { to: '/', key: 'home', end: true },
  { to: '/properties', key: 'properties' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const hidden = useHideOnScroll();

  const navClass = ({ isActive }) =>
    `py-1 border-b-2 transition-colors duration-150 ${
      isActive
        ? 'border-accent text-ink'
        : 'border-transparent text-ink-soft hover:text-ink'
    }`;

  return (
    <header
      className={`sticky top-3 z-50 mt-3 px-3 sm:px-4 transition-transform duration-200 motion-reduce:transition-none ${
        hidden ? '-translate-y-[120%]' : ''
      }`}
    >
      <div className="mx-auto max-w-6xl rounded-lg border border-line bg-white/95 px-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="text-lg font-bold leading-tight text-green tracking-tight">
            {site.businessName}
            <span className="block font-sans text-[11px] font-normal tracking-wide text-ink-soft uppercase">
              {site.city}
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden sm:flex items-center gap-5 text-[15px]" aria-label="Main">
              {links.map((link) => (
                <NavLink key={link.key} to={link.to} end={link.end} className={navClass}>
                  {t(`nav.${link.key}`)}
                </NavLink>
              ))}
            </nav>
            <a
              href={`tel:${site.phone}`}
              className="hidden md:block text-sm font-semibold text-accent hover:text-accent-2"
              dir="ltr"
            >
              {site.phone}
            </a>
            <button
              type="button"
              onClick={() => i18n.changeLanguage(lang === 'en' ? 'ur' : 'en')}
              className="rounded-card border border-ink/25 px-2.5 py-1 text-sm hover:border-ink hover:bg-paper-2 transition-colors duration-150"
            >
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>
        <nav className="sm:hidden flex gap-5 pb-2.5 text-[15px]" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.key} to={link.to} end={link.end} className={navClass}>
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
