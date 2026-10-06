const machineService = require('../services/machineService');

const createMachine = async (req, res) => {
  try {
    const { reference, nom, atelier, localisation, etat } = req.body;

    if (!reference || !nom) {
      return res.status(400).json({
        success: false,
        message: 'La reference et le nom sont obligatoires'
      });
    }

    const machine = await machineService.createMachine({
      reference,
      nom,
      atelier,
      localisation,
      etat
    });

    return res.status(201).json({
      success: true,
      message: 'Machine creee avec succes',
      machine
    });
  } catch (error) {
    if (error.statusCode === 409 || error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Cette reference existe deja'
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAllMachines = async (req, res) => {
  try {
    const { atelier, etat } = req.query;
    const machines = await machineService.getAllMachines({ atelier, etat });

    return res.status(200).json({
      success: true,
      count: machines.length,
      machines
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMachine = async (req, res) => {
  try {
    const id = req.params.id;
    const machine = await machineService.getMachine(id);
    return res.status(200).json({
      success: true,
      message: 'Machine recuperee avec succes',
      machine
    });
  } catch (error) {
    const statusCode = error.statusCode || (error.name === 'CastError' ? 404 : 500);
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const updateMachine = async (req, res) => {
  try {
    const id = req.params.id;
    const { reference, nom, atelier, localisation, etat } = req.body;

    if (!reference && !nom && !atelier && !localisation && !etat) {
      return res.status(400).json({
        success: false,
        message: 'Changer au moins un champ'
      });
    }

    const updateData = {};
    if (reference !== undefined) updateData.reference = reference;
    if (nom !== undefined) updateData.nom = nom;
    if (atelier !== undefined) updateData.atelier = atelier;
    if (localisation !== undefined) updateData.localisation = localisation;
    if (etat !== undefined) updateData.etat = etat;

    const machine = await machineService.updateMachine(id, updateData);
    return res.status(200).json({
      success: true,
      message: 'La mise a jour est terminee avec succes',
      machine
    });
  } catch (error) {
    const statusCode = error.statusCode || (error.code === 11000 ? 409 : (error.name === 'CastError' ? 404 : 400));
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const deleteMachine = async (req, res) => {
  try {
    const id = req.params.id;
    await machineService.deleteMachine(id);
    return res.status(200).json({
      success: true,
      message: 'Machine supprimee avec succes'
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
  createMachine,
  getAllMachines,
  getMachine,
  updateMachine,
  deleteMachine
};
