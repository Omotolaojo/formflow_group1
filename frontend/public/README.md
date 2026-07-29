# Expense Claim Management System

A full-stack expense claim management platform that simplifies the submission, processing, review, and approval of employee expense claims.

The platform supports two claim submission workflows:

* **AI-Powered Receipt Processing** — Upload a receipt image or PDF and automatically extract expense information using Azure AI Document Intelligence.
* **Manual Claim Entry** — Submit expense claims manually when a receipt is unavailable or automated extraction is not required.

Administrators can review submitted claims, approve or reject them, and monitor expense activity through a centralized dashboard.

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Application Workflow](#application-workflow)
* [AI Receipt Processing](#ai-receipt-processing)
* [Claim Lifecycle](#claim-lifecycle)
* [Dashboard](#dashboard)
* [API Endpoints](#api-endpoints)
* [Environment Variables](#environment-variables)
* [Local Development](#local-development)
* [Database Setup](#database-setup)
* [Deployment](#deployment)
* [CORS Configuration](#cors-configuration)
* [Testing the API](#testing-the-api)
* [Troubleshooting](#troubleshooting)
* [Future Improvements](#future-improvements)
* [License](#license)

---

# Overview

The Expense Claim Management System is designed to provide organizations with a centralized solution for handling employee expense claims.

Instead of relying on manual paperwork or disconnected spreadsheets, employees can submit claims through a web application. The system then stores the claims in a PostgreSQL database and allows authorized users to review and manage them.

For receipts, the application integrates with **Azure AI Document Intelligence** to automatically extract relevant information such as:

* Vendor or merchant name
* Total expense amount
* Expense date

The extracted information is then used to create an expense claim in the system.

For expenses without receipts, users can submit claims manually.

Administrators can then review claims and update their status.

---

# Key Features

## AI-Powered Receipt Processing

Users can upload:

* Receipt images
* PDF receipts

The backend sends the uploaded document to Azure AI Document Intelligence for analysis.

The system extracts information such as:

* Merchant/vendor
* Total amount
* Expense date

The extracted information is then stored as an expense claim.

---

## Manual Expense Claim Submission

Users can manually enter:

* Vendor
* Amount
* Expense date
* Optional receipt URL

Manual claims are submitted directly to the backend API and persisted in the PostgreSQL database.

Successful submissions display a toast notification to provide immediate feedback to the user.

---

## Claim Management

Claims can be:

* Submitted
* Reviewed
* Approved
* Rejected

The system maintains the claim status in the database.

---

## Administrative Approval

Administrators can review pending claims and either:

* Approve the claim
* Reject the claim

The approval status is persisted in the database.

---

## Dashboard Analytics

The dashboard provides a high-level overview of expense activity, including:

* Total claims
* Pending claims
* Approved claims
* Rejected claims
* Total expense value
* Approval rate
* Pending workload
* Average claim value

Dashboard data is retrieved from the backend API and displayed using React Query.

---

## Responsive User Interface

The frontend is designed to work across:

* Desktop
* Tablet
* Mobile

The interface uses responsive layouts and reusable UI components.

---

## API Health Monitoring

The backend exposes a health endpoint that can be used to verify that the API is operational.

```text
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Expense Claim API is running"
}
```

---

# System Architecture

The application follows a full-stack client-server architecture.

```text
                    ┌──────────────────────────┐
                    │        End User          │
                    │     Browser / Client     │
                    └────────────┬─────────────┘
                                 │
                                 │ HTTPS
                                 ▼
                    ┌──────────────────────────┐
                    │      Next.js Frontend    │
                    │                          │
                    │  - Dashboard             │
                    │  - Claim Submission      │
                    │  - AI Receipt Upload     │
                    │  - Manual Claim Entry    │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │   Express Backend API    │
                    │                          │
                    │  - Claim Routes          │
                    │  - Approval Routes       │
                    │  - Processing Routes     │
                    │  - CORS                  │
                    └──────┬───────────┬───────┘
                           │           │
                           │           │
                           ▼           ▼
              ┌─────────────────┐   ┌──────────────────────┐
              │   PostgreSQL    │   │ Azure AI Document    │
              │    Database     │   │    Intelligence      │
              │                 │   │                      │
              │  Claims Data    │   │ Receipt Extraction   │
              └─────────────────┘   └──────────────────────┘
```

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* DaisyUI
* TanStack React Query
* React Hot Toast
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* Multer
* CORS

## Database

* PostgreSQL

## AI / Cloud Services

* Microsoft Azure
* Azure AI Document Intelligence

## Deployment

* Vercel — Frontend
* Render — Backend API
* PostgreSQL — Production database

---

# Project Structure

The project is divided into frontend and backend applications.

## Frontend

A typical frontend structure is:

```text
frontend/
├── app/
│   ├── dashboard/
│   ├── upload/
│   ├── claims/
│   └── layout.tsx
│
├── components/
│   ├── forms/
│   │   ├── UploadForm.tsx
│   │   └── ManualClaimForm.tsx
│   │
│   └── ...
│
├── types/
│   └── claims.ts
│
├── lib/
│   └── ...
│
├── public/
│
├── package.json
└── tsconfig.json
```

## Backend

The backend follows a controller-route architecture:

```text
backend/
├── src/
│   ├── config/
│   │   └── prisma.ts
│   │
│   ├── controllers/
│   │   ├── claims.controllers.ts
│   │   ├── approve.controllers.ts
│   │   └── process.controllers.ts
│   │
│   ├── routes/
│   │   ├── claims.routes.ts
│   │   ├── approve.routes.ts
│   │   └── process.routes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── package.json
└── tsconfig.json
```

---

# Application Workflow

## 1. Manual Claim Workflow

```text
User
 │
 │ Enter vendor, amount, date
 ▼
Manual Claim Form
 │
 │ POST /api/claims
 ▼
Express API
 │
 │ Validate request
 ▼
Claim Controller
 │
 │ Prisma
 ▼
PostgreSQL
 │
 │ Create claim
 ▼
Status: pending
```

---

## 2. AI Receipt Workflow

```text
User
 │
 │ Upload receipt
 ▼
Next.js Frontend
 │
 │ Multipart Form Data
 ▼
POST /api/process
 │
 ▼
Express Backend
 │
 │ Upload document
 ▼
Azure AI Document Intelligence
 │
 │ Extract fields
 ▼
Backend Processing Logic
 │
 │ Create claim
 ▼
PostgreSQL
 │
 ▼
Status: pending
```

---

## 3. Approval Workflow

```text
Pending Claim
      │
      ▼
Administrator Review
      │
      ├───────────────┐
      │               │
      ▼               ▼
   Approve          Reject
      │               │
      ▼               ▼
  approved         rejected
```

---

# AI Receipt Processing

The application uses Azure AI Document Intelligence to analyze receipt documents.

The backend accepts the uploaded file and sends it for document analysis.

The extracted information is mapped into the claim structure.

Example extracted data:

```json
{
  "merchant": "Example Store",
  "total": 2999.97,
  "date": "2026-07-23"
}
```

The backend can then create a claim using:

```text
vendor → merchant
amount → total
date → date
```

The resulting claim is stored with a default status of:

```text
pending
```

This allows an administrator to review the claim before approval.

---

# Claim Lifecycle

Claims follow a basic approval lifecycle.

```text
pending
   │
   ├───────────────┐
   │               │
   ▼               ▼
approved        rejected
```

## Pending

The claim has been submitted and is awaiting administrator review.

## Approved

The claim has been reviewed and approved.

## Rejected

The claim has been reviewed and rejected.

---

# Dashboard

The dashboard retrieves all claims using:

```text
GET /api/claims/all
```

The frontend calculates statistics from the returned claim collection.

The dashboard currently displays:

### Total Claims

The total number of submitted claims.

### Pending Claims

The number of claims currently awaiting approval.

### Approved Claims

The number of claims with an approved status.

### Rejected Claims

The number of claims with a rejected status.

### Total Expenses

The total value of submitted claims.

### Approval Rate

The percentage of submitted claims that have been approved.

### Pending Workload

The percentage of claims that are still pending.

### Average Claim Value

The average expense amount across submitted claims.

Dashboard data can be refreshed manually using the refresh button.

---

# API Endpoints

The backend API is organized around REST-style routes.

## Health Check

```http
GET /api/health
```

Returns the API health status.

---

## Get Pending Claims

```http
GET /api/claims
```

Returns claims currently awaiting approval.

---

## Get All Claims

```http
GET /api/claims/all
```

Returns all claims.

Example response:

```json
[
  {
    "id": "claim-id",
    "vendor": "Example Store",
    "amount": 3000,
    "date": "2026-07-23T00:00:00.000Z",
    "status": "pending",
    "receiptUrl": null
  }
]
```

---

## Create Claim

```http
POST /api/claims
```

Example request:

```json
{
  "vendor": "FoodCeleb",
  "amount": 3000,
  "date": "2026-07-23",
  "receiptUrl": null
}
```

Example response:

```json
{
  "id": "claim-id",
  "vendor": "FoodCeleb",
  "amount": 3000,
  "date": "2026-07-23T00:00:00.000Z",
  "status": "pending",
  "receiptUrl": null
}
```

---

## Approve or Reject Claim

```http
POST /api/approve
```

Example request:

```json
{
  "id": "claim-id",
  "status": "approved"
}
```

Or:

```json
{
  "id": "claim-id",
  "status": "rejected"
}
```

Valid statuses are:

```text
approved
rejected
```

---

## Process Receipt

```http
POST /api/process
```

The endpoint accepts a multipart form-data request containing a receipt file.

The expected field name is:

```text
file
```

Example:

```text
Content-Type: multipart/form-data
```

The endpoint processes the receipt using Azure AI Document Intelligence.

---

# Environment Variables

## Frontend

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://expense-claim-api.onrender.com/api
```

The frontend uses this variable for API requests.

For example:

```typescript
const apiUrl =
  `${process.env.NEXT_PUBLIC_API_URL}/claims`;
```

---

## Backend

The backend environment configuration should include the required database and Azure credentials.

Example:

```env
PORT=5000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

FRONTEND_URL="http://localhost:3000"

AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="https://YOUR-RESOURCE.cognitiveservices.azure.com/"

AZURE_DOCUMENT_INTELLIGENCE_KEY="YOUR_AZURE_KEY"
```

For production:

```env
FRONTEND_URL="https://your-production-frontend.vercel.app"
```

> Never commit `.env`, `.env.local`, or production credentials to GitHub.

---

# Local Development

## Prerequisites

Make sure the following are installed:

* Node.js 20+
* npm
* PostgreSQL
* Git
* Azure account for AI receipt processing

---

## Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd expense-claim-system
```

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
touch .env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
touch .env
```

Configure the required environment variables.

Start the backend:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

Test the health endpoint:

```text
http://localhost:5000/api/health
```

---

# Database Setup

The project uses Prisma ORM with PostgreSQL.

After configuring the `DATABASE_URL`, run:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

To inspect the database using Prisma Studio:

```bash
npx prisma studio
```

For production deployments, use:

```bash
npx prisma migrate deploy
```

Make sure Prisma Client is generated as part of the deployment process.

A typical build command can include:

```bash
npx prisma generate && npm run build
```

---

# Deployment

The recommended deployment architecture is:

```text
                    GitHub
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
         Vercel                 Render
            │                     │
            ▼                     ▼
       Next.js App          Express API
                                  │
                                  ├──── PostgreSQL
                                  │
                                  └──── Azure AI
                                      Document Intelligence
```

## Frontend Deployment

Deploy the Next.js frontend to Vercel.

Configure:

```env
NEXT_PUBLIC_API_URL=https://expense-claim-api.onrender.com/api
```

After changing environment variables, redeploy the application so the new variables are included in the frontend build.

---

## Backend Deployment

Deploy the Express API to Render.

Configure the required environment variables:

```env
DATABASE_URL=...
FRONTEND_URL=https://your-production-frontend.vercel.app
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=...
AZURE_DOCUMENT_INTELLIGENCE_KEY=...
```

The backend should expose:

```text
GET /api/health
```

for health monitoring.

---

# CORS Configuration

The backend uses CORS to allow requests from the frontend.

Example configuration:

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-production-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },
    credentials: true,
  })
);
```

The production Vercel URL must match the browser's actual origin.

For example, if the frontend is accessed through:

```text
https://expense-tracker-system-f5iyltu3d-jaysoftys-projects.vercel.app
```

that exact origin must be allowed by the backend.

CORS errors can occur when the Vercel deployment URL changes between preview and production deployments.

---

# Testing the API

## Health Check

```bash
curl https://expense-claim-api.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Expense Claim API is running"
}
```

---

## Create a Manual Claim

```bash
curl -X POST \
  https://expense-claim-api.onrender.com/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "vendor": "FoodCeleb",
    "amount": 3000,
    "date": "2026-07-23",
    "receiptUrl": null
  }'
```

---

## Get All Claims

```bash
curl https://expense-claim-api.onrender.com/api/claims/all
```

---

## Approve a Claim

```bash
curl -X POST \
  https://expense-claim-api.onrender.com/api/approve \
  -H "Content-Type: application/json" \
  -d '{
    "id": "YOUR_CLAIM_ID",
    "status": "approved"
  }'
```

---

## Reject a Claim

```bash
curl -X POST \
  https://expense-claim-api.onrender.com/api/approve \
  -H "Content-Type: application/json" \
  -d '{
    "id": "YOUR_CLAIM_ID",
    "status": "rejected"
  }'
```

---

# Troubleshooting

## 404 When Opening the Render Root URL

Opening:

```text
https://expense-claim-api.onrender.com/
```

may return a 404 if no root route is configured.

The application provides a health endpoint:

```text
https://expense-claim-api.onrender.com/api/health
```

A successful response confirms that the backend is running.

---

## CORS Error

If the browser displays:

```text
Access-Control-Allow-Origin
```

check:

1. The frontend's actual deployed URL.
2. The `FRONTEND_URL` environment variable.
3. The backend `allowedOrigins` configuration.
4. Whether the backend has been redeployed after changing environment variables.

Remember that a Vercel preview URL and a Vercel production URL are different origins.

---

## Manual Claim Form Refreshes the Page

Make sure the form uses:

```tsx
<form onSubmit={handleSubmit}>
```

and the handler begins with:

```typescript
e.preventDefault();
e.stopPropagation();
```

The submit button should be:

```tsx
<button type="submit">
```

There should only be one submit button in the form.

---

## Dashboard Does Not Update After Approval

The dashboard retrieves claim data through React Query.

After approving or rejecting a claim, the dashboard may need to refetch the claims query.

The dashboard query uses:

```typescript
queryKey: ["dashboard-claims"]
```

After a successful approval request, the frontend can invalidate the query:

```typescript
queryClient.invalidateQueries({
  queryKey: ["dashboard-claims"],
});
```

This ensures the dashboard retrieves the latest claim statuses from the API.

---

## Database Changes Are Not Reflected

Check:

```bash
npx prisma studio
```

Confirm that the claim's status has changed in the database.

Then test:

```text
GET /api/claims/all
```

If the API returns the updated status but the dashboard does not update, the issue is likely frontend caching or React Query invalidation.

---

# Future Improvements

Potential improvements include:

* User authentication and role-based access control
* Employee-specific claims
* Administrator-only approval actions
* Email notifications
* Claim history and audit logs
* Approval timestamps
* Rejection reasons
* Payment processing
* Claim reimbursement tracking
* File storage using Azure Blob Storage
* Advanced expense analytics
* Monthly and yearly expense reports
* CSV and PDF report exports
* Search and filtering
* Pagination for large claim datasets
* Automated testing
* CI/CD pipelines
* Docker containerization
* Infrastructure as Code
* Centralized application logging
* Production monitoring and alerting

---

# Security Considerations

The following security practices should be implemented before production use:

* Never expose Azure API keys in frontend code.
* Store secrets using environment variables.
* Never commit `.env` files to source control.
* Restrict CORS to trusted frontend origins.
* Validate uploaded file types.
* Enforce maximum upload sizes.
* Authenticate administrative operations.
* Implement role-based authorization.
* Validate and sanitize all user input.
* Use HTTPS in production.
* Protect database credentials.
* Implement rate limiting for public APIs.
* Add audit logging for approval actions.

---

# License

This project is currently intended for educational and demonstration purposes.

Add an appropriate license before distributing or commercializing the application.

---

# Author

Developed as a full-stack cloud-based expense management application using modern web technologies and Azure AI services.

Built with:

**Next.js · React · TypeScript · Express · Prisma · PostgreSQL · Azure AI Document Intelligence · Vercel · Render**

---
