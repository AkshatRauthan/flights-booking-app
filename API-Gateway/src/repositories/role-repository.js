const { Role } = require('../models');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repository');

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role);
    }

    async getRoleByName(roll_name){
        return await Role.findOne({where : {name : roll_name}});
    }
}

module.exports = RoleRepository; 