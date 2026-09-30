const express = require('express');
const cors = require('cors');

// Import routes
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Declaration des routes de base
app.use('/api/health', healthRoutes);

// Route par defaut pour routes non trouvees (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable sur ce serveur`
  });
});

module.exports = app;
