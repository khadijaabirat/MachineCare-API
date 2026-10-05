const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, machineController.createMachine);
router.get('/', authMiddleware, machineController.getAllMachines);
router.get('/:id', authMiddleware, machineController.getMachine);
router.put('/:id', authMiddleware, machineController.updateMachine);
router.delete('/:id', authMiddleware, machineController.deleteMachine);
router.get('/:id/incidents', authMiddleware, incidentController.getIncidentsByMachine);

module.exports = router;
