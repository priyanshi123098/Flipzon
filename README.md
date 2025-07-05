# Flipzon

Flipzon is a full-stack e-commerce application that allows users to browse items, add them to their cart, place orders, and manage their profiles. It also includes features for sellers to add items and manage orders.

## Features

### Frontend
- User authentication (Signup/Login).
- Browse items with search and category filters.
- Add items to the cart.
- Place orders with OTP verification.
- View order history and add reviews for sellers.
- Seller functionality to add items and view completed orders.
- Responsive design with a clean and user-friendly interface.

### Backend
- RESTful API built with Express.js.
- MongoDB database integration using Mongoose.
- JWT-based authentication and authorization.
- Secure password hashing with bcrypt.
- OTP generation and verification for order completion.
- Chat functionality using external APIs.

## Project Structure

### Frontend
- Built with React.js.
- Organized into components for modularity.
- Styling with CSS modules.

### Backend
- Built with Node.js and Express.js.
- Routes for user authentication, item management, cart operations, and order processing.
- Models for users, items, carts, and orders.

## Installation

### Prerequisites
- Node.js
- MongoDB

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/Flipzon.git
    cd Flipzon
    ```

2. Install dependencies for the backend:
    ```bash
    cd backend
    npm install
    ```
3. Install dependencies for the frontend:
    ```bash
    cd ../frontend
    npm install
    ```
4. Set up environment variables:
Create .env files in both backend and frontend directories.
Add the required environment variables as specified in the project.

5. Start the backend server:
    ```bash
    cd backend
    npm start
    ```
6. Start the frontend development server:
    ```bash
    cd ../frontend
    npm start
    ```

7. Open the application in your browser at http://localhost:3000.

## API Endpoints

### User Routes
- `POST /api/users` - Create a new user.
- `POST /api/auth` - Authenticate a user.

### Item Routes
- `GET /api/items` - Get all items.
- `POST /api/items/add` - Add a new item.

### Cart Routes
- `POST /api/cart/add-to-cart` - Add an item to the cart.
- `POST /api/cart/remove-from-cart` - Remove an item from the cart.
- `POST /api/cart/final-order` - Place an order.

### Order Routes
- `GET /api/cart/buyer-orders` - Get buyer orders.
- `POST /api/cart/verify-otp` - Verify OTP for order completion.

### Chat Routes
- `POST /api/chat` - Generate AI responses.

## Technologies Used

### Frontend
- React.js
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing