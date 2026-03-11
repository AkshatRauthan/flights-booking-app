const CircuitBreaker = require('opossum');
const Logger = require('../config/logger-config');

const DEFAULT_OPTIONS = {
    timeout: 10000,           // 10 seconds
    errorThresholdPercentage: 50,
    resetTimeout: 30000,      // 30 seconds
    volumeThreshold: 5,       // minimum requests before tripping
};

function createCircuitBreaker(asyncFn, name, options = {}) {
    const breaker = new CircuitBreaker(asyncFn, {
        ...DEFAULT_OPTIONS,
        ...options,
        name,
    });

    breaker.on('open', () => Logger.warn(`Circuit breaker [${name}] OPENED`));
    breaker.on('halfOpen', () => Logger.info(`Circuit breaker [${name}] HALF-OPEN`));
    breaker.on('close', () => Logger.info(`Circuit breaker [${name}] CLOSED`));
    breaker.on('fallback', () => Logger.warn(`Circuit breaker [${name}] FALLBACK`));
    breaker.on('timeout', () => Logger.error(`Circuit breaker [${name}] TIMEOUT`));

    return breaker;
}

module.exports = { createCircuitBreaker };
