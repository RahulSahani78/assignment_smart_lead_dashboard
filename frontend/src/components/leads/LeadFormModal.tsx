import { useEffect, useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from '../../types';
import { isNonEmpty, isValidEmail } from '../../utils/validators';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: FormValues) => Promise<void> | void;
  initial?: Lead | null;
  loading?: boolean;
}

export interface FormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  status: LeadStatus;
  source: LeadSource;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const empty: FormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  status: 'New',
  source: 'Website',
};

const LeadFormModal = ({ open, onClose, onSubmit, initial, loading }: Props) => {
  const [form, setForm] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        name: initial.name,
        email: initial.email,
        phone: initial.phone ?? '',
        company: initial.company ?? '',
        notes: initial.notes ?? '',
        status: initial.status,
        source: initial.source,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [open, initial]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!isNonEmpty(form.name, 2)) next.name = 'Name is required';
    if (!isValidEmail(form.email)) next.email = 'Valid email is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit lead' : 'Create new lead'}
      description={
        initial
          ? 'Update the details for this lead and save your changes.'
          : 'Capture a new lead with their contact info and source.'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            placeholder="e.g. Rahul Sharma"
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="rahul@example.com"
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 9876543210"
          />
          <Input
            label="Company"
            name="company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Inc."
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as LeadStatus })
            }
            options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <Select
            label="Source"
            value={form.source}
            onChange={(e) =>
              setForm({ ...form, source: e.target.value as LeadSource })
            }
            options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[100px] resize-y"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            maxLength={1000}
            placeholder="Add context, last conversation, next steps…"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {form.notes.length}/1000
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initial ? 'Save changes' : 'Create lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
