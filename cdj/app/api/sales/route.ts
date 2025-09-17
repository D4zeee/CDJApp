import { NextRequest, NextResponse } from 'next/server';
import { getSales, createSale } from '@/lib/supabase/database-helpers';
import { createSaleSchema, saleFiltersSchema } from '@/lib/schemas';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      customer_name: searchParams.get('customer_name') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Validate filters
    const validatedFilters = saleFiltersSchema.parse(filters);

    // Get sales
    const result = await getSales(validatedFilters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in GET /api/sales:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = createSaleSchema.parse(body);

    // Create sale
    const sale = await createSale(validatedData);

    return NextResponse.json({
      success: true,
      data: sale,
      message: 'Sale created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/sales:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
