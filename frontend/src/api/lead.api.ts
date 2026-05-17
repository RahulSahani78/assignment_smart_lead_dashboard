import { apiClient } from './axios';
import type {
  ApiSuccess,
  Lead,
  LeadFilters,
  LeadStats,
  PaginationMeta,
} from '../types';

const toParams = (filters: LeadFilters): Record<string, string | number> => {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search && filters.search.trim()) params.search = filters.search.trim();
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  return params;
};

export const fetchLeads = async (
  filters: LeadFilters
): Promise<{ items: Lead[]; pagination: PaginationMeta }> => {
  const { data } = await apiClient.get<ApiSuccess<Lead[]>>('/leads', {
    params: toParams(filters),
  });
  const pagination = (data.meta?.pagination ?? {
    page: 1,
    limit: 10,
    totalItems: data.data.length,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  }) as PaginationMeta;
  return { items: data.data, pagination };
};

export const fetchLead = async (id: string): Promise<Lead> => {
  const { data } = await apiClient.get<ApiSuccess<Lead>>(`/leads/${id}`);
  return data.data;
};

export type CreateLeadPayload = Pick<
  Lead,
  'name' | 'email' | 'status' | 'source'
> & {
  phone?: string;
  company?: string;
  notes?: string;
};

export const createLead = async (payload: CreateLeadPayload): Promise<Lead> => {
  const { data } = await apiClient.post<ApiSuccess<Lead>>('/leads', payload);
  return data.data;
};

export const updateLead = async (
  id: string,
  payload: Partial<CreateLeadPayload>
): Promise<Lead> => {
  const { data } = await apiClient.put<ApiSuccess<Lead>>(`/leads/${id}`, payload);
  return data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await apiClient.delete(`/leads/${id}`);
};

export const fetchStats = async (): Promise<LeadStats> => {
  const { data } = await apiClient.get<ApiSuccess<LeadStats>>('/leads/stats');
  return data.data;
};

export const exportLeadsCsv = async (filters: LeadFilters): Promise<Blob> => {
  const response = await apiClient.get('/leads/export', {
    params: toParams(filters),
    responseType: 'blob',
  });
  return response.data as Blob;
};
