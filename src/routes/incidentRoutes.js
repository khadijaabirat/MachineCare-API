const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, incidentController.createIncident);
router.get('/', authMiddleware, incidentController.getAllIncidents);

module.exports = router;
