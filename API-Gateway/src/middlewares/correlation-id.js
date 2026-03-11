const { v4: uuidv4 } = require('uuid');

function correlationId(req, res, next) {
    const id = req.headers['x-correlation-id'] || uuidv4();
    req.correlationId = id;
    res.setHeader('x-correlation-id', id);
    // Make it available for downstream service calls
    req.headers['x-correlation-id'] = id;
    next();
}

module.exports = { correlationId };
