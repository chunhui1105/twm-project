# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (React Query, Wouter, Tailwind CSS, Framer Motion)

## Application: AutoGear Car Accessories Shop

A full e-commerce shop for car accessories (roof boxes, fog lamps, wipers, air fresheners, seat covers, dash cams, car care). Built with dark Navy/Amber theme, Space Grotesk fonts.

### Pages
- `/` — Home: hero, featured products, category grid
- `/shop` — Full product catalog with filters (category, price, search)
- `/shop/:id` — Product detail with reviews and add-to-cart
- `/cart` — Shopping cart management
- `/checkout` — Checkout form + order confirmation
- `/admin` — Admin dashboard with product stats
- `/admin/products/new` — Add new product
- `/admin/products/:id/edit` — Edit product
- `/admin/orders` — All orders with status management

### Data Models
- **Categories**: id, name, slug, description, imageUrl, productCount
- **Products**: id, name, slug, description, price, compareAtPrice, imageUrl, imageUrls[], categoryId, brand, sku, stock, featured, rating, reviewCount, tags[], createdAt
- **Reviews**: id, productId, reviewerName, rating, title, comment, createdAt
- **CartItems**: id, sessionId, productId, quantity (session-based, no auth)
- **Orders**: id, customerName, customerEmail, customerPhone, shippingAddress, items (JSONB), total, status, createdAt

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── car-accessories-shop/ # React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seeder
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema (lib/db/src/schema/)
- `categories.ts` — categories table
- `products.ts` — products table (with array columns: imageUrls, tags)
- `reviews.ts` — product reviews
- `cart.ts` — cart_items table (session-based)
- `orders.ts` — orders with JSONB items array

## API Routes (artifacts/api-server/src/routes/)
- `health.ts` — GET /healthz
- `categories.ts` — GET /categories
- `products.ts` — CRUD /products, /products/featured, /products/stats, /products/:id/reviews
- `cart.ts` — GET/POST /cart, PATCH/DELETE /cart/:sessionId/items/:productId
- `orders.ts` — GET/POST /orders, GET/PATCH /orders/:id

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/scripts run seed` — seed the database with sample products

## Seeding

```bash
pnpm --filter @workspace/scripts run seed
```

Seeds 7 categories and 16 products with realistic data and sample reviews.
