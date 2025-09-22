import { NextRequest, NextResponse } from 'next/server';
import { getItems, createItem } from '@/lib/supabase/database-helpers';
import { createItemSchema, itemFiltersSchema } from '@/lib/schemas';
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
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Validate filters
    const validatedFilters = itemFiltersSchema.parse(filters);

    // Get items
    const result = await getItems(validatedFilters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in GET /api/items:', error);
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
    const validatedData = createItemSchema.parse(body);

    // Create item
    const item = await createItem(validatedData);

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/items:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
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
