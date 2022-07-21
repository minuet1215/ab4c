require("dotenv").config();
const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } = process.env;
const aws = require("aws-sdk");

const s3 = new aws.S3({
  secretAccessKey: AWS_SECRET_KEY,
  accessKeyId: AWS_ACCESS_KEY,
  region: AWS_REGION,
});

module.exports = { s3 };
