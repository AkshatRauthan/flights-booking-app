const { StatusCodes } = require('http-status-codes');
const { createErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validate(schema, source = 'body') {
    return (req, res, next) => {
        const data = source === 'params' ? req.params : source === 'query' ? req.query : req.body;
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = (result.error.issues || result.error.errors || []).map(e => e.message);
            return res.status(StatusCodes.BAD_REQUEST).json(
                createErrorResponse(new AppError(errors, StatusCodes.BAD_REQUEST), 'Validation failed')
            );
        }
        // Replace with parsed/transformed data
        if (source === 'body') req.body = result.data;
        else if (source === 'params') req.params = result.data;
        else req.query = result.data;
        next();
    };
}

module.exports = validate;
