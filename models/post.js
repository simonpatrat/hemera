const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PostSchema = new Schema({
  easyId: { type: String, required: true },
  dateCreated: { type: String, required: true },
  dateUpdated: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: Object, required: true },
  featuredImage: { type: Object, required: true },
  categories: [
    {
      name: { type: String },
      slug: { type: String },
      catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    },
  ],
  metas: { type: Object, required: false },
  author: { type: Object, required: true },
});

module.exports = mongoose.model("post", PostSchema);
