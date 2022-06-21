const Carrello = require("../Models/Carrello");

var mongoose = require('mongoose');

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Carrello.findOneAndUpdate(condition, updateData,)
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}

exports.addArticoliAlCarrello = (req, res) => {
  Carrello.findOne({ utente: req.utente._id }).exec((error, carrello) => {
    if (error) return res.status(400).json({ error });
    if (carrello) {
      //if cart already exists then update cart by quantity
      let promiseArray = [];

      req.body.ArticoliCarrello.forEach((articoloCarrello) => {
        const articolo = articoloCarrello.articolo;
        const item = carrello.articoliCarrello.find((c) => c.articolo == articolo);
        let condition, update;

        if (item) {
          condition = { "utente": req.utente._id, "articoliCarrello.articolo": articolo };
          update = {
            $set: {
              "articoliCarrello.$": articoloCarrello,
            },

          };
        } else {

          condition = { utente: req.utente._id };
          update = {
            $push: {
              articoliCarrello: articoloCarrello,
            },
          };
        }
        promiseArray.push(runUpdate(condition, update));
        //Cart.findOneAndUpdate(condition, update, { new: true }).exec();
        // .exec((error, _cart) => {
        //     if(error) return res.status(400).json({ error });
        //     if(_cart){
        //         //return res.status(201).json({ cart: _cart });
        //         updateCount++;
        //     }
        // })
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      //if cart not exist then create a new cart
      const carrello = new Carrello({
        utente: req.utente._id,
        articoliCarrello: req.body.ArticoliCarrello,
      });
      carrello.save((error, carrello) => {
        if (error) return res.status(400).json({ error });
        if (carrello) {
          return res.status(201).json({ carrello });
        }
      });
    }
  });
};

// exports.addAlCarrello = (req, res) => {
//     const { cartItems } = req.body;
//     if(cartItems){
//        if(Object.keys(cartItems).length > 0){
//            Cart.findOneAndUpdate({
//                "user": req.user._id
//            }, {
//                "cartItems": cartItems
//            }, {
//                 upsert: true, new: true, setDefaultsOnInsert: true
//            }, (error, cartItems) => {
//                if(error) return res.status(400).json({ error });
//                if(cartItems) res.status(201).json({ message: 'Added Successfully' });
//            })
//        }
//        //res.status(201).json({ cartItems });
//     }else{
//         //res.status(201).json({ req });
//     }
// }

exports.getArticoliCarrello = (req, res) => {
  //const { user } = req.body.payload;
  //if(user){
    let ArticoliCarrello = {};
  Carrello.findOne({ utente: req.utente._id })
    .populate({
      path: 'articoliCarrello',
      populate: {
        path: 'articolo',
        model: 'Partita',
        populate: {
          path: 'IdStadio',
          model: 'Stadio'
        }
      }
    })
    .exec((error, carrello) => {
      if (error) return res.status(400).json({ error });
      if (carrello) {

        carrello.articoliCarrello.forEach(  (articolo, index) => {
           ArticoliCarrello[articolo.articolo._id.toString()] = {
            _id: articolo.articolo._id.toString(),
            nome: `${articolo.articolo.squadra1} - ${articolo.articolo.squadra2}`,
            img: articolo.articolo.ImmaginePartita[0] ? articolo.articolo.ImmaginePartita[0].img : null,
            prezzoBigliettoPartita: articolo.articolo.prezzoBigliettoPartita,
            totalePostiStadio: articolo.articolo.IdStadio.totalePostiStadio,
            totalePostiOccupati: articolo.articolo.totalePostiOccupati,
            qty: articolo.quantita,
          };

        });
        res.status(200).json({ ArticoliCarrello });  
      }
    })
  //}
};

// new update remove cart items
exports.removeArticoliCarrello = (req, res) => {
  const { IdPartita } = req.body.payload;
  if (IdPartita) {
    Carrello.updateOne(
      { utente: req.utente._id },
      {
        $pull: {
          articoliCarrello: {
            articolo: IdPartita,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};