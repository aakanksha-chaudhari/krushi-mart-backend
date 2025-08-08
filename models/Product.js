const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  imageUrl: String,
  category: String,
  subcategory: String //  MUST BE HERE
});

module.exports = mongoose.model("Product", productSchema);
