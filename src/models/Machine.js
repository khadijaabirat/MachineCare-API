const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: [true, 'La reference est obligatoire'],
      unique: true,
      trim: true,
      uppercase: true
    },
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    atelier: {
      type: String,
      trim: true
    },
    localisation: {
      type: String,
      trim: true
    },
    etat: {
      type: String,
      enum: {
        values: ['disponible', 'en maintenance', 'hors service'],
        message: "L'etat doit etre: disponible, en maintenance ou hors service"
      },
      default: 'disponible'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Machine', machineSchema);
