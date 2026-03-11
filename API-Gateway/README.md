# API Gateway

The central entry point for the Flights Booking Application. Handles authentication, authorization, rate limiting, and proxies requests to downstream microservices.

## Responsibilities

- **User Authentication** — JWT-based signup/signin with bcrypt password hashing
- **RBAC Authorization** — Role-based access control (system_admin, airline_admin, customer)
- **Rate Limiting** — 50 requests per 5 minutes per IP address
- **Reverse Proxy** — Routes requests to Creation, Searching, and Booking services
- **Service-to-Service Auth** — Validates AES-256-GCM encrypted tokens from internal services
- **User Management** — Email/password updates, role assignment, account deletion

## API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/signup` | `validateAuthRequest` | Register a new user |
| POST | `/signin` | `validateAuthRequest` | Login and receive JWT token |

### User Management (`/api/v1/user`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/:id/email` | JWT + Owner | Update user email |
| POST | `/:id/password` | JWT + Owner | Update user password |
| DELETE | `/:id` | JWT + Owner | Delete user account |
| POST | `/role` | JWT + Admin | Assign role to user |
| GET | `/:id/email` | ID Validation | Get user email |
| POST | `/validate` | None | Check if user exists |

### Internal Routes (`/api/v1/internal`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/auth/signup` | Service Token | Internal user creation (service-to-service) |

### Proxy Routes
| Prefix | Target |
|--------|--------|
| `/flightsCreationService` | Flights Creation Service |
| `/flightsSearchingService` | Flights Searching Service |
| `/flightsBookingsService` | Flights Booking Service |

## Database

- **Database:** `api_gateway_db`
- **Models:** User, Role, UserRole

### Roles
| Role | Description |
|------|-------------|
| `system_admin` | Full system access |
| `airline_admin` | Airline management access |
| `customer` | Standard booking access |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Server port | 3001 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USERNAME` | MySQL username | — |
| `DB_PASSWORD` | MySQL password | — |
| `JWT_SECRET` | JWT signing key | — |
| `JWT_EXPIRY` | Token expiry | 1h |
| `SALT_ROUNDS` | bcrypt rounds | 10 |
| `SERVICE_SECRET` | Service auth secret | — |
| `FLIGHT_CREATION_SERVICE` | Creation service URL | — |
| `FLIGHT_SEARCHING_SERVICE` | Searching service URL | — |
| `FLIGHT_BOOKING_SERVICE` | Booking service URL | — |

## Setup

```bash
npm install
cp .env.example .env
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

## Testing

```bash
npm test
```

20 unit tests covering auth service, user service, validation middlewares, and error handling.