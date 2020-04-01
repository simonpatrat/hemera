const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_BUCKET_FOLDER: process.env.S3_BUCKET_FOLDER,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
};
