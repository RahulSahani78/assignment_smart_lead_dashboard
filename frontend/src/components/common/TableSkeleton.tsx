interface Props {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 6, columns = 6 }: Props) => (
  <div className="animate-pulse divide-y divide-slate-100 dark:divide-slate-800">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-6 py-4">
        {Array.from({ length: columns }).map((__, c) => (
          <div
            key={c}
            className="h-3 flex-1 rounded bg-slate-200 dark:bg-slate-700"
            style={{ maxWidth: c === 0 ? '14rem' : undefined }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
