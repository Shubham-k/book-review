# Book Review API

A RESTful API built with Node.js and Express.js for a Book Review system. This API allows users to register, authenticate, manage books, and submit reviews with ratings.

## 🚀 Features

- **User Authentication**: JWT-based authentication with signup and login
- **Book Management**: Create, retrieve, and search books with pagination and filters
- **Review System**: Submit, update, and delete reviews with soft delete functionality
- **Search**: Partial and case-insensitive search by title or author
- **Data Validation**: Request validation using Joi
- **Database**: MySQL with migration system

## 📋 API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate and get JWT token

### Books

- `POST /books` - Add a new book (Authenticated)
- `GET /books` - Get all books with pagination and filters
- `GET /books/:id` - Get book details by ID with reviews
- `GET /books/search?q=term` - Search books by title or author

### Reviews

- `POST /books/:id/reviews` - Submit a review for a book (Authenticated)
- `PATCH /reviews/:id` - Update your own review (Authenticated)
- `DELETE /reviews/:id` - Delete your own review (Authenticated, Soft Delete)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Environment**: dotenv

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-review
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
DB_PORT=your-mysql-port
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Database Setup

Run migrations to create the database tables:

```bash
npm run migrate
```

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Debug mode
npm run debug
```

The server will start on `http://localhost:3000`

## 📖 API Usage Examples

### Authentication

#### Signup

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Books

#### Create a Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "description": "A classic American novel",
    "publishedYear": 1925
  }'
```

#### Get All Books (with pagination)

```bash
curl "http://localhost:3000/books?page=1&limit=10"
```

#### Get Books with Filters

```bash
curl "http://localhost:3000/books?author=Fitzgerald&genre=Fiction"
```

#### Get Book by ID

```bash
curl http://localhost:3000/books/1
```

#### Search Books

```bash
curl "http://localhost:3000/books/search?q=gatsby"
```

### Reviews

#### Submit a Review

```bash
curl -X POST http://localhost:3000/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Excellent book!"
  }'
```

#### Update a Review

```bash
curl -X PATCH http://localhost:3000/reviews/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Updated review"
  }'
```

#### Delete a Review (Soft Delete)

```bash
curl -X DELETE http://localhost:3000/reviews/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### Tables

#### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Books Table

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    description TEXT,
    published_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Reviews Table

```sql
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_review (user_id, book_id)
);
```

### Relationships

- **Users** → **Reviews** (One-to-Many)
- **Books** → **Reviews** (One-to-Many)
- **Users** ↔ **Books** (Many-to-Many through Reviews)

## 🎯 Design Decisions & Assumptions

### 1. Authentication

- **JWT Tokens**: Used for stateless authentication with 7-day expiration
- **Password Hashing**: bcryptjs with salt rounds of 10 for security
- **Username Generation**: Auto-generated unique usernames to avoid conflicts

### 2. Database Design

- **Soft Delete**: Reviews use soft delete (`deleted_at` column) to preserve data integrity
- **Unique Constraints**: One review per user per book to prevent spam
- **Foreign Keys**: Proper referential integrity with CASCADE delete for data consistency

### 3. API Design

- **RESTful**: Follows REST conventions for resource-based URLs
- **Pagination**: Database-level pagination for performance
- **Filtering**: Author and genre filters for better user experience
- **Search**: Partial, case-insensitive search for better discoverability

### 4. Validation

- **Joi Schemas**: Comprehensive request validation for all endpoints
- **Rating Constraints**: 1-5 star rating system with database constraints
- **Email Validation**: Proper email format validation

### 5. Error Handling

- **Consistent Responses**: Standardized error response format
- **HTTP Status Codes**: Appropriate status codes for different scenarios
- **Logging**: Console logging for debugging and monitoring

### 6. Security

- **Environment Variables**: Sensitive data stored in `.env` file
- **SQL Injection Prevention**: Parameterized queries throughout
- **CORS**: Ready for CORS configuration if needed

## 🔧 Configuration

### Environment Variables

- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `DB_PORT` - MySQL port
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)
