import { useTranslation } from 'react-i18next';
import Button from './Button';

export default function Pagination({ page, pages, onPage }) {
  const { t } = useTranslation();
  if (pages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        {t('pagination.prev')}
      </Button>
      <span className="text-sm text-ink-soft">
        {t('pagination.of', { page, pages })}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        {t('pagination.next')}
      </Button>
    </nav>
  );
}
