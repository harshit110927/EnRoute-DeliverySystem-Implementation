# Replit.md - E-commerce Application

## Overview

This is a full-stack e-commerce application built with React, Express.js, and TypeScript. The application mimics a Walmart-style shopping experience with product browsing, cart management, and order processing capabilities. It features a modern UI built with shadcn/ui components and uses PostgreSQL with Drizzle ORM for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom Walmart brand colors
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **API Design**: RESTful API endpoints for products and orders
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Database Schema
- **Products Table**: Stores product information including name, description, price, category, image URL, and stock status
- **Orders Table**: Stores order details including customer information, shipping address, items (JSON), and order status
- **Schema Types**: Generated with drizzle-zod for type safety

### API Endpoints
- `GET /api/products` - Retrieve all products
- `GET /api/products/category/:category` - Filter products by category
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/:id` - Get single product details
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/number/:orderNumber` - Get order by order number

### Frontend Components
- **Header**: Navigation with search, categories, and cart toggle
- **ProductGrid**: Product listing with sorting and filtering
- **CartSidebar**: Shopping cart with item management
- **CheckoutModal**: Order form with customer details and payment
- **OrderConfirmation**: Success page with order details

### State Management
- **Cart Context**: Global cart state with add/remove/update functionality
- **React Query**: Caching and synchronization for product data
- **Local State**: Form handling and UI state management

## Data Flow

1. **Product Browsing**: Users browse products fetched from the backend API
2. **Cart Management**: Items are added to cart context and persisted in memory
3. **Search/Filter**: Real-time filtering through API endpoints
4. **Checkout Process**: Form submission creates order in database
5. **Order Confirmation**: Success state with order tracking number

## External Dependencies

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data and Backend
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL provider
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast bundling for production
- **Replit Integration**: Development environment plugins

## Deployment Strategy

### Development
- Uses Vite dev server with hot reload
- Integrates with Replit development environment
- Database migrations handled by Drizzle Kit

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle pushes schema changes to production database

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup