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

const getMachineById = async (id) => {
  const machine = await Machine.findById(id);
  if (!machine) {
    const error = new Error('Machine introuvable');
    error.statusCode = 404;
    throw error;
  }
  return machine;
};

const updateMachine = async (id, data) => {
  const machine = await Machine.findById(id);
  if (!machine) {
    const error = new Error('Machine introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (data.reference && data.reference !== machine.reference) {
    const existing = await Machine.findOne({ reference: data.reference });
    if (existing) {
      const error = new Error('Une machine avec cette reference existe deja');
      error.statusCode = 409;
      throw error;
    }
  }

  Object.assign(machine, data);
  await machine.save();
  return machine;
};

module.exports = {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine
};
