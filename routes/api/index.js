const express = require("express");
const asyncHandler = require("express-async-handler");

const ImageModel = require("../../models/image");

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

module.exports = router;
