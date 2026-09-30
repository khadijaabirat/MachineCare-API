/**
 * Health check controller
 * Permet de verifier que l'API est en ligne et repond correctement
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MachineCare API is running successfully',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  getHealth
};
