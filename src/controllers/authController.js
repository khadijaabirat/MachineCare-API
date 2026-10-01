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

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (nom, email, mot de passe) sont obligatoires'
      });
    }

    const user = await authService.registerUser(name, email, password);

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

// 3. Controleur de consultation de profil (GET /api/auth/profile)
const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    }
  });
};

// 4. Controleur de mise a jour de profil (PUT /api/auth/profile)
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedUser = await authService.updateProfile(req.user._id, { name, email, password });

    return res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
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
