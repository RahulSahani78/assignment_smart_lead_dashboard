import { Router } from 'express';
import {
  create,
  exportCsv,
  getById,
  list,
  remove,
  stats,
  update,
} from '../controllers/lead.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createLeadSchema,
  leadQuerySchema,
  updateLeadSchema,
} from '../validators/lead.validator';

const router = Router();

router.use(requireAuth);

router.get('/stats', stats);
router.get('/export', validate(leadQuerySchema, 'query'), exportCsv);

router.get('/', validate(leadQuerySchema, 'query'), list);
router.post('/', validate(createLeadSchema), create);

router.get('/:id', getById);
router.put('/:id', validate(updateLeadSchema), update);
router.patch('/:id', validate(updateLeadSchema), update);
// Only admin or owner can delete — owner check handled inside service
// We still keep delete open to authenticated users (sales delete their own)
router.delete('/:id', remove);

// Admin-only example: bulk operations route (placeholder for future scaling)
router.post('/admin/seed-demo', requireRole('admin'), (_req, res) => {
  res.status(200).json({ success: true, message: 'Admin endpoint reachable' });
});

export default router;
