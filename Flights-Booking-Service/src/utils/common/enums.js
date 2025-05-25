const SEAT_TYPES = {
    BUSINESS: 'business',
    ECONOMY: 'economy',
    PREMIUM_ECONOMY: 'premium-economy',
    FIRST_CLASS: 'first-class'
};

const BOOKING_STATUS = {
    BOOKED: 'booked',
    CANCELLED: 'cancelled',
    INITIATED: 'initiated',
    PENDING: 'pending'
}

const USER_ROLES_ENUMS = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    FLIGHT_COMPANY: 'flight_company',
}

module.exports = {
    SEAT_TYPES,
    BOOKING_STATUS,
    USER_ROLES_ENUMS
}