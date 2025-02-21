const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repository');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }
}

module.exports = UserRepository;