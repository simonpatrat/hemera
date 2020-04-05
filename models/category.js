const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false }
});

module.exports = mongoose.model("category", CategorySchema);
