# E-Commerce Backend Project

## Overview

This project is the backend for an e-commerce platform that manages categories, sub-categories, products, brands, orders, and users (admin, seller, customer). The project also includes payment gateway integration.

## Features

- **Categories & Sub-Categories**: Manage product categories and their corresponding sub-categories.
- **Products**: Create, update, delete, and view products associated with categories, sub-categories, and brands.
- **Brands**: Manage product brands.
- **Orders**: Handle customer orders, including order creation, status updates, and order history.
- **Users**: Admin, seller, and customer roles with specific permissions and access controls.
- **Payment Gateway**: Integrate and manage payment processes for customer orders.

## Tech Stack

- **Node.js/Express**: Web framework for building the backend API.
- **MongoDB/Mongoose**: Database and ODM for storing and managing data.
- **JSON Web Token (JWT)**: Authentication and authorization.
- **Bcrypt**: Password hashing and security.
- **Multer**: Middleware for handling file uploads.
- **Joi**: Schema validation.
- **Axios**: Promise-based HTTP client for making API requests.
- **Dotenv**: Environment variable management.
- **Nanoid**: Unique ID generation.
- **Slugify**: URL-friendly string generation for categories, sub-categories, and products.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/e-commerce-backend.git
    cd e-commerce-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup environment variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```bash
    PORT=your_port_number
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    PAYMENT_GATEWAY_API_KEY=your_payment_gateway_api_key
    ```

## Running the Project

1. **Start the server in development mode**:
    ```bash
    npm run dev
    ```
   This will start the server using `nodemon`, which will automatically restart the server when code changes are detected.

2. **Start the server in production mode**:
    ```bash
    npm start
    ```
   This will start the server normally without the automatic restart feature.

3. **Access the API**:
   Once the server is running, you can access the API at `http://localhost:<PORT>` where `<PORT>` is the port number specified in your `.env` file.

## API Endpoints

### Categories

- **GET /api/categories**: Get all categories
- **POST /api/categories**: Create a new category
- **PUT /api/categories/:id**: Update a category by ID
- **DELETE /api/categories/:id**: Delete a category by ID

### Sub-Categories

- **GET /api/subcategories**: Get all sub-categories
- **POST /api/subcategories**: Create a new sub-category
- **PUT /api/subcategories/:id**: Update a sub-category by ID
- **DELETE /api/subcategories/:id**: Delete a sub-category by ID

### Products

- **GET /api/products**: Get all products
- **POST /api/products**: Create a new product
- **GET /api/products/:id**: Get a product by ID
- **PUT /api/products/:id**: Update a product by ID
- **DELETE /api/products/:id**: Delete a product by ID

### Brands

- **GET /api/brands**: Get all brands
- **POST /api/brands**: Create a new brand
- **PUT /api/brands/:id**: Update a brand by ID
- **DELETE /api/brands/:id**: Delete a brand by ID

### Orders

- **GET /api/orders**: Get all orders
- **POST /api/orders**: Create a new order
- **GET /api/orders/:id**: Get an order by ID
- **PUT /api/orders/:id**: Update an order status by ID
- **DELETE /api/orders/:id**: Delete an order by ID

### Users

- **POST /api/auth/register**: Register a new user (admin, seller, or customer)
- **POST /api/auth/login**: Log in a user and obtain a JWT token
- **GET /api/users**: Get all users (admin only)
- **GET /api/users/:id**: Get a user by ID (admin only)
- **PUT /api/users/:id**: Update a user’s details (admin and user themselves)
- **DELETE /api/users/:id**: Delete a user by ID (admin only)

### Payment Gateway

- **POST /api/payments**: Process a payment for an order
- **GET /api/payments/:id**: Get payment details by ID
