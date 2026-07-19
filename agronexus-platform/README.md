# AgroNexus Platform

AgroNexus is an AI-powered compound risk prediction platform designed to assist farmers by identifying simultaneous financial and disaster vulnerabilities. The platform optimizes the allocation of limited relief resources using advanced optimization techniques.

## Project Structure

The project is organized into two main parts: the frontend and the backend.

### Frontend

The frontend is built using React and TypeScript. It includes:

- **public/index.html**: The main HTML entry point for the application.
- **src/components**: Reusable React components.
- **src/pages**: Different page components representing distinct views.
- **src/services**: Service files for handling API calls and business logic.
- **src/styles**: CSS or styling files for the application.
- **src/App.tsx**: The main component that sets up routing and layout.
- **src/main.tsx**: The entry point for the React application.

### Backend

The backend is developed using Python and FastAPI. It includes:

- **app/api**: API endpoints for handling requests and responses.
- **app/models**: Data models defining the structure of the data.
- **app/services**: Service files for business logic and data manipulation.
- **app/main.py**: The entry point for the backend application.

## Getting Started

To get started with the AgroNexus platform, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/agronexus-platform.git
   cd agronexus-platform
   ```

2. Set up the backend:
   - Navigate to the backend directory and install the required dependencies:
     ```bash
     cd backend
     pip install -r requirements.txt
     ```

3. Set up the frontend:
   - Navigate to the frontend directory and install the required dependencies:
     ```bash
     cd frontend
     npm install
     ```

4. Run the application:
   - Start the backend server:
     ```bash
     cd backend
     python app/main.py
     ```
   - Start the frontend application:
     ```bash
     cd frontend
     npm start
     ```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.