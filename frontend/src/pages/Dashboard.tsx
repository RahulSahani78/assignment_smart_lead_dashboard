import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StatsCards from '../components/leads/StatsCards';
import LeadFiltersBar from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import Pagination from '../components/leads/Pagination';
import LeadFormModal, {
  type FormValues,
} from '../components/leads/LeadFormModal';
import ConfirmDelete from '../components/leads/ConfirmDelete';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import TableSkeleton from '../components/common/TableSkeleton';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  fetchLeads,
  fetchStats,
  updateLead,
} from '../api/lead.api';
import { extractErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type {
  Lead,
  LeadFilters,
  LeadStats,
  PaginationMeta,
} from '../types';

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);

  const [loadingLeads, setLoadingLeads] = useState<boolean>(true);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [exporting, setExporting] = useState<boolean>(false);

  const loadLeads = useCallback(async (current: LeadFilters) => {
    setLoadingLeads(true);
    setError(null);
    try {
      const { items, pagination: meta } = await fetchLeads(current);
      setLeads(items);
      setPagination(meta);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load leads'));
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const s = await fetchStats();
      setStats(s);
    } catch (err) {
      // non-fatal; just show zeros
      console.warn(extractErrorMessage(err));
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads(filters);
  }, [filters, loadLeads]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditing(lead);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateLead(editing._id, values);
        setLeads((prev) =>
          prev.map((l) => (l._id === updated._id ? updated : l))
        );
        toast.success('Lead updated');
      } else {
        await createLead(values);
        toast.success('Lead created');
        // Reload to respect sort/filters
        void loadLeads(filters);
      }
      setFormOpen(false);
      setEditing(null);
      void loadStats();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save lead'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLead(deleteTarget._id);
      toast.success('Lead deleted');
      setDeleteTarget(null);
      void loadLeads(filters);
      void loadStats();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete lead'));
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportLeadsCsv(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Export failed'));
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => setFilters({ ...defaultFilters });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? 'You are viewing all leads in the system.'
              : 'Showing leads that belong to you.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
            loading={exporting}
          >
            Export CSV
          </Button>
          <Button leftIcon={<PlusIcon />} onClick={handleCreate}>
            New lead
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} loading={loadingStats} />

      <LeadFiltersBar
        value={filters}
        onChange={(next) => setFilters(next)}
        onReset={resetFilters}
      />

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Leads
            {pagination && (
              <span className="ml-2 text-xs font-medium text-slate-400">
                ({pagination.totalItems})
              </span>
            )}
          </h2>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => loadLeads(filters)} />
        ) : loadingLeads ? (
          <TableSkeleton rows={6} columns={6} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              filters.search || filters.status || filters.source
                ? 'Try adjusting filters or clearing your search.'
                : 'Get started by creating your first lead.'
            }
            action={
              <Button leftIcon={<PlusIcon />} onClick={handleCreate}>
                Create lead
              </Button>
            }
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={handleEdit}
              onDelete={(lead) => setDeleteTarget(lead)}
            />
            {pagination && (
              <Pagination meta={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </section>

      <LeadFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleFormSubmit}
        initial={editing}
        loading={submitting}
      />

      <ConfirmDelete
        open={!!deleteTarget}
        lead={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
};

export default DashboardPage;
