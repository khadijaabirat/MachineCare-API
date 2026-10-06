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

const getAllIncidents = async (filters = {}) => {
  const query = {};

  if (filters.machine) {
    query.machine = filters.machine;
  }

  if (filters.statut) {
    query.statut = filters.statut;
  }

  const incidents = await Incident.find(query)
    .populate('machine', 'reference nom atelier localisation etat')
    .populate('declaredBy', 'name email')
    .sort({ createdAt: -1 });

  return incidents;
};

const getIncidentsByMachine = async (machineId) => {
  const machine = await Machine.findById(machineId);
  if (!machine) {
    const error = new Error('Machine introuvable');
    error.statusCode = 404;
    throw error;
  }

  const incidents = await Incident.find({ machine: machineId })
    .populate('declaredBy', 'name email')
    .sort({ createdAt: -1 });

  return incidents;
};

const updateIncident = async (id, data) => {
  const incident = await Incident.findById(id);
  if (!incident) {
    const error = new Error('Incident introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (data.statut === 'resolu') {
    const note = data.resolutionNote || incident.resolutionNote;
    if (!note || !note.trim()) {
      const error = new Error('La note de resolution est obligatoire pour passer au statut resolu');
      error.statusCode = 400;
      throw error;
    }
    incident.resolutionNote = note.trim();
    incident.resolvedAt = new Date();
    incident.statut = 'resolu';
  } else if (data.statut) {
    incident.statut = data.statut;
  }

  if (data.description) {
    incident.description = data.description;
  }

  if (data.resolutionNote && data.statut !== 'resolu') {
    incident.resolutionNote = data.resolutionNote.trim();
  }

  await incident.save();
  return incident;
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentsByMachine,
  updateIncident
};
