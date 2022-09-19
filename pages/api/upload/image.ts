import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { uploadImage } from "../../../libs/media";

type Data = {
  url?: string | null;
  error?: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const data: { fields: formidable.Fields; files: formidable.Files } =
      await new Promise(function (resolve, reject) {
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, function (err, fields, files) {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });
    const file = data.files.file;
    if (!file) {
      return res.status(400).json({
        url: null,
        error: "no files uploaded",
      });
    }
    try {
      const response = await uploadImage(file as FileFormdiable);
      const upload = response.upload;
      const result = await upload.promise();
      
      res.status(200).json({ url: result.Location });
    } catch (e: unknown) {
      let error = (e as Error).message;
      res.status(500).json({
        url: null,
        error: error,
      });
    }
  }
}

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};
