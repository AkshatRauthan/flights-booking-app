const CrudRepsitory= require('./crud-repositories');
const { Flight } = require('../models')

class FlightRepository extends CrudRepsitory {
    constructor(){
        super(Flight)
    }
};

module.exports = FlightRepository;