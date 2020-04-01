const express = require("express");
const router = express.Router();
const checkIsAuthenticated = require("./lib/checkIsAuthenticated");
const userModel = require("../../models/user");

/* GET users listing. */
router.get("/", checkIsAuthenticated, async function(req, res, next) {
  const users = await userModel.find();
  res.json(users);
});

module.exports = router;
