const Ordine = require("../Models/Ordine");
const Carrello = require("../Models/Carrello");

exports.addOrdine = (req, res) => {
    Carrello.deleteOne({ utente: req.utente._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.utente = req.utente._id;
      const ordine = new Ordine(req.body);
      ordine.save((error, ordine) => {
        if (error) return res.status(400).json({ error });
        if (ordine) {
          res.status(201).json({ ordine });
        }
      });
    }
  });
};

exports.getOrdini = (req, res) => {
    Ordine.find({ utente: req.utente._id })
    .select("_id importoTotale biglietti createdAt")
    .populate("biglietti.IdPartita", "_id squadra1 squadra2 productPictures")
    .exec((error, ordini) => {
      if (error) return res.status(400).json({ error });
      if (ordini) {
        res.status(200).json({ ordini });
      }
    });
};

exports.getOrdine = (req, res) => {
    Ordine.findOne({ _id: req.body.IdOrdine })
    .populate({
      path: 'biglietti',
      populate: {
        path: 'IdPartita',
        model: 'Partita',
        populate: {
          path: 'IdStadio',
          model: 'Stadio'
        }
      }

})
    .lean()
    .exec((error, ordine) => {
      if (error) return res.status(400).json({ error });
      if (ordine) {
        res.status(200).json({ ordine });
      }
    });
};

// exports.deleteOrdinePartitaById = (req, res) => {
//     const { IdPartita } = req.body.payload;
//     if (IdPartita) {
//       Ordine.updateMany(
//         { },
//         { $pull: { biglietti: { IdPartita: IdPartita } } }
       
//     ).exec((error, result) => {
//         if (error) return res.status(400).json({ error });
//         if (result) {
//           res.status(202).json({ result });
//         }
//       });
//     } else {
//       res.status(400).json({ error: "Params required" });
//     }
//   };
  