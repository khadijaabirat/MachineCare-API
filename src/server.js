const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MachineCare API demarree avec succes !`);
  console.log(`📡 Port d'ecoute : http://localhost:${PORT}`);
  console.log(`🩺 Health check  : http://localhost:${PORT}/api/health`);
  console.log(`🌱 Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

// Gestion propre de l'arret du serveur (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM recu, fermeture du serveur HTTP...');
  server.close(() => {
    console.log('Serveur HTTP ferme.');
  });
});
