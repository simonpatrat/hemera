const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SettingsSchema = new Schema({
  name: { type: String, required: true, default: "config" },
  sitename: { type: String, required: true, default: "Hemera" }
});

module.exports = mongoose.model("settings", SettingsSchema);
