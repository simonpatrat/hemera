const config = require("../config");
// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  region: config.S3_REGION
});

// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

async function uploadFile({ file, name, fileExtension }) {
  return new Promise(async (resolve, reject) => {
    const uploadParams = {
      Bucket: config.S3_BUCKET_NAME,
      Key: "",
      Body: ""
    };

    // Configure the file stream and obtain the upload parameters
    const fs = require("fs");
    const fileStream = fs.createReadStream(file);
    fileStream.on("error", function(err) {
      console.log("File Error", err);
    });
    uploadParams.Body = fileStream;
    const path = require("path");
    uploadParams.Key = `${config.S3_BUCKET_FOLDER}/${name ||
      path.basename(file)}${fileExtension}`;

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function(err, data) {
      if (err) {
        console.log("Error", err);
        return resolve({
          err
        });
      }
      if (data) {
        console.log("Upload Success", data, data.Location);
        return resolve(data);
      }
    });
  });
}

module.exports = uploadFile;
