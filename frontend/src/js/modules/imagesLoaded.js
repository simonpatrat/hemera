function ImagesLoaded(images, options) {
  const defaults = {};
  this.settings = {
    ...defaults,
    ...options
  };
  this.images = [...images];
  this.imageLoaded = img => {
    return new Promise((resolve, reject) => {
      img.classList.add("img-loading");
      img.parentNode.classList.add("img-loading");
      const imgEl = document.createElement("img");
      imgEl.onload = () => {
        if (this.settings.debug) {
          console.log("Image :", img.src, " loaded.");
        }
        img.classList.remove("img-loading");
        img.classList.add("img-loaded");
        img.parentNode.classList.remove("img-loading");
        img.parentNode.classList.add("img-loaded");
        resolve(img);
      };
      imgEl.onError = err => reject(err);
      imgEl.src = img.src;
    });
  };

  this.getAllImageLoaded = () => {
    return Promise.all(
      this.images.map(image => {
        return this.imageLoaded(image);
      })
    );
  };
}

export default function imageLoaded() {
  const images = Array.from(document.querySelectorAll("img"));
  const imagesLoaded = new ImagesLoaded(images, {
    debug: false
  });

  imagesLoaded.getAllImageLoaded().then(() => {
    console.log("Every image has loaded");
  });
}
