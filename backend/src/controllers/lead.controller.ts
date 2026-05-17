import type { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { toCsv } from '../utils/csv';
import {
  createLead,
  deleteLead,
  getLead,
  getStats,
  listLeads,
  listLeadsForExport,
  updateLead,
} from '../services/lead.service';
import type { AuthRequest } from '../types';
import type {
  CreateLeadInput,
  LeadQueryInput,
  UpdateLeadInput,
} from '../validators/lead.validator';

const requireUser = (req: AuthRequest) => {
  if (!req.user) throw ApiError.unauthorized();
  return { userId: req.user.id, role: req.user.role };
};

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const query = req.query as unknown as LeadQueryInput;
  const result = await listLeads(query, actor);
  return sendSuccess(res, result.items, 'Leads fetched', 200, {
    pagination: result.meta,
    filters: {
      status: query.status ?? null,
      source: query.source ?? null,
      search: query.search ?? null,
      sort: query.sort,
    },
  });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const lead = await getLead(req.params.id, actor);
  return sendSuccess(res, lead, 'Lead fetched');
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const lead = await createLead(req.body as CreateLeadInput, actor);
  return sendSuccess(res, lead, 'Lead created', 201);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const lead = await updateLead(req.params.id, req.body as UpdateLeadInput, actor);
  return sendSuccess(res, lead, 'Lead updated');
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  await deleteLead(req.params.id, actor);
  return sendSuccess(res, { id: req.params.id }, 'Lead deleted');
});

export const stats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const result = await getStats(actor);
  return sendSuccess(res, result, 'Stats fetched');
});

export const exportCsv = asyncHandler(async (req: AuthRequest, res: Response) => {
  const actor = requireUser(req);
  const query = req.query as unknown as LeadQueryInput;
  const items = await listLeadsForExport(query, actor);

  const csv = toCsv(
    items.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone ?? '',
      Company: lead.company ?? '',
      Status: lead.status,
      Source: lead.source,
      Notes: lead.notes ?? '',
      CreatedAt: lead.createdAt,
      UpdatedAt: lead.updatedAt,
    })),
    [
      { key: 'Name', header: 'Name' },
      { key: 'Email', header: 'Email' },
      { key: 'Phone', header: 'Phone' },
      { key: 'Company', header: 'Company' },
      { key: 'Status', header: 'Status' },
      { key: 'Source', header: 'Source' },
      { key: 'Notes', header: 'Notes' },
      { key: 'CreatedAt', header: 'CreatedAt' },
      { key: 'UpdatedAt', header: 'UpdatedAt' },
    ]
  );

  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('﻿' + csv); // BOM for Excel UTF-8
});
