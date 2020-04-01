const express = require("express");
const asyncHandler = require("express-async-handler");

const article_controller = require("../../controllers/article");
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const router = express.Router();

/* GET images. */
router.get(
  "/",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const images = await ImageModel.find();
      res.render("imagesList", { images: images, title: "Images" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

router.post("/add", checkIsAuthenticated, (req, res, next) => {
  if (currentUser && currentUser.canPublish()) {
    return article_controller.article_create(req, res, next);
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
    res.render("addArticle", {
      title: "New article",
      currentPage: "addArticle"
    });
  })
);

module.exports = router;
