const CrudRepsitory= require('./crud-repositories');
const { City } = require('../models')

class CityRepository extends CrudRepsitory {
    constructor(){
        super(City)
    }
};

module.exports = CityRepository