const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");

router.get("/", checkIsAuthenticated, (req, res, next) => {
  res.render("adminHome", {
    title: `${req.siteSettings.sitename} | Admin`,
    user: {
      name: req.user.username
    }
  });
});

module.exports = router;
