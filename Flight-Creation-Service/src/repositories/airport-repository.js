const CrudRepository = require('./crud-repositories');
const { Airport } = require('../models');

class AirportRepository extends CrudRepository {
    constructor() {
        super(Airport);
    }
}

module.exports = AirportRepository;