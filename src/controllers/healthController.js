/**
 * Contrôleur de vérification de l'état de l'API (Health Check)
 */
const checkHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'OK',
    message: 'MachineCare API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  checkHealth
};
