const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  type: {
    type: String,
    enum: ["admin", "user", "guest"],
    required: true,
    default: "user"
  }
});

const userModel = mongoose.model("user", UserSchema);
userModel.prototype.isAdmin = function() {
  return this.type === "admin";
};

userModel.prototype.isUser = function() {
  return this.type === "user";
};

userModel.prototype.canPublish = function() {
  return this.isAdmin() || this.isUser();
};

userModel.prototype.canUpdate = function() {
  return this.canPublish();
};

userModel.prototype.canDelete = function() {
  return this.isAdmin();
};

module.exports = userModel;
