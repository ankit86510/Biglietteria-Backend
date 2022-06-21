const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
    },
    categoryImage: { type: String },
    parentId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categorie", categorySchema);