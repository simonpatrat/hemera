import "babel-polyfill";

import "../css/main.pcss";

const modules = {
  addImageForm: import("./modules/addImageForm"),
  addPostForm: import("./modules/addPostForm"),
  imagesLoaded: import("./modules/imagesLoaded"),
  userMenu: import("./modules/userMenu"),
  registerForm: import("./modules/registerForm"),
  postActions: import("./modules/postActions"),
  categoryActions: import("./modules/categoryActions"),
};

(function(window) {
  window.addEventListener("DOMContentLoaded", (event) => {
    const moduleElements = document.querySelectorAll("[data-module]");
    moduleElements.forEach(async (moduleElement, index) => {
      const moduleName = moduleElement.getAttribute("data-module");
      const moduleOptions = moduleElement.getAttribute("data-options");
      if (!moduleName || !modules[moduleName]) {
        return;
      }
      console.log("Loading Module: ", moduleName);
      const loadedModule = await modules[moduleName];
      loadedModule.default(moduleElement, moduleOptions);
    });
  });
})(window);
