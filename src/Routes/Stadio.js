const express = require("express");
//const {  } = require('../controller/category');
const {
    necessitaLogin,
    adminMiddleware,
    upload,
} = require("../Controller/Common");
const {
  createStadio,
//   getProductsBySlug,
  getStadioDetailsById,
  deleteStadioById,
  getStadi,
} = require("../Controller/Stadio");
const { validateNewStadioRequest, isRequestValidated} = require('../Validator/Stadio');

const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

router.post(
  "/stadio/create",
  necessitaLogin,
  adminMiddleware,
  upload.array('ImmagineStadio'),
  validateNewStadioRequest,
  isRequestValidated,
  createStadio
);
// router.get("/products/:slug", getProductsBySlug);
//router.get('/category/getcategory', getCategories);
router.get("/stadio/:IdPartita", getStadioDetailsById);
router.delete(
  "/stadio/deleteStadioById",
  necessitaLogin,
  adminMiddleware,
  deleteStadioById
);
router.post(
  "/stadio/getStadi",
  necessitaLogin,
  adminMiddleware,
  getStadi
);

module.exports = router;