const express = require('express');
const { login, registrazione, logout } = require('../../Controller/admin/admin');
const {validateSignupRequest, validateSigninRequest, isRequestValidated} = require('../../Validator/utente');
const router = express.Router();

router.post('/admin/Login',validateSigninRequest, isRequestValidated, login);

router.post('/admin/Registrazione',validateSignupRequest, isRequestValidated, registrazione);

router.post('/admin/Logout', isRequestValidated, logout);


module.exports = router;