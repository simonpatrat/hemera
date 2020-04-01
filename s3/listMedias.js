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

// Create the parameters for calling listObjects
const bucketParams = {
  Bucket: config.S3_BUCKET_NAME,
  Prefix: `${config.S3_BUCKET_FOLDER}/`
};

function getBucketObjectsList() {
  return new Promise((resolve, reject) => {
    try {
      // Call S3 to obtain a list of the objects in the bucket
      s3.listObjects(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
          throw new Error(error);
        }

        return resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = getBucketObjectsList;
