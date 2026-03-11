jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
    Mailer: {
        sendMail: jest.fn(),
    },
    ServerConfig: {},
}));

jest.mock('../../../src/repositories', () => ({
    TicketRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        getPendingTickets: jest.fn(),
    })),
}));

jest.mock('../../../src/models', () => ({
    Ticket: {
        findAll: jest.fn().mockResolvedValue([]),
    },
}));

jest.mock('../../../src/utils/common', () => ({
    ENUMS: {
        TICKET_STATUS_ENUMS: { FAILED: 'FAILED', SUCCESS: 'SUCCESS' },
    },
    createErrorResponse: jest.fn(),
    createSuccessResponse: jest.fn(),
}));

const EmailService = require('../../../src/services/email-service');
const { Mailer } = require('../../../src/config');

describe('Email Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sendEmail', () => {
        it('should send email via Mailer', async () => {
            Mailer.sendMail.mockResolvedValue({ messageId: 'msg-123' });
            
            const result = await EmailService.sendEmail(
                'from@test.com', 'to@test.com', 'Test Subject', 'Test Body'
            );
            
            expect(Mailer.sendMail).toHaveBeenCalledWith({
                from: 'from@test.com',
                to: 'to@test.com',
                subject: 'Test Subject',
                text: 'Test Body',
            });
            expect(result.messageId).toBe('msg-123');
        });

        it('should throw error when Mailer fails', async () => {
            Mailer.sendMail.mockRejectedValue(new Error('SMTP error'));
            await expect(
                EmailService.sendEmail('from@test.com', 'to@test.com', 'Sub', 'Body')
            ).rejects.toThrow('SMTP error');
        });
    });

    describe('exports', () => {
        it('should export all expected functions', () => {
            expect(EmailService.sendEmail).toBeDefined();
            expect(EmailService.createTicket).toBeDefined();
            expect(EmailService.getPendingEmails).toBeDefined();
        });
    });
});
