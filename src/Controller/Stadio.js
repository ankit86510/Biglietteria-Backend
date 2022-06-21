const Stadi = require("../Models/Stadio");
const Ordine = require("../Models/Ordine");


exports.createStadio = (req, res) => {
  //   res.status(200).json( { file: req.files, body: req.body } );

  const {
    nome,
    citta,
    regione,
    prezzoBigliettoPartita,
    totalePostiStadio,
    descrizione } = req.body;

  let ImmagineStadio = [];

  if (req.files.length > 0) {
    ImmagineStadio = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const partita = new Stadi({
    nome,
    citta,
    regione,
    totalePostiStadio,
    descrizione,
    ImmagineStadio,
    createdBy: req.utente._id,
  });

  partita.save((error, stadio) => {
    if (error) return res.status(400).json({ error });
    if (stadio) {
      res.status(201).json({ stadio, files: req.files });
    }
  });
};

exports.getStadioDetailsById = (req, res) => {
  const { IdStadio } = req.params;
  if (IdStadio) {
    Stadi.findOne({ _id: IdStadio }).exec((error, stadio) => {
      if (error) return res.status(400).json({ error });
      if (stadio) {
        res.status(200).json({ stadio });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteStadioById = (req, res) => {
  const { IdStadio } = req.body.payload;
  if (IdStadio) {
    Ordine.find().populate({
      path: 'biglietti',
      populate: {
        path: 'IdPartita',
        model: 'Partita',
      }
    }).exec((error, ordini) => {
      if (error) return res.status(400).json({ error });
      if (ordini) {
        let trovato = false;
        ordini.forEach((ordine) => {
          ordine.biglietti.forEach((biglietto) => {
            if (biglietto.IdPartita.IdStadio == IdStadio) { trovato = true }
            if (trovato) return
          })
          if (trovato) return
        })
        if (trovato) {
          res.status(400).json({
            error: "Eliminazione Stadio non possibile: In programma una partita nello Stadio"
          })
        }
        else {
          Stadi.deleteOne({ _id: IdStadio }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
              res.status(202).json({ result });
            }

          })
        }
      }
    })
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getStadi = async (req, res) => {
  const stadi = await Stadi.find({ createdBy: req.utente._id })
    .select("_id nome citta regione totalePostiStadio descrizione ImmagineStadio")
    .populate({ path: "regione", select: "_id nome" })
    .exec();

  res.status(200).json({ stadi });
};