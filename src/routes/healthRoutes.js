const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @route   GET /api/health
 * @desc    Verification de l'etat de sante de l'API
 * @access  Public
 */
router.get('/', healthController.getHealth);

module.exports = router;
