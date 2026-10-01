const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route publique : Connexion
router.post('/login', authController.login);

// Route protegee par JWT : Creation d'un nouvel utilisateur
router.post('/register', authMiddleware, authController.register);

// Routes protegees par JWT : Profil de l'utilisateur connecte
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
