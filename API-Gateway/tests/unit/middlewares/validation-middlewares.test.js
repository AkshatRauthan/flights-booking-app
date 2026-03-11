// Mock the deep dependency chain that reaches Sequelize
jest.mock('../../../src/models', () => ({}));
jest.mock('../../../src/repositories', () => ({}));
jest.mock('../../../src/services', () => ({}));
jest.mock('../../../src/config/queue-config', () => ({}));

const validate = require('../../../src/middlewares/validate');
const {
    signupSchema,
    signinSchema,
    updateEmailSchema,
    updatePasswordSchema,
    addRoleSchema,
    idParamSchema,
} = require('../../../src/middlewares/validators');

describe('Zod Validation Middlewares', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('updateEmailSchema', () => {
        const middleware = validate(updateEmailSchema);

        it('should call next for valid email', () => {
            req.body = { newEmail: 'valid@email.com' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when newEmail is missing', () => {
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 for invalid email format', () => {
            req.body = { newEmail: 'not-an-email' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('updatePasswordSchema', () => {
        const middleware = validate(updatePasswordSchema);

        it('should call next for valid password update', () => {
            req.body = { oldPassword: 'oldpass', newPassword: 'newpassword' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when oldPassword is missing', () => {
            req.body = { newPassword: 'newpassword' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when newPassword is too short', () => {
            req.body = { oldPassword: 'oldpass', newPassword: '12345' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('addRoleSchema', () => {
        const middleware = validate(addRoleSchema);

        it('should call next for valid role assignment', () => {
            req.body = { id: 1, roleName: 'customer' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 for invalid role name', () => {
            req.body = { id: 1, roleName: 'superadmin' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should accept all valid role names', () => {
            const validRoles = ['system_admin', 'customer', 'airline_admin'];
            validRoles.forEach(role => {
                req.body = { id: 1, roleName: role };
                next.mockClear();
                res.status.mockClear();
                middleware(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('idParamSchema', () => {
        const middleware = validate(idParamSchema, 'params');

        it('should call next for valid numeric id', () => {
            req.params = { id: '123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 for non-numeric id', () => {
            req.params = { id: 'abc' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('signupSchema', () => {
        const middleware = validate(signupSchema);

        it('should call next for valid signup', () => {
            req.body = { email: 'test@test.com', password: 'password123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 for invalid email', () => {
            req.body = { email: 'invalid', password: 'password123' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 for short password', () => {
            req.body = { email: 'test@test.com', password: '12' };
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
