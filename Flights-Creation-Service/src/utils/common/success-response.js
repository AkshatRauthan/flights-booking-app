function createSuccessResponse(data = {}, message = 'Request Successful') {
    return {
        success: true,
        message,
        data,
        error: {}
    };
}

module.exports = createSuccessResponse;