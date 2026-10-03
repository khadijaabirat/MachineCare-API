const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, machineController.createMachine);
router.get('/', authMiddleware, machineController.getAllMachines);

module.exports = router;
