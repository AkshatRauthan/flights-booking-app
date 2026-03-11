jest.mock('../../../src/repositories', () => ({
    UserRepository: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        getUserByEmail: jest.fn(),
        updateUserEmailById: jest.fn(),
        updateUserPasswordById: jest.fn(),
        deleteUserById: jest.fn(),
    })),
    RoleRepository: jest.fn().mockImplementation(() => ({
        getRoleByName: jest.fn(),
    })),
    UserRoleRepository: jest.fn().mockImplementation(() => ({
        getUserRoleByUserId: jest.fn(),
        deleteUserRoleByUserId: jest.fn(),
    })),
}));

jest.mock('../../../src/models', () => ({
    sequelize: {
        transaction: jest.fn().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        }),
    },
}));

jest.mock('../../../src/config', () => ({
    Logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

jest.mock('../../../src/utils/common', () => ({
    AuthFunctions: {
        verifyToken: jest.fn(),
        checkPassword: jest.fn(),
        hashPassword: jest.fn(),
    },
    ENUMS: {
        USER_ROLES_ENUMS: {
            SYSTEM_ADMIN: 'system_admin',
            CUSTOMER: 'customer',
            AIRLINE_ADMIN: 'airline_admin',
        },
    },
}));

const UserService = require('../../../src/services/user-service');
const { AuthFunctions } = require('../../../src/utils/common');

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isAuthenticated', () => {
        it('should throw error when token is missing', async () => {
            await expect(UserService.isAuthenticated(null))
                .rejects
                .toThrow('Authentication token missing in the request body');
        });

        it('should throw error when token is empty string', async () => {
            await expect(UserService.isAuthenticated(''))
                .rejects
                .toThrow('Authentication token missing in the request body');
        });
    });

    describe('exports', () => {
        it('should export all expected functions', () => {
            expect(UserService.isAuthenticated).toBeDefined();
            expect(UserService.addRoleToUser).toBeDefined();
            expect(UserService.isAdmin).toBeDefined();
            expect(UserService.getUserEmailById).toBeDefined();
            expect(UserService.isValidUser).toBeDefined();
            expect(UserService.deleteUserById).toBeDefined();
            expect(UserService.updateUserEmailById).toBeDefined();
            expect(UserService.updateUserPasswordById).toBeDefined();
        });
    });
});
