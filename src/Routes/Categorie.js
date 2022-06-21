const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../Controller/Categorie");
const {
  necessitaLogin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../Controller/Common");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/categorie/create",
  necessitaLogin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/categorie/getcategorie", getCategories);
router.post(
  "/categorie/update",
  necessitaLogin,
  adminMiddleware,
  upload.array("categoryImage"),
  updateCategories
);
router.post(
  "/categorie/delete",
  necessitaLogin,
  adminMiddleware,
  deleteCategories
);

module.exports = router;