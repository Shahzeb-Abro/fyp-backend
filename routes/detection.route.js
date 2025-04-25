import { Router } from "express";
import { detectUlcer } from "../controllers/detection.controller.js";
const router = Router();

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), detectUlcer);

export default router;
