import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getLowStockItems, getRecentSales } from '@/lib/supabase/database-helpers';
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

    // Get dashboard data in parallel
    const [stats, lowStockItems, recentSales] = await Promise.all([
      getDashboardStats(),
      getLowStockItems(),
      getRecentSales(5), // Get last 5 sales for dashboard
    ]);

    return NextResponse.json({
      success: true,
      data: {
        statistics: stats,
        lowStockItems,
        recentSales,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
