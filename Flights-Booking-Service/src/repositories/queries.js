function seatBookingQuery(data){
    const values = data.map(obj =>
        `(${parseInt(obj.user_id)}, ${parseInt(obj.seat_id)}, ${parseInt(obj.flight_id)}, NOW(), NOW())`
    ).join(', ');
    return `INSERT INTO seat_bookings (user_id, seat_id, flight_id, createdAt, updatedAt) VALUES ${values}`;
}

function seatUpdatingQuery(data) {
    const bookingId = parseInt(data.booking_id);
    const userId = parseInt(data.user_id);
    const flightId = parseInt(data.flight_id);
    return `UPDATE seat_bookings SET booking_id = ${bookingId} WHERE user_id = ${userId} AND flight_id = ${flightId}`;
}

function seatDeletingQuery(data) {
    const ids = Array.isArray(data) ? data.map(id => parseInt(id)).join(',') : parseInt(data);
    return `DELETE FROM seat_bookings WHERE id IN (${ids})`;
}

module.exports = {
    seatBookingQuery,
    seatUpdatingQuery,
    seatDeletingQuery,
}