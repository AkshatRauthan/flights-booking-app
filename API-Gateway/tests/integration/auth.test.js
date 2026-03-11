const request = require('supertest');

// Mock external dependencies before requiring app
jest.mock('http-proxy-middleware', () => ({
    createProxyMiddleware: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../../src/config/redis-config', () => ({
    getRedisClient: jest.fn(() => ({
        ping: jest.fn().mockResolvedValue('PONG'),
    })),
    closeRedis: jest.fn().mockResolvedValue(),
}));

jest.mock('../../src/config/queue-config', () => ({
    connectQueue: jest.fn(),
    sendData: jest.fn(),
    getChannel: jest.fn(),
}));

jest.mock('../../src/services/auth-service', () => ({
    createUser: jest.fn(),
    authenticateUser: jest.fn(),
    isAirlineAdmin: jest.fn(),
}));

jest.mock('../../src/services/user-service', () => ({
    isAuthenticated: jest.fn(),
    addRoleToUser: jest.fn(),
    isAdmin: jest.fn(),
    getUserEmailById: jest.fn(),
    isValidUser: jest.fn(),
    deleteUserById: jest.fn(),
    updateUserEmailById: jest.fn(),
    updateUserPasswordById: jest.fn(),
}));

const app = require('../../src/index');
const AuthService = require('../../src/services/auth-service');

describe('Auth API Integration Tests', () => {
    afterAll(async () => {
        jest.restoreAllMocks();
    });

    describe('POST /api/v1/auth/signup', () => {
        it('should reject signup with invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({ email: 'invalid', password: '123456' });
            expect(res.status).toBe(400);
        });

        it('should reject signup with short password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({ email: 'test@test.com', password: '12' });
            expect(res.status).toBe(400);
        });

        it('should reject signup with missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({});
            expect(res.status).toBe(400);
        });

        it('should accept valid signup data', async () => {
            AuthService.createUser.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });

            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({ email: 'test@test.com', password: 'password123' });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success', true);
        });
    });

    describe('POST /api/v1/auth/signin', () => {
        it('should reject signin with missing password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signin')
                .send({ email: 'test@test.com' });
            expect(res.status).toBe(400);
        });

        it('should reject signin with invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signin')
                .send({ email: 'invalid', password: 'password123' });
            expect(res.status).toBe(400);
        });
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const res = await request(app).get('/api/v1/nonexistent');
            expect(res.status).toBe(404);
        });
    });
});
