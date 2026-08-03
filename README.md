# EXAMFORGE AI - Assessment Operating System Monorepo

EXAMFORGE AI reduces examination creation time from 10+ hours to under 30 seconds by orchestrating multiple AI agents to parse syllabi, map blueprints, generate questions, check duplicate semantic profiles, and compile institutional PDFs.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Shadcn UI, Recharts, Zustand, React Query, React Hook Form, Zod.
*   **Backend**: Python, FastAPI, SQLAlchemy (Async), Alembic, Pydantic, Celery, Redis, LangChain, pgvector.
*   **Infrastructure**: Docker, Nginx, Railway, Vercel.

---

## 📂 Repository Layout

```
examforge-monorepo/
├── backend/            # Python FastAPI service & Celery worker nodes
├── frontend/           # React 19 Client SPA
├── docker-compose.yml  # Multi-container orchestration configurations
├── nginx.conf          # Local gateway proxy schema
└── README.md           # This instructions page
```

---

## 🚀 Getting Started

### 1. Prerequisite Installations
*   Ensure **Docker & Docker Compose** are installed and running.
*   Ensure **Node.js** (v18+) is available.
*   Ensure **Python** (3.11+) is available.

### 2. Local Environment Setup
1.  Initialize backend configurations:
    ```bash
    cd backend
    cp .env.example .env
    ```
2.  Configure your LLM API keys (e.g. `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`) and Cloudflare R2 values in the newly created `.env` file.

### 3. Spin Up Services Using Docker Compose
In the root directory, launch the database, cache, backend, and background worker containers:
```bash
docker-compose up --build
```
This boots:
*   PostgreSQL + pgvector at `localhost:5432`
*   Redis at `localhost:6379`
*   FastAPI Backend API at `localhost:8000` (docs available at `http://localhost:8000/docs`)
*   Celery Worker Cluster enqueuing OCR & Generation tasks.

### 4. Launch Client Development Server
In another terminal, compile and run the React client:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔬 Running Test Suites

*   **Run Backend Tests (pytest)**:
    ```bash
    cd backend
    pytest
    ```
*   **Run Frontend Checks (TypeScript Compile Check)**:
    ```bash
    cd frontend
    npm run build
    ```
