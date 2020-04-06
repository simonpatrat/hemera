const express = require("express");
const asyncHandler = require("express-async-handler");
const orderBy = require("lodash/orderBy");

const ImageModel = require("../../models/image");

const image_controller = require("../../controllers/image");
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const router = express.Router();

/* GET images. */
router.get(
  "/",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const images = await ImageModel.find();
      const orderedImages = orderBy(images, "dateUploaded");
      res.render("imagesList", {
        images: orderedImages,
        title: `${req.siteSettings.sitename} | Images`
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

router.post("/add", checkIsAuthenticated, (req, res, next) => {
  const { currentUser } = res.locals;

  if (currentUser && currentUser.canPublish()) {
    return image_controller.image_create(req, res, next);
  } else {
    const error = new Error({
      type: 500,
      message: "Current user has not the right to publish"
    });
    return next(error);
  }
});

/* GET images add. */
router.get(
  "/add",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    res.render("addImages", {
      title: `${req.siteSettings.sitename} | Add image`,
      currentPage: "addImage"
    });
  })
);

module.exports = router;
