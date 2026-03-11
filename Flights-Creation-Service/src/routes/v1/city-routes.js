const express = require('express');
const { CityController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { createCitySchema } = require('../../middlewares/validators');

const router = express.Router();

// /api/v1/city POST
router.post('/',
        validate(createCitySchema),
        CityController.createCity
);

// api/v1/city GET
router.get('/',
        CityController.getCities
);

// api/v1/city/:id GET
router.get('/:id',
        CityController.getCity
);

// api/v1/city/:id DELETE
router.delete('/:id',
        CityController.destroyCity
);

// api/v1/city/:id PATCH
router.patch('/:id',
        validate(createCitySchema),
        CityController.updateCity
);

module.exports = router;