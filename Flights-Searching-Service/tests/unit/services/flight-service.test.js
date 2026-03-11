jest.mock('../../../src/config', () => ({
    Logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

jest.mock('../../../src/config/server-config', () => ({
    FLIGHT_CREATION_SERVICE: 'http://localhost:3003',
}));

jest.mock('axios');
const axios = require('axios');

const FlightService = require('../../../src/services/flight-service');

describe('Flight Service (Searching)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllFlights', () => {
        it('should fetch flights from creation service', async () => {
            const mockFlights = [{ id: 1, flightNumber: 'UK808' }];
            axios.get.mockResolvedValue({ data: { data: mockFlights } });
            
            const result = await FlightService.getAllFlights({ trips: 'MUM-DEL' });
            expect(result).toEqual(mockFlights);
            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3003/api/v1/flights',
                { params: { trips: 'MUM-DEL' } }
            );
        });

        it('should throw AppError on failure', async () => {
            axios.get.mockRejectedValue(new Error('Network error'));
            await expect(FlightService.getAllFlights({})).rejects.toThrow();
        });
    });

    describe('getFlight', () => {
        it('should fetch a single flight', async () => {
            const mockFlight = { id: 1, flightNumber: 'UK808', price: 5000 };
            axios.get.mockResolvedValue({ data: { data: mockFlight } });
            
            const result = await FlightService.getFlight(1);
            expect(result).toEqual(mockFlight);
        });

        it('should throw AppError when flight not found', async () => {
            axios.get.mockRejectedValue(new Error('Not found'));
            await expect(FlightService.getFlight(999)).rejects.toThrow();
        });
    });
});
