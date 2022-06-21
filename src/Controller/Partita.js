const Partite = require("../Models/Partita");
const Categorie = require("../Models/Categorie");
const Ordine = require("../Models/Ordine");
var mongoose = require('mongoose');



exports.createPartita = (req, res) => {
  //   res.status(200).json( { file: req.files, body: req.body } );

  const { squadra1, squadra2, dataOraPartita, prezzoBigliettoPartita, descrizione,
    IdStadio, categoria } = req.body;

  let ImmaginePartita = [];

  if (req.files.length > 0) {
    ImmaginePartita = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  let errore = false

  const Squadre = [squadra1, squadra2];
  var option1 = { year: 'numeric', month: 'numeric', day: 'numeric' };
  var option2 = { hour: 'numeric', minute: 'numeric' };
  let inputDataOra = new Date(dataOraPartita);
  let inputData = inputDataOra.toLocaleDateString("it-IT", option1);

  let inputOra = inputDataOra.toLocaleDateString("it-IT", option2);


  Partite.find({})
    .select("_id squadra1 squadra2 incontro dataOraPartita prezzoBigliettoPartita slug descrizione IdStadio ImmaginePartita categoria")
    .exec((error, partite) => {
      if (error) return res.status(400).json({ error });
      if (partite) {
        partite.forEach((partita) => {
          if (((partita.squadra1.includes(Squadre[0]) || partita.squadra1.includes(Squadre[1]))
            && (partita.squadra2.includes(Squadre[0]) || partita.squadra2.includes(Squadre[1])))
            || (partita.IdStadio == IdStadio)
            || (partita.squadra1.includes(Squadre[0]) || partita.squadra2.includes(Squadre[0]))
            || (partita.squadra1.includes(Squadre[1]) || partita.squadra2.includes(Squadre[1]))) {

            let DataOra = new Date(partita.dataOraPartita);
            let dataPartita = DataOra.toLocaleDateString("it-IT", option1);
            let oraPartita = DataOra.toLocaleDateString("it-IT", option2);


            if ((dataPartita === inputData)) {
              return errore = true
            }
          }
        })
        if (!errore) {
          const partita = new Partite({
            squadra1,
            squadra2,
            dataOraPartita,
            prezzoBigliettoPartita,
            descrizione,
            ImmaginePartita,
            IdStadio,
            categoria,
            createdBy: req.utente._id,
          });
      
          partita.save((error, partita) => {
            if (error) return res.status(400).json({ error });
            if (partita) {
              res.status(201).json({ partita, files: req.files });
            }
          });
        } else { return res.status(400).json({ error: "Problemi di concomitanza nell'inserimento della partita" + "\r\n" +
        "Possibili errori potrebbero essere i seguenti:" + "\r\n" +
        "1)Inserimento di una partita già esistente" + "\r\n" +
        "2)Le squadre selezionate hanno già in programma una partita nella data selezionata" + "\r\n" +
        "3)La data selezionata ha già in programma una partita in quello stadio" + "\r\n" +
        "(uno stadio può avere in programma solo una partita nell'arco della giornata)" }) }
      }

    });
}

exports.getPartitaDetailsById = (req, res) => {
  const { IdPartita } = req.params;
  if (IdPartita) {

    Ordine.aggregate([
      {
        "$match": {
          "biglietti.IdPartita": mongoose.Types.ObjectId(IdPartita)
        }
      },
      {
        "$unwind": "$biglietti"
      },
      {
        "$match": {
          "biglietti.IdPartita": mongoose.Types.ObjectId(IdPartita)
        }
      },
      {
        "$group": {
          "_id": null,
          "totalePostiOccupati": {
            "$sum": "$biglietti.N_BigliettiAcquistati"
          }
        }
      },
      {
        "$project": {
          "_id": 0,
          "totalePostiOccupati": 1
        }
      }
    ]).exec().then(async function (doc) {
      if (doc[0]) {
        const filter = { _id: IdPartita };
        const update = { totalePostiOccupati: doc[0].totalePostiOccupati };
        Partite.findOneAndUpdate(filter, update, {
          new: true
        })
          .populate("IdStadio")
          .exec((error, partita) => {
            if (error) return res.status(400).json({ error });
            if (partita) {
              res.status(200).json({ partita });
            }
          })
      } else {
        Partite.findOne({ _id: IdPartita })
          .populate("IdStadio")
          .exec((error, partita) => {
            if (error) return res.status(400).json({ error });
            if (partita) {
              res.status(200).json({ partita });
            }
          });

      }
    });


    // Partite.findOne({ _id: IdPartita })
    //   .populate("IdStadio")
    //   .exec((error, partita) => {
    //     if (error) return res.status(400).json({ error });
    //     if (partita) {
    //       console.log(partita);
    //       res.status(200).json({ partita });
    //     }
    //   });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deletePartitaById = (req, res) => {
  const { IdPartita } = req.body.payload;
  if (IdPartita) {
    Ordine.find({ "biglietti.IdPartita": IdPartita })
      .exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (Array.isArray(result) && result.length) {
          res.status(400).json({ error: "Eliminazione Parita non possibile causa presenza ordini contenente IdPartita" });
        }
        else {
          Partite.deleteOne({ _id: IdPartita }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
              res.status(202).json({ result });
            }
          });
        }
      });

  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getPartite = async (req, res) => {
  const partite = await Partite.find({ createdBy: req.utente._id })
    .select("_id squadra1 squadra2 incontro dataOraPartita prezzoBigliettoPartita slug descrizione IdStadio ImmaginePartita categoria")
    .populate({ path: "categoria", select: "_id nome" })
    .populate({ path: "IdStadio", select: "_id nome" })
    .exec();

  res.status(200).json({ partite });
};

exports.getPartitaBySlug = (req, res) => {
  const { slug } = req.params;
  Categorie.findOne({ slug: slug })
    .select("_id type")
    .exec(async (error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        const partite = await Partite.find({ categoria: category._id })
          .select("_id squadra1 squadra2 dataOraPartita prezzoBigliettoPartita slug descrizione IdStadio ImmaginePartita categoria")
          .populate("categoria")
          .populate("IdStadio")
          .exec();
        res.status(200).json({
          partite,
        });
        if (error) {
          return res.status(400).json({ error });
        }
      }
    });
};

// exports.UpdatePartitaById = (req, res) => {
//   const { IdPartite } = req.body.payload;
//   if (IdPartite) {
//     IdPartite.map((partita) => {
//       Partite.findOneAndUpdate(
//         {_id: partita.IdPartita._id},
//         {$inc: {totalePostiOccupati: -(partita.IdPartita.totalePostiOccupati)}},
//       ).exec((error, result) => {
//         if (error) return res.status(400).json({ error });
//         if (result) {
//           res.status(202).json({ result });
//         }
//       });
//     })
//   } else {
//     res.status(400).json({ error: "Params required" });
//   }
// };
//Verifica se esiste già uno stesso evento con la stessa data/ora o con le stesse squadre
