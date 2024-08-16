const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  content: String,
  version: Number,
  updatedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
