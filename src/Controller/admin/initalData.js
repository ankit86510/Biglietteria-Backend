const Categorie = require("../../Models/Categorie");
const Partite = require("../../Models/Partita");
const Ordini = require("../../Models/Ordine");
const Stadi = require("../../Models/Stadio");
const Utente = require("../../Models/utente");




function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      nome: cate.nome,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  const categories = await Categorie.find({}).exec();
  const partite = await Partite.find({ createdBy: req.utente._id })
    .select("_id squadra1 squadra2 dataOraPartita prezzoBigliettoPartita totalePostiOccupati slug descrizione IdStadio ImmaginePartita categoria")
    .populate("categoria")
    .populate("IdStadio")
    .exec();
  const stadi = await Stadi.find({ createdBy: req.utente._id }).exec();
  const ordini = await Ordini.find({})
    .populate("utente")
    .populate("biglietti.IdPartita")
    .exec();
  const clienti = await Utente.find({ ruolo: "utente"})
    .exec();
  res.status(200).json({
    categories: createCategories(categories),
    partite,
    stadi,
    ordini,
    clienti,
  });
};