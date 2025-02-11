const { CityController } = require('../../controllers');

const { CityMiddleware } = require('../../middlewares/index');

const express = require('express');

const router = express.Router();

// /api/v1/cities POST
router.post('/',
        CityMiddleware.validateCreateObject,
        CityController.createCity
);

// api/v1/cities GET
router.get('/',
        CityController.getCities
);

// api/v1/cities/:id POST
router.get('/:id',
        CityController.getCity
);

// api/v1/cities/:id DELETE
router.delete('/:id',
        CityController.destroyCity
)

// api/v1/cities/:id PATCH
router.patch('/:id',
        CityMiddleware.validateUpdateObject,
        CityController.updateCity
)

module.exports = router;