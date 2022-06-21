const  {initialData} = require('../../Controller/admin/initalData')
const express = require('express');
const { necessitaLogin, adminMiddleware } = require("../../Controller/Common");
const router = express.Router();

router.post('/initialData', necessitaLogin, adminMiddleware, initialData);

module.exports = router;