const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API MachineCare" });
});

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} introuvable sur ce serveur`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error("Erreur détectée:", err.message);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur interne du serveur"
  });
});

module.exports = app;
