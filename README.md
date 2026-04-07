# Farmer Land Compensation System

This project is a full-stack application designed to aid in the calculation of fair land compensation. It consists of a React frontend, a Node.js/Express backend, and a Python (FastAPI) Machine Learning service.

## Running the Backend

The backend is built with Node.js and Express, and it provides the authentication and database access layers.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Ensure you have a `.env` file set up in the `backend` directory (you can reference `.env.example` if it exists and fill in the required values like database credentials).

4.  **Run the Backend Server:**
    -   For development:
        ```bash
        npm run dev
        ```
    -   For production:
        ```bash
        npm start
        ```
    *Note: If you need to seed the database initially, you can run `npm run seed`.*

## Running the Machine Learning Service

The ML service is built with Python and FastAPI. It serves predictions for land compensation.

1.  **Navigate to the `ml` directory:**
    ```bash
    cd ml
    ```

2.  **Install Python requirements:**
    Ensure you have Python installed (preferably a virtual environment activated), and then install the dependencies using `pip`:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the ML API:**
    You can run the FastAPI server from the project root directory using:
    ```bash
    python -m ml.api
    ```
    *Alternatively, you can run it directly via Uvicorn:*
    ```bash
    uvicorn ml.api:app --host 0.0.0.0 --port 8001 --reload
    ```

## Running the Frontend

The frontend is a React application built with Vite.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
