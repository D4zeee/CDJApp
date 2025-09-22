"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from '@/components/logout-button';
import { 
  Settings,
  LayoutDashboard,
  Package, 
  User,
  ShoppingCart,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  RefreshCw,
  ChevronDown,
  Bell,
  Eye
} from 'lucide-react';
import { Item, ItemType } from '@/lib/types';
import { createItemSchema, type CreateItemInput } from '@/lib/schemas';

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<CreateItemInput>({
    name: '',
    description: '',
    quantity: 0,
    amount: 0,
    type: 'Engine & Drivetrain Parts'
  });

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
      });

      const response = await fetch(`/api/items?${params}`);
      const result = await response.json();

      if (result.success) {
        setItems(result.data.items || []);
        setTotalPages(Math.ceil((result.data.total || 0) / 20));
      } else {
        setError(result.error || 'Failed to fetch items');
      }
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, typeFilter]);

  // Load items on component mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchItems();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchItems]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = createItemSchema.parse(formData);
      
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          quantity: 0,
          amount: 0,
          type: 'Engine & Drivetrain Parts'
        });
        fetchItems();
      } else {
        setError(result.error || 'Failed to create item');
      }
    } catch (err) {
      setError('Invalid form data');
      console.error('Error creating item:', err);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const validatedData = createItemSchema.parse(formData);
      
      const response = await fetch(`/api/items/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        setFormData({
          name: '',
          description: '',
          quantity: 0,
          amount: 0,
          type: 'Engine & Drivetrain Parts'
        });
        fetchItems();
      } else {
        setError(result.error || 'Failed to update item');
      }
    } catch (err) {
      setError('Invalid form data');
      console.error('Error updating item:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      amount: item.amount,
      type: item.type
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete item
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchItems();
      } else {
        setError(result.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#FCFCFC] via-[#FFFFFF] to-[#F8F9FA] flex overflow-hidden">
      {/* Enhanced Sidebar */}
      <aside className="w-64 lg:w-72 bg-gradient-to-br from-[#2c2c2c] via-[#323232] to-[#1a1a1a] flex flex-col shadow-2xl border-r border-[#919191]/20 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"></div>
        {/* Logo Section */}
        <div className="px-4 lg:px-6 py-7 lg:py-9 border-b border-[#919191]/30 relative z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFFFFF] to-[#F0F0F0] rounded-xl p-2 shadow-xl flex-shrink-0 ring-2 ring-white/20">
              <Image src="/images/cdj-logo.png" alt="CDJ Auto Supply" width={32} height={32} className="object-contain" />
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
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] rounded-xl p-3 h-auto group backdrop-blur-sm border border-transparent">
                <LayoutDashboard className="h-4 w-4 lg:h-5 lg:w-5 mr-3 flex-shrink-0 opacity-80 drop-shadow-sm" />
                <span className="font-semibold text-sm lg:text-base truncate tracking-wide">Dashboard</span>
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-[#FFFFFF] bg-gradient-to-r from-[#000000]/30 to-[#000000]/20 rounded-xl p-3 h-auto group shadow-lg backdrop-blur-sm border border-white/15 ring-2 ring-white/10">
              <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-3 flex-shrink-0 drop-shadow-lg" />
              <span className="font-semibold text-sm lg:text-base truncate drop-shadow-lg tracking-wide">Inventory</span>
            </Button>
            <Link href="/sales" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] rounded-xl p-3 h-auto group backdrop-blur-sm border border-transparent">
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-3 flex-shrink-0 opacity-80 drop-shadow-sm" />
                <span className="font-semibold text-sm lg:text-base truncate tracking-wide">Sales</span>
              </Button>
            </Link>
            <Link href="/transactions" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] rounded-xl p-3 h-auto group backdrop-blur-sm border border-transparent">
                <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5 mr-3 flex-shrink-0 opacity-80 drop-shadow-sm" />
                <span className="font-semibold text-sm lg:text-base truncate tracking-wide">Transaction</span>
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="ghost" className="w-full justify-start text-[#B0B0B0] rounded-xl p-3 h-auto group backdrop-blur-sm border border-transparent">
                <Settings className="h-4 w-4 lg:h-5 lg:w-5 mr-3 flex-shrink-0 opacity-80 drop-shadow-sm" />
                <span className="font-semibold text-sm lg:text-base truncate tracking-wide">Settings</span>
              </Button>
            </Link>
          </div>
        </nav>
        
        {/* User Profile Section */}
        <div className="p-3 lg:p-4 border-t border-[#919191]/30 flex-shrink-0 relative z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#B0B0B0] via-[#919191] to-[#323232] rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/20 shadow-lg">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFFFFF] drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#FFFFFF] font-medium truncate text-sm lg:text-base drop-shadow-sm">Admin</p>
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
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#323232] tracking-tight">Inventory</h1>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1 text-xs">Live</Badge>
              </div>
              <p className="text-[#919191] text-sm lg:text-base">Manage your inventory items • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button className="bg-gradient-to-r from-[#323232] to-[#1a1a1a] text-[#FFFFFF] px-4 rounded-xl font-medium shadow-lg text-sm h-12 w-12 relative">
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
          <div className="h-full flex flex-col">
            {/* Main Content Card */}
            <div className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-2xl border border-[#E5E5E5] flex-1 flex flex-col overflow-hidden relative backdrop-blur-sm">
              {/* Header Section */}
              <div className="p-6 border-b border-[#919191]/20 bg-gradient-to-r from-[#F8F9FA] to-[#F5F5F5]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-semibold text-[#323232]">Category:</label>
                      <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ItemType | 'all')}>
                        <SelectTrigger className="w-56 bg-gradient-to-r from-[#F8F9FA] to-[#F5F5F5] border-2 border-[#E5E5E5] rounded-xl shadow-lg focus:ring-2 focus:ring-[#323232]/20 focus:border-[#323232]/30">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Engine & Drivetrain Parts">Engine & Drivetrain Parts</SelectItem>
                          <SelectItem value="Suspension, Steering & Brakes">Suspension, Steering & Brakes</SelectItem>
                          <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                          <SelectItem value="Wheels, Tires & Accessories">Wheels, Tires & Accessories</SelectItem>
                          <SelectItem value="Body & Exterior">Body & Exterior</SelectItem>
                          <SelectItem value="Interior Parts">Interior Parts</SelectItem>
                          <SelectItem value="Fluids, Filters & Maintenance">Fluids, Filters & Maintenance</SelectItem>
                          <SelectItem value="Tools & Accessories">Tools & Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="text-[#323232] border-2 border-[#E5E5E5] bg-white rounded-xl font-medium px-4 py-2">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={fetchItems}
                      variant="outline" 
                      className="text-[#323232] border-2 border-[#E5E5E5] bg-white rounded-xl font-medium px-4 py-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-[#323232] to-[#1a1a1a] text-[#FFFFFF] px-6 py-2 rounded-xl font-semibold shadow-lg border-2 border-[#323232]">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>


                {/* Search and Filter Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#919191] h-4 w-4" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#F8F9FA] border-[#E5E5E5] rounded-xl shadow-sm focus:ring-2 focus:ring-[#323232]/20"
                    />
                  </div>
                  <Button variant="outline" className="text-[#323232] border-2 border-[#E5E5E5] bg-white rounded-xl font-medium px-4 py-2">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="ghost" className="text-[#919191] rounded-xl shadow-sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Table Section */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#323232] to-[#1a1a1a] rounded-xl flex items-center justify-center animate-pulse">
                        <RefreshCw className="h-6 w-6 text-white animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#323232] font-semibold">Loading items...</p>
                        <p className="text-[#919191] text-sm">Please wait while we fetch your inventory</p>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <p className="text-red-600 mb-2 font-semibold">Error: {error}</p>
                      <Button onClick={fetchItems} variant="ghost" className="text-[#919191] rounded-xl shadow-sm">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#F8F9FA] to-[#E5E5E5] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-[#919191]" />
                      </div>
                      <p className="text-[#323232] text-xl font-bold mb-2">No items found</p>
                      <p className="text-[#919191] text-sm">Try adjusting your search or filters to find what you're looking for</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-2xl border border-[#E5E5E5] relative overflow-hidden backdrop-blur-sm flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/15 pointer-events-none"></div>
                    
                    {/* Fixed Table Header */}
                    <div className="relative z-10 bg-gradient-to-r from-[#F8F9FA] to-[#F5F5F5] border-b border-[#919191]/20">
                      <div className="overflow-x-auto">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12 py-4 px-6"></TableHead>
                              <TableHead className="text-[#919191] font-semibold py-4 px-6 text-sm uppercase tracking-wide">Name</TableHead>
                              <TableHead className="text-[#919191] font-semibold py-4 px-6 text-sm uppercase tracking-wide">Category</TableHead>
                              <TableHead className="text-[#919191] font-semibold py-4 px-6 text-sm uppercase tracking-wide">Quantity</TableHead>
                              <TableHead className="text-[#919191] font-semibold py-4 px-6 text-sm uppercase tracking-wide">Status</TableHead>
                              <TableHead className="text-[#919191] font-semibold py-4 px-6 text-sm uppercase tracking-wide">Amount</TableHead>
                              <TableHead className="w-20 py-4 px-6 text-[#919191] font-semibold text-sm uppercase tracking-wide">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                      </div>
                    </div>

                    {/* Scrollable Table Body */}
                    <div className="flex-1 overflow-y-auto overflow-x-auto">
                      <div className="relative z-10">
                        <Table className="w-full">
                          <TableBody>
                            {items.map((item, index) => (
                              <TableRow 
                                key={item.id} 
                                className="border-b border-[#919191]/10"
                              >
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-[#323232] bg-white border-2 border-[#D1D5DB] rounded-md focus:ring-2 focus:ring-[#323232]/30 focus:ring-offset-0 focus:border-[#323232]" 
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#919191] to-[#323232] rounded-lg shadow-sm flex-shrink-0"></div>
                                    <div>
                                      <p className="font-semibold text-[#323232]">{item.name}</p>
                                      {item.description && (
                                        <p className="text-sm text-[#919191] truncate max-w-xs mt-1">{item.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-full font-medium">
                                    {item.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <span className="font-semibold text-[#323232] text-lg">{item.quantity}</span>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <div className="flex justify-center">
                                    <Badge className={`px-3 py-1 rounded-full font-medium ${
                                      item.status === 'Available' ? 'bg-green-100 text-green-800 border-green-200' : 
                                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
                                    }`}>
                                      {item.status}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <span className="font-bold text-[#323232] font-mono">{formatCurrency(item.amount)}</span>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleEdit(item)}
                                      className="text-[#323232] border border-[#E5E5E5] bg-white p-2 rounded-lg shadow-sm"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleDelete(item.id)}
                                      className="text-red-600 border border-red-200 bg-white p-2 rounded-lg shadow-sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Fixed Bottom Space */}
                    <div className="h-8 bg-gradient-to-r from-[#F8F9FA] to-[#F5F5F5] border-t border-[#919191]/10"></div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-[#919191]/20 bg-gradient-to-r from-[#F8F9FA] to-[#F5F5F5] flex items-center justify-center">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="text-[#323232] border-2 border-[#E5E5E5] bg-white rounded-lg disabled:opacity-50 shadow-md font-medium px-4 py-2"
                      >
                        ← Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="text-[#323232] border-2 border-[#E5E5E5] bg-white rounded-lg disabled:opacity-50 shadow-md font-medium px-4 py-2"
                      >
                        Next →
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#919191] font-medium">Page</span>
                      <div className="bg-[#323232] text-white px-3 py-1 rounded-lg font-semibold text-sm">
                        {currentPage}
                      </div>
                      <span className="text-sm text-[#919191] font-medium">of {totalPages}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-[#323232] font-bold">Add New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Item Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#323232] mb-2 block">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#323232] mb-2 block">Price</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Category</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ItemType })}>
                <SelectTrigger className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine & Drivetrain Parts">Engine & Drivetrain Parts</SelectItem>
                  <SelectItem value="Suspension, Steering & Brakes">Suspension, Steering & Brakes</SelectItem>
                  <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                  <SelectItem value="Wheels, Tires & Accessories">Wheels, Tires & Accessories</SelectItem>
                  <SelectItem value="Body & Exterior">Body & Exterior</SelectItem>
                  <SelectItem value="Interior Parts">Interior Parts</SelectItem>
                  <SelectItem value="Fluids, Filters & Maintenance">Fluids, Filters & Maintenance</SelectItem>
                  <SelectItem value="Tools & Accessories">Tools & Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-[#919191] rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#323232] to-[#1a1a1a] text-[#FFFFFF] rounded-xl font-medium shadow-lg">
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F5] border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-[#323232] font-bold">Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Item Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#323232] mb-2 block">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#323232] mb-2 block">Price</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#323232] mb-2 block">Category</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ItemType })}>
                <SelectTrigger className="bg-[#F8F9FA] border-[#E5E5E5] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine & Drivetrain Parts">Engine & Drivetrain Parts</SelectItem>
                  <SelectItem value="Suspension, Steering & Brakes">Suspension, Steering & Brakes</SelectItem>
                  <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                  <SelectItem value="Wheels, Tires & Accessories">Wheels, Tires & Accessories</SelectItem>
                  <SelectItem value="Body & Exterior">Body & Exterior</SelectItem>
                  <SelectItem value="Interior Parts">Interior Parts</SelectItem>
                  <SelectItem value="Fluids, Filters & Maintenance">Fluids, Filters & Maintenance</SelectItem>
                  <SelectItem value="Tools & Accessories">Tools & Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-[#919191] rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#323232] to-[#1a1a1a] text-[#FFFFFF] rounded-xl font-medium shadow-lg">
                Update Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}