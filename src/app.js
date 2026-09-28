const express = require('express');
const cors = require('cors');

// Import des routes
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine informative
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'MachineCare API',
    version: '1.0.0',
    description: 'API de gestion de la maintenance industrielle',
    documentation: '/api/health'
  });
});

// Enregistrement des routes API
app.use('/api/health', healthRoutes);

// Gestion des routes inexistantes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
