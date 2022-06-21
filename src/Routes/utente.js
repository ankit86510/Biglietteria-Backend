const express = require('express');
const { login, registrazione, necessitaLogin } = require('../Controller/utente');
const {validateSignupRequest, validateSigninRequest, isRequestValidated} = require('../Validator/utente');
const router = express.Router();

router.post('/Login',validateSigninRequest, isRequestValidated,login);

router.post('/Registrazione', validateSignupRequest, isRequestValidated, registrazione);

// router.post('/Profilo', necessitaLogin, (req, res) => {
//     res.status(200).json({
//         user: 'profile'
//     })
// });

module.exports = router;