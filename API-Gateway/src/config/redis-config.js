const Redis = require('ioredis');
const Logger = require('./logger-config');

let redis;

function getRedisClient() {
    if (!redis) {
        const { REDIS_HOST, REDIS_PORT } = require('./server-config');
        redis = new Redis({
            host: REDIS_HOST || 'localhost',
            port: REDIS_PORT || 6379,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        });

        redis.on('connect', () => Logger.info('Redis connected successfully'));
        redis.on('error', (err) => Logger.error('Redis connection error', err));
    }
    return redis;
}

async function closeRedis() {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}

module.exports = { getRedisClient, closeRedis };
