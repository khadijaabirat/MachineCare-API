const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares obligatoires
app.use(cors());
app.use(express.json());

// Message de bienvenue sur la racine de l'API
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API MachineCare" });
});

// Les routes demandees par le cahier des charges seront branchees ici :
// - Authentification : /api/auth
// - Machines : /api/machines
// - Signalements : /api/signalements

module.exports = app;
