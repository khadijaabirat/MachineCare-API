const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
    {
        machine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machine',
            required: [true, 'La machine est obligatoire']
        },
        description: {
            type: String,
            required: [true, 'La description est obligatoire'],
            trim: true
        },
        declaredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "L'utilisateur declarant est obligatoire"]
        },
        statut: {
            type: String,
            enum: {
                values: ['ouvert', 'en cours', 'resolu'],
                message: "Le statut doit etre: ouvert, en cours ou resolu"
            },
            default: 'ouvert'
        },
        resolutionNote: {
            type: String,
            trim: true
        },
        resolvedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Incident', incidentSchema);
