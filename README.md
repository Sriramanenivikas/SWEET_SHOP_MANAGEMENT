# Sweet Shop Management System

A full-stack application for managing a sweet shop with user authentication, inventory management, and purchase functionality.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios

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

2. Run the backend:
```bash
cd backend
./mvnw spring-boot:run
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

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Sweets
- `GET /api/sweets` - List all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Create sweet (Admin)
- `PUT /api/sweets/{id}` - Update sweet (Admin)
- `DELETE /api/sweets/{id}` - Delete sweet (Admin)

### Inventory
- `POST /api/sweets/{id}/purchase` - Purchase sweet
- `POST /api/sweets/{id}/restock` - Restock sweet (Admin)

## Running Tests

```bash
cd backend
./mvnw test
```

## Project Structure

```
sweet-shop/
├── backend/           # Spring Boot API
├── frontend/          # React SPA
├── docker-compose.yml # PostgreSQL setup
└── README.md
```

## My AI Usage

*This section will be updated with details about AI tool usage during development.*

## License

MIT License
