import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { Lead } from '../../types';

interface Props {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDelete = ({ open, lead, onClose, onConfirm, loading }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Delete this lead?"
    description="This action cannot be undone."
  >
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Are you sure you want to delete{' '}
      <span className="font-semibold text-slate-900 dark:text-slate-100">
        {lead?.name ?? 'this lead'}
      </span>
      ? All associated data will be permanently removed.
    </p>
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        Delete lead
      </Button>
    </div>
  </Modal>
);

export default ConfirmDelete;
