const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const CrudRepository = require('./crud-repository');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email) {
        return await User.findOne({where : {email : email}});
    }

    async updateUserEmailById(id, email, transaction) {
        const updatedUser = await User.update(
            { email: email },
            { where: { id: id } },
            { transaction: transaction }
        );
        return updatedUser;
    }

    async updateUserPasswordById(id, hashedPassword, transaction){
        const updatedUser = await User.update(
            { password: hashedPassword },
            { where: { id: id } },
            { transaction: transaction }
        );
        return updatedUser;
    }

    async deleteUserById(id, transaction) {
        const deletedUser = await User.destroy({
            where: { id: id },
        }, {transaction: transaction});
        return deletedUser;
    }
}

module.exports = UserRepository;