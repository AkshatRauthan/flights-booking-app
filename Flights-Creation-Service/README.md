# Flights Creation Service

Manages the core flight data domain — airplanes, airports, cities, flights, airlines, and airline administrators.

## Responsibilities

- **Flight Management** — Create, retrieve, and search flights with filters
- **Airplane Management** — CRUD operations for airplane fleet
- **Airport Management** — CRUD operations for airports
- **City Management** — CRUD operations for cities
- **Airline Management** — Register and manage airlines
- **Airline Admin Management** — Register airline admin users via API Gateway
- **Seat Management** — Track and update available seats per flight

## API Endpoints

### Flights (`/api/v1/flights`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateCreateObject` | Create a new flight |
| GET | `/` | — | Search flights with filters |
| GET | `/:id` | — | Get flight details |
| PATCH | `/:id/seats` | `validateUpdateSeatsRequest` | Update available seats |
| POST | `/:id/seats/validate` | — | Validate seat availability |
| POST | `/validate` | — | Validate flight exists |

### Airplanes (`/api/v1/airplanes`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateCreateObject` | Create airplane |
| GET | `/` | — | List all airplanes |
| GET | `/:id` | — | Get airplane by ID |
| PATCH | `/:id` | `validateUpdateObject` | Update airplane |
| DELETE | `/:id` | — | Delete airplane |

### Airports (`/api/v1/airports`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateCreateObject` | Create airport |
| GET | `/` | — | List all airports |
| GET | `/:id` | — | Get airport by ID |
| PATCH | `/:id` | `validateUpdateObject` | Update airport |
| DELETE | `/:id` | — | Delete airport |

### Cities (`/api/v1/cities`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateCreateObject` | Create city |
| GET | `/` | — | List all cities |
| GET | `/:id` | — | Get city by ID |
| PATCH | `/:id` | `validateUpdateObject` | Update city |
| DELETE | `/:id` | — | Delete city |

### Airlines (`/api/v1/airlines`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | — | Register an airline |
| POST | `/:id` | `isAirlineAdmin` | Update airline |
| GET | `/:id` | — | Get airline details |
| POST | `/admin/:airlineId` | `isAirlineAdmin`, `validateAirlineAdmin` | Register airline admin |

## Database

- **Database:** `flights_db` (shared with Searching Service)
- **Models:** Flight, Airplane, Airport, City, Airline, AirlineAdmin, Seat

### Flight Search Query Parameters
| Parameter | Example | Description |
|-----------|---------|-------------|
| `trips` | `MUM-DEL` | Departure-Arrival airport codes |
| `price` | `1000-5000` | Price range filter |
| `travellers` | `2` | Number of travelers |
| `tripDate` | `2024-12-25` | Travel date |
| `sort` | `price_ASC` | Sort field and direction |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Server port | 3003 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USERNAME` | MySQL username | — |
| `DB_PASSWORD` | MySQL password | — |
| `API_GATEWAY` | API Gateway URL | — |
| `SERVICE_SECRET` | Service auth secret | — |
| `RABBITMQ_USERNAME` | RabbitMQ username | guest |
| `RABBITMQ_PASSWORD` | RabbitMQ password | guest |

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

10 unit tests covering flight service and error handling.