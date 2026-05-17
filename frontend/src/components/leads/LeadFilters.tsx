import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadFilters as Filters,
} from '../../types';

interface Props {
  value: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const LeadFiltersBar = ({ value, onChange, onReset }: Props) => {
  const [searchText, setSearchText] = useState<string>(value.search ?? '');
  const debounced = useDebounce(searchText, 400);

  // Sync external value back to local input only when external value changes (e.g. reset)
  useEffect(() => {
    setSearchText(value.search ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.search]);

  // Push debounced search up
  useEffect(() => {
    if ((value.search ?? '') === debounced) return;
    onChange({ ...value, search: debounced, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <section className="card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Input
            label="Search"
            placeholder="Search by name or email…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            leftIcon={<SearchIcon />}
            rightSlot={
              searchText ? (
                <button
                  type="button"
                  className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  onClick={() => setSearchText('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              ) : undefined
            }
          />
        </div>

        <Select
          label="Status"
          value={value.status ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              status: (e.target.value as Filters['status']) || '',
              page: 1,
            })
          }
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          placeholder="All statuses"
        />
        <Select
          label="Source"
          value={value.source ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              source: (e.target.value as Filters['source']) || '',
              page: 1,
            })
          }
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
          placeholder="All sources"
        />
        <Select
          label="Sort"
          value={value.sort ?? 'latest'}
          onChange={(e) =>
            onChange({
              ...value,
              sort: e.target.value as Filters['sort'],
              page: 1,
            })
          }
          options={[
            { value: 'latest', label: 'Latest first' },
            { value: 'oldest', label: 'Oldest first' },
          ]}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {value.search || value.status || value.source
            ? 'Active filters applied'
            : 'No filters applied'}
        </p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </section>
  );
};

export default LeadFiltersBar;
