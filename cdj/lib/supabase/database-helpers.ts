// Database helper functions for CDJ Auto Supply
import { createClient } from './server';
import type { 
  Item, 
  Sale, 
  SaleItem, 
  StockMovement, 
  ItemFilters,
  SaleFilters,
  CreateItemInput,
  CreateSaleInput,
  CreateStockMovementInput
} from '../types';

// =====================================================
// ITEM OPERATIONS
// =====================================================

export async function getItems(filters?: ItemFilters) {
  const supabase = await createClient();
  
  let query = supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }

  return {
    items: data as Item[],
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

export async function getItemById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error(`Error fetching item: ${error.message}`);
  }
  
  return data as Item;
}

export async function createItem(itemData: CreateItemInput) {
  const supabase = await createClient();
  
  // Determine status based on quantity
  let status: 'Available' | 'Low Stock' | 'Not Available' = 'Available';
  if (itemData.quantity === 0) {
    status = 'Not Available';
  } else if (itemData.quantity < 10) { // Low stock threshold
    status = 'Low Stock';
  }
  
  const { data, error } = await supabase
    .from('items')
    .insert({
      name: itemData.name,
      description: itemData.description || null,
      quantity: itemData.quantity,
      amount: itemData.amount,
      type: itemData.type,
      status,
      image_url: null, // Will be updated after image upload
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error creating item: ${error.message}`);
  }
  
  return data as Item;
}

export async function updateItem(id: string, itemData: Partial<CreateItemInput>) {
  const supabase = await createClient();
  
  // Update status if quantity is being changed
  const updateData: any = { ...itemData };
  if (itemData.quantity !== undefined) {
    if (itemData.quantity === 0) {
      updateData.status = 'Not Available';
    } else if (itemData.quantity < 10) {
      updateData.status = 'Low Stock';
    } else {
      updateData.status = 'Available';
    }
  }
  
  const { data, error } = await supabase
    .from('items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error updating item: ${error.message}`);
  }
  
  return data as Item;
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw new Error(`Error deleting item: ${error.message}`);
  }
}

// =====================================================
// SALES OPERATIONS
// =====================================================

export async function getSales(filters?: SaleFilters) {
  const supabase = await createClient();
  
  let query = supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        *,
        item:items (*)
      )
    `)
    .order('sold_at', { ascending: false });

  // Apply filters
  if (filters?.customer_name) {
    query = query.ilike('customer_name', `%${filters.customer_name}%`);
  }
  
  if (filters?.date_from) {
    query = query.gte('sold_at', filters.date_from);
  }
  
  if (filters?.date_to) {
    query = query.lte('sold_at', filters.date_to);
  }

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Error fetching sales: ${error.message}`);
  }

  return {
    sales: data,
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

export async function createSale(saleData: CreateSaleInput) {
  const supabase = await createClient();
  
  // Start transaction
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get items and calculate total
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('id, name, amount, quantity')
    .in('id', saleData.items.map(item => item.item_id));
    
  if (itemsError) {
    throw new Error(`Error fetching items: ${itemsError.message}`);
  }

  // Validate stock availability
  for (const saleItem of saleData.items) {
    const item = items.find(i => i.id === saleItem.item_id);
    if (!item) {
      throw new Error(`Item not found: ${saleItem.item_id}`);
    }
    if (item.quantity < saleItem.quantity) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${item.quantity}, Requested: ${saleItem.quantity}`);
    }
  }

  // Calculate total amount
  const totalAmount = saleData.items.reduce((total, saleItem) => {
    const item = items.find(i => i.id === saleItem.item_id);
    return total + (item!.amount * saleItem.quantity);
  }, 0);

  // Create sale record
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      customer_name: saleData.customer_name,
      customer_contact: saleData.customer_contact || null,
      total_amount: totalAmount,
      sold_at: new Date().toISOString(),
      created_by: user.id,
    })
    .select()
    .single();
    
  if (saleError) {
    throw new Error(`Error creating sale: ${saleError.message}`);
  }

  // Create sale items
  const saleItemsData = saleData.items.map(saleItem => {
    const item = items.find(i => i.id === saleItem.item_id);
    return {
      sale_id: sale.id,
      item_id: saleItem.item_id,
      quantity: saleItem.quantity,
      unit_price: item!.amount,
      line_total: item!.amount * saleItem.quantity,
    };
  });

  const { error: saleItemsError } = await supabase
    .from('sale_items')
    .insert(saleItemsData);
    
  if (saleItemsError) {
    throw new Error(`Error creating sale items: ${saleItemsError.message}`);
  }

  // Update item quantities and create stock movements
  for (const saleItem of saleData.items) {
    const item = items.find(i => i.id === saleItem.item_id);
    const newQuantity = item!.quantity - saleItem.quantity;
    
    // Update item quantity
    await supabase
      .from('items')
      .update({ quantity: newQuantity })
      .eq('id', saleItem.item_id);
      
    // Create stock movement
    await supabase
      .from('stock_movements')
      .insert({
        item_id: saleItem.item_id,
        movement_type: 'issue',
        quantity: saleItem.quantity,
        reference_id: sale.id,
        reference_type: 'sale',
        notes: `Sale to ${saleData.customer_name}`,
        created_by: user.id,
      });
  }

  return sale;
}

// =====================================================
// STOCK MOVEMENT OPERATIONS
// =====================================================

export async function getStockMovements(itemId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('stock_movements')
    .select(`
      *,
      item:items (name, type)
    `)
    .order('created_at', { ascending: false });
    
  if (itemId) {
    query = query.eq('item_id', itemId);
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error fetching stock movements: ${error.message}`);
  }

  return data;
}

