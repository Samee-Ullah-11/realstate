import { useTranslation } from 'react-i18next';
import { Label, Input, Select } from '../ui/Field';
import Button from '../ui/Button';
import site from '../../config/site';
import { BUDGETS, budgetLabel, budgetFromParams, paramsFromBudget } from '../../lib/budgets';

// Everything reads from and writes to the URL search params, so every
// filtered view is shareable.
export default function Filters({ params, onChange }) {
  const { t } = useTranslation();

  const set = (patch) => onChange({ ...patch, page: '' });

  return (
    <form
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end"
      onSubmit={(e) => {
        e.preventDefault();
        set({ area: e.target.elements.area.value.trim() });
      }}
    >
      <div>
        <Label htmlFor="f-purpose">{t('filters.purpose')}</Label>
        <Select
          id="f-purpose"
          value={params.purpose || ''}
          onChange={(e) => set({ purpose: e.target.value })}
        >
          <option value="">{t('filters.any')}</option>
          <option value="buy">{t('purpose.buy')}</option>
          <option value="rent">{t('purpose.rent')}</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="f-type">{t('filters.type')}</Label>
        <Select
          id="f-type"
          value={params.type || ''}
          onChange={(e) => set({ type: e.target.value })}
        >
          <option value="">{t('filters.any')}</option>
          {site.propertyTypes.map((type) => (
            <option key={type} value={type}>
              {t(`propertyType.${type}`)}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-budget">{t('filters.budget')}</Label>
        <Select
          id="f-budget"
          value={budgetFromParams(params.minPrice, params.maxPrice)}
          onChange={(e) => set(paramsFromBudget(e.target.value))}
        >
          <option value="">{t('filters.any')}</option>
          {BUDGETS.map((budget) => (
            <option key={budget.key} value={budget.key}>
              {budgetLabel(budget, t)}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-beds">{t('filters.beds')}</Label>
        <Select
          id="f-beds"
          value={params.beds || ''}
          onChange={(e) => set({ beds: e.target.value })}
        >
          <option value="">{t('filters.any')}</option>
          {[2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-area">{t('filters.area')}</Label>
        <Input
          id="f-area"
          name="area"
          defaultValue={params.area || ''}
          key={params.area || ''}
          placeholder={t('filters.areaPlaceholder')}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="secondary" className="flex-1">
          {t('actions.search')}
        </Button>
      </div>
    </form>
  );
}
