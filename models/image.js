const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ImageSchema = new Schema({
  dateUploaded: { type: String, required: true },
  title: { type: String, required: true },
  colorPalette: { type: Object, required: true },
  url: { type: String, required: true },
  fileName: { type: String, required: true },
  description: { type: String, required: false },
  s3_eTag: { type: String, required: true }
});

module.exports = mongoose.model("image", ImageSchema);
