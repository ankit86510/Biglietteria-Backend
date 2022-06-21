const { necessitaLogin, userMiddleware, adminMiddleware } = require("../Controller/Common");
const { addOrdine, getOrdini, getOrdine, deleteOrdinePartitaById } = require("../Controller/Ordine");
const router = require("express").Router();

router.post("/addOrdine", necessitaLogin, userMiddleware, addOrdine);
router.get("/getOrdini", necessitaLogin, userMiddleware, getOrdini);
// router.get("/admin/getOrdini", necessitaLogin, adminMiddleware, getOrdini);
router.post("/getOrdine", necessitaLogin, userMiddleware, getOrdine);
// router.delete("/admin/deleteOrdinePartitaById", necessitaLogin, adminMiddleware, deleteOrdinePartitaById);


module.exports = router;