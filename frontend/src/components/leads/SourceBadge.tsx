import Badge from '../ui/Badge';
import type { LeadSource } from '../../types';

const sourceTone: Record<LeadSource, 'blue' | 'violet' | 'slate'> = {
  Website: 'blue',
  Instagram: 'violet',
  Referral: 'slate',
};

const SourceBadge = ({ source }: { source: LeadSource }) => (
  <Badge tone={sourceTone[source]}>{source}</Badge>
);

export default SourceBadge;
