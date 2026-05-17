import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SourceBadge from './SourceBadge';
import { formatDate } from '../../utils/format';
import type { Lead } from '../../types';

interface Props {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LeadTable = ({ leads, onEdit, onDelete }: Props) => (
  <>
    {/* Desktop table */}
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
        <thead className="bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3 font-semibold">Lead</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Source</th>
            <th className="px-6 py-3 font-semibold">Company</th>
            <th className="px-6 py-3 font-semibold">Created</th>
            <th className="px-6 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="table-row-hover">
              <td className="px-6 py-3.5">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {lead.name}
                  </span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400"
                  >
                    {lead.email}
                  </a>
                </div>
              </td>
              <td className="px-6 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-3.5">
                <SourceBadge source={lead.source} />
              </td>
              <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                {lead.company || '—'}
              </td>
              <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/leads/${lead._id}`}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    title="View"
                  >
                    <EyeIcon />
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-300"
                    onClick={() => onEdit(lead)}
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-300"
                    onClick={() => onDelete(lead)}
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile cards */}
    <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {leads.map((lead) => (
        <li key={lead._id} className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                {lead.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {lead.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={lead.status} />
                <SourceBadge source={lead.source} />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lead.company ? `${lead.company} · ` : ''}
                {formatDate(lead.createdAt)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                to={`/leads/${lead._id}`}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="View"
              >
                <EyeIcon />
              </Link>
              <button
                type="button"
                onClick={() => onEdit(lead)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => onDelete(lead)}
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </>
);

export default LeadTable;
