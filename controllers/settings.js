const Settings = require("../models/settings");

async function settingsExist(name) {
  return await Settings.exists({ name: name }, function(err, result) {
    if (err) {
      return err;
    }
    return result;
  });
}

exports.settings_update = async function(req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      const settingsToUpdate = Object.keys(req.body);
      const docs = await Promise.all(
        settingsToUpdate.map(async settingName => {
          const newValue = req.body[settingName];
          console.log("setting name: ", settingName);
          console.log("setting value: ", newValue);

          let doc = await Settings.findOneAndUpdate(
            { name: "config" },
            { [settingName]: newValue },
            function(err) {
              if (err) {
                console.log(err);
                next(err);
              }
            }
          );

          return doc;
        })
      );
      const newSettings = await Settings.find();

      return resolve(newSettings[0]);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.settings_get = async function(req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      const settings = await Settings.find();
      return resolve(settings);
    } catch (error) {
      return reject(error);
    }
  });
};
