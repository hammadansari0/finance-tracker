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

```text
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
```
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
```

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

# 📄 Export Module

The Export Module allows users to download financial data in multiple formats including:

- CSV Exports
- PDF Financial Reports

---

# 📄 CSV EXPORT

## Export Expenses CSV

### Endpoint

```http
GET /export/expenses
```

### Description

Exports all user expenses as a CSV file.

### Response

Downloads a `.csv` file containing:

- Expense title
- Amount
- Category
- Date
- Notes (if available)

---

## Export Income CSV

### Endpoint

```http
GET /export/income
```

### Description

Exports all user income records as a CSV file.

### Response

Downloads a `.csv` file containing:

- Income source
- Amount
- Category
- Date
- Notes (if available)

---

# 📊 PDF FINANCIAL REPORT

Generate a complete financial report in PDF format.

---

## Endpoint

```http
GET /export/report
```

---

## Optional Query Parameters

| Parameter | Required | Description |
|----------|----------|-------------|
| from | ❌ Optional | Start date filter |
| to | ❌ Optional | End date filter |

---

## Example Requests

### Get Full Report

```http
GET /export/report
```

### Get Report Between Dates

```http
GET /export/report?from=2026-01-01&to=2026-12-31
```

### Get Report From Specific Date

```http
GET /export/report?from=2026-01-01
```

### Get Report Until Specific Date

```http
GET /export/report?to=2026-12-31
```

---

# ✅ Response

Downloads a PDF file containing:

- Income list (sorted by date ascending)
- Expense list (sorted by date ascending)
- Total income
- Total expenses
- Final balance summary

---

# ⚠️ Important Behavior

## What happens if date range is NOT provided?

If the endpoint is called without `from` and `to`:

```http
GET /export/report
```

### System Behavior

- ✅ No error will be thrown
- ✅ All income records are included
- ✅ All expense records are included
- ✅ Data is sorted by date ascending

---

# 🧠 Filtering Logic

| Case | Result |
|------|--------|
| No `from`, no `to` | Returns all data |
| Only `from` provided | Returns data from date → present |
| Only `to` provided | Returns data from start → specified date |
| Both provided | Returns filtered range |
| Invalid dates | Ignored or returns empty result |

---

# 📌 Notes

- Date format must be:

```txt
YYYY-MM-DD
```

Example:

```txt
2026-01-01
```

- PDF generation is optimized for large datasets.
- CSV exports use UTF-8 encoding.
- All exported data belongs only to the authenticated user.

---

# 🔐 Authentication

All export endpoints require authentication.

Example:

```http
Authorization: Bearer <token>
```

---

# 🚀 Export Endpoints Summary

| Feature | Method | Endpoint |
|---------|--------|----------|
| Export Expenses CSV | GET | `/export/expenses` |
| Export Income CSV | GET | `/export/income` |
| Export PDF Report | GET | `/export/report` |

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

You can use this as Base URL to test Live instances.

```url
https://finance-tracker-backend-6s2l.onrender.com
```

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