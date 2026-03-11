# Flights Searching Service

A Backend-for-Frontend (BFF) service that proxies flight search queries to the Flights Creation Service. Acts as an abstraction layer for client-facing search operations.

## Responsibilities

- **Flight Search Proxy** — Forwards search queries with filters to Creation Service
- **Single Flight Lookup** — Retrieves individual flight details
- **Response Transformation** — Normalizes flight data for client consumption

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/flights` | Search flights with query filters |
| GET | `/api/v1/flights/:id` | Get specific flight details |

### Query Parameters
| Parameter | Example | Description |
|-----------|---------|-------------|
| `trips` | `MUM-DEL` | Departure-Arrival airport code pair |
| `price` | `1000-5000` | Price range |
| `travellers` | `2` | Number of seats needed |
| `tripDate` | `2024-12-25` | Date of travel |
| `sort` | `price_ASC` | Sort order |

## Architecture Note

This service currently acts as a pass-through proxy to the Flights Creation Service using Axios. Future enhancements:
- **Redis caching** for frequently searched routes
- **Response aggregation** from multiple data sources
- **Search analytics** and trending routes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Server port | 3004 |
| `FLIGHT_CREATION_SERVICE` | Creation service URL | — |

## Setup

```bash
npm install
cp .env.example .env
npm start
```

## Testing

```bash
npm test
```

6 unit tests covering flight service proxy and error handling.