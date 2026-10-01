const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seed.js');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Serveur lance sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du demarrage du serveur:', error.message);
    process.exit(1);
  }
};

startServer();