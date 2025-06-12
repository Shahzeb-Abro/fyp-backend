import AppError from "../utils/appError.js";
import { storage } from "../utils/appWrite.js";
import catchAsync from "../utils/catchAsync.js";

import { InputFile } from "node-appwrite/file";
import { ID } from "node-appwrite";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import History from "../models/history.model.js";

export const detectUlcer = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("Please upload an image", 400));
  }

  const appwriteRes = await storage.createFile(
    process.env.APPWRITE_DETECTION_BUCKET_ID,
    ID.unique(),
    InputFile.fromPath(file.path, file.originalname)
  );

  const fileId = appwriteRes.$id;

  const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_DETECTION_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

  const form = new FormData();
  form.append("file", fs.createReadStream(file.path), file.originalname);

  // Send to Flask API
  const flaskRes = await axios.post(
    `${process.env.MODEL_BASE_URL}/predict`,
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
    }
  );

  await fs.promises.unlink(file.path);

  if (flaskRes.status !== 200) {
    return next(new AppError("Error in prediction", 500));
  }

  await History.create({
    userId: req?.user?._id || "680b9c949db31fa827a60ec3",
    imgUrl: fileUrl,
    result: flaskRes.data.class_name,
  });

  console.log("Flask res", flaskRes);

  res.json({
    status: "success",
    message: "Detected successfully",
    data: {
      result: flaskRes.data.class_name,
      flaskRes: flaskRes.data,
    },
  });
});
