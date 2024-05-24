const express = require('express');
const ClientsController = require('../controllers/clientsController');
const CarsController = require('../controllers/carsController');
const carHistoryController = require('../controllers/carHistoryController');
const router = express.Router();

router.get('/getAllClients', ClientsController.getAllClients);
router.post('/addClient', ClientsController.addClient);
router.put('/editClient/:id', ClientsController.editClient);
router.delete('/deleteClient/:id', ClientsController.deleteClient);

router.get('/getAllCarsOfClient/:id', CarsController.getAllCarsOfClient);
router.get('/getAllCars', CarsController.getAllCars);
router.get('/getClientName/:id', CarsController.getClientName);
router.post('/addCar', CarsController.addCar);
router.put('/editCar/:id', CarsController.editCar);
router.delete('/deleteCar/:id', CarsController.deleteCar);

router.get('/getAllCarHistoryOfCar/:id', carHistoryController.getAllCarHistoryOfCar);
router.get('/getCarName/:id', carHistoryController.getCarName);
router.post('/addCarHistory', carHistoryController.addCarHistory);
router.put('/editCarHistory/:id', carHistoryController.editCarHistory);
router.delete('/deleteCarHistory/:id', carHistoryController.deleteCarHistory);

module.exports = router;

