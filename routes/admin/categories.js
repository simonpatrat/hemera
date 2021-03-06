const express = require("express");
const asyncHandler = require("express-async-handler");
const orderBy = require("lodash/orderBy");
const categories_controller = require("../../controllers/category");
const CategoriesModel = require("../../models/category");
const PostModel = require("../../models/post");

const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const router = express.Router();

/* GET images. */
router.get(
  "/",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const categories = await CategoriesModel.find();
      const orderedCategories = orderBy(categories, "name");

      res.render("categoriesList", {
        categories: orderedCategories,
        title: `${req.siteSettings.sitename} | Categories`,
        message: res.message,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

router.post("/add", checkIsAuthenticated, (req, res, next) => {
  const { currentUser } = res.locals;

  if (currentUser && currentUser.canPublish()) {
    return categories_controller.category_create(req, res, next);
  } else {
    const error = new Error({
      type: 500,
      message: "Current user has not the right to publish",
    });
    return next(error);
  }
});

router.post("/edit", checkIsAuthenticated, (req, res, next) => {
  const { currentUser } = res.locals;

  if (currentUser && currentUser.canPublish()) {
    return categories_controller.category_update(req, res, next);
  } else {
    const error = new Error({
      type: 500,
      message: "Current user has not the right to update",
    });
    return next(error);
  }
});

router.post("/delete", checkIsAuthenticated, async (req, res, next) => {
  const { currentUser } = res.locals;
  if (currentUser && currentUser.canDelete()) {
    const deletionResult = await categories_controller.category_delete(
      req,
      res,
      next
    );
    console.log("deletion: ", deletionResult);
    res.json(deletionResult);
  } else {
    const error = new Error({
      type: 500,
      message: "Current user has not the right to publish",
    });
    return next(error);
  }
});

module.exports = router;
