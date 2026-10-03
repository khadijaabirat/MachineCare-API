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

const getMachineById = async (req, res) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    return res.status(200).json({
      success: true,
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
    const { reference, nom, atelier, localisation, etat } = req.body;

    if (!reference && !nom && !atelier && !localisation && !etat) {
      return res.status(400).json({
        success: false,
        message: 'Fournissez au moins un champ a modifier'
      });
    }

    const machine = await machineService.updateMachine(req.params.id, {
      reference,
      nom,
      atelier,
      localisation,
      etat
    });

    return res.status(200).json({
      success: true,
      message: 'Machine mise a jour avec succes',
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

module.exports = {
  createMachine,
  getAllMachines,
  getMachineById,
  getMachine: getMachineById,
  updateMachine
};
