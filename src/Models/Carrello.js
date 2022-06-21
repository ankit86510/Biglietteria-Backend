const mongoose = require('mongoose');

const CarrelloSchema = new mongoose.Schema({
    utente: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
    articoliCarrello: [
        {
            _id: false,
            articolo: { type: mongoose.Schema.Types.ObjectId, ref: 'Partita', required: true },
            quantita: { type: Number, default: 1 },
            //price: { type: Number, required: true }
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('Carrello', CarrelloSchema);