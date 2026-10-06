const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Ressource introuvable avec cet identifiant';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `La valeur pour le champ '${field}' existe deja` : 'Cette ressource existe deja';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
