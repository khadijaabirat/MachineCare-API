require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  🚀 MachineCare API démarrée !`);
  console.log(`  📡 Port        : ${PORT}`);
  console.log(`  🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🩺 Health Check : http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

// Gestion des erreurs inattendues pour éviter le crash brutal
process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée (Unhandled Rejection) :', err);
});
