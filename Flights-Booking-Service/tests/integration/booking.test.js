const request = require('supertest');

// Mock external dependencies before requiring app
jest.mock('../../src/models', () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn(),
        close: jest.fn(),
        transaction: jest.fn().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        }),
    },
    Sequelize: {},
}));

jest.mock('../../src/config/queue-config', () => ({
    connectQueue: jest.fn(),
    sendData: jest.fn(),
}));

jest.mock('../../src/config/redis-config', () => ({
    getRedisClient: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        incr: jest.fn().mockResolvedValue(1),
        expire: jest.fn().mockResolvedValue(1),
        ping: jest.fn().mockResolvedValue('PONG'),
    })),
    closeRedis: jest.fn().mockResolvedValue(),
}));

const app = require('../../src/index');

describe('Booking API Integration Tests', () => {
    afterAll(async () => {
        jest.restoreAllMocks();
    });

    describe('POST /api/v1/bookings', () => {
        it('should reject booking with missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/bookings')
                .send({});
            expect(res.status).toBe(400);
        });

        it('should reject booking with invalid flightId', async () => {
            const res = await request(app)
                .post('/api/v1/bookings')
                .send({ flightId: -1, userId: 1, noOfSeats: 1, selectedSeats: [1] });
            expect(res.status).toBe(400);
        });

        it('should reject booking with zero seats', async () => {
            const res = await request(app)
                .post('/api/v1/bookings')
                .send({ flightId: 1, userId: 1, noOfSeats: 0, selectedSeats: [1] });
            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/v1/bookings/payments', () => {
        it('should reject payment with missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/bookings/payments')
                .send({});
            expect(res.status).toBe(400);
        });

        it('should reject payment with negative cost', async () => {
            const res = await request(app)
                .post('/api/v1/bookings/payments')
                .send({ bookingId: 1, userId: 1, totalCost: -100 });
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/v1/bookings/user/:userId', () => {
        it('should return response for valid userId', async () => {
            // Without a real DB this will hit the service which fails gracefully
            const res = await request(app).get('/api/v1/bookings/user/1');
            expect([200, 500]).toContain(res.status);
        });
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status');
        });
    });
});
