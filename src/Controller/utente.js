const Utente = require('../Models/utente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateJwtToken = (_id, ruolo) => {
    return jwt.sign({ _id, ruolo }, process.env.Secret_Key, {
        expiresIn: "1d",
    });
};

exports.login = ((req, res) => {

    Utente.findOne({ email: req.body.email })
        .exec(async (error, utente) => {
            if (error) return res.status(400).json({ error });
            if (utente) {
                const isPassword = await utente.autenticazione(req.body.password);
                if (isPassword && utente.ruolo === "utente") {
                    // const token = jwt.sign(
                    //   { _id: user._id, role: user.role },
                    //   process.env.JWT_SECRET,
                    //   { expiresIn: "1d" }
                    // );
                    const token = generateJwtToken(utente._id, utente.ruolo);
                    const { _id, nome, cognome, email, ruolo, fullname } = utente;
                    res.status(200).json({
                        token,
                        utente: { _id, nome, cognome, email, ruolo, fullname },
                    });
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
exports.registrazione = ((req, res) => {

    Utente.findOne({ email: req.body.email })
        .exec(async (error, utente) => {
            if (utente) return res.status(400).json({
                message: 'Utente già esistente'
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
                hash_password
            });

            _utente.save((error, utente) => {
                if (error) {
                    return res.status(400).json({
                        message: 'Qualcosa è andato storto'
                    });
                }

                if (utente) {
                    const token = generateJwtToken(utente._id, utente.ruolo);
                    const {  _id, nome, cognome, email, ruolo, fullname } = utente;
                    return res.status(201).json({
                        token,
                        utente: {  _id, nome, cognome, email, ruolo, fullname },
                    });
                }
            });
        });


});