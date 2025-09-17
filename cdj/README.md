# CDJ Auto Supply - Inventory Management System

<p align="center">
  <img alt="CDJ Auto Supply Logo" src="/public/images/cdj-logo.png" width="200">
  <h1 align="center">CDJ Auto Supply</h1>
</p>

<p align="center">
  <strong>Complete Inventory & Sales Management System</strong>
</p>

<p align="center">
  <a href="#overview"><strong>Overview</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#progress"><strong>Progress</strong></a> ·
  <a href="#next-steps"><strong>Next Steps</strong></a>
</p>
<br/>

## Overview

CDJ Auto Supply is a comprehensive inventory and sales management system built with modern web technologies. It provides a complete solution for managing automotive parts inventory, processing sales, and tracking transactions.

## Features

### ✅ **Authentication & Security**
- **Secure Admin Authentication** with Supabase Auth
- **Row Level Security (RLS)** policies for data protection
- **Role-based access control** for admin users
- **Session management** with secure cookies

### ✅ **Inventory Management**
- **Complete CRUD operations** for inventory items
- **Advanced search and filtering** by name, category, status
- **Real-time inventory tracking** with quantity management
- **Category-based organization** (8 automotive categories)
- **Status management** (Available, Low Stock, Not Available)
- **Price and quantity tracking** with PHP currency formatting

### ✅ **User Interface**
- **Modern, responsive design** with Tailwind CSS
- **Interactive data tables** with pagination
- **Modal dialogs** for forms and actions
- **Real-time search** with debounced input
- **Loading states** and error handling
- **Mobile-friendly** responsive layout

### ✅ **Database & API**
- **PostgreSQL database** with Supabase
- **RESTful API routes** for all operations
- **Data validation** with Zod schemas
- **Efficient database queries** with proper indexing
- **Type-safe** TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CDJApp/cdj
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `cdj` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the database setup scripts (see Database Schema section)
   - Configure RLS policies

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Progress

### ✅ **Phase 1: Project Setup** (Completed)
- Next.js 15 with TypeScript configuration
- Tailwind CSS and shadcn/ui setup
- Basic project structure and routing

### ✅ **Phase 2: Authentication System** (Completed)
- Supabase authentication integration
- Login/logout functionality
- Admin user management
- Session handling with middleware

### ✅ **Phase 3: Database Design** (Completed)
- PostgreSQL database schema design
- Tables: `admin_users`, `items`, `sales`, `sale_items`, `stock_movements`
- Proper relationships and constraints
- ENUM types for status and categories

### ✅ **Phase 4: API Development** (Completed)
- RESTful API routes for all entities
- CRUD operations for items, sales, stock movements
- Data validation with Zod schemas
- Error handling and response formatting

### ✅ **Phase 5: Security Implementation** (Completed)
- Row Level Security (RLS) policies
- Database functions for admin checks
- Secure authentication flow
- Input validation and sanitization

### ✅ **Phase 6: Database Implementation** (Completed)
- Database tables creation
- RLS policies implementation
- Database indexes for performance
- API routes for all CRUD operations

### ✅ **Phase 7: Inventory Management UI** (Completed)
- ✅ Inventory list page with table view
- ✅ Search and filtering functionality
- ✅ Add new item form with validation
- ✅ Edit item functionality with pre-populated data
- ✅ Delete item functionality with confirmation
- ✅ Real-time search with debounced input
- ✅ Pagination for large datasets
- ✅ Status badges and currency formatting
- ✅ Responsive design for all screen sizes

### 📋 **Phase 8: Sales Management UI** (Pending)
- Sales transaction interface
- Customer management
- Receipt generation
- Sales reporting

### 📋 **Phase 9: Dashboard & Analytics** (Pending)
- Overview dashboard with statistics
- Inventory analytics
- Sales reports and charts
- Low stock alerts

### 📋 **Phase 10: Advanced Features** (Pending)
- Stock movement tracking
- Barcode scanning
- Print functionality
- Data export/import

## Database Schema

### Tables
- **`admin_users`** - Admin user accounts
- **`items`** - Inventory items with categories and pricing
- **`sales`** - Sales transactions
- **`sale_items`** - Individual items in sales
- **`stock_movements`** - Inventory movement tracking

### Key Features
- **8 Automotive Categories**: Engine & Drivetrain, Suspension & Brakes, Electrical, etc.
- **3 Item Statuses**: Available, Low Stock, Not Available
- **3 Movement Types**: Issue, Receive, Adjust
- **Row Level Security**: Admin-only access to all data
- **Proper Indexing**: Optimized for performance

## Next Steps

### Immediate (Phase 7 Completion)
1. **Complete Edit Item Functionality**
   - Edit item form with pre-populated data
   - Update item API integration
   - Form validation and error handling

2. **Add View Item Details**
   - Detailed item information modal
   - Stock movement history
   - Related sales information

3. **Implement Bulk Operations**
   - Bulk delete items
   - Bulk status updates
   - Bulk category changes

### Short Term (Phase 8-9)
1. **Sales Management Interface**
2. **Dashboard with Analytics**
3. **Reporting and Charts**

### Long Term (Phase 10)
1. **Advanced Features**
2. **Mobile App Integration**
3. **Multi-location Support**

## Version History

- **v0.4.0** - Complete inventory management UI with CRUD operations
- **v0.3.1** - Authentication and RLS issues resolved
- **v0.3.0** - Complete backend foundation with RLS policies and API routes
- **v0.2.1** - Database tables created and basic structure
- **v0.1.0** - Initial project setup and authentication

## Contributing

This is a private project for CDJ Auto Supply. For questions or issues, please contact the development team.

## License

Private - CDJ Auto Supply © 2024
