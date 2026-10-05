const incidentService = require('../services/incidentService');

const createIncident = async (req, res) => {
  try {
    const { machine, description } = req.body;

    if (!machine || !description) {
      return res.status(400).json({
        success: false,
        message: 'La machine et la description sont obligatoires'
      });
    }

    const incident = await incidentService.createIncident(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Incident declare avec succes',
      incident
    });
  } catch (error) {
    const statusCode = error.statusCode || (error.name === 'CastError' ? 404 : 400);
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createIncident
};
