const { z } = require('zod');

const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isDatabaseAdmin: z.boolean().optional(),
    isAirlineAdmin: z.boolean().optional(),
});

const signinSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const updateEmailSchema = z.object({
    newEmail: z.string().email('Must be a valid email address'),
});

const updatePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const addRoleSchema = z.object({
    id: z.number({ coerce: true }).int().positive('User ID must be positive'),
    roleName: z.enum(['system_admin', 'customer', 'airline_admin'], {
        errorMap: () => ({ message: 'roleName must be one of: system_admin, customer, airline_admin' }),
    }),
});

const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric value'),
});

module.exports = {
    signupSchema,
    signinSchema, 
    updateEmailSchema,
    updatePasswordSchema,
    addRoleSchema,
    idParamSchema,
};
