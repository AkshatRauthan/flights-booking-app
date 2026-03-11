jest.mock('../../../src/repositories', () => {
    const mockFlightRepo = {
        create: jest.fn(),
        get: jest.fn(),
        getFlight: jest.fn(),
        getAllFlights: jest.fn(),
        updateRemainingSeat: jest.fn(),
    };
    return {
        FlightRepository: jest.fn().mockImplementation(() => mockFlightRepo),
        Seat: {},
        __mockFlightRepo: mockFlightRepo,
    };
});

jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

jest.mock('../../../src/utils/common', () => ({
    DateTimeHelpers: {
        compareTime: jest.fn(),
    },
    QueryParsers: {
        parseFilterQuery: jest.fn().mockReturnValue({}),
        parseOrderQuery: jest.fn().mockReturnValue([]),
    },
}));

const FlightService = require('../../../src/services/flight-service');
const { __mockFlightRepo } = require('../../../src/repositories');

describe('Flight Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isValidFlight', () => {
        it('should return true for existing flight', async () => {
            __mockFlightRepo.get.mockResolvedValue({ id: 1, flightNumber: 'UK808' });
            const result = await FlightService.isValidFlight(1);
            expect(result).toBe(true);
        });

        it('should return false for non-existing flight', async () => {
            __mockFlightRepo.get.mockResolvedValue(null);
            const result = await FlightService.isValidFlight(999);
            expect(result).toBe(false);
        });
    });

    describe('areValidSeats', () => {
        it('should return true when seats are within capacity', async () => {
            __mockFlightRepo.get.mockResolvedValue({ id: 1, totalSeats: 120 });
            const result = await FlightService.areValidSeats(1, [1, 2, 3]);
            expect(result).toBe(true);
        });

        it('should return false when flight does not exist', async () => {
            __mockFlightRepo.get.mockResolvedValue(null);
            const result = await FlightService.areValidSeats(999, [1]);
            expect(result).toBe(false);
        });

        it('should return false when too many seats requested', async () => {
            __mockFlightRepo.get.mockResolvedValue({ id: 1, totalSeats: 2 });
            const result = await FlightService.areValidSeats(1, [1, 2, 3]);
            expect(result).toBe(false);
        });
    });

    describe('getAllFlights', () => {
        it('should fetch and return flights list', async () => {
            const mockFlights = [{ id: 1 }, { id: 2 }];
            __mockFlightRepo.getAllFlights.mockResolvedValue(mockFlights);
            const result = await FlightService.getAllFlights({});
            expect(result).toEqual(mockFlights);
        });
    });

    describe('exports', () => {
        it('should export all functions', () => {
            expect(FlightService.createFlight).toBeDefined();
            expect(FlightService.updateSeats).toBeDefined();
            expect(FlightService.isValidFlight).toBeDefined();
            expect(FlightService.areValidSeats).toBeDefined();
            expect(FlightService.getFlight).toBeDefined();
            expect(FlightService.getAllFlights).toBeDefined();
        });
    });
});
