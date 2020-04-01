const express = require("express");
const router = express.Router();
const adminHomeRouter = require("./home");
const usersRouter = require("./users");
const imagesRouter = require("./images");
const authRouter = require("./auth");
const articlesRouter = require("./articles");

router.use("/", adminHomeRouter);
router.use("/users", usersRouter);
router.use("/images", imagesRouter);
router.use("/articles", articlesRouter);
router.use("/auth", authRouter);

module.exports = router;