export async function createStockMovement(movementData: CreateStockMovementInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Create stock movement record
  const { data, error } = await supabase
    .from('stock_movements')
    .insert({
      ...movementData,
      created_by: user.id,
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error creating stock movement: ${error.message}`);
  }

  // Update item quantity based on movement type
  const { data: item } = await supabase
    .from('items')
    .select('quantity')
    .eq('id', movementData.item_id)
    .single();
    
  if (item) {
    let newQuantity = item.quantity;
    
    switch (movementData.movement_type) {
      case 'receive':
        newQuantity += movementData.quantity;
        break;
      case 'issue':
        newQuantity -= movementData.quantity;
        break;
      case 'adjust':
        newQuantity = movementData.quantity; // Direct adjustment
        break;
    }
    
    // Ensure quantity doesn't go negative
    newQuantity = Math.max(0, newQuantity);
    
    // Update item quantity and status
    let status: 'Available' | 'Low Stock' | 'Not Available' = 'Available';
    if (newQuantity === 0) {
      status = 'Not Available';
    } else if (newQuantity < 10) {
      status = 'Low Stock';
    }
    
    await supabase
      .from('items')
      .update({ 
        quantity: newQuantity,
        status 
      })
      .eq('id', movementData.item_id);
  }

  return data;
}

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

export async function getDashboardStats() {
  const supabase = await createClient();
  
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);
  
  // Get sales statistics
  const { data: todaySales } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sold_at', new Date().toISOString().split('T')[0]);
    
  const { data: weekSales } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sold_at', weekStart.toISOString());
    
  const { data: monthSales } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sold_at', monthStart.toISOString());
    
  const { data: yearSales } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sold_at', yearStart.toISOString());

  return {
    today_total: todaySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
    week_total: weekSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
    month_total: monthSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
    year_total: yearSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
  };
}

export async function getLowStockItems() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('items')
    .select('id, name, quantity, status, type')
    .in('status', ['Low Stock', 'Not Available'])
    .order('quantity', { ascending: true });
    
  if (error) {
    throw new Error(`Error fetching low stock items: ${error.message}`);
  }

  return data;
}

export async function getRecentSales(limit: number = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        *,
        item:items (name)
      )
    `)
    .order('sold_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    throw new Error(`Error fetching recent sales: ${error.message}`);
  }

  return data;
}
