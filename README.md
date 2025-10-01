# Project Poggers

This project consists of a frontend built with React and Vite, and a backend built with Laravel.

## Technologies Used

### Frontend
*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **Axios:** Promise based HTTP client for the browser and node.js.
*   **React Router DOM:** Declarative routing for React.js.
*   **React Toastify:** React notification library.
*   **ESLint:** Pluggable JavaScript linter.

### Backend
*   **Laravel:** A PHP web application framework with expressive, elegant syntax.
*   **PHP:** A popular general-purpose scripting language.
*   **Composer:** Dependency manager for PHP.
*   **Guzzle HTTP:** PHP HTTP client.
*   **Laravel Sanctum:** API authentication for SPAs, mobile applications, and simple, token based APIs.
*   **Laravel Tinker:** Powerful REPL for Laravel.
*   **Vite:** (Used for asset compilation in Laravel)

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
*   Node.js (LTS recommended)
*   npm or yarn
*   PHP (8.0.2 or higher)
*   Composer
*   A database (e.g., MySQL, PostgreSQL, SQLite)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Composer dependencies:**
    ```bash
    composer install
    ```

3.  **Copy the environment file:**
    ```bash
    cp .env.example .env
    ```

4.  **Generate application key:**
    ```bash
    php artisan key:generate
    ```

5.  **Configure your database:**
    Open the `.env` file and update the database connection details:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    
    HUGGINGFACE_API_TOKEN=your_huggingface_api_token
    ```
    
    Make sure to replace `your_huggingface_api_token` with your actual Hugging Face API token.
6.  **Run database migrations:**
    ```bash
    php artisan migrate
    ```

7.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
    The backend will typically run on `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Vite development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend will typically run on `http://localhost:5173`.

## API Endpoints

The API routes are defined in `backend/routes/api.php`. You can inspect this file to see the available endpoints.

## Project Structure

```
.
├───backend/              # Laravel backend application
└───frontend/             # React.js frontend application
```
