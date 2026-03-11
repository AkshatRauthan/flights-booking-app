# ✈️ Flights Booking Application

A production-ready **microservices-based flight booking system** built with Node.js, Express, MySQL, RabbitMQ, and Docker.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                       │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (:3001)                         │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────────┐    │
│  │ Rate Limiter│ │ Auth (JWT)   │ │ Reverse Proxy          │    │
│  │ (50/5min)   │ │ RBAC         │ │ (http-proxy-middleware) │    │
│  └─────────────┘ └──────────────┘ └────────────────────────┘    │
└─────┬──────────────────┬──────────────────┬─────────────────────┘
      │                  │                  │
      ▼                  ▼                  ▼
┌───────────┐   ┌──────────────┐   ┌──────────────┐
│  Flights  │   │   Flights    │   │   Flights    │
│ Creation  │   │  Searching   │   │   Booking    │
│ Service   │   │  Service     │   │   Service    │
│  (:3003)  │   │   (:3004)    │   │   (:3002)    │
└─────┬─────┘   └──────┬───────┘   └──────┬───────┘
      │                │                   │
      │                │                   │
      ▼                │                   ▼
┌───────────┐          │           ┌──────────────┐
│  MySQL    │◀─────────┘           │  RabbitMQ    │
│ (flights) │                      │  (messaging) │
└───────────┘                      └──────┬───────┘
                                          │
                                          ▼
                                  ┌──────────────┐
                                  │Notifications │
                                  │  Service     │
                                  │  (:3005)     │
                                  └──────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 3001 | Authentication, authorization, rate limiting, reverse proxy routing |
| **Flights Booking Service** | 3002 | Booking management, payment processing, seat booking, cron-based expiry |
| **Flights Creation Service** | 3003 | CRUD for flights, airplanes, airports, cities, airlines, and airline admins |
| **Flights Searching Service** | 3004 | Flight search proxy with caching layer (BFF pattern) |
| **Notifications Service** | 3005 | Email notifications via RabbitMQ consumer using Gmail SMTP |

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js |
| **Database** | MySQL 8.0 with Sequelize ORM |
| **Message Queue** | RabbitMQ 3+ |
| **Authentication** | JWT + bcrypt |
| **Service Auth** | AES-256-GCM encrypted tokens |
| **Email** | Nodemailer (Gmail SMTP) |
| **Logging** | Winston |
| **Security** | Helmet, CORS, express-rate-limit |
| **Scheduling** | node-cron |
| **Testing** | Jest + Supertest |
| **Containerization** | Docker + Docker Compose |

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **MySQL** >= 8.0
- **RabbitMQ** >= 3.x
- **npm** >= 9.x

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Flights Booking App"
   ```

2. **Set up environment variables**
   ```bash
   # Copy the root .env.example
   cp .env.example .env
   
   # Copy .env.example in each service
   for dir in API-Gateway Flights-Booking-Service Flights-Creation-Service Flights-Searching-Service Notifications-Service; do
     cp "$dir/.env.example" "$dir/.env"
   done
   ```
   
   Edit each `.env` file with your actual credentials.

3. **Create MySQL databases**
   ```sql
   CREATE DATABASE api_gateway_db;
   CREATE DATABASE flights_booking_db;
   CREATE DATABASE flights_db;
   CREATE DATABASE notifications_db;
   ```

4. **Install dependencies**
   ```bash
   for dir in API-Gateway Flights-Booking-Service Flights-Creation-Service Flights-Searching-Service Notifications-Service; do
     cd "$dir" && npm install && cd ..
   done
   ```

5. **Run database migrations and seeders**
   ```bash
   # In each service directory:
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Start all services**
   ```bash
   # In separate terminals:
   cd API-Gateway && npm start
   cd Flights-Creation-Service && npm start
   cd Flights-Searching-Service && npm start
   cd Flights-Booking-Service && npm start
   cd Notifications-Service && npm start
   ```

7. **Verify health**
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   curl http://localhost:3004/health
   curl http://localhost:3005/health
   ```

## API Reference

### API Gateway (Port 3001)

#### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/signup` | Register new user | None |
| POST | `/api/v1/auth/signin` | Login and get JWT | None |

#### User Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/user/:id/email` | Update user email | JWT + Owner |
| POST | `/api/v1/user/:id/password` | Update user password | JWT + Owner |
| DELETE | `/api/v1/user/:id` | Delete user account | JWT + Owner |
| POST | `/api/v1/user/role` | Assign role to user | JWT + Admin |
| GET | `/api/v1/user/:id/email` | Get user email | None |
| POST | `/api/v1/user/validate` | Validate user exists | Internal |

#### Proxy Routes
| Path Prefix | Target Service |
|-------------|---------------|
| `/flightsCreationService/*` | Flights Creation Service |
| `/flightsSearchingService/*` | Flights Searching Service |
| `/flightsBookingsService/*` | Flights Booking Service |

### Flights Creation Service (Port 3003)

#### Flights
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/flights` | Create a flight |
| GET | `/api/v1/flights` | Search flights with filters |
| GET | `/api/v1/flights/:id` | Get flight details |
| PATCH | `/api/v1/flights/:id/seats` | Update available seats |
| POST | `/api/v1/flights/validate` | Validate flight exists |

#### Airplanes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/airplanes` | Create an airplane |
| GET | `/api/v1/airplanes` | List all airplanes |
| GET | `/api/v1/airplanes/:id` | Get airplane by ID |
| PATCH | `/api/v1/airplanes/:id` | Update airplane |
| DELETE | `/api/v1/airplanes/:id` | Delete airplane |

