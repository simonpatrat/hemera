const express = require("express");
const asyncHandler = require("express-async-handler");

const ImageModel = require("../../models/image");
const PostModel = require("../../models/post");

const router = express.Router();

/* GET api/images. */
router.get(
  "/v1/images",
  asyncHandler(async (req, res, next) => {
    try {
      const images = await ImageModel.find();
      res.json(images);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

/* GET api/posts. */
router.get(
  "/v1/posts",
  asyncHandler(async (req, res, next) => {
    try {
      const posts = await PostModel.find();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

module.exports = router;
