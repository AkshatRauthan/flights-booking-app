const CrudRepository = require('./crud-repositories');
const { Airplane } = require('../models');

class AirplaneRepository extends CrudRepository {
    constructor() {
        super(Airplane);
    }
}

module.exports = AirplaneRepository;