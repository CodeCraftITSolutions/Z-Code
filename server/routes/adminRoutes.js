const express = require('express');
const routes = express.Router();

const { getAdmin, updateAdmin,changeDatabase} = require('../controller/adminController');


routes.get('/:userId', getAdmin);
routes.put('/:id', updateAdmin);
routes.post('/change',changeDatabase);



module.exports = routes;

