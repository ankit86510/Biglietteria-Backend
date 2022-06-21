const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
    check('nome')
    .notEmpty()
    .withMessage('Nome obbligatorio!'),
    check('cognome')
    .notEmpty()
    .withMessage('Cognome obbligatorio'),
    check('email')
    .isEmail()
    .withMessage('Email valido obbligatorio!'),
    check('password')
    .isLength({ min: 8 })
    .withMessage('Password deve contenere almeno 8 caratteri!')
];

exports.validateSigninRequest = [
    check('email')
    .isEmail()
    .withMessage('Email valido obbligatorio!')
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}