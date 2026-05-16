# Service Request Board 
**Repository:** https://github.com/Yenura/Mini-Service-Request-Board-Project

A mini full-stack app where homeowners post service requests and tradespeople browse, view details, and update status.

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Project Structure

```
├── backend/     # Express REST API
└── frontend/    # Next.js web app
```

## Prerequisites

- Node.js 18+
- MongoDB (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project
```

For Atlas, use your connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/globaltna-jobs
```

### Frontend (`frontend/.env.local`)

Copy `frontend/.env.local.example` to `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Setup & Run

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start MongoDB

Ensure MongoDB is running locally, or use your Atlas URI in `backend/.env`.

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

API runs at **http://localhost:5000**

### 5. Start the frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

App runs at **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (`?category=`, `?status=`) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create job |
| PATCH | `/api/jobs/:id` | Update status only |
| DELETE | `/api/jobs/:id` | Delete job |

## Frontend Pages

1. **Home** (`/`) — Job cards with category filter
2. **New request** (`/jobs/new`) — Create form with validation
3. **Job detail** (`/jobs/[id]`) — Full details, status dropdown, delete

The frontend calls the Express API only (not MongoDB directly).

## Submission

Push to a public GitHub repo and email the link to your GlobalTNA contact, CC: **nimeshsago@gmail.com**
