const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  dateCreated: { type: String, required: true },
  dateUpdated: { type: String, required: true },
  description: { type: String, required: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});

categoryModel = mongoose.model("category", CategorySchema);
categoryModel.prototype.getNumberOfPosts = function() {
  return this.posts.length;
};

module.exports = categoryModel;
