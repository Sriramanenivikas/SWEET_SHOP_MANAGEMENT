# 🍬 Mithai - Sweet Shop Management System

A production-ready full-stack web application for managing an Indian sweet shop. Features user authentication, product catalog with search/filter, shopping cart functionality, and an admin dashboard for inventory management.

Built with modern technologies following **Test-Driven Development (TDD)** principles.

---

## ✨ Features

### Customer Features
- **Browse Sweets**: View all available sweets with beautiful product cards
- **Search & Filter**: Find sweets by name, category (Barfi, Ladoo, Halwa, Traditional, Namkeen), or price range
- **Purchase**: Buy sweets with real-time stock validation
- **User Authentication**: Secure registration and login with JWT tokens

### Admin Features
- **Inventory Management**: Full CRUD operations on products
- **Restock**: Increase stock quantities for products
- **Dashboard**: Admin-only access to management features

### Technical Features
- **JWT Authentication**: Secure stateless authentication with 24-hour token expiry
- **Role-Based Access Control**: USER and ADMIN roles with endpoint-level security
- **Input Validation**: Server-side validation with meaningful error messages
- **Responsive Design**: Mobile-first UI that works on all devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 17, Spring Boot 3.2.1, Spring Security 6 |
| **Database** | PostgreSQL 15 |
| **Authentication** | JWT (jjwt 0.12.3) |
| **Testing** | JUnit 5, Mockito, Spring Security Test |
| **Coverage** | JaCoCo (91% coverage) |
| **Frontend** | React 19, React Router 7 |
| **Styling** | Tailwind CSS 3.4, Framer Motion |
| **HTTP Client** | Axios |
| **Build Tools** | Maven 3.9+, Create React App |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```
sweet-shop/
├── backend/                      # Spring Boot REST API
│   ├── src/main/java/com/sweetshop/
│   │   ├── config/              # Security configuration
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Request/Response DTOs
│   │   ├── entity/              # JPA entities
│   │   ├── enums/               # UserRole, SweetCategory
│   │   ├── exception/           # Custom exceptions & handler
│   │   ├── repository/          # JPA repositories
│   │   ├── security/            # JWT filter & provider
│   │   └── service/             # Business logic
│   ├── src/test/java/           # 101 unit & integration tests
│   ├── Dockerfile               # Multi-stage Docker build
│   └── pom.xml
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route pages
│   │   ├── context/             # Auth context provider
│   │   └── services/            # API service layer
│   └── public/                  # Static assets & images
├── docker-compose.yml            # PostgreSQL container
├── seed-data.js                  # Database seeder script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/)
- **Maven 3.9+** - [Download](https://maven.apache.org/)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd sweet-shop

# Start PostgreSQL database
docker-compose up -d

# Start backend (in terminal 1)
cd backend
mvn spring-boot:run

# Start frontend (in terminal 2)
cd frontend
npm install
npm start
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| PostgreSQL | localhost:5433 |

### Seed the Database

```bash
# From project root
node seed-data.js
```

This creates:
- **Admin user**: `admin@sweetshop.com` / `Admin@123`
- **Customer user**: `customer@sweetshop.com` / `Customer@123`
- **30 premium Indian sweets** across 5 categories

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |

**Register Request:**
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
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### Sweet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sweets` | List all sweets (paginated) | Public |
| GET | `/api/sweets/{id}` | Get sweet by ID | Public |
| GET | `/api/sweets/search` | Search with filters | Public |
| POST | `/api/sweets` | Create new sweet | Admin |
| PUT | `/api/sweets/{id}` | Update sweet | Admin |
| DELETE | `/api/sweets/{id}` | Delete sweet | Admin |

**Search Parameters:**
- `name` - Filter by name (partial match)
- `category` - Filter by category (BARFI, LADOO, HALWA, TRADITIONAL, NAMKEEN)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 0)
- `size` - Page size (default: 12)

