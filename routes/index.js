const express = require("express");
const router = express.Router();
const siteSettings = require("../settings");

const site = siteSettings.getSetting("site");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: site.name,
    currentUser: req.user
  });
});

module.exports = router;
