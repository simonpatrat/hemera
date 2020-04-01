const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const precss = require("precss");
const atImport = require("postcss-import");
const fs = require("fs");

const compile = async () => {
  const result = await fs.readFile("frontend/src/css/main.pcss", (err, css) => {
    postcss([atImport, precss, autoprefixer])
      .process(css, {
        from: "frontend/src/css/main.pcss",
        to: "public/stylesheets/style.css"
      })
      .then(result => {
        fs.writeFile("public/stylesheets/style.css", result.css, () => true);
        if (result.map) {
          fs.writeFile(
            "public/stylesheets/style.css.map",
            result.map,
            () => true
          );
        }
      });
  });
  return result;
};

module.exports = compile;
