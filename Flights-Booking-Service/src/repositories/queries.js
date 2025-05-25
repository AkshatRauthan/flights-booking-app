function seatBookingQuery(data){
    const values = data.map(obj =>
        `(${obj.user_id}, ${obj.seat_id}, ${obj.flight_id}, NOW(), NOW())`
    ).join(', ');
    return `INSERT INTO seat_bookings (user_id, seat_id, flight_id, createdAt, updatedAt) VALUES ${values}`;
}

function seatUpdatingQuery(data) {
    return query = `update seat_bookings set booking_id = ${data.booking_id} where user_id = ${data.user_id} and flight_id = ${data.flight_id}`;
}

function seatDeletingQuery(data) {
    return query = `delete from seat_bookings where id in (${id});`
}

module.exports = {
    seatBookingQuery,
    seatUpdatingQuery,
    seatDeletingQuery,
}