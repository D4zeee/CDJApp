// Database types based on PostgreSQL schema
export type ItemStatus = 'Available' | 'Low Stock' | 'Not Available';
export type ItemType = 
  | 'Engine & Drivetrain Parts'
  | 'Suspension, Steering & Brakes'
  | 'Electrical & Electronics'
  | 'Wheels, Tires & Accessories'
  | 'Body & Exterior'
  | 'Interior Parts'
  | 'Fluids, Filters & Maintenance'
  | 'Tools & Accessories';

export type MovementType = 'issue' | 'receive' | 'adjust';

// Database entity types
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  amount: number;
  image_url: string | null;
  status: ItemStatus;
  type: ItemType;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  customer_name: string;
  customer_contact: string | null;
  total_amount: number;
  sold_at: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  movement_type: MovementType;
  quantity: number;
  reference_id: string | null;
  reference_type: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

// Extended types with relations
export interface ItemWithDetails extends Item {
  stock_movements?: StockMovement[];
}

export interface SaleWithItems extends Sale {
  sale_items: (SaleItem & { item: Item })[];
}

export interface StockMovementWithItem extends StockMovement {
  item: Item;
}

// Form input types
export interface CreateItemInput {
  name: string;
  description?: string;
  quantity: number;
  amount: number;
  type: ItemType;
  image?: File;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
  id: string;
}

export interface CreateSaleInput {
  customer_name: string;
  customer_contact?: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
}

export interface CreateStockMovementInput {
  item_id: string;
  movement_type: MovementType;
  quantity: number;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
}

// Dashboard data types
export interface DashboardStats {
  today_total: number;
  week_total: number;
  month_total: number;
  year_total: number;
}

export interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
  type: ItemType;
}

export interface RecentStockMovement {
  id: string;
  item_name: string;
  movement_type: MovementType;
  quantity: number;
  notes: string | null;
  created_at: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and filter types
export interface ItemFilters {
  search?: string;
  type?: ItemType;
  status?: ItemStatus;
  page?: number;
  limit?: number;
}

export interface SaleFilters {
  date_from?: string;
  date_to?: string;
  customer_name?: string;
  page?: number;
  limit?: number;
}

// Print types
export interface ReceiptData {
  sale: SaleWithItems;
  printed_at: string;
}

export interface PrintItemsData {
  items: Item[];
  printed_at: string;
  filters?: ItemFilters;
}

export interface PrintSalesData {
  sales: SaleWithItems[];
  printed_at: string;
  filters?: SaleFilters;
}
