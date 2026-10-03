const Machine = require('../models/Machine');

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
