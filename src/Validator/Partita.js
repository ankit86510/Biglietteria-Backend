const { check, validationResult } = require('express-validator');

exports.validateNewPartitaRequest = [
    check('squadra1')
    .notEmpty()
    .withMessage('Nome Squadra 1 obbligatorio!'),
    check('squadra2')
    .notEmpty()
    .withMessage('Nome Squadra 2 obbligatorio!'),
    check('prezzoBigliettoPartita')
    .notEmpty()
    .withMessage('Prezzo biglietto obbligatorio!'),
    check('IdStadio')
    .isMongoId()
    .withMessage('Stadio scelto inesistente!'),
    check('categoria')
    .isMongoId()
    .withMessage('Categoria scelta inesistente!')

];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}