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
    createAirlineAdminReq: jest.fn(),
    getChannel: jest.fn(),
}));

const app = require('../../src/index');

describe('Flight Creation API Integration Tests', () => {
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
