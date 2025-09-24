const express = require('express');
const router = express.Router();

const { uploadImage,getImage,deleteImage } = require('../controller/imageController');

router.post('/', uploadImage);
router.get('/:userId', getImage);
router.delete('/:userId', deleteImage);

module.exports = router;