### Inventory Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/sweets/{id}/purchase` | Purchase sweet | User/Admin |
| POST | `/api/sweets/{id}/restock` | Restock sweet | Admin only |

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
mvn test
```

### Run with Coverage Report
```bash
mvn test jacoco:report
open target/site/jacoco/index.html
```

### Test Coverage Summary

| Package | Coverage |
|---------|----------|
| Services | 98% |
| Controllers | 100% |
| Security | 80% |
| **Overall** | **91%** |

**101 tests** covering:
- Unit tests for services and utilities
- Integration tests for REST endpoints
- Security tests for authentication and authorization
- Repository tests for data access

---

## 🔐 Security

### Authentication Flow
1. User registers or logs in via `/api/auth/*`
2. Server returns JWT token (valid 24 hours)
3. Client includes token in `Authorization: Bearer <token>` header
4. Server validates token on each request

### Security Features
- **BCrypt password hashing** with cost factor 12
- **JWT tokens** with HMAC-SHA256 signing
- **Role-based access control** (USER, ADMIN)
- **CORS configured** for frontend origins
- **Stateless sessions** (no server-side session storage)
- **Input validation** on all endpoints

---

## 🌍 Environment Variables

### Backend (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5433/sweetshop
spring.datasource.username=sweetshop
spring.datasource.password=sweetshop123

# JWT (use environment variable in production)
jwt.secret=${JWT_SECRET:your-256-bit-secret}
jwt.expiration=86400000
```

### Production Considerations
- Set `JWT_SECRET` as environment variable
- Use strong, unique database credentials
- Enable HTTPS
- Configure proper CORS origins

---

## 📸 Screenshots

*Screenshots of the application should be added here showing:*
- Landing page
- Product catalog with filters
- Admin dashboard
- Login/Register forms

---

## 🤖 My AI Usage

### Tools Used
- **GitHub Copilot**: Code completion and suggestions

### How AI Was Used
| Task | AI Involvement |
|------|----------------|
| Project scaffolding | Initial Spring Boot and React setup |
| Boilerplate code | JWT configuration, DTOs, security filters |
| UI components | Basic Tailwind CSS component structure |
| Test templates | Initial test class structure |

### What I Wrote Manually
- **Architecture decisions**: Package structure, API design
- **Business logic**: Service layer implementation
- **Security configuration**: JWT validation, role-based access
- **Error handling**: Custom exceptions, global handler
- **Test cases**: All 101 test cases and assertions
- **Database design**: Entity relationships, constraints

### Reflection
AI tools accelerated development of repetitive patterns (DTOs, CRUD operations) while I focused on core business logic, security implementation, and ensuring comprehensive test coverage. The TDD approach with 91% code coverage demonstrates commitment to code quality over speed.

---

## 📋 Development Approach

This project follows **Test-Driven Development (TDD)**:

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│   RED   │ ──► │  GREEN  │ ──► │ REFACTOR │
│  Write  │     │  Write  │     │ Improve  │
│ failing │     │ minimal │     │   code   │
│  tests  │     │  code   │     │ quality  │
└─────────┘     └─────────┘     └──────────┘
```

### Commit Convention
- `test(scope):` - New tests (RED phase)
- `feat(scope):` - New features (GREEN phase)
- `refactor(scope):` - Code improvements
- `fix(scope):` - Bug fixes
- `docs(scope):` - Documentation

---

## 🚧 Known Limitations

1. **No payment integration** - Purchase is simulated (decrements stock only)
2. **No email verification** - Registration is immediate
3. **No password reset** - Users cannot recover forgotten passwords
4. **No rate limiting** - Production should add request throttling
5. **Single currency** - Prices in INR only

---

## 📄 License

MIT License - feel free to use this project for learning or as a starter template.

---

## 👤 Author

Built as a TDD Kata assignment demonstrating:
- Full-stack development skills
- Security best practices
- Test-driven development methodology
- Clean code principles
