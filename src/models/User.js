const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'le nom est obligatoire'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'l email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'le mot de passe est obligatoire'],
        trim: true,
        minlength: [6, 'le mot de passe doit contenir au mois 6 caractaires']
    }
}, { timestamps: true });
const bcrypt = require('bcryptjs');
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};
const User = mongoose.model('User', UserSchema);
module.exports = User;