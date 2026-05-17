import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StatusBadge from '../components/leads/StatusBadge';
import SourceBadge from '../components/leads/SourceBadge';
import ErrorState from '../components/common/ErrorState';
import PageLoader from '../components/common/PageLoader';
import LeadFormModal, {
  type FormValues,
} from '../components/leads/LeadFormModal';
import ConfirmDelete from '../components/leads/ConfirmDelete';
import { deleteLead, fetchLead, updateLead } from '../api/lead.api';
import { extractErrorMessage } from '../api/axios';
import { formatDateTime } from '../utils/format';
import type { Lead } from '../types';

const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLead(id);
      setLead(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load lead'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageLoader label="Loading lead…" />;
  if (error)
    return (
      <div className="card">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  if (!lead) return null;

  const handleUpdate = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const updated = await updateLead(lead._id, values);
      setLead(updated);
      toast.success('Lead updated');
      setEditOpen(false);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Update failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(lead._id);
      toast.success('Lead deleted');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Delete failed'));
    } finally {
      setDeleting(false);
    }
  };

  const owner =
    typeof lead.owner === 'string'
      ? null
      : { name: lead.owner.name, email: lead.owner.email, role: lead.owner.role };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard"
            className="text-xs font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {lead.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lead.email}
            {lead.company ? ` · ${lead.company}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Lead details
            </h2>
          </div>
          <dl className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              ['Name', lead.name],
              ['Email', lead.email],
              ['Phone', lead.phone || '—'],
              ['Company', lead.company || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label}
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-100">{value}</dd>
              </div>
            ))}

            <div className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-6">
              <dt className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </dt>
              <dd>
                <StatusBadge status={lead.status} />
              </dd>
            </div>
            <div className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-6">
              <dt className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Source
              </dt>
              <dd>
                <SourceBadge source={lead.source} />
              </dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Notes
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {lead.notes || '—'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Meta
            </h2>
          </div>
          <div className="space-y-3 px-5 py-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Created
              </p>
              <p className="text-slate-900 dark:text-slate-100">
                {formatDateTime(lead.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Last updated
              </p>
              <p className="text-slate-900 dark:text-slate-100">
                {formatDateTime(lead.updatedAt)}
              </p>
            </div>
            {owner && (
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Owner
                </p>
                <p className="text-slate-900 dark:text-slate-100">
                  {owner.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {owner.email} · {owner.role}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <LeadFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initial={lead}
        loading={submitting}
      />

      <ConfirmDelete
        open={deleteOpen}
        lead={lead}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default LeadDetailsPage;
