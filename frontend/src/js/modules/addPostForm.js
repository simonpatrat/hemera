import { createEditor } from "../helpers/wysiwygEditor";

import {
  getEveryFormElementIsValid,
  observeAndValidateInputs,
  sanitizeAndHighlightFormElements,
} from "../helpers/form";

function addPostForm(form) {
  const editor = createEditor();

  const submitButtons = form.querySelectorAll('button[type="submit"]');

  observeAndValidateInputs({
    formElement: form,
    cssSelector: ".input--observable",
  });

  const loadingOverlay = document.querySelector(".loading-overlay");
  const statusTextOutput = document.querySelector(".loading-status__text");

  const featuredImageInput = form.querySelector("#featuredImage");
  const featuredImageInputContainer = featuredImageInput.parentElement;
  const featuredImageOutput = featuredImageInputContainer.querySelector("img");

  featuredImageInput.addEventListener("change", (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      featuredImageInputContainer.classList.add("image-loading");
      reader.onload = function(e) {
        featuredImageOutput.setAttribute("src", e.target.result);
        featuredImageInputContainer.classList.remove("image-loading");
        featuredImageInputContainer.classList.add("image-selected");
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const categories = Array.from(form.categories)
      .filter((cat) => {
        return cat.checked;
      })
      .map((cat) => {
        return {
          id: cat.value,
          name: cat.dataset.name,
        };
      });

    loadingOverlay.style.display = "flex";

    statusTextOutput.textContent = "Saving in progress...";
    submitButtons.forEach((button) => {
      button.setAttribute("disabled", true);
    });

    const { action: apiUrl, method } = form;

    const sanitizedFormElementsList = sanitizeAndHighlightFormElements(form, [
      "title",
    ]);
    const everyElementIsValid = getEveryFormElementIsValid(
      sanitizedFormElementsList
    );

    if (!everyElementIsValid) {
      return;
    }

    const formData = new FormData(form);

    try {
      const featuredImage = featuredImageInput.files
        ? featuredImageInput.files[0]
        : null;

      let savedFeaturedImage = null;

      if (!!featuredImage) {
        const imageFormData = new FormData();
        imageFormData.append("file", featuredImage);

        const savedImage = await fetch("/admin/images/add", {
          method: "POST",
          body: imageFormData,
        });
        const savedImageJson = await savedImage.json();
        console.log("SAVED IMAGE: ", savedImageJson);
        savedFeaturedImage = savedImageJson.file;
      }

      const outputData = await editor.save();

      formData.append("editorContent", JSON.stringify(outputData));
      formData.append("featuredImage", JSON.stringify(savedFeaturedImage));
      formData.append("categories", JSON.stringify(categories));
      const responseData = await fetch(apiUrl, {
        method,
        body: formData,
      });
      const response = await responseData.json();

      loadingOverlay.style.display = "none";

      statusTextOutput.textContent = "Saving Success!";
      submitButtons.forEach((button) => {
        button.setAttribute("disabled", false);
      });
    } catch (error) {
      console.error("Editor saving failed: ", error);

      statusTextOutput.textContent = "Saving Error...";
      setTimeout(() => {
        submitButtons.forEach((button) => {
          button.setAttribute("disabled", false);
        });

        loadingOverlay.style.display = "none";
      }, 2000);
    }
  });

  return editor;
}

export default addPostForm;
