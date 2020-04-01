import "babel-polyfill";

import "../css/main.pcss";

const modules = {
  addImageForm: import("./modules/addImageForm"),
  addPostForm: import("./modules/addPostForm"),
  imagesLoaded: import("./modules/imagesLoaded"),
  userMenu: import("./modules/userMenu"),
  registerForm: import("./modules/registerForm")
};

(function(window) {
  window.addEventListener("DOMContentLoaded", event => {
    const moduleElements = document.querySelectorAll("[data-module]");
    moduleElements.forEach(async (moduleElement, index) => {
      const moduleName = moduleElement.getAttribute("data-module");
      if (!moduleName || !modules[moduleName]) {
        return;
      }
      console.log("Loading Module: ", moduleName);
      const loadedModule = await modules[moduleName];
      loadedModule.default(moduleElement);
    });
  });
})(window);
