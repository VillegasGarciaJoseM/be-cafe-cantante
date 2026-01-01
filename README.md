# Café Cantante - Flamenco Lyrics & Resources

**Café Cantante** is a modern web application dedicated to preserving and sharing the rich heritage of Flamenco lyrics (letras), styles (palos), and artists (autores). It scrapes data from trusted sources, organizes it in a structured database, and presents it through a beautiful, user-friendly interface.

## 🚀 Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS (Custom Flamenco Design System)
-   **Backend**: Node.js, Express, Swagger (OpenAPI)
-   **Database**: PostgreSQL, Prisma ORM
-   **Scraper**: Node.js, Cheerio, Axios
-   **DevOps**: Docker, Docker Compose

---

## 🐳 Quick Start (Docker)

The easiest way to run the entire application is using Docker Compose. This will start the Database, Backend, and Frontend services automatically.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd be-cafe-cantante
    ```

2.  **Run with Docker Compose**:
    ```bash
    docker compose up --build
    ```

3.  **Access the App**:
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:3000](http://localhost:3000)
    -   **API Documentation (Swagger)**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🛠 Manual Setup

If you prefer to run components individually without Docker, follow these steps.

### Prerequisites
-   Node.js (v18 or v20 recommended)
-   PostgreSQL installed and running locally

### 1. Database Setup
1.  Create a PostgreSQL database named `flamenco_db`.
2.  Configure the environment variable in a `.env` file (or export it):
    ```bash
    export DATABASE_URL="postgresql://postgres:password@localhost:5432/flamenco_db?schema=public"
    ```
3.  Run migrations:
    ```bash
    npx prisma migrate dev
    ```

### 2. Scraper (Populate Data)
To fetch lyrics and populate the database:
```bash
# Install dependencies
npm install

# Run the scraper
npx ts-node scraper/index.ts

# Verify data
npx ts-node verify_db.ts
```

### 3. Backend (API)
The backend serves the data via a REST API.
```bash
# Start the server
npx ts-node backend/src/server.ts
```
The API will be available at `http://localhost:3000`.

### 4. Frontend (UI)
The frontend is a React application built with Vite.
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📂 Project Structure

-   **`scraper/`**: Logic for scraping `canteytoque.es` and parsing HTML.
-   **`backend/`**: Express server, API routes (`/artists`, `/lyrics`, `/palos`), and Swagger config.
-   **`frontend/`**: React application with Tailwind CSS styling.
-   **`prisma/`**: Database schema and migrations.
-   **`docker-compose.yml`**: Orchestration for the full stack.

## 🎨 Design System

The UI uses a custom color palette inspired by traditional Flamenco imagery:
-   **Flamenco Red** (`#E63946`)
-   **Deep Blue** (`#1D3557`)
-   **Gold** (`#FFD700`)
-   **Cream** (`#F1FAEE`)
