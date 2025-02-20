function addingRowLockOnFlights(flightId){
    return `SELECT * FROM FLIGHTS WHERE Flights.id = ${flightId} FOR UPDATE;`;
}

module.exports = {
    addingRowLockOnFlights,
}