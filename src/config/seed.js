const User = require('../models/User');

const seedAdmin = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({
      name: process.env.DEFAULT_ADMIN_NAME || 'Super Admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@machinecare.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123456!'
    });
    console.log('Compte administrateur par defaut cree avec succes !');
  } else {
    console.log('Des utilisateurs existent deja en base de donnees.');
  }
};

module.exports = seedAdmin;
