const userModel = require("../../../models/user");

const validateUserName = (req, res, next) => {
  userModel.exists({ username: req.body.username }, function(err, result) {
    console.log("userNameExist: ", err, result);
    if (err) {
      next(err);
    }
    req.usernameExists = result;
    next();
  });
};

const validateUserEmail = (req, res, next) => {
  userModel.exists({ email: req.body.email }, function(err, result) {
    console.log("userEmailExist: ", err, result);
    if (err) {
      next(err);
    }
    req.emailIsTaken = result;
    next();
  });
};

module.exports = {
  validateUserName,
  validateUserEmail
};
