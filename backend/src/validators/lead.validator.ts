import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../types';

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone too long')
    .optional()
    .or(z.literal('')),
  company: z.string().trim().max(120, 'Company too long').optional().or(z.literal('')),
  notes: z.string().trim().max(1000, 'Notes too long').optional().or(z.literal('')),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().max(120).optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? 1 : Number(v)))
    .pipe(z.number().int().min(1)),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? 10 : Number(v)))
    .pipe(z.number().int().min(1).max(100)),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
