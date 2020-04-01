/* RESIZE OPTIMIZE IMAGES */
const Jimp = require("jimp");

/**
 * Resize + optimize images.
 *
 * @param Array images An array of images paths.
 * @param Number width A number value of width e.g. 1920.
 * @param Number height Optional number value of height e.g. 1080.
 * @param Number quality Optional number value of quality of the image e.g. 90.
 */
module.exports = async ({ images, width, height = Jimp.AUTO, quality }) => {
  await Promise.all(
    images.map(async imgPath => {
      const image = await Jimp.read(imgPath);
      await image.resize(width, height);
      await image.quality(quality);
      await image.writeAsync(imgPath);
    })
  );
};
