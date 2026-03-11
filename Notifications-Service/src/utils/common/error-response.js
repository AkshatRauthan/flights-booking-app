function createErrorResponse(error = {}, message = 'Something went wrong') {
    return {
        success: false,
        message,
        data: {},
        error
    };
}

module.exports = createErrorResponse;