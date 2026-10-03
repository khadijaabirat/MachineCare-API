const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes protegees par JWT pour la gestion des machines
router.post('/', authMiddleware, machineController.createMachine);
router.get('/', authMiddleware, machineController.getAllMachines);

module.exports = router;
