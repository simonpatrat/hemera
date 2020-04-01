const isValidEmail = value => {
  const regexp = new RegExp(
    /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/
  );
  return !!value && regexp.test(value);
};

const isValidUserName = value => {
  return value.length >= 3;
};

const isValidPassword = value => {
  return value.length >= 5;
};

export const parseAndSanitizedForm = (form, elements) => {
  const sanitized = elements.map(element => {
    const { value, type, name } = form[element];
    const trimmedValue = !!value ? value.trim() : null;
    let validatedInput = {
      name: element,
      [element]: trimmedValue,
      isValid: !!trimmedValue
    };

    console.log("Validating ", name);
    switch (name) {
      case "email":
        return {
          ...validatedInput,
          isValid: isValidEmail(trimmedValue)
        };
      case "password":
        return {
          ...validatedInput,
          isValid: isValidPassword(trimmedValue)
        };
      case "username":
        return {
          ...validatedInput,
          isValid: isValidUserName(trimmedValue)
        };
      default:
        return validatedInput;
    }
  });
  return sanitized;
};

export const getEveryFormElementIsValid = elementsArray => {
  const everyElementIsValid = elementsArray.every(element => !!element.isValid);
  return everyElementIsValid;
};

export const highlightErrors = (form, elements) => {
  elements.forEach(element => {
    const { name, isValid } = element;
    const formElement = form[name];
    if (!formElement) {
      throw new Error(
        "You must have given a wromng element name: ",
        `form[${name}] does not exists.`
      );
    }
    if (!isValid) {
      formElement.classList.add("with-error");
    }
    if (isValid) {
      formElement.classList.remove("with-error");
    }
  });
};

export const sanitizeAndHighlightFormElements = (form, formElementsNames) => {
  const sanitizedFormElementsList = parseAndSanitizedForm(form, [
    ...formElementsNames
  ]);

  highlightErrors(form, sanitizedFormElementsList);

  return sanitizedFormElementsList;
};

export const observeAndValidateInputs = ({ formElement, cssSelector }) => {
  if (!formElement) {
    throw new Error("You must specify a form element to perform form in.");
  }
  if (!cssSelector) {
    throw new Error(
      "You must specify a css selector to perform form validation."
    );
  }

  const observableInputs = Array.from(
    formElement.querySelectorAll(cssSelector)
  );

  observableInputs.forEach(input => {
    input.addEventListener("change", event => {
      input.value = input.value.trim();
      sanitizeAndHighlightFormElements(formElement, [input.name]);
    });
  });
};
