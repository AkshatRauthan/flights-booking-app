const { StatusCodes } = require('http-status-codes');
const { getRedisClient } = require('../config/redis-config');
const { createErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const Logger = require('../config/logger-config');

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 30;

async function perUserRateLimiter(req, res, next) {
    try {
        const redis = getRedisClient();
        const identifier = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
        const key = `rate_limit:${identifier}`;

        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
        }

        res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - current));

        if (current > MAX_REQUESTS_PER_WINDOW) {
            return res.status(StatusCodes.TOO_MANY_REQUESTS).json(
                createErrorResponse(
                    new AppError('Too many requests, please try again later', StatusCodes.TOO_MANY_REQUESTS),
                    'Rate limit exceeded'
                )
            );
        }
        next();
    } catch (error) {
        Logger.error('Rate limiter error, allowing request through', error);
        next(); // Fail open
    }
}

module.exports = { perUserRateLimiter };
