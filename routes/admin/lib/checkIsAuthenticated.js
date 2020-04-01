const checkIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.status(401).redirect("/admin/auth/login");
  }
};

module.exports = checkIsAuthenticated;
