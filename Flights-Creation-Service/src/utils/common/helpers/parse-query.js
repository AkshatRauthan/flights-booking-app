const { Op } = require("sequelize");

function parseOrderQuery(query) {
    let sortFilter = [];
    if (query.order && Array.isArray(query.order)) {
        sortFilter = query.order
            .map((field) => {
                if (typeof field !== "string") return null;
                const parts = field.split("_");
                if (parts.length !== 2) return null;
                const [key, direction] = parts;
                if (!key || !direction) return null;
                return [key, direction.toUpperCase()];
            })
            .filter(Boolean); // Removes null entries
    }
    return sortFilter;
}

function parseFilterQuery(query) {
    let filter = {};
    if (query.trips) {
        const [departureAirportId, arrivalAirportId] = query.trips.split("-");
        filter.departureAirportId = departureAirportId;
        filter.arrivalAirportId = arrivalAirportId;
    }
    if (query.price) {
        const [minPrice, maxPrice] = query.price.split("-");
        filter.price = {
            [Op.between]: [minPrice, maxPrice]
        };
    }
    if (query.travellers) {
        filter.totalSeats = {
            [Op.gte]: query.travellers
        };
    }
    if (query.tripDate) {
        const dayLastMinute = " 23:59:59";
        filter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + dayLastMinute]
        };
    }
    return filter;
}

module.exports = {
    parseOrderQuery,
    parseFilterQuery
}