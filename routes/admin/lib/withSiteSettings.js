const siteSettings = require("../../../controllers/settings");
const Settings = require("../../../models/settings");

module.exports = async function(req, res, next) {
  const settings = await siteSettings.settings_get();

  if (settings.length <= 0) {
    let baseSettings = new Settings({
      name: "config",
      sitename: "Hemera"
    });
    await baseSettings.save();
  }
  req.siteSettings = settings[0];
  console.log("settings set sitename: ", req.siteSettings.sitename);
  next();
};
