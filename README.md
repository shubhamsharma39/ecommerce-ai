# 🛍️ Shopify — Full-Stack E-Commerce Web Application

> **Academic Project Submission**: College Mini-Project / Final Year Capstone Project  
> **Application Name**: **Shopify**  
> **Architecture**: Decoupled Client-Server SPA  
> **Tech Stack**: FastAPI (Python 3.10+), MongoDB Atlas (Async Motor Driver), React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, TanStack React Query  

---

## 📌 1. Project Overview & Scope

**Shopify** is a production-grade, responsive e-commerce web platform engineered to provide a realistic, intuitive, and high-performance online shopping experience inspired by modern e-commerce leaders like Flipkart and Shopify.

The application spans the entire customer journey and administrative operations:
- **Comprehensive Product Catalog**: Browsing and real-time filtering across 8 core shopping categories (**Mobiles**, **Electronics**, **Fashion**, **Home & Kitchen**, **Beauty & Personal Care**, **Books & Stationery**, **Sports & Fitness**, and **Accessories**).
- **Interactive Homepage**: Dynamic hero promotional carousel, category grid, trending products, best-selling deals, curated department showcases, value perks ribbon, and newsletter subscription.
- **Advanced Search & Filtering**: Multi-parameter search by keyword and category, price range slider ($0 - $1,500), multiple sort options (Price Low-to-High, High-to-Low, Highest Rated, Product Name A-Z), search result counter, and 1-click filter reset.
- **Product Details & Direct Purchase**: High-resolution gallery showcase, specifications table, stock availability badge, clamped quantity selector (enforcing non-negative and stock limits), **Add to Cart**, and instant **Buy Now** direct-to-checkout flow.
- **Server-Side Shopping Cart**: Real-time quantity adjustments, item removal, promo code discount calculation (15% off with code `SHOPIFY15`), and animated visual progress bar towards **Free Express Shipping** over $50.
- **Realistic Cash on Delivery (COD) Checkout**: Complete Indian shipping address form (Full Name, Phone, Street, City, State, Postal Code), client/server validation, idempotent order placement with duplicate submission prevention, and order confirmation receipt.
- **Order Tracking & Shipment Lifecycle**: Customer order history with unique tracking IDs and visual shipment stepper (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- **Protected Administrator Dashboard**: Overview KPI cards (Total Revenue, Orders, Products, Customers), product inventory management (Add, Edit, Restock, Delete with confirmation), and instant order status dispatch updating.
- **Role-Based Authentication (RBAC)**: Secure registration, login, and token-based protection using `bcrypt` salted password hashing and stateless HS256 JSON Web Tokens (JWT).
- **AI Shopping Assistant**: Floating AI shopping copilot to provide instant assistance to customers.

---

## 🎨 2. Design System & Visual Identity

The design adheres to a clean, production-inspired e-commerce aesthetic:
- **Brand Identity**: Signature Emerald Green (`#008060`) reflecting reliability and trust.
- **Hover & Active Accents**: Deep Forest Green (`#006E52`) and Forest Shadow (`#004C3F`).
- **Backgrounds**: Soft canvas white (`#FFFFFF`) and warm light grey (`#F8F9FA`).
- **Typography**: Google Font **Plus Jakarta Sans** with geometric clarity and high contrast.
- **Badges**: Emerald green for In-Stock and Cash on Delivery, Amber for hot picks, Rose for alerts.

---

## ⚙️ 3. Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       SHOPIFY FRONTEND                      │
│   React 19 + TypeScript + Vite + Tailwind CSS + Redux Query │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND SERVICE                   │
│         Uvicorn ASGI Server • Python 3.10 • Asyncio         │
│  - JWT Bearer Token Security & Bcrypt Hashing               │
│  - Pydantic v2 Schema Validation & Serialization            │
│  - Services: Auth, Products, Cart, Orders, Admin            │
└──────────────────────────────┬──────────────────────────────┘
                               │ Motor (Async MongoDB Driver)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB ATLAS DATABASE                    │
│            Database Name: ecommerce_db                      │
│  Collections: users, products, carts, orders, ai_chat_logs  │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend SPA** | React 19, TypeScript, Vite | Component-driven UI, strong type safety, sub-second HMR development. |
| **State & Data Fetching** | TanStack React Query v5, Redux Toolkit | Server-cache management, optimistic updates, and persistent auth state. |
| **Styling & UI Icons** | Tailwind CSS, Lucide React | Utility styling, responsive mobile layouts, accessible SVG iconography. |
| **Backend Framework** | FastAPI (Python 3.10+), Uvicorn | High-performance asynchronous REST API with automatic OpenAPI Swagger UI. |
| **Authentication & RBAC** | Python-Jose (JWT), Passlib (Bcrypt) | Secure salted password hashing and stateless authorization guards. |
| **Database & ODM** | MongoDB Atlas, Motor (AsyncIOMotorClient) | Asynchronous non-blocking document storage with in-memory fallback. |
| **Validation** | Pydantic v2 | Strict request validation, error reporting, and typed response serialization. |

---

## 📂 4. Project Folder Structure

```
ecommerce project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── admin.py         # Admin product CRUD, order status, analytics metrics
│   │   │   │   ├── ai.py            # AI Shopping copilot assistant
│   │   │   │   ├── auth.py          # Register, login, current user (/me)
│   │   │   │   ├── cart.py          # Cart retrieval, add item, update quantity, remove
│   │   │   │   ├── orders.py        # Order placement, customer order history, details
│   │   │   │   ├── payments.py      # Stripe checkout and webhook listeners
│   │   │   │   └── products.py      # Customer product listing, search, filtering
│   │   │   └── router.py            # Root API V1 router aggregation
│   │   ├── core/
│   │   │   ├── config.py            # Environment settings and Pydantic configuration
│   │   │   └── security.py          # Bcrypt hashing and JWT token creation/decoding
│   │   ├── db/
│   │   │   ├── indexes.py           # Database index declarations (search, unique emails)
│   │   │   └── mongodb.py           # Motor async connection & resilient mock database
│   │   ├── models/                  # MongoDB entity representations
│   │   ├── schemas/                 # Pydantic request and response schemas
│   │   ├── services/                # Business logic services
│   │   └── main.py                  # FastAPI application entrypoint with CORS & lifespan
│   ├── scripts/
│   │   ├── promote_admin.py         # Utility to grant admin role to any user
│   │   └── seed_products.py         # Non-destructive seed script for 8 categories
│   ├── requirements.txt             # Python dependencies
│   └── .env                         # Backend environment variables
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts            # Axios instance with automated Bearer token injection
    │   │   └── services.ts          # Strongly-typed API functions
    │   ├── components/
    │   │   ├── AIChatWidget.tsx     # Floating interactive AI assistant
    │   │   ├── AuthModal.tsx        # Registration and Sign In dialog with demo accounts
    │   │   ├── Footer.tsx           # Shopify footer with policies, contacts, categories
    │   │   ├── Navbar.tsx           # Logo, search with Enter, 8 category pills, cart badge
    │   │   └── ProtectedRoute.tsx   # Role-based route protection (customer & admin)
    │   ├── pages/
    │   │   ├── AdminDashboardPage.tsx  # Admin console (products CRUD, orders management)
    │   │   ├── CartPage.tsx            # Interactive cart, promo codes, shipping progress
    │   │   ├── CheckoutPage.tsx        # Shipping address form, COD order placement
    │   │   ├── HomePage.tsx            # Hero carousel, category cards, product showcases
    │   │   ├── OrderDetailPage.tsx     # Order invoice, live shipment stepper
    │   │   ├── OrdersPage.tsx          # Customer order history list
    │   │   ├── ProductDetailPage.tsx   # Product gallery, specs, Add to Cart, Buy Now
    │   │   └── ShopPage.tsx            # Full catalog with search, price slider, sorting
    │   ├── store/
    │   │   ├── authSlice.ts         # Redux authentication slice with localStorage sync
    │   │   ├── hooks.ts             # Typed Redux dispatch and selector hooks
    │   │   └── index.ts             # Redux store configuration
    │   ├── App.tsx                  # Main application routing and cart count query
    │   └── index.css                # Shopify design tokens and modern CSS utilities
    ├── package.json                 # Frontend dependencies and scripts
    └── vite.config.ts               # Vite configuration
```

---

## 🗄️ 5. MongoDB Database Schemas

### 1. `users` Collection
Stores customer accounts and store administrators:
```json
{
  "_id": "670c18fa2a...",
  "email": "demo@shopify-store.local",
  "name": "Demo Shopper",
  "password_hash": "$2b$12$...",
  "role": "customer",
  "is_active": true,
  "created_at": "2026-10-15T09:00:00Z"
}
```

### 2. `products` Collection
Stores catalog inventory items across the 8 categories:
```json
{
  "_id": "670c192b1a...",
  "name": "Apple iPhone 15 Pro Max (256GB)",
  "description": "Forged in titanium with A17 Pro chip, 48MP camera, and USB-C connectivity.",
  "price": 1199.00,
  "currency": "usd",
  "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
  "stock": 15,
  "category": "Mobiles",
  "brand": "Apple",
  "is_active": true,
  "rating": 4.9,
  "reviewCount": 384,
  "created_at": "2026-10-15T09:00:00Z"
}
```

### 3. `carts` Collection
Maintains customer cart contents:
```json
{
  "_id": "670c193c3b...",
  "user_id": "670c18fa2a...",
  "items": [
    {
      "product_id": "670c192b1a...",
      "quantity": 1,
      "price_at_addition": 1199.00
    }
  ],
  "updated_at": "2026-10-15T09:15:00Z"
}
```

### 4. `orders` Collection
Maintains immutable snapshots of completed orders:
```json
{
  "_id": "670c198f4c...",
  "order_number": "ORD-670C198F",
  "user_id": "670c18fa2a...",
  "items": [
    {
      "product_id": "670c192b1a...",
      "product_name": "Apple iPhone 15 Pro Max (256GB)",
      "price": 1199.00,
      "quantity": 1
    }
  ],
  "total": 1199.00,
  "subtotal": 1199.00,
  "shipping_fee": 0.0,
  "currency": "usd",
  "payment_method": "cod",
  "payment_status": "pending",
  "order_status": "confirmed",
  "shipping_address": {
    "full_name": "Demo Shopper",
    "phone": "+91 9876543210",
    "address_line": "Flat 402, Lotus Towers, MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India"
  },
  "created_at": "2026-10-15T09:20:00Z"
}
```

---

## 📡 6. REST API Endpoints Documentation

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Create new customer account with name, email, password |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user and issue JWT bearer token |
| `GET` | `/api/v1/auth/me` | Customer | Fetch current logged-in user profile |
| `GET` | `/api/v1/products` | Public | List products with optional `search` and `category` query filters |
| `GET` | `/api/v1/products/{id}` | Public | Retrieve single product details by ID |
| `GET` | `/api/v1/cart` | Customer | Get customer's cart items, subtotal, and line items |
| `POST` | `/api/v1/cart/items` | Customer | Add product to cart or increment existing quantity |
| `PUT` | `/api/v1/cart/items/{id}` | Customer | Update cart item quantity |
| `DELETE` | `/api/v1/cart/items/{id}` | Customer | Remove specific item from cart |
| `POST` | `/api/v1/orders/from-cart` | Customer | Create order from cart with validated shipping address |
| `GET` | `/api/v1/orders` | Customer | Fetch customer's own order history |
| `GET` | `/api/v1/orders/{id}` | Customer | Get single order invoice and shipping details |
| `GET` | `/api/v1/admin/stats` | Admin | Retrieve store revenue, orders, products, and customer counts |
| `GET` | `/api/v1/admin/orders` | Admin | View all customer orders with filtering |
| `PATCH`| `/api/v1/admin/orders/{id}/status`| Admin | Update order status (`Confirmed`, `Shipped`, `Delivered`) |
| `POST` | `/api/v1/admin/products` | Admin | Create new catalog item |
| `PUT` | `/api/v1/admin/products/{id}` | Admin | Update product details, price, or stock |
| `DELETE`| `/api/v1/admin/products/{id}` | Admin | Delete product from catalog |

---

## 🚀 7. Installation & Startup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher (with npm)
- Git

---

### Step 1: Start the Backend Server

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd "backend"
   ```

2. Activate the Python virtual environment:
   ```bash
   # On Linux / macOS:
   source venv/bin/activate

   # On Windows:
   venv\Scripts\activate
   ```

3. Ensure all Python dependencies are present:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - **Backend API URL**: `http://localhost:8000`
   - **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`

---

### Step 2: Start the Frontend Application

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd "frontend"
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - **Frontend Web Application URL**: `http://localhost:5173`

---

## 🎯 8. Examiner Viva & Demonstration Workflow

When presenting the project to your college examiner, follow this recommended walkthrough:

```mermaid
sequenceDiagram
    autonumber
    actor Examiner as College Examiner
    participant Home as Homepage & Navbar
    participant Shop as Product Catalog
    participant Details as Product Details
    participant Cart as Cart & Checkout
    participant Orders as My Orders
    participant Admin as Admin Portal

    Examiner->>Home: 1. Explore Homepage & 8 Categories
    Home->>Shop: 2. Filter by Category (e.g. Mobiles) or Price Range
    Shop->>Details: 3. View Product Details & Select Quantity
    Details->>Cart: 4. Click "Buy Now" or "Add to Cart"
    Cart->>Cart: 5. Apply Promo Code "SHOPIFY15" & Verify Free Shipping
    Cart->>Cart: 6. Fill Shipping Address & Choose Cash on Delivery
    Cart->>Orders: 7. Place Order & View Live Stepper (Pending -> Confirmed)
    Examiner->>Admin: 8. Switch to Admin Console
    Admin->>Admin: 9. View KPIs & Update Order Status to "Shipped" or "Delivered"
    Admin->>Orders: 10. Refresh Customer Orders to see updated status in real time
```

1. **Brand & Category Showcase**: Open `http://localhost:5173`. Demonstrate the clean Shopify branding and the 8 target categories (**Mobiles**, **Electronics**, **Fashion**, etc.).
2. **Search & Filter Flow**: Click on "Mobiles" or type "iPhone" in the search bar and press Enter. Demonstrate the active search result count, category filter, and price slider.
3. **Product Inspection**: Click any product to open its dedicated page. Highlight the clamped quantity selector (can't go below 1 or exceed stock), specifications table, and stock badge.
4. **Buy Now / Cart Flow**: Demonstrate clicking "Buy Now" or "Add to Cart". Notice the cart badge count in the header update in real time.
5. **Checkout with Cash on Delivery**: Go to `/checkout`, enter shipping details (Name, Phone, Address, City, Postal Code), select "Cash on Delivery", and click "Place Order".
6. **Order Confirmation & Tracking**: Note the unique order ID generated and the live shipment progress stepper (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
7. **Admin Dashboard Demonstration**: Navigate to `/admin`. Demonstrate the revenue metrics, product inventory management (Add/Edit/Delete), and update the customer's order status to `Shipped` or `Delivered`. Return to `/orders` to demonstrate real-time consistency.

---

## ⚖️ 9. Limitations & Future Roadmap

- **Multi-Vendor Marketplace**: Expand the system to support multiple seller portals with individual vendor payout calculations.
- **Automated SMS & WhatsApp Alerts**: Integrate Twilio / WhatsApp Business API to dispatch automated dispatch notifications.
- **Advanced Recommendations**: Train collaborative filtering recommendation models on user browsing history.

---

*Developed for College Academic Evaluation. Shopify E-Commerce Application © 2026.*
