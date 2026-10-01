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

module.exports = {
  login,
  register
};
