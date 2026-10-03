# 🌿 Pure Veda E-Commerce

> **Sacred Ayurvedic Wellness & Botanical Apothecary**  
> A production-grade, full-stack e-commerce web application built with **React 18+ (Vite + TypeScript)**, **Tailwind CSS**, **Lucide React**, **Zustand**, and an **Express / TypeScript backend** connected to **MySQL** with automatic in-memory fallback.

---

## 🌟 Key Highlights & Architectural Features

- **Monorepo Architecture**: Clean separation of concerns with `/client` (Vite + React) and `/server` (Express + TypeScript).
- **Graceful Fallback Mode**: If MySQL credentials are not configured or if the database is offline, the backend seamlessly activates an **In-Memory Mock Store**, ensuring that catalog browsing, filtering, real-time stock updates, and order checkout work immediately out of the box with zero runtime errors.
- **State Management**: Zustand store with `persist` middleware (saving cart state to `localStorage`), real-time item count badges, subtotal, tax calculation (8%), and dynamic free-shipping progress indicator ($50 threshold).
- **Responsive Mobile-First UI/UX**:
  - **Mobile (< 640px)**: 1-column product cards, thumb-friendly 48px "Add to Bag" triggers, slide-over cart drawer, collapsible hamburger menu drawer, and mobile search bar.
  - **Tablet (640px - 1024px)**: 2 to 3-column product grid with sticky horizontal category filter pills.
  - **Desktop (> 1024px)**: 4-column catalog grid, sticky facet filter sidebar (category selector, price range slider $10–$100, sorting selector, reset filters), quick-view modal, and slide-over cart sheet.
- **Design Tokens**: Earthy luxury Ayurvedic color palette (`#315e3d` forest emerald, `#d97706` amber gold, warm stone neutrals), Google Fonts (`Playfair Display` + `Plus Jakarta Sans`), smooth micro-interactions, and zero layout shift (CLS).
- **Checkout Accordion Flow**:
  1. Contact & Shipping Address validation
  2. Mock Payment Method selection (Credit Card, Instant UPI, Cash on Delivery)
  3. Order Review & Total Breakdown
  4. Real-time API submission to `POST /api/orders`
  5. Interactive Order Confirmation screen with generated receipt ID and purchased item summary.
- **Dedicated Staff Admin Portal**:
  - **URL / Direct Access**: Available at `http://localhost:3000/#admin` or by clicking **"Admin"** in the top navigation or footer.
  - **Passcode**: Defaults to `admin123` (or click *Instant Demo Unlock*).
  - **Live Inventory Manager**: Real-time stock stepper, price adjustment, and formulation deletion.
  - **Order Management & Dispatch**: View buyer shipping address, purchased items, and change order status (`paid` -> `shipped`).
  - **Financial & Operational Analytics**: Total gross revenue, order volume, catalog size, and low-stock alerts (≤12 units).
  - **Add Formulation Modal**: Add custom remedies with category, image URL, and stock directly into the database.

---

## 📁 Project Structure

```
Pure Veda E-commerce/
├── package.json               # Monorepo scripts (dev, dev:server, dev:client, seed)
├── scripts/
│   └── dev.ts                 # Concurrent dev runner for server & client
├── server/                    # Node.js + Express + TypeScript Backend
│   ├── .env                   # Database and port configuration
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── db.ts              # MySQL connection pool with In-Memory fallback
│       ├── mockData.ts        # Seed data (12 products across 4 categories)
│       ├── schema.sql         # Relational MySQL DDL schema
│       ├── seed.ts            # Database migration and seeder script
│       └── server.ts          # REST API endpoints (/api/categories, /api/products, /api/orders)
└── client/                    # Vite + React + TypeScript + Tailwind CSS Frontend
    ├── index.html             # SEO meta tags, Google Fonts (Playfair Display & Plus Jakarta)
    ├── vite.config.ts         # Port 3000 & /api reverse proxy to port 5000
    ├── tailwind.config.js     # Custom Ayurvedic brand color tokens & shadows
    ├── src/
        ├── types.ts           # Product, Category, CartItem, Order interfaces
        ├── store/
        │   └── useCartStore.ts# Zustand store with persistence & checkout state
        ├── services/
        │   └── api.ts         # Fetch API client
        ├── components/
        │   ├── Navbar.tsx     # Header, search bar, announcement, live bag badge
        │   ├── HeroBanner.tsx # Brand storytelling & trust credentials
        │   ├── CategoryPills.tsx # Mobile/tablet horizontal scroll pills
        │   ├── FilterSidebar.tsx # Desktop sticky facet filter sidebar
        │   ├── ProductCard.tsx# Responsive card with 48px touch CTA & quick view
        │   ├── ProductDetailModal.tsx # Quick view & detail inspector
        │   ├── CartDrawer.tsx # Slide-over bag sheet with free shipping bar
        │   ├── CheckoutModal.tsx # Accordion checkout & confirmation receipt
        │   └── Footer.tsx     # Certifications, newsletter & links
        └── App.tsx            # Main catalog orchestrator
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **MySQL**: (Optional, as the app includes built-in fallback mode)

### 2. Installation
Run the following from the root directory:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup (Optional)
If you have a local MySQL server:
1. Ensure MySQL is running on port 3306.
2. Edit `server/.env` with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=pure_veda_db
   DB_PORT=3306
   ```
3. Run the seeder to create tables and populate 12 authentic products:
   ```bash
   npm run seed
   ```
> **Note**: If MySQL is not running or credentials are empty, the backend automatically runs in **In-Memory Fallback Mode** with complete functionality (products, categories, stock tracking, and orders).

### 4. Running the Development Servers
From the root directory, run:
```bash
npm run dev
```
Or start each service independently:
- **Backend API**: `npm run dev:server` (running on `http://localhost:5000`)
- **Frontend App**: `npm run dev:client` (running on `http://localhost:3000`)

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & database connection status (`mysql-connected` or `in-memory-fallback`) |
| `GET` | `/api/categories` | Retrieve all product categories |
| `GET` | `/api/products` | Retrieve products with optional query filters: `category`, `search`, `sort`, `minPrice`, `maxPrice` |
| `GET` | `/api/products/:identifier` | Retrieve single product details by numeric ID or slug |
| `POST` | `/api/orders` | Place a new order with payload `{ customer_name, customer_email, shipping_address, items }` |
| `GET` | `/api/orders/:id` | Retrieve order receipt and line items by Order ID |

---

## 🧪 Verified User Journeys
1. **Catalog Browsing & Search**: Search for products like `"shilajit"`, `"ashwagandha"`, or `"oil"`.
2. **Category Filtering**: Filter across Herbal Supplements, Botanical Skincare, Restorative Elixirs & Teas, and Aromatherapy.
3. **Quick-View Modal**: Inspect formulations, review ratings, adjust quantities, and verify real-time stock levels.
4. **Slide-over Cart**: Real-time quantity steppers, item removal, dynamic tax calculation, and free shipping progress meter.
5. **Checkout & Order Placement**: Multi-step checkout accordion with customer details, mock payment selection, order persistence, and confirmation receipt.
