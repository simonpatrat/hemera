const formidable = require("formidable");
const asyncHandler = require("express-async-handler");
const path = require("path");

const uploadFile = require("../s3/upload");
const Image = require("../models/image");
const optimizeImages = require("../lib/optimizeImages");

const config = require("../config");

const { S3_BUCKET_NAME, S3_BUCKET_FOLDER } = config;

const getImageColorPalette = require("../lib/imageColorPalette");

const getImageUrl = (image, bucketName, bucketFolder) => {
  const { name: fileName } = image;
  const imageUrl = `https://${bucketName || S3_BUCKET_NAME}/${bucketFolder ||
    S3_BUCKET_FOLDER}.s3.amazonaws.com/${fileName}`;
  return imageUrl;
};

const image_save = async (req, res, next, fields, files) => {
  const file = files.file || files.image;
  let { title, description } = fields;
  if (!title) {
    title = file.name;
  }
  const fileExtension = path.extname(file.name);

  const colorPalette = await getImageColorPalette(file.path);
  const fileName = title.trim().replace(/\s/g, "_");
  await optimizeImages({
    images: [file.path],
    width: 1920,
    quality: 60
  });
  const s3Upload = await uploadFile({
    file: file.path,
    name: fileName,
    fileExtension
  });

  if (!!s3Upload.error) {
    throw new Error(s3Upload.error);
  }

  const { Location, ETag } = s3Upload;

  let image = new Image({
    dateUploaded: new Date().toString(),
    title,
    colorPalette: colorPalette,
    description,
    url: Location || getImageUrl(file),
    fileName,
    s3_eTag: ETag
  });

  image.save(function(err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json({
      success: 1,
      file: {
        url: image.url
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
      },
      message: "Image Saved successfully!"
    });
  });
};

exports.image_create = asyncHandler(async (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("ERROR UPLOADING: ", err);
      next(err);
      return;
    }
    image_save(req, res, next, fields, files);
  });
});

exports.image_save;
