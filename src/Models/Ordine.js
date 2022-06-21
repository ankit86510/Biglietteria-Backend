const mongoose = require("mongoose");
// A
const orderSchema = new mongoose.Schema(
    {
        utente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utente",
            required: true,
        },
        importoTotale: {
            type: Number,
            required: true,
        },        
        biglietti: [
            {
                IdPartita: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Partita",
                    required: true 
                },
                N_BigliettiAcquistati: {
                    type: Number,
                    required: true,
                },
                PrezzoBiglietto: {
                    type: Number,
                    required: true,
                },
            },
        ],
        eventType: {
            type: String,
        },
    }, { timestamps: true }

);

module.exports = mongoose.model("Ordine", orderSchema);