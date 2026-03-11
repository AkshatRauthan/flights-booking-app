const CrudRepository = require('./crud-repositories');
const { AirlineAdmin } = require('../models');
const { Logger } = require('../config');

class AirlineAdminRepository extends CrudRepository {
    constructor() {
        super(AirlineAdmin);
    }

    async registerAirlineAdmin(data, transaction){
        Logger.info(`Registering airline admin: ${JSON.stringify(data)}`);
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