const express = require('express');
const router = express.Router();

const { getSample,createSample,getSamples,updateSample,deleteSample } = require('../controller/sample');

router.get('/', getSamples
);


router.post('/', createSample);

router.get('/:id', getSample);

router.patch('/:id', updateSample);

router.delete('/:id', deleteSample);
    

module.exports = router;