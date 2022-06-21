const express = require("express");
const {
    addArticoliAlCarrello,
    addToCart,
    getArticoliCarrello,
    removeArticoliCarrello,
} = require("../Controller/Carrello");
const { necessitaLogin, userMiddleware } = require("../Controller/Common");
const router = express.Router();

router.post(
  "/utente/carrello/addtocart",
  necessitaLogin,
  userMiddleware,
  addArticoliAlCarrello
);
//router.post('/user/cart/addToCartByLogin', necessitaLogin, userMiddleware, addToCart);
router.post("/utente/getCartItems", necessitaLogin, userMiddleware, getArticoliCarrello);
//new update
router.post(
  "/utente/carrello/removeItem",
  necessitaLogin,
  userMiddleware,
  removeArticoliCarrello
);

module.exports = router;