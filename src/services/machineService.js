const Machine = require('../models/Machine');

// ST-5.2 : Creer une machine avec verification de reference unique (409 Conflict)
const createMachine = async (data) => {
  const existingReference = await Machine.findOne({ reference: data.reference });
  if (existingReference) {
    const error = new Error('Une machine avec cette reference existe deja');
    error.statusCode = 409;
    throw error;
  }
  const machine = await Machine.create(data);
  return machine;
};

// ST-5.3 : Lister les machines avec filtres query atelier et etat
const getAllMachines = async (filters = {}) => {
  const query = {};

  if (filters.atelier) {
    query.atelier = filters.atelier;
  }

  if (filters.etat) {
    query.etat = filters.etat;
  }

  const machines = await Machine.find(query);
  return machines;
};

module.exports = {
  createMachine,
  getAllMachines
};
