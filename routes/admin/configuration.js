const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const siteSettings = require("../../controllers/settings");
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");

router.get("/", checkIsAuthenticated, async (req, res, next) => {
  const { sitename } = req.siteSettings;
  res.render("configuration", {
    title: `${sitename} | Configuration`,
    user: {
      name: req.user.username
    },
    formValues: {
      sitename: sitename
    }
  });
});

router.post("/", checkIsAuthenticated, async (req, res, next) => {
  try {
    const newSettings = await siteSettings.settings_update(req, res, next);
    const { sitename } = newSettings;
    res.status(200).render("configuration", {
      title: `${sitename} | Configuration`,
      user: {
        name: req.user.username
      },
      formValues: {
        sitename: sitename
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
