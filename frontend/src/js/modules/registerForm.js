import {
  getEveryFormElementIsValid,
  observeAndValidateInputs,
  sanitizeAndHighlightFormElements
} from "../helpers/form";

export default function registerForm(form) {
  observeAndValidateInputs({
    formElement: form,
    cssSelector: ".input--observable"
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const sanitizedFormElementsList = sanitizeAndHighlightFormElements(form, [
      "username",
      "email"
    ]);
    const everyElementIsValid = getEveryFormElementIsValid(
      sanitizedFormElementsList
    );

    if (!everyElementIsValid) {
      return;
    } else {
      form.submit();
    }
  });
}
