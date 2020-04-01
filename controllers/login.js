const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.user_login = asyncHandler(async function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/admin");
    });
  })(req, res, next);
});
