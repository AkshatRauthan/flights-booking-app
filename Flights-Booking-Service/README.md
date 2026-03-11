# Flights Booking Service

Handles flight booking lifecycle — booking creation, payment processing, seat reservation, and automatic expiry of stale bookings.

## Responsibilities

- **Booking Management** — Create bookings with flight and seat validation
- **Payment Processing** — Idempotent payment handling with idempotency keys
- **Seat Booking** — Reserve and track individual seat assignments
- **Automatic Expiry** — Cron job cancels unpaid bookings after 5 minutes
- **Notifications** — Publishes booking events to RabbitMQ for email delivery

## API Endpoints

### Bookings (`/api/v1/bookings`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateCreateBooking` | Create a new booking |
| POST | `/payments` | `validateMakePayment` | Process payment for booking |
| POST | `/cancel` | — | Trigger cancellation of expired bookings |

### Seat Bookings (`/api/v1/seats/bookings`)
| Method | Path | Middleware | Description |
|--------|------|-----------|-------------|
| POST | `/` | `validateSeatBooking` | Reserve seats for a flight |

## Booking Flow

```
1. Client → POST /bookings
   ├── Validate flight exists (→ Creation Service)
   ├── Validate user exists (→ API Gateway)
   ├── Reserve seats (unique constraint: seat_id + flight_id)
   ├── Calculate total cost
   ├── Create booking (status: INITIATED)
   └── Decrement available seats (→ Creation Service)

2. Client → POST /bookings/payments
   ├── Validate idempotency key (x-idempotency-key header)
   ├── Check booking exists and is not cancelled
   ├── Verify 15-minute payment window
   ├── Match payment amount and user
   ├── Update status to BOOKED
   └── Send notification (→ RabbitMQ → Notifications Service)

3. Cron Job (every 5 minutes)
   └── Cancel bookings older than 5 minutes with status != BOOKED/CANCELLED
```

### Booking Status Flow
```
INITIATED → PENDING → BOOKED
    │                    
    └── CANCELLED (by cron or payment timeout)
```

## Database

- **Database:** `flights_booking_db`
- **Models:** Booking, Seat_Booking

### Booking Model
| Field | Type | Description |
|-------|------|-------------|
| `flightId` | INTEGER | Flight reference |
| `userId` | INTEGER | User reference |
| `status` | ENUM | initiated, pending, booked, cancelled |
| `totalCost` | INTEGER | Total booking cost |
| `noOfSeats` | INTEGER | Number of seats booked |

### Seat_Booking Model
| Field | Type | Description |
|-------|------|-------------|
| `user_id` | INTEGER | User reference |
| `seat_id` | INTEGER | Seat reference |
| `booking_id` | INTEGER | Booking reference |
| `flight_id` | INTEGER | Flight reference |

**Unique Constraint:** `(seat_id, flight_id)` — prevents double-booking a seat on the same flight.

## Payment Idempotency

All payment requests require an `x-idempotency-key` header to prevent duplicate payments:

```bash
curl -X POST http://localhost:3002/api/v1/bookings/payments \
  -H "Content-Type: application/json" \
  -H "x-idempotency-key: unique-payment-key-123" \
  -d '{"bookingId": 1, "userId": 1, "totalCost": 5500}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3002 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USERNAME` | MySQL username | — |
| `DB_PASSWORD` | MySQL password | — |
| `RABBITMQ_USERNAME` | RabbitMQ username | guest |
| `RABBITMQ_PASSWORD` | RabbitMQ password | guest |
| `RABBITMQ_HOST` | RabbitMQ host | localhost |
| `FLIGHT_CREATION_SERVICE` | Creation service URL | — |
| `FLIGHT_SEARCHING_SERVICE` | Searching service URL | — |
| `API_GATEWAY` | API Gateway URL | — |

## Setup

```bash
npm install
cp .env.example .env
npx sequelize-cli db:migrate
npm start
```

## Testing

```bash
npm test
```

16 unit tests covering booking middlewares, booking service, and error handling.
