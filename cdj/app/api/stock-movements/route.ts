import { NextRequest, NextResponse } from 'next/server';
import { getStockMovements, createStockMovement } from '@/lib/supabase/database-helpers';
import { createStockMovementSchema } from '@/lib/schemas';
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
    const itemId = searchParams.get('item_id') || undefined;

    // Get stock movements
    const movements = await getStockMovements(itemId);

    return NextResponse.json({
      success: true,
      data: movements,
    });
  } catch (error) {
    console.error('Error in GET /api/stock-movements:', error);
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
    const validatedData = createStockMovementSchema.parse(body);

    // Create stock movement
    const movement = await createStockMovement(validatedData);

    return NextResponse.json({
      success: true,
      data: movement,
      message: 'Stock movement created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/stock-movements:', error);
    
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
