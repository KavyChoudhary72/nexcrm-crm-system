# NEXCRM - Multi-Tenant Lead Management CRM

NEXCRM is a production-grade, high-performance, and secure MERN stack Lead Management CRM built using TypeScript, MongoDB, Express, React/Vite, Tailwind CSS, Framer Motion, and Google Gemini AI.

The application is architected from the ground up to support multi-tenant isolation, allowing 30–40 distinct companies to operate concurrently with guaranteed data protection and high-speed querying.

---

## Key Features

*   **Multi-Tenant Isolation**: Complete data segregation at the database level using a dedicated `Company` model and indexed `companyId` keys. Users from Company A can never view or modify data from Company B.
*   **₹0 Invite Code Onboarding System**:
    *   **Admins**: Create a new company workspace which automatically generates a unique, random 6-character uppercase alphanumeric invitation code.
    *   **Sales Executives**: Join existing workspaces by registering with the organization's unique invite code.
*   **Role-Based Access Control (RBAC)**:
    *   **Admin**: Global read/write access, dashboard metrics aggregate across the company, team settings roster management, lead deletion, and global CSV/Excel data exports.
    *   **Sales Executive**: RESTRICTED view, showing only leads explicitly assigned to them.
*   **Team Workspace Management**: Admins can open any agent's profile inside the workspace settings to view details (email, role, joined date) or remove them from the workspace. Removing an agent automatically resets their leads to "unassigned" and cleans up scheduled follow-up tasks.
*   **Gemini AI Lead Scoring**: Automatically scans lead intent probability from 1 to 100 based on lead budget, source, and requirement details.
*   **Viewport-Triggered Animations**: Smooth viewport scroll-triggered entry animations on the landing page representing platform performance metrics (productivity, setup setup, and pricing savings).

---

## Project Structure

```
crm-system/
├── backend/            # Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/     # DB and logger configurations
│   │   ├── controllers/# Business logic controllers
│   │   ├── middleware/ # Authentication and role guards
│   │   ├── models/     # Mongoose database schemas
│   │   ├── routes/     # Router endpoint bindings
│   │   └── services/   # Auth token and AI scoring services
├── frontend/           # React SPA Client (Vite, TypeScript, Tailwind CSS)
│   ├── src/
│   │   ├── components/ # Shared layout, dashboard, and settings components
│   │   ├── context/    # User authentication provider state
│   │   ├── hooks/      # Custom data hooks (dashboard, theme)
│   │   ├── pages/      # Route pages (Home, Dashboard, Kanban, Login)
│   │   ├── services/   # Axios API client calls
│   │   └── types/      # TypeScript interfaces
└── render.yaml         # Automated infrastructure-as-code Blueprint
```

---

## Deployment to Render

To deploy the NEXCRM application on Render without failures, it is recommended to set up the backend as a Node Web Service and the frontend as a Static Site. 

### Option 1: Automated Deployment using Blueprint (`render.yaml`)

This repository includes a `render.yaml` file that automates the creation of both services and links them.

1. Create a Render account at [render.com](https://render.com).
2. Connect your GitHub repository to Render.
3. Click **New** → **Blueprint** in the Render Dashboard.
4. Select this repository. Render will automatically read the `render.yaml` file.
5. Provide values for the required environment variables:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secure key used for signing JWTs.
6. Click **Apply**. Render will deploy both services in the correct sequence.

### Option 2: Manual Deployment

If you prefer to set up services manually:

#### 1. Backend Web Service
*   **Service Type**: Web Service
*   **Environment**: `Node`
*   **Root Directory**: `backend`
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm start`
*   **Environment Variables**:
    *   `PORT`: `5000`
    *   `NODE_ENV`: `production`
    *   `MONGODB_URI`: *(your MongoDB Atlas URI)*
    *   `JWT_SECRET`: *(your JWT secret key)*
    *   `FRONTEND_URL`: *(the URL of your deployed frontend static site)*

#### 2. Frontend Static Site
*   **Service Type**: Static Site
*   **Root Directory**: `frontend`
*   **Build Command**: `npm install && npm run build`
*   **Publish Directory**: `dist`
*   **Environment Variables**:
    *   `VITE_API_BASE_URL`: `https://<your-backend-web-service-url>.onrender.com/api`

---

## Local Setup & Development

### Backend
1. Navigate to `/backend`.
2. Create a `.env` file containing:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/crm_db
   JWT_SECRET=your_super_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the live reloading development server.

### Frontend
1. Navigate to `/frontend`.
2. Create a `.env` file containing:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to launch the Vite local server (runs on `http://localhost:5173`).
