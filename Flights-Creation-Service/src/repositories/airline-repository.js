const CrudRepository = require('./crud-repositories');
const { Airline } = require('../models');

class AirlineRepository extends CrudRepository {
    constructor() {
        super(Airline);
    }

    async registerAirline(data, transaction){
        console.log("the data in repository is :")
        console.log(data);
        const response = await Airline.create(data, transaction);
        return response;
    }

    async updateAirline(data, id, transaction){
        const response = await Airline.update(data, {
            where: { id: id },
            transaction: transaction,
            returning: true
        });
        console.log(response);
        return response;
    }

    async getAirlineById(id) {
        const response = await Airline.findByPk(id);
        if (!response) {
            return new AppError("The requested airline is not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = AirlineRepository;