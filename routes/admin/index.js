const express = require("express");
const router = express.Router();
const adminHomeRouter = require("./home");
const usersRouter = require("./users");
const imagesRouter = require("./images");
const authRouter = require("./auth");
const articlesRouter = require("./articles");
const categoriesRouter = require("./categories");
const configurationRouter = require("./configuration");

router.use("/", adminHomeRouter);
router.use("/users", usersRouter);
router.use("/images", imagesRouter);
router.use("/posts", articlesRouter);
router.use("/articles", articlesRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/configuration", configurationRouter);

module.exports = router;
