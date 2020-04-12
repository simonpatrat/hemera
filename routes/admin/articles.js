const express = require("express");
const asyncHandler = require("express-async-handler");
const orderBy = require("lodash/orderBy");

const article_controller = require("../../controllers/article");
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const CategoriesModel = require("../../models/category");
const PostModel = require("../../models/post");

const router = express.Router();

router.get(
  "/",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    const posts = await PostModel.find();
    const ordredPosts = orderBy(posts, "dateCreated");

    /*  res.render("postsList", {
      title: `${req.siteSettings.sitename} | Posts`,
      currentPage: "postList",
      posts: ordredPosts
    }); */
    res.status(200).json({
      title: `${req.siteSettings.sitename} | Posts`,
      currentPage: "postList",
      posts: ordredPosts
    });
  })
);

router.post("/add", checkIsAuthenticated, (req, res, next) => {
  const { currentUser } = res.locals;
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

router.get(
  "/add",
  checkIsAuthenticated,
  asyncHandler(async (req, res, next) => {
    const categories = await CategoriesModel.find();
    const orderedCategories = orderBy(categories, "name");

    res.render("addArticle", {
      title: `${req.siteSettings.sitename} | New Post`,
      currentPage: "addArticle",
      categories: orderedCategories
    });
  })
);

module.exports = router;
