const machineService = require('../services/machineService');

// ST-5.2 : POST /api/machines
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

// ST-5.3 : GET /api/machines (avec ?atelier=xxx&etat=yyy)
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

module.exports = {
  createMachine,
  getAllMachines
};