#### Airports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/airports` | Create an airport |
| GET | `/api/v1/airports` | List all airports |
| GET | `/api/v1/airports/:id` | Get airport by ID |
| PATCH | `/api/v1/airports/:id` | Update airport |
| DELETE | `/api/v1/airports/:id` | Delete airport |

#### Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/cities` | Create a city |
| GET | `/api/v1/cities` | List all cities |
| GET | `/api/v1/cities/:id` | Get city by ID |
| PATCH | `/api/v1/cities/:id` | Update city |
| DELETE | `/api/v1/cities/:id` | Delete city |

#### Airlines
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/airlines` | Register an airline |
| POST | `/api/v1/airlines/:id` | Update airline (admin only) |
| GET | `/api/v1/airlines/:id` | Get airline details |
| POST | `/api/v1/airlines/admin/:airlineId` | Register airline admin |

### Flights Booking Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/bookings` | Create a booking |
| POST | `/api/v1/bookings/payments` | Process payment (idempotent) |
| POST | `/api/v1/bookings/cancel` | Cancel expired bookings |
| POST | `/api/v1/seats/bookings` | Reserve seats |

### Flights Searching Service (Port 3004)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/flights` | Search flights |
| GET | `/api/v1/flights/:id` | Get flight details |

### Notifications Service (Port 3005)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tickets` | Create notification ticket |

> **Note:** The Notifications Service primarily operates via RabbitMQ consumer, automatically sending emails when booking events are published.

## Project Structure

```
Flights Booking App/
├── docker-compose.yml          # Container orchestration
├── init-db.sql                 # Database initialization
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules
│
├── API-Gateway/                # Authentication & routing gateway
├── Flights-Booking-Service/    # Booking & payment processing
├── Flights-Creation-Service/   # Flight & airline management
├── Flights-Searching-Service/  # Flight search proxy (BFF)
└── Notifications-Service/      # Email notification handler
```

Each service follows the same internal structure:
```
<Service>/
├── Dockerfile
├── .dockerignore
├── .env.example
├── package.json
├── src/
│   ├── index.js              # Entry point with Express app
│   ├── config/               # Configuration (DB, Logger, Queue, Server)
│   ├── controllers/          # Request handlers
│   ├── middlewares/           # Validation, auth, error handling
│   ├── migrations/           # Sequelize database migrations
│   ├── models/               # Sequelize model definitions
│   ├── repositories/         # Data access layer
│   ├── routes/               # Express route definitions
│   ├── seeders/              # Database seed data
│   ├── services/             # Business logic layer
│   └── utils/                # Shared utilities, errors, enums
└── tests/
    └── unit/                 # Unit tests (Jest)
```

## Environment Variables

See `.env.example` in each service directory. Key variables:

| Variable | Service | Description |
|----------|---------|-------------|
| `PORT` | All | Service port number |
| `DB_HOST` | All (except Searching) | MySQL host |
| `DB_USERNAME` | All (except Searching) | MySQL username |
| `DB_PASSWORD` | All (except Searching) | MySQL password |
| `JWT_SECRET` | API Gateway | JWT signing secret |
| `JWT_EXPIRY` | API Gateway | JWT token expiry (e.g., `1h`) |
| `SALT_ROUNDS` | API Gateway | bcrypt salt rounds |
| `SERVICE_SECRET` | Gateway + Creation | Service-to-service auth secret |
| `RABBITMQ_USERNAME` | Booking + Notifications | RabbitMQ username |
| `RABBITMQ_PASSWORD` | Booking + Notifications | RabbitMQ password |
| `GMAIL_EMAIL` | Notifications | Gmail address for sending |
| `GMAIL_APP_PASSWORD` | Notifications | Gmail app password |

## Testing

Each service has its own test suite using **Jest**.

```bash
# Run tests for a specific service
cd API-Gateway && npm test

# Run tests for all services
for dir in API-Gateway Flights-Booking-Service Flights-Creation-Service Flights-Searching-Service Notifications-Service; do
  echo "=== Testing $dir ==="
  cd "$dir" && npm test && cd ..
done
```

**Test coverage:**
- API Gateway: 20 tests (auth service, user service, validation, error handling)
- Flights Booking Service: 16 tests (booking middlewares, services, error handling)
- Flights Creation Service: 10 tests (flight service, error handling)
- Flights Searching Service: 6 tests (flight service proxy, error handling)
- Notifications Service: 5 tests (email service, error handling)

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your production values

# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Check service health
curl http://localhost:3001/health

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Services started by Docker Compose

| Container | Image | Ports |
|-----------|-------|-------|
| flights-mysql | mysql:8.0 | 3306 |
| flights-rabbitmq | rabbitmq:3-management | 5672, 15672 |
| flights-api-gateway | custom | 3001 |
| flights-booking-service | custom | 3002 |
| flights-creation-service | custom | 3003 |
| flights-searching-service | custom | 3004 |
| flights-notifications-service | custom | 3005 |

Access RabbitMQ Management UI at `http://localhost:15672` (default: guest/guest).

## Key Features

- **RBAC Authorization** — Three roles: `system_admin`, `airline_admin`, `customer`
- **Service-to-Service Auth** — AES-256-GCM encrypted tokens for internal communication
- **Idempotent Payments** — Idempotency key support to prevent duplicate payments
- **Automatic Booking Expiry** — Cron job cancels bookings older than 5 minutes
- **Email Notifications** — Async booking confirmation emails via RabbitMQ
- **Rate Limiting** — 50 requests per 5 minutes per IP
- **Input Validation** — Request validation middleware on all mutation endpoints
- **Global Error Handling** — Consistent error response format across all services
- **Health Checks** — `/health` endpoint on every service
- **Graceful Shutdown** — SIGTERM/SIGINT handlers on all services
- **Structured Logging** — Winston logger with file and console transports

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is for educational purposes.
