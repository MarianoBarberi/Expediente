const express = require('express');
const ClientsController = require('../controllers/clientsController');
const CarsController = require('../controllers/carsController');
const carHistoryController = require('../controllers/carHistoryController');
const router = express.Router();

router.get('/getAllClients', ClientsController.getAllClients);
router.get('/getClient/:id', ClientsController.getClient);

router.get('/getAllCarsOfClient/:id', CarsController.getAllCarsOfClient);
router.get('/getCar/:id', CarsController.getCar);
router.get('/getClientName/:id', CarsController.getClientName);

router.get('/getAllCarHistoryOfCar/:id', carHistoryController.getAllCarHistoryOfCar);
router.get('/getCarName/:id', carHistoryController.getCarName);

module.exports = router;

