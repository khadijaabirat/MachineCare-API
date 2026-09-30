const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Message d'accueil sur la racine
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API MachineCare" });
});

// Middleware pour les routes non trouvees (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable sur ce serveur`
  });
});

module.exports = app;
