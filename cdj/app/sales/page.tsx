import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sales - CDJ Auto Supply',
  description: 'Manage your sales with CDJ Auto Supply',
};
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from '@/components/logout-button';
import { 
  Settings,
  LayoutDashboard,
  Package, 
  BarChart3,
  Bell,
  User,
  ShoppingCart,
  ArrowUpRight
} from 'lucide-react';

export default async function SalesPage() {
  let user;
  try {
    user = await requireAuth();
  } catch (error) {
    console.error('Auth error:', error);
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#323232] mb-4">Authentication Error</h1>
          <p className="text-[#919191]">Unable to authenticate user</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#323232] mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] flex">
      {/* Enhanced Sidebar */}
      <aside className="w-64 lg:w-72 bg-gradient-to-br from-[#2c2c2c] via-[#323232] to-[#1a1a1a] flex flex-col shadow-2xl border-r border-[#919191]/20 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"></div>
        {/* Logo Section */}
        <div className="px-4 lg:px-6 py-7 lg:py-9 border-b border-[#919191]/30 relative z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFFFFF] to-[#F0F0F0] rounded-xl p-2 shadow-xl flex-shrink-0 ring-2 ring-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img src="/images/cdj-logo.png" alt="CDJ Auto Supply" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[#FFFFFF] font-bold text-base lg:text-lg truncate drop-shadow-sm">CDJ Auto Supply</h2>
              <p className="text-[#B0B0B0] text-xs lg:text-sm truncate opacity-90">Inventory & Sales</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto relative z-10">
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <LayoutDashboard className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Dashboard</span>
              </Button>
            </Link>
            <Link href="/inventory" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Inventory</span>
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/60 hover:to-[#000000]/40 bg-gradient-to-r from-[#000000]/30 to-[#000000]/20 rounded-xl p-3 h-auto transition-all duration-300 group shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/15 ring-2 ring-white/10">
              <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 drop-shadow-lg" />
              <span className="font-semibold text-sm lg:text-base truncate drop-shadow-lg tracking-wide">Sales</span>
            </Button>
            <Link href="/transactions" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Transaction</span>
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <Settings className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Settings</span>
              </Button>
            </Link>
          </div>
        </nav>
        
        {/* User Profile Section */}
        <div className="p-3 lg:p-4 border-t border-[#919191]/30 flex-shrink-0 relative z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#B0B0B0] via-[#919191] to-[#323232] rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:ring-white/30">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFFFFF] drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#FFFFFF] font-medium truncate text-sm lg:text-base drop-shadow-sm">{user.username}</p>
              <p className="text-[#B0B0B0] text-xs lg:text-sm truncate opacity-90">Administrator</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-[#FFFFFF] border-b border-[#919191]/10 px-4 lg:px-6 py-4 lg:py-6 shadow-sm backdrop-blur-sm bg-[#FFFFFF]/95 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#323232] tracking-tight">Sales</h1>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1 text-xs">Live</Badge>
              </div>
              <p className="text-[#919191] text-sm lg:text-base">Welcome back, <span className="font-semibold text-[#323232]">{user.username}</span> • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button className="bg-gradient-to-r from-[#323232] to-[#1a1a1a] hover:from-[#1a1a1a] hover:to-[#000000] text-[#FFFFFF] px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm h-12 w-12 relative">
                <Bell className="h-4 w-4" />
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
                  3
                </div>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA]">
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#6B6B6B] to-[#4A4A4A] rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#323232]">Sales Management</h2>
              <p className="text-[#919191] text-lg font-medium">To be developed</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#6B6B6B] to-[#4A4A4A] rounded-full mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
