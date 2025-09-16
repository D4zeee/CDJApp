import { z } from 'zod';
import type { ItemStatus, ItemType, MovementType } from './types';

// Enum schemas
export const itemStatusSchema = z.enum(['Available', 'Low Stock', 'Not Available']);
export const itemTypeSchema = z.enum([
  'Engine & Drivetrain Parts',
  'Suspension, Steering & Brakes',
  'Electrical & Electronics',
  'Wheels, Tires & Accessories',
  'Body & Exterior',
  'Interior Parts',
  'Fluids, Filters & Maintenance',
  'Tools & Accessories'
]);
export const movementTypeSchema = z.enum(['issue', 'receive', 'adjust']);

// Base schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const itemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  quantity: z.number().int().min(0),
  amount: z.number().min(0),
  image_url: z.string().url().nullable(),
  status: itemStatusSchema,
  type: itemTypeSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const saleSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().min(1).max(255),
  customer_contact: z.string().nullable(),
  total_amount: z.number().min(0),
  sold_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const saleItemSchema = z.object({
  id: z.string().uuid(),
  sale_id: z.string().uuid(),
  item_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
  line_total: z.number().min(0),
  created_at: z.string().datetime(),
});

export const stockMovementSchema = z.object({
  id: z.string().uuid(),
  item_id: z.string().uuid(),
  movement_type: movementTypeSchema,
  quantity: z.number().int().min(1),
  reference_id: z.string().uuid().nullable(),
  reference_type: z.string().nullable(),
  notes: z.string().nullable(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
});

// Form input schemas
export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(255, 'Item name too long'),
  description: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity must be 0 or greater'),
  amount: z.number().min(0, 'Amount must be 0 or greater'),
  type: itemTypeSchema,
  image: z.instanceof(File).optional(),
});

export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string().uuid(),
});

export const createSaleSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required').max(255, 'Customer name too long'),
  customer_contact: z.string().optional(),
  items: z.array(z.object({
    item_id: z.string().uuid(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one item is required'),
});

export const createStockMovementSchema = z.object({
  item_id: z.string().uuid(),
  movement_type: movementTypeSchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  reference_id: z.string().uuid().optional(),
  reference_type: z.string().optional(),
  notes: z.string().optional(),
});

// Filter schemas
export const itemFiltersSchema = z.object({
  search: z.string().optional(),
  type: itemTypeSchema.optional(),
  status: itemStatusSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const saleFiltersSchema = z.object({
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  customer_name: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Dashboard schemas
export const dashboardStatsSchema = z.object({
  today_total: z.number(),
  week_total: z.number(),
  month_total: z.number(),
  year_total: z.number(),
});

// Print schemas
export const receiptDataSchema = z.object({
  sale: saleSchema.extend({
    sale_items: z.array(saleItemSchema.extend({
      item: itemSchema,
    })),
  }),
  printed_at: z.string().datetime(),
});

// Type exports
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
export type ItemFilters = z.infer<typeof itemFiltersSchema>;
export type SaleFilters = z.infer<typeof saleFiltersSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type ReceiptData = z.infer<typeof receiptDataSchema>;
