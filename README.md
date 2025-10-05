# Task Manager Monorepo

A full-stack task management application that pairs a MongoDB-powered REST API with a React + TypeScript client. The repository is organized as a multi-package workspace (`server/` and `client/`) managed from the project root.

## Tech Stack

- **API:** Node.js, Express 5, TypeScript, Mongoose, JWT authentication, Swagger (OpenAPI 3)
- **Client:** React 18, Vite, TypeScript
- **Tooling:** Nodemon, ts-node, concurrently, Zod validation, Morgan logging

## Prerequisites

- Node.js 18+ and npm 9+
- MongoDB instance (local or hosted)
- Optional: modern package manager support for workspaces (npm already configured)

## Repository Layout

```
.
+-- client/     # React front-end (Vite)
+-- server/     # Express + TypeScript API
+-- package.json          # Root scripts for managing both apps
+-- README.md             # This file
```

## 1. Install Dependencies

From the repository root run:

```bash
npm install           # installs root tooling (concurrently)
npm run install:all   # installs dependencies in server/ and client/
```

> Tip: You can also install individually with `npm install` inside `server/` and `client/` if you prefer.

## 2. Configure Environment Variables

### API (`server/.env`)

Create a `.env` file in `server/` (see `.env.example`) and set:

```
PORT=5000                 # or any free port
MONGODB_URI=mongodb://... # connection string
JWT_SECRET=supersecret    # used for signing access tokens
API_BASE_URL=http://localhost:5000 # optional override for Swagger server entry
```

### Client (`client/.env`)

Create `client/.env` (see existing example) and update the API base URL to match the backend:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Manager
```

## 3. Start Development Servers

Run both apps together from the project root:

```bash
npm run dev
```

The command spawns:

- API: `http://localhost:5000` (configurable via `PORT`)
- Client: typically `http://localhost:5173` (Vite default)

### Run Services Individually

```bash
npm --prefix server run dev   # API with nodemon + ts-node
npm --prefix client run dev   # React client with Vite
```

## 4. API Documentation (Swagger)

- Interactive UI: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON: `http://localhost:5000/api-docs.json`

All Express routes are annotated with `@openapi` JSDoc blocks and backed by shared schemas in `server/src/config/swagger.ts`. Update those annotations when you add or change endpoints to keep the docs in sync.

## 5. Useful Scripts

### API (`server/`)

- `npm run dev` start the API with watch mode
- `npm run check` TypeScript type checking (`tsc --noEmit`)
- `npm run build` compile to `dist/`
- `npm start` run compiled JavaScript (`dist/index.js`)

### Client (`client/`)

- `npm run dev` Vite dev server
- `npm run build` production build into `dist/`
- `npm run preview` preview the production build locally
