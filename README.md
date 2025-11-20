# Jweluxe — Project Summary

**Short description:**
A full-stack jewellery shop management system (JSMS) built as a MERN-style application but using **MySQL + Express + React + Node**. It supports product management (admin), user registration/login, shopping cart, and Stripe payments.

---

# Tech stack (languages, frameworks, libraries, services)

**Frontend**

- Language: JavaScript (React).
- React (React 18).
- React Router (client-side routing).
- @reduxjs/toolkit (state management).
- Reactstrap / Bootstrap components (Reactstrap).
- Axios (HTTP requests).
- React Toastify (notifications).
- styled-components (styling).
- Material Icons.
- Stripe client library (Stripe Elements or stripe-js) for payments.

**Backend**

- Node.js + Express. (Node 18 or 20; Express 4/5).
- MySQL as the relational database (compatible with MySQL 8 / MariaDB).
- mysql (Node MySQL driver) or mysql2 (README says “MySQL” driver).
- cors, multer (for file uploads), jsonwebtoken (JWT auth), crypto-js (encryption), stripe (server-side Stripe SDK).

**Services**

- Stripe for payments (Stripe API keys required).
- Local MySQL server (or managed MySQL like AWS RDS / PlanetScale for deployments).

---

# Architecture (diagram + concise explanation)

## High level architecture (textual diagram)

```
[Browser / Client (React)]
        |
        | HTTPS (REST API) - axios
        v
[Backend API - Node.js + Express] -----> [Stripe API] (payments)
        |
        | MySQL connection (mysql/mysql2 driver)
        v
[MySQL Database (users, categories, products, cart, orders, payments)]
```

## Components & data flow (concise)

- **Frontend (React):** UI for customers and admin. Handles routing, local state via Redux Toolkit, and communicates to backend API endpoints (authentication, product listing, cart, checkout). Uses Stripe client-side library for collecting card/payment details, then calls backend to create charges / payment intents.
- **Backend (Express):** Auth routes (register/login — JWT issuance), product/category CRUD (admin-protected), cart and order endpoints, endpoints to create Stripe payment intents or to confirm payments, file/image upload handling (multer), and database access layer to MySQL. Uses jsonwebtoken for protected endpoints and crypto-js for any sensitive data handling.
- **Database (MySQL):** Stores users, categories, jewellery products, cart items, orders, and payment records.
- **Stripe:** Payment processing. Frontend collects card info securely via Stripe; backend uses Stripe SDK to create/confirm payment intents and record transactions.

---

# Core features implemented, why they matter, and trade-offs

1. **Product listing & details**

   - _Why it matters:_ Core of any e-commerce — users must browse products.
   - _Trade-offs:_ If images are stored on the server (multer) rather than a CDN, it’s simpler but not scalable.

2. **Cart management (add/update/delete)**

   - _Why:_ Users expect a standard cart flow.
   - _Trade-offs:_ In-memory session cart vs persistent cart in DB — persistent cart (DB) is better for multi-device but requires more DB operations.

3. **User authentication (login / register)**

   - _Why:_ Needed for order tracking and admin access. Uses JWT tokens.
   - _Trade-offs:_ JWT simplifies stateless auth but requires token lifecycle management and secure storage on client.

4. **Admin CRUD for categories and jewellery items**

   - _Why:_ Business owners can manage inventory.
   - _Trade-offs:_ Simpler role-based checks (e.g., `isAdmin` flag) may be good enough for a demo but not fine-grained for production.

5. **Stripe payments**

   - _Why:_ Secure and trusted payments.
   - _Trade-offs:_ Integrating Stripe requires server-side secret storage and webhook setup for real production-level payment confirmation.

6. **File uploads (multer)**

   - _Why:_ Add product images.
   - _Trade-offs:_ Local storage is simple for dev; production should use cloud storage (S3, GCS).

---

# Setup & Run (step-by-step)

> These are detailed steps that will get the project running locally. Adjust paths and names if your repo layout differs.

