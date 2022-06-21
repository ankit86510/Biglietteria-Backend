const Utente = require('../../Models/utente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = ((req,res) => {

    Utente.findOne({ email: req.body.email })
   .exec((error, utente) => {
       if(error) return res.status(400).json({ error });

       if(utente) {
           if(utente.autenticazione(req.body.password) && utente.ruolo == 'admin') {
               const token = jwt.sign({_id: utente._id, ruolo: utente.ruolo}, process.env.Secret_Key, { expiresIn: '1h'} );
               res.cookie('token', token, {expiresIn: '1d'});
               const {nome, cognome, email, ruolo, fullname } = utente;
               res.status(201).json({
                   token,
                   utente: {
                       nome, cognome, email, ruolo, fullname
                   }
               })
           } else {
               res.status(400).json({
                   message: 'Password non valido!!'
               })
           }
       } else {
           return res.status(400).json({
               message: 'Qualcosa è andato storto'
           });
       };
    });
});
exports.registrazione =  ((req,res) => {

    Utente.findOne({ email: req.body.email })
   .exec(async (error, utente) => {
       if(utente) return res.status(400).json({
        message: 'Admin già esistente'
    });

    const {
        nome,
        cognome,
        email,
        password
    } = req.body;

    const hash_password = await bcrypt.hashSync(password, 10);
    const _utente = new Utente({
        nome,
        cognome,
        username: Math.random().toString(),
        email,
        hash_password,
        ruolo: 'admin'
     });

    _utente.save((error, data) => {
        if(error) {
            return res.status(400).json({
                message: 'Qualcosa è andato storto'
            });
        }

        if(data) {
            return res.status(201).json({
                message: 'Admin creato con sucesso!!'
            });
        }
       });
   });

});
exports.logout = ((req, res) => {
    res.clearCookie("token");
    res.status(201).json({
      message: "Logout avvenuto con successo...!",
    });
});