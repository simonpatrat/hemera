const express = require("express");
const asyncHandler = require("express-async-handler");
const orderBy = require("lodash/orderBy");

const article_controller = require("../../controllers/article");
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const CategoriesModel = require("../../models/category");

const router = express.Router();

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
    const categories = await CategoriesModel.find();
    const orderedCategories = orderBy(categories, "name");

    res.render("addArticle", {
      title: "New article",
      currentPage: "addArticle",
      categories: orderedCategories
    });
  })
);

module.exports = router;
