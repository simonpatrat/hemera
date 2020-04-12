const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.user_login = asyncHandler(async function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).json({ error: true, message: err, info });
    }
    if (!user) {
      console.log("ERROR PAS DE USER: ", user);
      return res.status(500).json({ error: true, message: err, info });
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log("ERROR: ", err);
        return res.status(500).json({ error: true, message: err, info });
      }
      return res.status(200).json({
        error: false,
        redirect: "/",
        message: "User logged in.",
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});
