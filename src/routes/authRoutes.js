const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route publique : Connexion
router.post('/login', authController.login);

// Routes protegees par JWT :
router.post('/register', authMiddleware, authController.register);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
