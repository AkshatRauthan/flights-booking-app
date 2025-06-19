const CrudRepository = require('./crud-repositories');
const { AirlineAdmin } = require('../models');

class AirlineAdminRepository extends CrudRepository {
    constructor() {
        super(AirlineAdmin);
    }

    async registerAirlineAdmin(data, transaction){
        console.log(data);
        const response = await AirlineAdmin.create(data, {
            transaction: transaction
        });
        return response;
    }

    async validateAirlineAdmin(id, airlineId){
        const response = await AirlineAdmin.findOne({
            where: {
                userId: id,
                airlineId: airlineId
            }
        });
        return response;
    }
}

module.exports = AirlineAdminRepository;