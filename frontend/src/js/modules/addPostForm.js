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
  const updatePostId = form.getAttribute("data-postid");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const categoriesArray = !!form.categories.length
      ? Array.from(form.categories)
      : [form.categories];

    const categories = categoriesArray
      .filter((cat) => {
        return cat.checked;
      })
      .map((cat) => {
        return {
          _id: cat.value,
          catId: cat.value,
          name: cat.dataset.name,
          posts: JSON.parse(cat.dataset.posts),
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

      const isEditMode = !!updatePostId;
      if (isEditMode) {
        formData.append("postId", updatePostId);

        /* const catsToSave = await Promise.all(
          categories.map(async (cat) => {
            const newPosts = Array.from(new Set([...cat.posts, updatePostId]));

            const updatedCategory = await fetch("/admin/categories/edit", {
              method: "POST",
              body: JSON.stringify({
                ...cat,
                categoryId: cat._id,
                posts: newPosts,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const updatedCategoryJson = await updatedCategory.json();

            console.log("CATEGORY UPDATED", updatedCategoryJson);
            return updatedCategoryJson;
          })
        );

        console.log("catsToSave: ", catsToSave); */
      }
      formData.append("editorContent", JSON.stringify(outputData));
      formData.append("featuredImage", JSON.stringify(savedFeaturedImage));
      formData.append("categories", JSON.stringify(categories));

      const urlToFetch = isEditMode
        ? "/admin/articles/edit/" + updatePostId
        : apiUrl;
      const responseData = await fetch(urlToFetch, {
        method,
        body: formData,
      });

      const savedPost = await responseData.json();

      loadingOverlay.style.display = "none";

      statusTextOutput.textContent = "Saving Success!";
      submitButtons.forEach((button) => {
        button.setAttribute("disabled", false);
      });
      window.location.href = "/admin/articles/edit/" + savedPost.post.slug;
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
