const { StatusCodes } = require('http-status-codes')

const info = (req, res) => {
    return res.status(StatusCodes.OK).json({   // Returning Custoom Status Code For The API Request.
        success : true,
        message : "API is live",
        error: {},
        data: {},
    })
};

module.exports = {
    info
}