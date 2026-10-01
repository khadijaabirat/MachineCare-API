const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. Service de connexion
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return { user, token };
};

// 2. Service de creation d'utilisateur (Register)
const registerUser = async (name, email, password) => {
  // Verifier si l'email existe deja
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Cet email est deja utilise');
  }

  // Creer le nouvel utilisateur (le pre-save hook va hacher le mot de passe automatiquement)
  const user = await User.create({
    name,
    email,
    password
  });

  return user;
};

module.exports = {
  loginUser,
  registerUser
};
