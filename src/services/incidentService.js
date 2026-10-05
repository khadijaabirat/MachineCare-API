const Incident = require('../models/Incident');
const Machine = require('../models/Machine');

const createIncident = async (data, userId) => {
  const machineId = data.machine || data.machineId;

  const machine = await Machine.findById(machineId);
  if (!machine) {
    const error = new Error('Machine introuvable');
    error.statusCode = 404;
    throw error;
  }

  const incident = await Incident.create({
    machine: machine._id,
    description: data.description,
    declaredBy: userId
  });

  return incident;
};

module.exports = {
  createIncident
};
