import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from '@/components/logout-button';
import { 
  Settings,
  LayoutDashboard,
  Package, 
  BarChart3,
  Bell,
  Plug,
  Search,
  User,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default async function DashboardPage() {
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
          <p className="text-[#919191]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Real data - empty for now since we haven't created records yet
  const totalSales = 0;
  const totalExpenses = 0;
  const recentSales: any[] = [];
  const lowStockItems: any[] = [];

  return (
    <div className="h-screen bg-gradient-to-br from-[#FCFCFC] via-[#FFFFFF] to-[#F8F9FA] flex overflow-hidden">
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
            <Button variant="ghost" className="w-full justify-start text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/60 hover:to-[#000000]/40 bg-gradient-to-r from-[#000000]/30 to-[#000000]/20 rounded-xl p-3 h-auto transition-all duration-300 group shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/15 ring-2 ring-white/10">
              <LayoutDashboard className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 drop-shadow-lg" />
              <span className="font-semibold text-sm lg:text-base truncate drop-shadow-lg tracking-wide">Dashboard</span>
            </Button>
            <Link href="/inventory" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Inventory</span>
              </Button>
            </Link>
            <Link href="/sales" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] hover:text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#000000]/50 hover:to-[#000000]/30 rounded-xl p-3 h-auto transition-all duration-300 group backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-white/15 hover:ring-2 hover:ring-white/10">
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 opacity-80 group-hover:opacity-100 drop-shadow-sm group-hover:drop-shadow-lg" />
                <span className="font-semibold text-sm lg:text-base truncate group-hover:drop-shadow-lg tracking-wide">Sales</span>
              </Button>
            </Link>
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
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#323232] tracking-tight">Dashboard</h1>
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

        {/* Top Row - Sales and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#323232]">Sales</h2>
              <Button variant="ghost" className="text-[#919191] hover:text-[#323232] hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                <Eye className="h-4 w-4 mr-2" />
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Sales Card */}
              <Card className="bg-gradient-to-br from-[#2a2a2a] via-[#323232] to-[#1e1e1e] text-white rounded-2xl p-6 shadow-2xl hover:shadow-black/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 h-[195px] relative overflow-hidden group border border-white/15 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/25 pointer-events-none"></div>
                
                {/* Continuous Rotating Border */}
                <div className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/15 via-transparent to-white/15 animate-spin" style={{animationDuration: '12s'}}></div>
                </div>
                
                {/* Breathing Pulse Effect */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-2 rounded-xl bg-white/5 animate-pulse" style={{animationDuration: '3s'}}></div>
                </div>
                
                {/* Continuously Moving Geometric Patterns */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-6 h-6 border border-white/15 animate-spin" style={{animationDuration: '6s'}}></div>
                  <div className="absolute top-8 right-12 w-3 h-3 border border-white/12 animate-spin" style={{animationDelay: '1s', animationDuration: '4s', animationDirection: 'reverse'}}></div>
                  <div className="absolute bottom-8 left-6 w-5 h-5 border border-white/20 animate-spin" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
                  <div className="absolute bottom-12 left-12 w-2 h-2 border border-white/25 animate-spin" style={{animationDelay: '0.5s', animationDuration: '5s', animationDirection: 'reverse'}}></div>
                </div>
                
                {/* Orbiting Particles */}
                <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-10 -translate-y-10">
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '10s'}}>
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/40 rounded-full -translate-x-0.5"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                    <div className="absolute bottom-0 right-1/2 w-1.5 h-1.5 bg-white/30 rounded-full translate-x-0.5"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
                    <div className="absolute left-0 top-1/2 w-0.5 h-0.5 bg-white/50 rounded-full -translate-y-0.5"></div>
                  </div>
                </div>
                
                {/* Dynamic Background Elements with Continuous Animation */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/6 to-transparent rounded-full -translate-y-16 translate-x-16 animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{animationDuration: '4s'}}></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-white/4 to-transparent rounded-full animate-pulse group-hover:scale-150 transition-transform duration-1000" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
                
                {/* Floating Elements with Continuous Movement */}
                <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
                <div className="absolute top-12 left-14 w-1 h-1 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2.5s'}}></div>
                <div className="absolute bottom-14 right-14 w-2 h-2 bg-white/15 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
                <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.8s', animationDuration: '2.8s'}}></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold drop-shadow-lg tracking-wide">Total Sales</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-white/25 via-white/20 to-white/15 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:ring-white/35">
                      <DollarSign className="h-5 w-5 drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight drop-shadow-lg">₱ 158,900.00</div>
                  <div className="text-sm text-white/75 drop-shadow-md font-medium">{new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </Card>
              
              {/* Total Expenses Card */}
              <Card className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 shadow-2xl hover:shadow-gray-300/50 border border-[#E5E5E5] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 h-[195px] relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 via-transparent to-orange-50/25 pointer-events-none"></div>
                
                {/* Continuous Rotating Border */}
                <div className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-300/30 via-transparent to-gray-300/30 animate-spin" style={{animationDuration: '15s'}}></div>
                </div>
                
                {/* Breathing Pulse Effect */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-2 rounded-xl bg-gray-200/20 animate-pulse" style={{animationDuration: '4s'}}></div>
                </div>
                
                {/* Continuously Moving Geometric Patterns */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-5 h-5 border border-gray-400/20 animate-spin" style={{animationDuration: '8s'}}></div>
                  <div className="absolute top-8 right-12 w-2.5 h-2.5 border border-gray-400/15 animate-spin" style={{animationDelay: '1s', animationDuration: '6s', animationDirection: 'reverse'}}></div>
                  <div className="absolute bottom-8 left-6 w-4 h-4 border border-gray-400/25 animate-spin" style={{animationDelay: '2s', animationDuration: '10s'}}></div>
                  <div className="absolute bottom-12 left-12 w-1.5 h-1.5 border border-gray-400/30 animate-spin" style={{animationDelay: '0.5s', animationDuration: '7s', animationDirection: 'reverse'}}></div>
                </div>
                
                {/* Orbiting Particles */}
                <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-8 -translate-y-8">
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '12s'}}>
                    <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-gray-400/40 rounded-full -translate-x-0.5"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '18s', animationDirection: 'reverse'}}>
                    <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-gray-400/30 rounded-full translate-x-0.5"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '22s'}}>
                    <div className="absolute left-0 top-1/2 w-0.5 h-0.5 bg-gray-400/50 rounded-full -translate-y-0.5"></div>
                  </div>
                </div>
                
                {/* Dynamic Background Elements with Continuous Animation */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200/15 to-transparent rounded-full -translate-y-16 translate-x-16 animate-pulse group-hover:scale-110 transition-transform duration-700" style={{animationDuration: '5s'}}></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-gray-200/10 to-transparent rounded-full animate-pulse group-hover:scale-125 transition-transform duration-700" style={{animationDuration: '7s', animationDelay: '2.5s'}}></div>
                
                {/* Floating Elements with Continuous Movement */}
                <div className="absolute top-6 left-6 w-1 h-1 bg-gray-400/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3.5s'}}></div>
                <div className="absolute top-12 left-14 w-0.5 h-0.5 bg-gray-400/25 rounded-full animate-bounce" style={{animationDelay: '1.2s', animationDuration: '3s'}}></div>
                <div className="absolute bottom-14 right-14 w-1.5 h-1.5 bg-gray-400/20 rounded-full animate-bounce" style={{animationDelay: '1.8s', animationDuration: '4s'}}></div>
                <div className="absolute bottom-8 right-8 w-1 h-1 bg-gray-400/35 rounded-full animate-bounce" style={{animationDelay: '0.6s', animationDuration: '3.2s'}}></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#2A2A2A] drop-shadow-lg tracking-wide">Total Expenses</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6B6B6B] via-[#5A5A5A] to-[#4A4A4A] rounded-xl flex items-center justify-center shadow-xl ring-2 ring-gray-400/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:ring-gray-400/60">
                      <TrendingDown className="h-5 w-5 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#2A2A2A] tracking-tight drop-shadow-lg">₱ 8,500.00</div>
                  <div className="text-sm text-[#6B6B6B] drop-shadow-md font-medium">{new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#323232]">Statistics</h2>
            </div>
            <Card className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] relative h-[195px] overflow-hidden group backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/25 via-transparent to-indigo-50/15 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/15 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute -bottom-3 -left-3 w-18 h-18 bg-gradient-to-tr from-indigo-100/10 to-transparent rounded-full group-hover:scale-125 transition-transform duration-700"></div>
              <div className="absolute top-4 right-4 z-20">
                <div className="relative group">
                  <select className="appearance-none text-xs border border-[#6B6B6B] rounded-lg px-1.5 py-1.5 pr-5 bg-[#2A2A2A] backdrop-blur-md text-[#FFFFFF] focus:outline-none focus:border-[#4A4A4A] focus:ring-1 focus:ring-gray-400/20 focus:bg-[#323232] transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#4A4A4A] font-medium cursor-pointer group-hover:scale-105 transform">
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>
                  
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-3 h-3 text-[#FFFFFF]/70 group-hover:text-[#FFFFFF] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              <div className="flex flex-col h-full">
                {/* Chart Section */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-28 h-28 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background Circle */}
                      <path
                        className="stroke-[#E5E7EB]"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress Circle - Sales */}
                      <path
                        className="stroke-[#2A2A2A]"
                        strokeWidth="3"
                        strokeDasharray="75, 25"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress Circle - Expenses */}
                      <path
                        className="stroke-[#6B6B6B]"
                        strokeWidth="3"
                        strokeDasharray="15, 85"
                        strokeDashoffset="-75"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-medium text-[#6B7280]">Profit</div>
                        <div className="text-sm font-bold text-[#2A2A2A]">₱150.4K</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend Section */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#2A2A2A] rounded-full"></div>
                      <span className="text-[#6B7280] font-medium">Sales</span>
                    </div>
                    <span className="text-[#2A2A2A] font-semibold">75%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#6B6B6B] rounded-full"></div>
                      <span className="text-[#6B7280] font-medium">Expenses</span>
                    </div>
                    <span className="text-[#2A2A2A] font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#E5E7EB] rounded-full"></div>
                      <span className="text-[#6B7280] font-medium">Remaining</span>
                    </div>
                    <span className="text-[#2A2A2A] font-semibold">10%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Recent Sales and Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Recent Sales Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#323232]">Recent Transactions</h2>
              <Button variant="ghost" className="text-[#919191] hover:text-[#323232] hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                <Eye className="h-4 w-4 mr-2" />
                See all
              </Button>
            </div>
            
             {/* Sales Table */}
             <Card className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] h-[450px] relative overflow-hidden group backdrop-blur-sm">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-teal-50/15 pointer-events-none"></div>
               <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-[#919191] border-b border-[#919191]/20 pb-3 uppercase tracking-wide">
                  <div className="text-center">Item</div>
                  <div className="text-center">Date</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Amount</div>
                </div>
                 
                 {/* Table Rows */}
                 <div className="space-y-3">
                   <div className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                     <div className="flex items-center space-x-3 text-left">
                       <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                       <span className="font-semibold text-[#323232]">Brake Fluid</span>
                     </div>
                     <div className="text-[#919191] font-medium font-mono text-center">11/09/25</div>
                     <div className="flex justify-center">
                       <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full font-medium">Success</Badge>
                     </div>
                     <div className="font-bold text-[#323232] text-center font-mono">₱ 1,500.00</div>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                     <div className="flex items-center space-x-3 text-left">
                       <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                       <span className="font-semibold text-[#323232]">Fuel Filter</span>
                     </div>
                     <div className="text-[#919191] font-medium font-mono text-center">11/08/25</div>
                     <div className="flex justify-center">
                       <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full font-medium">Success</Badge>
                     </div>
                     <div className="font-bold text-[#323232] text-center font-mono">₱ 1,200.00</div>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                     <div className="flex items-center space-x-3 text-left">
                       <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                       <span className="font-semibold text-[#323232]">Air Filter</span>
                     </div>
                     <div className="text-[#919191] font-medium font-mono text-center">11/07/25</div>
                     <div className="flex justify-center">
                       <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1 rounded-full font-medium">Not yet</Badge>
                     </div>
                     <div className="font-bold text-[#323232] text-center font-mono">₱ 3,500.00</div>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                     <div className="flex items-center space-x-3 text-left">
                       <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                       <span className="font-semibold text-[#323232]">Belts</span>
                     </div>
                     <div className="text-[#919191] font-medium font-mono text-center">11/06/25</div>
                     <div className="flex justify-center">
                       <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full font-medium">Success</Badge>
                     </div>
                     <div className="font-bold text-[#323232] text-center font-mono">₱   800.00</div>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-[#FCFCFC] rounded-xl transition-all duration-200">
                     <div className="flex items-center space-x-3 text-left">
                       <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                       <span className="font-semibold text-[#323232]">Oil Filter</span>
                     </div>
                     <div className="text-[#919191] font-medium font-mono text-center">11/05/25</div>
                     <div className="flex justify-center">
                       <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full font-medium">Success</Badge>
                     </div>
                     <div className="font-bold text-[#323232] text-center font-mono">₱ 1,500.00</div>
                   </div>
                 </div>
               </div>
             </Card>
          </div>

           {/* Reminders Section */}
           <div className="lg:col-span-1">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-[#323232]">Reminders</h2>
               <div className="w-[70px]"></div>
             </div>
             <Card className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 shadow-2xl border border-[#E5E5E5] h-[455px] flex items-center justify-center relative overflow-hidden group backdrop-blur-sm">
               <div className="absolute inset-0 bg-gradient-to-br from-violet-50/15 via-transparent to-amber-50/12 pointer-events-none"></div>
               <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-violet-100/8 to-transparent rounded-full -translate-y-14 translate-x-14 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-tr from-amber-100/8 to-transparent rounded-full group-hover:scale-125 transition-transform duration-700"></div>
               <div className="text-center text-[#6B6B6B] relative z-10">
                 <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#F8F8F8] via-[#F0F0F0] to-[#E8E8E8] rounded-xl flex items-center justify-center shadow-xl ring-2 ring-gray-300/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:ring-gray-300/60">
                   <Bell className="h-6 w-6 text-[#6B6B6B] drop-shadow-lg" />
                 </div>
                 <p className="text-sm font-medium drop-shadow-md">No reminders</p>
               </div>
             </Card>
           </div>
        </div>
        </main>
      </div>
    </div>
  );
}
