# OPUS Anagram Finder

A full-stack web application that allows users to import a dictionary of words and search for anagrams quickly and efficiently. The application supports multilingual (Estonian/English) interfaces and includes a documented REST API.

## Tech Stack

* **Backend:** Symfony 8, PHP 8.1+, Doctrine ORM
* **Frontend:** React.js, i18next (Internationalization)
* **Database:** PostgreSQL
* **API Documentation:** NelmioApiDoc (Swagger UI)

## Prerequisites

Before you begin, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the database)
* [PHP](https://www.php.net/downloads) (v8.1 or higher)
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/) & npm
* [Symfony CLI](https://symfony.com/download) (optional, but recommended)

## Quick Start Guide

This project is pre-configured for a quick setup. The database configuration is committed to the repository for ease of testing, so **no manual `.env` configuration is required**.

### 1. Start the Database
The project includes a Docker Compose configuration to spin up the database instantly.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Start the database container:
    ```bash
    docker compose up -d
    ```

### 2. Backend Setup
Still inside the `backend/` directory, install dependencies and set up the schema:

1.  Install PHP packages:
    ```bash
    composer install
    ```
2.  Create the database schema:
    ```bash
    php bin/console doctrine:schema:update --force
    ```

### 3. Frontend Setup
Open a **new terminal window** and navigate to the frontend:

1.  Go to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

---

## Running the Application

You will need two terminal windows running simultaneously.

### Terminal 1: Backend API
Inside the `backend/` folder, run:

```bash
symfony server:start
```

*(Alternatively, using PHP built-in server: `php -S 127.0.0.1:8000 -t public`)*

The API will be available at: `http://127.0.0.1:8000`

### Terminal 2: Frontend Client

Inside the `frontend/` folder, run:

```bash
npm start
```

The application will automatically open in your browser at: `http://localhost:3000`

## Usage & Documentation

### API Documentation

The backend includes auto-generated Swagger documentation. You can view it by visiting:
**[http://127.0.0.1:8000/api/doc](http://127.0.0.1:8000/api/doc)**

### Note

* **Database Credentials:** The `.env` file is pre-configured to connect to the local Docker container (`user: app`, `pass: !ChangeMe!`). No manual configuration is required.

## Project Structure

**backend/src/Controller/**
* `ImportController.php`: Handles data ingestion (SRP).
* `SearchController.php`: Handles search requests (SRP).

**backend/src/Service/**
* `AnagramSolver.php`: A dedicated service for the sorting logic (DRY), injected into controllers via Dependency Injection.

**backend/src/Entity/**
* `Word.php`: Database entity representing a word and its sorted key.

**frontend/src/**
* `App.js`: Main React component containing state and logic.
* `App.css`: Responsive styling using Flexbox.
* `i18n.js`: Configuration for language switching (ET/EN).