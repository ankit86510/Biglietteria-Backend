const mongoose = require('mongoose');
const PartitaSchema = new mongoose.Schema({

    squadra1: {
        type: String, 
        required: true, 
        trim: true
    },
    squadra2: {
        type: String, 
        required: true, 
        trim: true
    },
    dataOraPartita: { 
        type: Date, 
        required: true, 
    },
    prezzoBigliettoPartita: { 
        type: Number, 
        required: true 
    },
    totalePostiOccupati: {
        type: Number,
        required: true,
        default: 0
    },
    descrizione: {
        type: String,
        // required: true,
        trim: true
    },
    ImmaginePartita: [
        { img: { type: String } }
    ],
    IdStadio: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadio', required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
    updatedAt: Date,

}, { timestamps: true });

PartitaSchema.virtual('incontro')
.get(function() {
    return `${this.squara1} - ${this.squadra2}`
})
module.exports = mongoose.model('Partita', PartitaSchema);