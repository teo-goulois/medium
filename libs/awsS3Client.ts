import getEnvVar from "../utils/getEnvVar";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: getEnvVar("AWS_S3_REGION"),
  accessKeyId: getEnvVar("AWS_S3_ACCESS_KEY_ID"),
  secretAccessKey: getEnvVar("AWS_S3_SECRET_ACCESS_KEY"),
  signatureVersion: "v4",
});

export { s3 };
