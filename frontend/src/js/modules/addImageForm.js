const UPLOAD_API_URL = `/admin/images/add`;
const PLACEHOLDER_PICTURE_URL = `https://i.picsum.photos/id/866/640/400.jpg`;

function readURL(input) {
  const addImagesForm = document.getElementById("add-images-form");
  const imagePreviewTag = document.getElementById("image-preview");
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      if (!!imagePreviewTag) {
        imagePreviewTag.setAttribute("src", e.target.result);
        imagePreviewTag.setAttribute("width", 640);
        imagePreviewTag.setAttribute("height", "");
      }
    };

    reader.readAsDataURL(input.files[0]);
    addImagesForm.classList.add("image-selected");
  }
}

function addImageForm(form) {
  const addImagesForm = form || document.getElementById("add-images-form");
  const loadingOverlay = document.querySelector(".loading-overlay");
  const statusTextOutput = document.querySelector(".loading-status__text");

  if (!!addImagesForm) {
    const imagesInput = document.getElementById("image-file");
    const titleInput = document.getElementById("image-title");
    const descriptionInput = document.getElementById("image-description");
    const submitFormButton = document.getElementById(
      "add-images-form-submit-button"
    );
    const imagePreviewTag = document.getElementById("image-preview");

    imagePreviewTag.addEventListener("click", () => {
      imagesInput.click();
    });

    imagesInput.addEventListener("change", function() {
      readURL(this);
    });

    addImagesForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!addImagesForm.classList.contains("image-selected")) {
        return alert("You must chose an image");
      }

      loadingOverlay.style.display = "flex";

      statusTextOutput.textContent = "Upload de l'image ...";
      submitFormButton.setAttribute("disabled", true);

      const fileToUpload =
        !!imagesInput && !!imagesInput.files[0] ? imagesInput.files[0] : null;
      const data = new FormData(addImagesForm);
      !!titleInput.value && data.append("title", titleInput.value);
      !!fileToUpload && data.append("file", fileToUpload);
      !!descriptionInput && data.append("description", descriptionInput.value);
      fetch(UPLOAD_API_URL, {
        method: "post",
        body: data
      })
        .then(async response => {
          if (response.status !== 404) {
            const json = await response.json();
            afterSubmitImage(
              statusTextOutput,
              addImagesForm,
              submitFormButton,
              imagePreviewTag
            );
          } else {
            throw new Error(response);
          }
        })
        .catch(error => {
          console.error(error);
          const isError = true;
          afterSubmitImage(
            statusTextOutput,
            addImagesForm,
            submitFormButton,
            imagePreviewTag,
            isError
          );
        });
    });
  }
}

function afterSubmitImage(
  statusTextOutput,
  addImagesForm,
  submitFormButton,
  imagePreviewTag,
  isError = false
) {
  statusTextOutput.textContent = isError
    ? "😥 Échec de l'upload."
    : "Upload réussi ! ✅";
  statusTextOutput.style.color = isError ? "red" : "";
  addImagesForm.reset();
  submitFormButton.removeAttribute("disabled");
  addImagesForm.classList.remove("image-selected");
  imagePreviewTag.setAttribute("src", PLACEHOLDER_PICTURE_URL);
  setTimeout(() => {
    document.querySelector(".loading-overlay").style.display = "";
    statusTextOutput.textContent = "";
  }, 3000);
}

export default addImageForm;