## Prerequisites

- Node.js (recommended 18 or 20) and npm/yarn installed.
- MySQL server (8 recommended) or a managed MySQL.
- Stripe account (get TEST publishable & secret keys).
- Git.

## 1) Clone repo

```bash
git clone https://github.com/girishhardia/Jweluxe.git
cd Jweluxe
```

## 2) Backend setup

```bash
cd backend
# install dependencies
npm install
# create .env based on .env.example (see below)
cp .env.example .env
# Edit .env with your MySQL & Stripe values
```

### Create the database

Connect to MySQL and create a DB. Example:

```sql
CREATE DATABASE jweluxe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

(If the repo contains SQL/migrations, run them — if not, use the sample schema below to create tables.)

### Run backend

```bash
# start in dev mode (if scripts use nodemon)
npm run dev
# or
npm start
```

- Default backend port: **3000** (if the repo uses that — check backend `app.listen`).

## 3) Frontend setup

```bash
cd ../frontend
npm install
# create .env.local or similar with FRONTEND_URL and backend URL if required
npm start
```

- Default React dev port: **3000** (if backend uses 3000, frontend will likely run on 3001 or 5173 depending on toolchain — check package.json scripts). If both default to 3000, change front or backend port before starting.

## 4) Stripe testing

- Use Stripe test keys in backend `.env`. Use Stripe test card numbers (e.g., 4242 4242 4242 4242) during checkout.

---

# .env.example

Place this file in both backend and frontend (frontend only needs public keys and backend URL). Do **not** commit real keys.

**backend/.env.example**

```
# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=jweluxe_db

# Server
PORT=3000
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # only if using webhooks

# Other
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.example**

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## REST endpoints

- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — login, returns JWT
- `GET /api/products` — list products
- `GET /api/products/:id` — product details
- `POST /api/cart` — add item to cart / update cart
- `GET /api/cart` — get current user cart
- `DELETE /api/cart/:itemId` — remove from cart
- `POST /api/orders` — create order (after payment)
- `POST /api/stripe/create-payment-intent` — create Stripe payment intent
- `POST /api/admin/categories` — admin create category (protected)
- `POST /api/admin/products` — admin create product (protected)

## Database schemas

**users**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**categories**

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**products**

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(1024),
  category_id INT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

**cart_items**

```sql
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

**orders**

```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2),
  payment_status VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**payments** (optional)

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  stripe_charge_id VARCHAR(255),
  amount DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

---

# Impact & metrics

- **Performance:** With local MySQL and Node backend, the app is suitable for demo/low traffic. Response times are dominated by DB queries and image serving; caching (Redis) would improve read-heavy product listing.
- **Scale assumptions:** Single instance Node + single MySQL is fine up to a few hundred requests/minute; beyond that add read replicas, connection pooling, and a CDN for static assets.
- **Testing:** README doesn’t mention automated tests; adding unit & integration tests (Jest, supertest) would improve reliability.
- **Security:** Uses JWT for auth and Stripe for payments (good). Must ensure secure handling of JWT secret, use HTTPS in production, validate inputs, and sanitize DB queries to avoid SQL injection (use parameterized queries / ORM).

---

# What’s next

**Known limitations**

- No CDN for images — local storage doesn’t scale.
- No webhook verification or durable payment recording (unless already implemented).
- No rate limiting, CORS policy may be permissive by default.
- No automated tests listed in README.

**Planned improvements**

1. Move images to cloud storage (S3) and serve via CDN.
2. Use an ORM (Sequelize / Prisma) for safer DB access and migrations.
3. Add Stripe webhooks to handle asynchronous payment events robustly.
4. Add integration tests (backend routes, payment flow).
5. Introduce role-based access control (fine-grained) for admin actions.
6. Add Dockerfiles and docker-compose to simplify local setup (Node + MySQL).
7. Add CI to run tests and linting, and CD to deploy on push.

---
