# Database Entity Relationship Diagram

## Overview

The Flights Booking App uses a **microservices architecture** with **4 separate MySQL databases**, each owned by a dedicated service. This ensures data isolation and independent scalability per service.

| Service | Database | Port |
|---|---|---|
| API Gateway | `api_gateway_db` | 3001 |
| Flights Booking Service | `flights_booking_db` | 3002 |
| Flights Creation Service | `flights_db` | 3003 |
| Notifications Service | `notifications_db` | 3005 |

> The **Flights Searching Service** (port 3004) does not own a database — it reads from the Flights Creation Service via HTTP and caches results in Redis.

---

## ER Diagram

```mermaid
erDiagram
    %% ===== API Gateway DB (api_gateway_db) =====

    users {
        INT id PK
        VARCHAR email UK "NOT NULL"
        VARCHAR password "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    roles {
        INT id PK
        ENUM name "system_admin | customer | airline_admin"
        DATETIME createdAt
        DATETIME updatedAt
    }

    user_roles {
        INT id PK
        INT userId FK "NOT NULL, UNIQUE"
        INT roleId FK "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    users ||--o{ user_roles : "has"
    roles ||--o{ user_roles : "assigned via"

    %% ===== Flights Creation DB (flights_db) =====

    cities {
        INT id PK
        VARCHAR name UK "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    airports {
        INT id PK
        VARCHAR name UK "NOT NULL"
        VARCHAR code UK "NOT NULL"
        VARCHAR address UK
        INT cityId FK "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    airplanes {
        INT id PK
        VARCHAR modelNumber "NOT NULL, alphanumeric"
        INT capacity "NOT NULL, 1-1000"
        DATETIME createdAt
        DATETIME updatedAt
    }

    airlines {
        INT id PK
        VARCHAR name UK "NOT NULL"
        VARCHAR email UK "NOT NULL"
        VARCHAR iataCode UK "NOT NULL, 2 chars"
        VARCHAR icaoCode UK "NOT NULL, 3 chars"
        VARCHAR country "NOT NULL, default India"
        VARCHAR contactNo UK "NOT NULL, 10-12 chars"
        ENUM status "active | inactive"
        VARCHAR logoIcon "URL, nullable"
        DATETIME createdAt
        DATETIME updatedAt
    }

    airline_admins {
        INT id PK
        INT user_id UK "NOT NULL"
        INT airline_id FK "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    seats {
        INT id PK
        INT row "NOT NULL"
        VARCHAR col "NOT NULL"
        ENUM type "business | economy | premium_economy | first_class"
        DATETIME createdAt
        DATETIME updatedAt
    }

    flights {
        INT id PK
        VARCHAR flightNumber UK "NOT NULL"
        INT airplaneId FK "NOT NULL"
        VARCHAR departureAirportId FK "NOT NULL"
        VARCHAR arrivalAirportId FK "NOT NULL"
        DATETIME arrivalTime "NOT NULL"
        DATETIME departureTime "NOT NULL"
        INT price "NOT NULL"
        VARCHAR boardingGate
        INT totalSeats "NOT NULL, auto from airplane"
        DATETIME createdAt
        DATETIME updatedAt
    }

    cities ||--o{ airports : "has"
    airports ||--o{ flights : "departure"
    airports ||--o{ flights : "arrival"
    airplanes ||--o{ flights : "operates"
    airplanes ||--o{ seats : "has"
    airlines ||--o{ airline_admins : "managed by"

    %% ===== Flights Booking DB (flights_booking_db) =====

    bookings {
        INT id PK
        INT flightId "NOT NULL"
        INT userId "NOT NULL"
        ENUM status "initiated | pending | booked | cancelled"
        INT totalCost "NOT NULL"
        INT noOfSeats "NOT NULL, default 1"
        DATETIME createdAt
        DATETIME updatedAt
    }

    seat_bookings {
        INT id PK
        INT user_id "NOT NULL"
        INT seat_id "NOT NULL"
        INT booking_id FK
        INT flight_id "NOT NULL"
        DATETIME createdAt
        DATETIME updatedAt
    }

    bookings ||--o{ seat_bookings : "contains"

    %% ===== Notifications DB (notifications_db) =====

    tickets {
        INT id PK
        VARCHAR subject "NOT NULL"
        VARCHAR content "NOT NULL"
        VARCHAR recipientEmail "NOT NULL"
        ENUM status "pending | success | failed"
        DATETIME createdAt
        DATETIME updatedAt
    }
```

---

## Databases & Tables

| Database | Service | Tables |
|---|---|---|
| `api_gateway_db` | API Gateway | `users`, `roles`, `user_roles` |
| `flights_db` | Flights Creation Service | `flights`, `airplanes`, `airports`, `cities`, `airlines`, `airline_admins`, `seats` |
| `flights_booking_db` | Flights Booking Service | `bookings`, `seat_bookings` |
| `notifications_db` | Notifications Service | `tickets` |

---

## Cross-Service References

These are **logical references** (not foreign keys) between databases:

| Source Table | Column | References | Target Database |
|---|---|---|---|
| `bookings.flightId` | flightId | `flights.id` | `flights_db` |
| `bookings.userId` | userId | `users.id` | `api_gateway_db` |
| `seat_bookings.user_id` | user_id | `users.id` | `api_gateway_db` |
| `seat_bookings.flight_id` | flight_id | `flights.id` | `flights_db` |
| `airline_admins.user_id` | user_id | `users.id` | `api_gateway_db` |

---

## Indexes

### API Gateway DB (`api_gateway_db`)

| Table | Index Name | Columns | Unique |
|---|---|---|---|
| `users` | `idx_users_email` | `email` | Yes |

### Flights Creation DB (`flights_db`)

| Table | Index Name | Columns | Unique |
|---|---|---|---|
| `flights` | `idx_flights_flightNumber` | `flightNumber` | Yes |
| `flights` | `idx_flights_route` | `departureAirportId`, `arrivalAirportId` | No |
| `flights` | `idx_flights_departureTime` | `departureTime` | No |
| `flights` | `idx_flights_price` | `price` | No |
| `airports` | `idx_airports_code` | `code` | Yes |
| `airlines` | `idx_airlines_iataCode` | `iataCode` | Yes |

### Flights Booking DB (`flights_booking_db`)

| Table | Index Name | Columns | Unique |
|---|---|---|---|
| `bookings` | `idx_bookings_userId` | `userId` | No |
| `bookings` | `idx_bookings_flightId` | `flightId` | No |
| `bookings` | `idx_bookings_status` | `status` | No |
| `seat_bookings` | `unique_seat_flight` | `seat_id`, `flight_id` | Yes |
| `seat_bookings` | `idx_seatbookings_bookingId` | `bookingId` | No |
| `seat_bookings` | `idx_seatbookings_flightId` | `flightId` | No |

### Notifications DB (`notifications_db`)

| Table | Index Name | Columns | Unique |
|---|---|---|---|
| `tickets` | `idx_tickets_status` | `status` | No |
| `tickets` | `idx_tickets_recipientEmail` | `recipientEmail` | No |
