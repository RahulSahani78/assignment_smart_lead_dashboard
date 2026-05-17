import { FilterQuery, SortOrder, Types } from 'mongoose';
import { LeadModel, type ILeadDocument } from '../models/lead.model';
import { ApiError } from '../utils/ApiError';
import type {
  LeadQuery,
  PaginatedResult,
  PaginationMeta,
  UserRole,
} from '../types';
import type {
  CreateLeadInput,
  UpdateLeadInput,
} from '../validators/lead.validator';

interface ActorContext {
  userId: string;
  role: UserRole;
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = (
  query: LeadQuery,
  actor: ActorContext
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  // RBAC: sales users only see their own leads; admins see all
  if (actor.role !== 'admin') {
    filter.owner = new Types.ObjectId(actor.userId);
  }

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  if (query.search && query.search.trim().length > 0) {
    const safe = escapeRegex(query.search.trim());
    filter.$or = [
      { name: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
    ];
  }
  return filter;
};

const buildSort = (sort: LeadQuery['sort']): Record<string, SortOrder> => {
  if (sort === 'oldest') return { createdAt: 1 };
  return { createdAt: -1 };
};

const buildMeta = (
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
};

export const listLeads = async (
  query: Required<Pick<LeadQuery, 'page' | 'limit' | 'sort'>> & LeadQuery,
  actor: ActorContext
): Promise<PaginatedResult<ILeadDocument>> => {
  const filter = buildFilter(query, actor);
  const sort = buildSort(query.sort);
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    LeadModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email role')
      .lean<ILeadDocument[]>()
      .exec(),
    LeadModel.countDocuments(filter),
  ]);

  return { items, meta: buildMeta(page, limit, totalItems) };
};

export const listLeadsForExport = async (
  query: LeadQuery,
  actor: ActorContext
): Promise<ILeadDocument[]> => {
  const filter = buildFilter(query, actor);
  const sort = buildSort(query.sort);
  return LeadModel.find(filter).sort(sort).lean<ILeadDocument[]>().exec();
};

const ensureOwnerOrAdmin = (
  lead: ILeadDocument,
  actor: ActorContext
): void => {
  if (actor.role === 'admin') return;
  if (lead.owner.toString() !== actor.userId) {
    throw ApiError.forbidden('You do not have access to this lead');
  }
};

const ensureId = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid lead id');
  }
};

export const getLead = async (
  id: string,
  actor: ActorContext
): Promise<ILeadDocument> => {
  ensureId(id);
  const lead = await LeadModel.findById(id).populate('owner', 'name email role');
  if (!lead) throw ApiError.notFound('Lead not found');
  ensureOwnerOrAdmin(lead, actor);
  return lead;
};

export const createLead = async (
  input: CreateLeadInput,
  actor: ActorContext
): Promise<ILeadDocument> => {
  const lead = await LeadModel.create({
    ...input,
    status: input.status ?? 'New',
    owner: new Types.ObjectId(actor.userId),
  });
  return lead;
};

export const updateLead = async (
  id: string,
  input: UpdateLeadInput,
  actor: ActorContext
): Promise<ILeadDocument> => {
  ensureId(id);
  const lead = await LeadModel.findById(id);
  if (!lead) throw ApiError.notFound('Lead not found');
  ensureOwnerOrAdmin(lead, actor);

  Object.assign(lead, input);
  await lead.save();
  return lead;
};

export const deleteLead = async (
  id: string,
  actor: ActorContext
): Promise<void> => {
  ensureId(id);
  const lead = await LeadModel.findById(id);
  if (!lead) throw ApiError.notFound('Lead not found');
  ensureOwnerOrAdmin(lead, actor);
  await lead.deleteOne();
};

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

export const getStats = async (actor: ActorContext): Promise<LeadStats> => {
  const baseFilter = buildFilter({}, actor);

  const [total, byStatusAgg, bySourceAgg] = await Promise.all([
    LeadModel.countDocuments(baseFilter),
    LeadModel.aggregate<{ _id: string; count: number }>([
      { $match: baseFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    LeadModel.aggregate<{ _id: string; count: number }>([
      { $match: baseFilter },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]),
  ]);

  const reduceToMap = (rows: { _id: string; count: number }[]) =>
    rows.reduce<Record<string, number>>((acc, row) => {
      acc[row._id] = row.count;
      return acc;
    }, {});

  return {
    total,
    byStatus: reduceToMap(byStatusAgg),
    bySource: reduceToMap(bySourceAgg),
  };
};
