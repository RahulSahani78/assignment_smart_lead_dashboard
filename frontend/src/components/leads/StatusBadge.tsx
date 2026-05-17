import Badge from '../ui/Badge';
import type { LeadStatus } from '../../types';

const statusTone: Record<LeadStatus, 'sky' | 'amber' | 'emerald' | 'rose'> = {
  New: 'sky',
  Contacted: 'amber',
  Qualified: 'emerald',
  Lost: 'rose',
};

const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <Badge tone={statusTone[status]}>{status}</Badge>
);

export default StatusBadge;
