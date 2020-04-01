const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const bcrypt = require("bcrypt");

const userModel = require("../../models/user");
const loginController = require("../../controllers/login");

const {
  validateUserName,
  validateUserEmail
} = require("./lib/validateUserCreation");

router.get(
  "/register",
  asyncHandler(async (req, res, next) => {
    res.render("register", { title: "Register" });
  })
);

router.use(validateUserName);
router.use(validateUserEmail);

router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const cryptedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.usernameExists) {
      res.status(500).render("register", {
        error: {
          status: 500,
          message:
            'User name "' +
            req.body.username +
            '" is already taken. Please enter another name'
        }
      });
    } else if (req.emailIsTaken) {
      res.status(500).render("register", {
        error: {
          status: 500,
          message:
            "Email " +
            req.body.email +
            " is already taken. Please chose another email address"
        }
      });
    } else {
      let user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: cryptedPassword
      });

      user.save(function(err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        // TODO: render login form with register success message instead
        res.render("registerSuccess", { username: user.username });
      });
    }
  })
);

router.get(
  "/login",
  asyncHandler(async (req, res, next) => {
    res.render("login", { title: "Login" });
  })
);

router.post("/login", loginController.user_login);

router.get(
  "/logout",
  asyncHandler(async (req, res, next) => {
    req.logout();
    res.redirect("/");
  })
);

module.exports = router;
