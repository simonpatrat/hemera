class Settings {
  constructor(options) {
    const defaults = {
      site: {
        name: "Hemera"
      }
    };
    this.settings = {
      ...defaults,
      ...options
    };
  }

  setSetting(setting = {}) {
    this.settings = {
      ...this.settings,
      ...setting
    };
  }

  getSetting(settingKey) {
    return this.settings[settingKey];
  }

  getSettings() {
    return this.settings;
  }
}

const siteSettings = new Settings();

module.exports = siteSettings;
