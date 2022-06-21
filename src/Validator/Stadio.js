const { check, validationResult } = require('express-validator');

exports.validateNewStadioRequest = [
    check('nome')
    .notEmpty()
    .withMessage('Nome Stadio obbligatorio!'),
    check('citta')
    .notEmpty()
    .withMessage('Citta obbligatoria!'),
    check('regione')
    .notEmpty()
    .withMessage('Regione obbligatoria!'),
    check('totalePostiStadio')
    .notEmpty()
    .withMessage('Totale Posti Stadio obbligatorio!'),
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}