import { createEditor } from "../helpers/wysiwygEditor";

import {
  getEveryFormElementIsValid,
  observeAndValidateInputs,
  sanitizeAndHighlightFormElements
} from "../helpers/form";

/*
    // POST MODEL:

    dateCreated: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: Object, required: true },
    featuredImage: { type: Object, required: true },
    categories: { type: Array, required: false },
    metas: { type: Object, required: false }

*/

function addPostForm(form) {
  const editor = createEditor();

  observeAndValidateInputs({
    formElement: form,
    cssSelector: ".input--observable"
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const { action: apiUrl, method } = form;

    const sanitizedFormElementsList = sanitizeAndHighlightFormElements(form, [
      "title"
    ]);
    const everyElementIsValid = getEveryFormElementIsValid(
      sanitizedFormElementsList
    );

    if (!everyElementIsValid) {
      return;
    }

    const formData = new FormData(form);

    try {
      const outputData = await editor.save();

      formData.append("editorContent", JSON.stringify(outputData));
      const responseData = await fetch(apiUrl, {
        method,
        body: formData
      });
      const response = await responseData.json();
    } catch (error) {
      console.error("Editor saving failed: ", error);
    }
  });

  return editor;
}

export default addPostForm;
