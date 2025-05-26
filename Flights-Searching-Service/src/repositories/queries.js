function addingRowLockOnFlights(flightId){
    return `select * from flights where flights.id = ${flightId} for update;`;
}

module.exports = {
    addingRowLockOnFlights,
}