const Machine = require('../models/Machine');
const mongose = require('mongoose');

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

const getMachine = async (req, res) => {
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
        const machine = await machineService.updateMachine(req.params.id, req.body);
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

const deleteMachine = async (id) => {
    const machine = await Machine.findById(id);
    if (!machine) {
        const error = new Error('Machine introuvable');
        error.statusCode = 404;
        throw error;
    }

    let incidentCount = 0;
    if (mongoose.models.Incident) {
        incidentCount = await mongoose.models.Incident.countDocuments({ machineId: id });
    } else {
        incidentCount = await mongoose.connection.collection('incidents').countDocuments({
            $or: [
                { machineId: machine._id },
                { machine: machine._id }
            ]
        }).catch(() => 0);
    }

    if (incidentCount > 0) {
        const error = new Error('Impossible de supprimer cette machine car des signalements y sont associes');
        error.statusCode = 409;
        throw error;
    }

    await Machine.findByIdAndDelete(id);
    return { message: 'Machine supprimee avec succes' };
};

module.exports = {
    createMachine,
    getAllMachines,
    getMachine,
    updateMachine,
    deleteMachine
};
