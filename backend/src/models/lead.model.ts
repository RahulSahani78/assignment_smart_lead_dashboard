import { Schema, model, Document } from 'mongoose';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadSource,
  type LeadStatus,
} from '../types';

export interface ILead {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    company: {
      type: String,
      trim: true,
      default: '',
    },

    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
      index: true,
    },

    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: 'Website',
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text' });

leadSchema.index({ createdAt: -1 });

leadSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;

    return ret;
  },
});

export const LeadModel = model<ILeadDocument>(
  'Lead',
  leadSchema
);