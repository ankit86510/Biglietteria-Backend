const express = require("express");
//const {  } = require('../controller/category');
const {
    necessitaLogin,
    adminMiddleware,
    upload,
} = require("../Controller/Common");
const {
  createPartita,
  getPartitaBySlug,
  getPartitaDetailsById,
  deletePartitaById,
  getPartite,
} = require("../Controller/Partita");
const {validateNewPartitaRequest, isRequestValidated} = require('../Validator/Partita');

const router = express.Router();

router.post(
  "/partita/create",
  necessitaLogin,
  adminMiddleware,
  upload.array('ImmaginePartita'),
  validateNewPartitaRequest,
  isRequestValidated,
  createPartita
);
// router.delete(
//   "/partita/update",
//   necessitaLogin,
//   adminMiddleware,
//   UpdatePartitaById,
// );
router.get("/partite/:slug", getPartitaBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/partita/:IdPartita", getPartitaDetailsById);
router.delete(
  "/partita/deleteParitaById",
  necessitaLogin,
  adminMiddleware,
  deletePartitaById
);
router.post(
  "/partita/getPartite",
  necessitaLogin,
  adminMiddleware,
  getPartite
);

module.exports = router;