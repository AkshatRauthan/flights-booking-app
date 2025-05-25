function addingRowLockOnFlights(flightId){
    return `select * from flights where flights.id = ${flightId} for update;`;
}
// Removed Row Locking
// return `select * from flights where flights.id = ${flightId} for update;`;
// return `select * from flights where flights.id = ${flightId};`;
module.exports = {
    addingRowLockOnFlights,
}