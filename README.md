# Sweet Shop Management System

A full-stack web application for managing an Indian sweet shop inventory. The system provides user authentication, product catalog management, search functionality, and role-based access control for administrators.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Development Journey](#development-journey)
- [My AI Usage](#my-ai-usage)
- [Known Limitations](#known-limitations)

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
|-------|------------|
| Backend | Java 17, Spring Boot 3.2.1, Spring Security 6 |
| Database | PostgreSQL 15 |
| Authentication | JWT (jjwt 0.12.3) |
| Testing | JUnit 5, Mockito, Spring Security Test |
| Code Coverage | JaCoCo (91% coverage) |
| Frontend | React 18, React Router 6 |
| Styling | Tailwind CSS 3.4 |
| HTTP Client | Axios |
| Build Tools | Maven 3.9+, npm |
| Containerization | Docker, Docker Compose |

## Project Structure

```
sweet-shop/
├── backend/
│   ├── src/main/java/com/sweetshop/
│   │   ├── config/           # Security and CORS configuration
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Request/Response data transfer objects
│   │   ├── entity/           # JPA entity classes
│   │   ├── enums/            # UserRole, SweetCategory enums
│   │   ├── exception/        # Custom exceptions and global handler
│   │   ├── repository/       # Spring Data JPA repositories
│   │   ├── security/         # JWT filter and token provider
│   │   └── service/          # Business logic layer
│   ├── src/test/java/        # Unit and integration tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context for auth state
│   │   └── services/         # API service layer
│   └── public/               # Static assets and images
├── docker-compose.yml
├── seed-data.js
└── README.md
```

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
| Admin | admin@sweetshop.com | Admin@123 |
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
| POST | /api/sweets/{id}/purchase | Purchase a sweet | User or Admin |
| POST | /api/sweets/{id}/restock | Restock a sweet | Admin only |

## Testing

### Running Tests

```bash
cd backend
mvn test
```

### Generating Coverage Report

```bash
mvn test jacoco:report
```

The report will be available at `backend/target/site/jacoco/index.html`.

### Coverage Summary

| Package | Coverage |
|---------|----------|
| Services | 98% |
| Controllers | 100% |
| Security | 80% |
| Overall | 91% |

The test suite includes 101 tests covering:
- Unit tests for service layer business logic
- Integration tests for REST endpoints
- Security tests for authentication and authorization
- Repository tests for data access layer

## Deployment

### Backend Deployment (Railway)

1. Create a Railway account at https://railway.app
2. Create a new project and add a PostgreSQL database
3. Connect your GitHub repository
4. Set the following environment variables:
   - `DATABASE_URL` - Provided by Railway PostgreSQL
   - `JWT_SECRET` - A secure random string (min 256 bits)
   - `CORS_ALLOWED_ORIGINS` - Your Vercel frontend URL

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Import your GitHub repository
3. Set the root directory to `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` - Your Railway backend URL (e.g., https://your-app.railway.app/api)

### Live Demo

- Frontend: [Vercel URL - to be added after deployment]
- Backend API: [Railway URL - to be added after deployment]

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

Initial TDD cycles are visible in commits `0452db0` through `e1a7518`. Additional test coverage was added later to achieve 91% overall coverage, demonstrating continuous quality improvement.

## My AI Usage

### Tools Used

- GitHub Copilot for code completion

### How AI Assisted Development

| Task | AI Involvement |
|------|----------------|
| Project scaffolding | Generated initial Spring Boot configuration and folder structure |
| Boilerplate code | JWT security configuration, DTO classes, exception handlers |
| UI components | Basic Tailwind CSS component templates |
| Test structure | Initial test class scaffolding |

### What I Wrote Manually

- Architecture decisions and package organization
- Core business logic in service layer
- Security configuration and JWT validation logic
- Custom exception handling
- All test assertions and edge case coverage
- Database schema design and entity relationships
- API endpoint design and request/response contracts

### Reflection

AI tools helped reduce time spent on repetitive boilerplate code, allowing me to focus on the aspects that matter most: business logic, security, and thorough testing. The TDD approach ensured that AI-generated code was validated against clearly defined requirements. Every piece of AI-suggested code was reviewed and often modified to fit the project's specific needs.

The 91% test coverage and clean separation of concerns demonstrate that AI assistance, when used responsibly, can accelerate development without sacrificing code quality.

## Known Limitations

1. **No payment processing** - Purchases only decrement inventory; no actual payment integration
2. **No email verification** - User registration is immediate without email confirmation
3. **No password reset** - Users cannot recover forgotten passwords through the application
4. **No rate limiting** - API endpoints do not have request throttling
5. **Single currency** - All prices are in INR only

## License

MIT License

---

Built as a TDD Kata assignment demonstrating full-stack development with emphasis on test-driven development, clean code practices, and security best practices.
