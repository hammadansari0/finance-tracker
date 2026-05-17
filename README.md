# 📘 NestJS Finance API (Income + Expense + Analytics)

A backend system built with **NestJS + Prisma + PostgreSQL + JWT Authentication** for managing personal finances including income, expenses, and analytics.

---

# 🚀 Project Overview

This project is a **multi-user finance tracking system** where each user can:

- Register/Login securely
- Add Income
- Add Expenses
- View only their own data
- Get financial analytics (balance, totals, summaries)

---

# 🧠 Core Features

- JWT Authentication
- User-specific data isolation
- Income CRUD operations
- Expense CRUD operations
- Financial analytics (income vs expense vs balance)
- Prisma ORM with PostgreSQL
- Secure backend architecture

---

# 🏗️ System Architecture

## 📦 Folder Structure

src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│
├── expenses/
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│
├── income/
│   ├── income.controller.ts
│   ├── income.service.ts
│
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│
├── prisma/
│   ├── prisma.service.ts
│
├── app.module.ts
└── main.ts

---

# 🔗 Module Relationships

## 🔐 Auth Module
- Handles user authentication (register/login)
- Generates JWT token
- Attaches user to request via `JwtAuthGuard`

---

## 💸 Expenses Module
- Protected by JWT
- Uses `req.user.id`
- Stores data in PostgreSQL via Prisma

---

## 💰 Income Module
- Same structure as Expenses
- Fully isolated per user

---

## 📊 Analytics Module
- Reads from Income + Expense tables
- Computes:
  - total income
  - total expenses
  - balance

---

## 🧩 Prisma Service Usage
PrismaService is injected directly into:
- Income Service
- Expense Service
- Analytics Service

No cross-module communication required.

---

# 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. Server returns JWT token
3. Client sends token in headers:

Authorization: Bearer <token>

4. JwtAuthGuard validates token
5. Attaches user to request:

req.user = { id, email }

6. Services use:

req.user.id

---

# 📦 Database Schema (Prisma)

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  password  String

  expenses  Expense[]
  incomes   Income[]

  createdAt DateTime  @default(now())
}

model Expense {
  id        Int      @id @default(autoincrement())
  title     String
  amount    Float
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Income {
  id        Int      @id @default(autoincrement())
  title     String
  amount    Float
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

# 📡 API ENDPOINTS

---

# 🔐 AUTH MODULE

## Register User

**POST** `/auth/register`

### Body

```json
{
  "email": "test@gmail.com",
  "name": "John",
  "password": "123456"
}
```

---

## Login User

**POST** `/auth/login`

### Body

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "access_token": "jwt_token_here"
}
```

---

## Get Logged-in User

**GET** `/auth/me`

### Headers

```bash
Authorization: Bearer <token>
```

---

# 💸 EXPENSE MODULE

## Create Expense

**POST** `/expenses`

```json
{
  "title": "Pizza",
  "amount": 20
}
```

---

## Get All Expenses

**GET** `/expenses`

---

## Get Expense by ID

**GET** `/expenses/:id`

---

## Update Expense (PUT)

**PUT** `/expenses/:id`

```json
{
  "title": "Burger",
  "amount": 50
}
```

---

## Patch Expense

**PATCH** `/expenses/:id`

```json
{
  "amount": 100
}
```

---

## Delete Expense

**DELETE** `/expenses/:id`

---

# 💰 INCOME MODULE

## Create Income

**POST** `/income`

```json
{
  "title": "Salary",
  "amount": 2000
}
```

---

## Get All Income

**GET** `/income`

---

## Get Income by ID

**GET** `/income/:id`

---

## Update Income (PUT)

**PUT** `/income/:id`

```json
{
  "title": "Freelance",
  "amount": 500
}
```

---

## Patch Income

**PATCH** `/income/:id`

---

## Delete Income

**DELETE** `/income/:id`

---

# 📊 ANALYTICS MODULE

## Get Financial Summary

**GET** `/analytics/summary`

### Response

```json
{
  "totalIncome": 5000,
  "totalExpenses": 3200,
  "balance": 1800,
  "incomeTransactions": 3,
  "expenseTransactions": 5
}
```

---

# 🔐 SECURITY MODEL

## Data Isolation Rule

Each user can ONLY access their own data:

```ts
where: { userId: req.user.id }
```

---

## Protected Routes

All routes except auth are protected using JWT.

---

# 🧠 DESIGN DECISIONS

## 1. No balance stored in DB

Balance is calculated dynamically:

```txt
Balance = Income - Expenses
```

---

## 2. Prisma used directly in services

No repository layer for simplicity.

---

## 3. JWT payload structure

```json
{
  "sub": "user.id",
  "email": "user.email"
}
```

Mapped in guard:

```ts
req.user = {
  id: payload.sub,
  email: payload.email
}
```

---

# 🧪 TESTING FLOW

1. Register user  
2. Login → get token  
3. Add income & expenses  
4. Call analytics endpoint  

---

# 🚀 FUTURE IMPROVEMENTS

- Monthly analytics
- Category system (Food, Rent, Salary)
- Charts API for frontend
- Pagination support
- Role-based access (Admin/User)
- Export PDF/CSV reports

---

# 👨‍💻 CONTRIBUTION GUIDE

- Use Nest CLI for modules
- Always inject `PrismaService`
- Always use `req.user.id`
- Never expose password or sensitive data
- Keep modules isolated