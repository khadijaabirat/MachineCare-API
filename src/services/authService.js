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
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Cet email est deja utilise');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  return user;
};

// 3. Service de mise a jour du profil
const updateProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  // Verifier l'unicite du nouvel email s'il change
  if (updates.email && updates.email !== user.email) {
    const emailExist = await User.findOne({ email: updates.email });
    if (emailExist) {
      throw new Error('Cet email est deja utilise');
    }
    user.email = updates.email;
  }

  if (updates.name) {
    user.name = updates.name;
  }

  if (updates.password) {
    user.password = updates.password;
  }

  await user.save();
  return user;
};

module.exports = {
  loginUser,
  registerUser,
  updateProfile
};
