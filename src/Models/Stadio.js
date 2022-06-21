const mongoose = require('mongoose');
const StadioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    citta: {
        type: String,
        required: true,
        trim: true
    },
    regione: {
        type: String,
        required: true,
        trim: true
    },
    totalePostiStadio: { type: Number, required: true},
    descrizione: {
        type: String,
        trim: true
    },
    ImmagineStadio: [
        { img: { type: String } }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
    updatedAt: Date,

}, { timestamps: true });


module.exports = mongoose.model('Stadio', StadioSchema);