const { z } = require('zod');

const createFlightSchema = z.object({
    flightNumber: z.string().min(1, 'Flight number is required'),
    airplaneId: z.number({ coerce: true }).int().positive(),
    departureAirportId: z.string().min(1, 'Departure airport is required'),
    arrivalAirportId: z.string().min(1, 'Arrival airport is required'),
    arrivalTime: z.string().min(1, 'Arrival time is required'),
    departureTime: z.string().min(1, 'Departure time is required'),
    price: z.number({ coerce: true }).positive('Price must be positive'),
    boardingGate: z.string().optional(),
});

const updateSeatsSchema = z.object({
    seats: z.number({ coerce: true }).int().min(1, 'seats must be at least 1'),
    dec: z.union([z.boolean(), z.string().transform(v => v === 'true')]),
});

const createAirplaneSchema = z.object({
    modelNumber: z.string().min(1, 'Model number is required'),
    capacity: z.number({ coerce: true }).int().positive('Capacity must be positive'),
});

const createAirportSchema = z.object({
    name: z.string().min(1, 'Airport name is required'),
    code: z.string().min(1, 'Airport code is required').max(10),
    cityId: z.number({ coerce: true }).int().positive('City ID is required'),
    address: z.string().optional(),
});

const createCitySchema = z.object({
    name: z.string().min(1, 'City name is required'),
});

const registerAirlineSchema = z.object({
    name: z.string().min(1, 'Airline name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    iataCode: z.string().length(2, 'IATA code must be 2 characters'),
    icaoCode: z.string().length(3, 'ICAO code must be 3 characters').optional(),
    country: z.string().min(1, 'Country is required'),
    contactNo: z.string().min(1, 'Contact number is required'),
    status: z.string().optional(),
    logoIcon: z.string().optional(),
});

module.exports = {
    createFlightSchema,
    updateSeatsSchema,
    createAirplaneSchema,
    createAirportSchema,
    createCitySchema,
    registerAirlineSchema,
};
