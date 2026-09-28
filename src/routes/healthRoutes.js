const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthController');

/**
 * @route   GET /api/health
 * @desc    Vérifier l'état de l'API
 * @access  Public
 */
router.get('/', checkHealth);

module.exports = router;
