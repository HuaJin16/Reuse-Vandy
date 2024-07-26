# Reuse-Vandy

A responsive MERN stack marketplace for Vanderbilt students to buy and sell used items

## Features

- Secure user authentication with email verification
- Intuitive item listing and browsing interface
- Advanced search funcationality
- Real-time statistics and updates
- Real-time messaging between users

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:HuaJin16/Reuse-Vandy.git
   ```

2. Install the dependencies:

   ```bash
   cd Reuse-Vandy
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Start the client:

   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173/`

## Environment Variables

### Client-side (.env file in the client folder):

VITE_FIREBASE_API_KEY = your_firebase_api_key

### Server-side (.env file in the root directory):

PORT = backend_port_number
MONGO_URL = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
HOST = your_email_service_provider
EMAIL_PORT = your_email_service_provider_port
SECURE = true
USER = your_email_address
PASS = your_app_specific_password

Replace the placeholders with your actual values. Do not commit these files to your repository
