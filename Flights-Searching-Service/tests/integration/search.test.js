const request = require('supertest');

// Mock uuid (v13 is ESM-only, not compatible with Jest CJS transform)
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock external dependencies before requiring app
jest.mock('../../src/config/redis-config', () => ({
    getRedisClient: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        ping: jest.fn().mockResolvedValue('PONG'),
    })),
    closeRedis: jest.fn().mockResolvedValue(),
}));

const app = require('../../src/index');

describe('Flight Searching API Integration Tests', () => {
    afterAll(async () => {
        jest.restoreAllMocks();
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
