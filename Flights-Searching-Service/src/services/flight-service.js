const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const axios = require('axios');

const { FLIGHT_CREATION_SERVICE } = require("./../config/server-config");

const AppError = require('../utils/errors/app-error');
const { Logger, RedisConfig } = require('../config');
const { createCircuitBreaker } = require('../utils/circuit-breaker');
const { retryWithBackoff } = require('../utils/retry');

const CACHE_TTL = 300; // 5 minutes in seconds

function buildCacheKey(query) {
    const sortedKeys = Object.keys(query).sort();
    const sortedParams = sortedKeys.map(k => `${k}=${query[k]}`).join('&');
    return `flights_search:${sortedParams}`;
}

// Raw HTTP call functions for circuit breaker wrapping
async function fetchAllFlightsFromCreationService(query) {
    const response = await axios.get(`${FLIGHT_CREATION_SERVICE}/api/v1/flights`, {
        params: query
    });
    return response.data.data;
}

async function fetchFlightFromCreationService(id) {
    const response = await axios.get(`${FLIGHT_CREATION_SERVICE}/api/v1/flights/${id}`, {
        id: id
    });
    return response.data.data;
}

// Circuit breakers
const getAllFlightsBreaker = createCircuitBreaker(fetchAllFlightsFromCreationService, 'getAllFlights');
const getFlightBreaker = createCircuitBreaker(fetchFlightFromCreationService, 'getFlight');

// Fallback: return cached data on circuit open
getAllFlightsBreaker.fallback(async (query) => {
    Logger.warn('Circuit open for getAllFlights, attempting Redis fallback');
    try {
        const redis = RedisConfig.getRedisClient();
        const cacheKey = buildCacheKey(query);
        const cached = await redis.get(cacheKey);
        if (cached) {
            Logger.info(`Fallback cache hit for key: ${cacheKey}`);
            return JSON.parse(cached);
        }
    } catch (cacheError) {
        Logger.error('Fallback Redis read error', cacheError);
    }
    throw new AppError('Service temporarily unavailable', StatusCodes.SERVICE_UNAVAILABLE);
});

async function getAllFlights(query) {
    try {
        Logger.info(`Flight search query: ${JSON.stringify(query)}`);

        // Check Redis cache
        try {
            const redis = RedisConfig.getRedisClient();
            const cacheKey = buildCacheKey(query);
            const cached = await redis.get(cacheKey);
            if (cached) {
                Logger.info(`Cache hit for key: ${cacheKey}`);
                return JSON.parse(cached);
            }
            Logger.info(`Cache miss for key: ${cacheKey}`);
        } catch (cacheError) {
            Logger.error('Redis cache read error, falling through to upstream', cacheError);
        }

        const data = await retryWithBackoff(
            () => getAllFlightsBreaker.fire(query),
            { maxRetries: 3, baseDelay: 1000 }
        );

        // Store in Redis cache
        try {
            const redis = RedisConfig.getRedisClient();
            const cacheKey = buildCacheKey(query);
            await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_TTL);
            Logger.info(`Cached result for key: ${cacheKey}`);
        } catch (cacheError) {
            Logger.error('Redis cache write error', cacheError);
        }

        return data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError('Cannot fetch the data of requested flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id){
    try {
        const data = await retryWithBackoff(
            () => getFlightBreaker.fire(id),
            { maxRetries: 3, baseDelay: 1000 }
        );
        return data;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error(error);
        throw new AppError('Cannot fetch the data of requested flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getAllFlights,
    getFlight,
};  