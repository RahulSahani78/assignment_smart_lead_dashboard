import type { LeadStats } from '../../types';

interface Props {
  stats: LeadStats | null;
  loading: boolean;
}

const Card = ({
  label,
  value,
  tone,
  loading,
}: {
  label: string;
  value: number;
  tone: string;
  loading: boolean;
}) => (
  <div className="card flex items-center justify-between p-5">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {loading ? (
        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value.toLocaleString()}
        </p>
      )}
    </div>
    <span
      className={`grid h-11 w-11 place-items-center rounded-xl text-white shadow-sm ${tone}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    </span>
  </div>
);

const StatsCards = ({ stats, loading }: Props) => {
  const total = stats?.total ?? 0;
  const qualified = stats?.byStatus?.Qualified ?? 0;
  const contacted = stats?.byStatus?.Contacted ?? 0;
  const newCount = stats?.byStatus?.New ?? 0;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Total Leads" value={total} tone="bg-brand-600" loading={loading} />
      <Card label="New" value={newCount} tone="bg-sky-500" loading={loading} />
      <Card label="Contacted" value={contacted} tone="bg-amber-500" loading={loading} />
      <Card label="Qualified" value={qualified} tone="bg-emerald-500" loading={loading} />
    </section>
  );
};

export default StatsCards;
