# Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory with user authentication, product catalog, search functionality, and role-based access control.

## Live Demo

- **Application :** https://sweet-shop-management-nu.vercel.app

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | newadmin@sweetshop.com | Admin@123 |
| Customer | customer@sweetshop.com | Customer@123 |

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Development Journey](#development-journey)
- [My AI Usage](#my-ai-usage)


## Overview

This application allows customers to browse and purchase Indian sweets, while administrators can manage inventory through a dedicated dashboard. Key features include:

**For Customers:**
- Browse available sweets with images and descriptions
- Search and filter by name, category, or price range
- Purchase items with real-time stock validation
- Secure account registration and login

**For Administrators:**
- Add, edit, and delete products
- Restock inventory
- View all transactions

**Technical Highlights:**
- JWT-based stateless authentication (24-hour token expiry)
- Role-based access control (USER and ADMIN roles)
- Server-side validation with detailed error messages
- Responsive design for mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|---------|
| Backend | Java 17, Spring Boot 3.2.1, Spring Security 6 |
| Database | PostgreSQL 15 |
| Authentication | JWT (jjwt 0.12.3) |
| Testing | JUnit 5, Mockito, Spring Security Test |
| Frontend | React 18, React Router 6 |
| Styling | Tailwind CSS 3.4 |
| HTTP Client | Axios |
| Build Tools | Maven 3.9+, npm |
| Containerization | Docker, Docker Compose |


## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- Maven 3.9 or higher

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Sriramanenivikas/SWEET_SHOP_MANAGEMENT.git
cd SWEET_SHOP_MANAGEMENT
```

2. Start the PostgreSQL database:
```bash
docker-compose up -d
```

3. Start the backend server:
```bash
cd backend
mvn spring-boot:run
```

4. In a separate terminal, start the frontend:
```bash
cd frontend
npm install
npm start
```

5. Seed the database with sample data:
```bash
node seed-data.js
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | newadmin@sweetshop.com | Admin@123 |
| Customer | customer@sweetshop.com | Customer@123 |

### Access URLs (Local)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| PostgreSQL | localhost:5433 |

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Authenticate and receive JWT | No |

**Registration Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/sweets | List all sweets (paginated) | No |
| GET | /api/sweets/{id} | Get sweet by ID | No |
| GET | /api/sweets/search | Search with filters | No |
| POST | /api/sweets | Create new sweet | Admin |
| PUT | /api/sweets/{id} | Update sweet | Admin |
| DELETE | /api/sweets/{id} | Delete sweet | Admin |

**Sweet Object Structure:**
```json
{
  "id": "uuid",
  "name": "Kaju Katli",
  "category": "BARFI",
  "price": 450.00,
  "quantity": 50,
  "description": "Premium cashew fudge with silver vark",
  "imageUrl": "/BARFI/Kaju_Barfi.jpg"
}
```

Each sweet has: unique ID, name, category, price, and quantity in stock (as required).

**Search Query Parameters:**
- `name` - Filter by name (partial match, case-insensitive)
- `category` - Filter by category (BARFI, LADOO, HALWA, TRADITIONAL, NAMKEEN)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 0)
- `size` - Page size (default: 12)

### Inventory

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/sweets/{id}/purchase | Purchase a sweet (decreases quantity) | User or Admin |
| POST | /api/sweets/{id}/restock | Restock a sweet (increases quantity) | Admin only |

## Testing

The project follows Test-Driven Development principles. See [TEST_REPORT.md](TEST_REPORT.md) for the complete test report.

### Running Tests

```bash
cd backend
mvn test
```

### Test Coverage

```bash
mvn test jacoco:report
# Report at: target/site/jacoco/index.html
```

### Summary

| Metric | Value |
|--------|-------|
| Total Tests | 101 |
| Passed | 101 |
| Failed | 0 |
| Line Coverage | 91% |

### Test Categories

- **Service Tests:** Business logic validation (24 tests)
- **Controller Tests:** REST endpoint integration (39 tests)  
- **Security Tests:** Authentication and authorization (19 tests)
- **Repository Tests:** Data access layer (18 tests)
- **Context Test:** Application startup (1 test)

## Screenshots

### Login Page
<img width="1280" height="719" alt="image" src="https://github.com/user-attachments/assets/b1980a3c-7300-4646-842a-c6d47782ee50" />


### Shop Page - Product Catalog
<img width="1280" height="719" alt="image" src="https://github.com/user-attachments/assets/a8cbec12-9987-463a-b29a-d4bc73c3b2f6" />

 
### Products 
<img width="1280" height="725" alt="image" src="https://github.com/user-attachments/assets/946cade3-2afa-4051-9717-39fca631aedd" />


### Admin Dashboard 
<img width="1280" height="718" alt="image" src="https://github.com/user-attachments/assets/b4b659b1-b59e-4868-93b1-6414524c0463" />

### Register Page
<img width="1280" height="725" alt="image" src="https://github.com/user-attachments/assets/ef3b2371-6780-49e7-a717-e1a7de284e5a" />


## Development Journey

This project was developed following Test-Driven Development (TDD) principles. The commit history demonstrates the Red-Green-Refactor cycle:

1. **RED Phase**: Write failing tests that define expected behavior
2. **GREEN Phase**: Write minimal code to make tests pass
3. **REFACTOR Phase**: Improve code quality while keeping tests green

Key commits showing this pattern:
- `test(auth): Add failing tests for user authentication` - RED
- `feat(auth): Implement registration and login with JWT` - GREEN
- `test(sweets): Add failing tests for CRUD and inventory` - RED
- `feat(sweets): Implement CRUD, search and inventory operations` - GREEN
- `refactor(backend): Add logging and improve error messages` - REFACTOR

Initial TDD cycles are visible in commits `0452db0` through `e1a7518`. Additional test coverage was added later to achieve overall coverage, demonstrating continuous quality improvement.

## My AI Usage

This section documents how AI tools were used during development, as required by the assignment guidelines.

### Tools Used

- GitHub Copilot  

### Where AI Helped

**Project Setup and Boilerplate:**
I used Copilot to generate the initial Spring Boot project structure, including the basic security configuration and JWT setup. This saved time on repetitive configuration that follows well-established patterns.

**DTO and Entity Classes:**
Copilot suggested the data transfer objects and entity field definitions based on the requirements. I reviewed and modified these to match the specific needs of the sweet shop domain.

**Test Scaffolding:**
For the test classes, I used Copilot to generate the initial test structure and some common test patterns. I then wrote the specific assertions and edge cases manually to ensure meaningful coverage.

**Frontend Components:**
Basic React component structure and Tailwind CSS classes were suggested by Copilot. The actual component logic, state management, and API integration were written manually.

### What I Wrote Without AI

- All business logic in the service layer
- Security configuration and authorization rules
- API endpoint design and request/response contracts
- Database schema and entity relationships
- Test assertions and edge case identification
- Error handling strategy
- Frontend routing and state management
- Search and filter implementation

### Commits with AI Assistance

The following commits include AI-generated code (marked with Co-authored-by):
- Initial project setup
- JWT security boilerplate
- DTO class generation
- Basic test structure
 
