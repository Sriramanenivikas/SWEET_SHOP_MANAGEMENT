# Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, product inventory, and purchase functionality. Built using Test-Driven Development (TDD) methodology.

## Features

- User registration and authentication with JWT
- Browse and search sweets by name, category, and price
- Purchase sweets with real-time stock management
- Admin panel for inventory management (CRUD operations)
- Restock functionality for administrators
- Responsive, modern UI design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Database | PostgreSQL 15 |
| Auth | JWT (jjwt) |
| Testing | JUnit 5, Mockito |
| Frontend | React 19, Vite, Tailwind CSS |
| Deployment | Railway (Backend), Vercel (Frontend) |

## Project Structure

```
sweet-shop/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Application code
│   ├── src/test/java/      # Unit & integration tests
│   └── pom.xml
├── frontend/               # React SPA
│   ├── src/components/     # UI components
│   ├── src/pages/          # Route pages
│   ├── src/context/        # Auth context
│   └── src/services/       # API services
└── docker-compose.yml      # Local PostgreSQL
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.9+

### Backend Setup

1. Start PostgreSQL:
```bash
docker-compose up -d
```

2. Run tests:
```bash
cd backend
mvn test
```

3. Start the backend:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Sweets
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sweets` | List all sweets | Public |
| GET | `/api/sweets/search` | Search sweets | Public |
| POST | `/api/sweets` | Create sweet | Admin |
| PUT | `/api/sweets/{id}` | Update sweet | Admin |
| DELETE | `/api/sweets/{id}` | Delete sweet | Admin |

### Inventory
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/sweets/{id}/purchase` | Purchase | User |
| POST | `/api/sweets/{id}/restock` | Restock | Admin |

## Test Coverage

Run tests with coverage report:
```bash
cd backend
mvn test jacoco:report
```

View report at `backend/target/site/jacoco/index.html`

## My AI Usage

### Tools Used
- **GitHub Copilot**: Code completion for boilerplate

### How AI Was Used
1. **Project scaffolding**: Initial Spring Boot and React setup
2. **Boilerplate code**: JWT configuration, security filters, DTOs
3. **UI skeleton**: Basic Tailwind CSS component structure

### What I Wrote Manually
- All TDD test cases (Red phase)
- Core business logic implementation (Green phase)
- Code refactoring and optimization (Refactor phase)
- Architecture decisions and API design
- Error handling and validation logic

### Reflection
AI assisted with approximately 25% of the code, primarily for repetitive boilerplate and configuration. All core business logic, tests, and architectural decisions were made by the developer. The TDD approach ensured code quality with test-first development.

## Development Approach

This project follows **Test-Driven Development (TDD)**:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Improve code quality

Commit history demonstrates this pattern:
- `test(auth):` - Failing auth tests
- `feat(auth):` - Implementation to pass tests
- `refactor(backend):` - Code improvements

## License

MIT
