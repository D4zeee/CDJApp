import { NextRequest, NextResponse } from 'next/server';
import { getItemById, updateItem, deleteItem } from '@/lib/supabase/database-helpers';
import { updateItemSchema } from '@/lib/schemas';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get item by ID
    const item = await getItemById(params.id);

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error(`Error in GET /api/items/${params.id}:`, error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const validatedData = updateItemSchema.parse({ id: params.id, ...body });

    // Update item
    const item = await updateItem(params.id, validatedData);

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error(`Error in PUT /api/items/${params.id}:`, error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete item
    await deleteItem(params.id);

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error(`Error in DELETE /api/items/${params.id}:`, error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
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
