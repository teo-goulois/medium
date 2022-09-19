import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import { s3 } from "./awsS3Client";
import getEnvVar from "../utils/getEnvVar";

export interface OutputImage {
  upload: AWS.S3.ManagedUpload;
}


export const uploadImage = async (
  file2upload: FileFormdiable
): Promise<OutputImage> => {
  if (file2upload.size > 10 * 1024 * 1024) {
    throw new Error("the uploaded image should be less than 10mb");
  }
  const file = file2upload.filepath;

  const fileStream = fs.createReadStream(file);

  const uploadParams = {
    Bucket: getEnvVar("AWS_S3_BUCKET_NAME"),
    Key: path.basename(file),
    Body: fileStream,
  };

  try {
    const upload = new AWS.S3.ManagedUpload({
      params: uploadParams,
      service: s3,
      partSize: 5 * 1024 * 1024,
      queueSize: 1,
    });
    AWS.S3.ManagedUpload.maxTotalParts = 10 * 1024 * 1024;

    return { upload };
  } catch (err) {
    throw new Error(err as string);
  }
};

