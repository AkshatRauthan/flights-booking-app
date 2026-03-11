const Logger = require('../config/logger-config');

async function retryWithBackoff(fn, { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = {}) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries) break;
            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000, maxDelay);
            Logger.warn(`Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

module.exports = { retryWithBackoff };
