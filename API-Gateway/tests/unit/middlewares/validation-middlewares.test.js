const { validateUpdateEmail, validateUpdatePassword, validateAddRole, validateIdParam } = require('../../../src/middlewares/validation-middlewares');

describe('Validation Middlewares', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('validateUpdateEmail', () => {
        it('should call next for valid email', () => {
            req.body.newEmail = 'valid@email.com';
            validateUpdateEmail(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when newEmail is missing', () => {
            validateUpdateEmail(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 for invalid email format', () => {
            req.body.newEmail = 'not-an-email';
            validateUpdateEmail(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('validateUpdatePassword', () => {
        it('should call next for valid password update', () => {
            req.body.oldPassword = 'oldpass';
            req.body.newPassword = 'newpassword';
            validateUpdatePassword(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when oldPassword is missing', () => {
            req.body.newPassword = 'newpassword';
            validateUpdatePassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when newPassword is too short', () => {
            req.body.oldPassword = 'oldpass';
            req.body.newPassword = '12345';
            validateUpdatePassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateAddRole', () => {
        it('should call next for valid role assignment', () => {
            req.body.id = 1;
            req.body.roleName = 'customer';
            validateAddRole(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 for invalid role name', () => {
            req.body.id = 1;
            req.body.roleName = 'superadmin';
            validateAddRole(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should accept all valid role names', () => {
            const validRoles = ['system_admin', 'customer', 'airline_admin'];
            validRoles.forEach(role => {
                req.body = { id: 1, roleName: role };
                next.mockClear();
                validateAddRole(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('validateIdParam', () => {
        it('should call next for valid numeric id', () => {
            req.params.id = '123';
            validateIdParam(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 for non-numeric id', () => {
            req.params.id = 'abc';
            validateIdParam(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
