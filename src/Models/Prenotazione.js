const mongoose = require("mongoose");
const BigliettoSchema = new mongoose.Schema(
    {
      utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utente",
        required: true,
      },
      biglietti: [
        {
          IdPartita: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partita",
          },
          N_BigliettiAcquistati: {
            type: Number,
            required: true,
          },
        },
      ],
      eventType: {
        type: String,
        required: true
      },
    }, {timestamps: true}
);
module.exports = mongoose.model("Biglietto", BigliettoSchema);