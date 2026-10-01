const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route publique : Connexion
router.post('/login', authController.login);

// Route protegee par JWT : Creation d'un nouvel utilisateur
router.post('/register', authMiddleware, authController.register);

module.exports = router;
