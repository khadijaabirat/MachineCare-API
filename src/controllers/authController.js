const authService = require('../services/authService');

// 1. Controleur de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "L'email et le mot de passe sont obligatoires"
      });
    }

    const { user, token } = await authService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Controleur d'inscription (Register)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifier si un champ est manquant
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (nom, email, mot de passe) sont obligatoires'
      });
    }

    // Appel du service pour creer l'utilisateur
    const user = await authService.registerUser(name, email, password);

    // Retourne le statut 201 Created avec les infos de l'utilisateur cree
    return res.status(201).json({
      success: true,
      message: 'Utilisateur enregistré avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Controleur de consultation du profil
const getProfile = async (req, res) => {
  try {
    // req.user est injecte par authMiddleware (sans le mot de passe)
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Controleur de mise a jour du profil
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifier qu'au moins un champ est fourni
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: 'Fournissez au moins un champ a modifier (nom, email ou mot de passe)'
      });
    }

    const updatedUser = await authService.updateProfile(req.user._id, { name, email, password });

    return res.status(200).json({
      success: true,
      message: 'Profil mis a jour avec succes',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile
};
