# Notifications Service

Handles asynchronous email notifications for the Flights Booking Application. Consumes messages from RabbitMQ and sends emails via Gmail SMTP.

## Responsibilities

- **RabbitMQ Consumer** — Listens to `notification-queue` for booking events
- **Email Delivery** — Sends booking confirmation emails via Gmail SMTP (nodemailer)
- **Ticket Management** — Tracks notification status (pending, success, failed)
- **Retry Handling** — Failed messages are requeued for retry (nack with requeue)

## How It Works

```
Booking Service                   RabbitMQ                    Notifications Service
     │                               │                              │
     │  sendData(notification)        │                              │
     │──────────────────────────────►│                              │
     │                               │   consume(notification)      │
     │                               │─────────────────────────────►│
     │                               │                              │  sendEmail()
     │                               │                              │──────────────►Gmail
     │                               │         ack/nack             │
     │                               │◄─────────────────────────────│
```

### Message Format
```json
{
  "recipientEmail": "user@example.com",
  "subject": "Flight booked",
  "content": "Flight Booked For FlightID: 5 with BookingID: 12"
}
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/tickets` | Create a notification ticket |

## Database

- **Database:** `notifications_db`
- **Models:** Ticket (status: pending | success | failed)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Server port | 3005 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USERNAME` | MySQL username | — |
| `DB_PASSWORD` | MySQL password | — |
| `RABBITMQ_USERNAME` | RabbitMQ username | guest |
| `RABBITMQ_PASSWORD` | RabbitMQ password | guest |
| `RABBITMQ_HOST` | RabbitMQ host | localhost |
| `GMAIL_EMAIL` | Sender Gmail address | — |
| `GMAIL_APP_PASSWORD` | Gmail app password | — |

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use the generated 16-character password as `GMAIL_APP_PASSWORD`

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

5 unit tests covering email service and error handling.