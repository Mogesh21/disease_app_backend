import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addVideoGalleryValidator, updateVideoGalleryValidator } from "../validators/validator.js";
import {
  createVideoGallery,
  deleteVideoFromGallery,
  getVideoById,
  getVideoGallery,
  updateVideoFromGallery,
} from "../controllers/videoGalleryController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const disease_id = req.params.disease_id;
      if (file.fieldname === "videos" || file.fieldname === "video_file") {
        const dir = `public/diseases/${disease_id}/videos`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
      } else if (file.fieldname === "thumbnails" || file.fieldname === "image_file") {
        const dir = `public/diseases/${disease_id}/thumbnails`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
      } else {
        cb(null);
      }
    } catch (err) {
      throw err;
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, Date.now() + "" + Math.floor(Math.random() * 10) + path.extname(file.originalname));
    } catch (err) {
      throw err;
    }
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (file.fieldname === "thumbnails" || file.fieldname === "image_file") {
    // IMAGE VALIDATION
    const allowedImages = /jpeg|jpg|png|webp/;
    if (allowedImages.test(ext) && allowedImages.test(mime)) {
      return cb(null, true);
    }
    return cb(new Error("Only image files (jpg, png, webp) are allowed for thumbnails!"), false);
  }

  if (file.fieldname === "videos" || file.fieldname === "video_file") {
    // VIDEO VALIDATION
    const allowedVideos = /mp4|mov|avi|mkv|webm/;
    if (allowedVideos.test(ext) && mime.startsWith("video/")) {
      return cb(null, true);
    }
    return cb(
      new Error("Only video files (mp4, mov, avi, mkv, webm) are allowed for videos!"),
      false
    );
  }

  return cb(new Error("Invalid file field!"), false);
};

const videoGallery = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.get(
  "/:disease_id/:id",
  // #swagger.tags = ["Video Gallery"]
  getVideoById
);

router.get(
  "/:disease_id",
  // #swagger.tags = ["Video Gallery"]
  getVideoGallery
);

router.put(
  "/:disease_id",
  // #swagger.tags = ["Video Gallery"]
  // #swagger.requestBody = {}
  // #swagger.description = 'Delete one or more images by IDs from the gallery.'
  // #swagger.parameters["ids"] = { in: "formData", type: "array", items: { type: "number" }, collectionFormat: 'multi', required: true }
  deleteVideoFromGallery
);

router.post(
  "/update/:disease_id",
  videoGallery.fields([
    { name: "video_file", maxCount: 1 },
    { name: "image_file", maxCount: 1 },
  ]),
  updateVideoGalleryValidator,
  // #swagger.tags = ["Video Gallery"]
  // #swagger.parameters["id"] = { in: "formData", type: "number", required: true}
  // #swagger.parameters["name"] = { in: "formData", type: "string", required: true}
  // #swagger.parameters["video"] = { in: "formData", type: "string", required: true}
  // #swagger.parameters["thumbnail"] = { in: "formData", type: "string", required: true }
  // #swagger.parameters["video_file"] = { in: "formData", type: "file"}
  // #swagger.parameters["image_file"] = { in: "formData", type: "file"}
  // #swagger.parameters["description"] = { in: "formData", type: "string", required: true}
  updateVideoFromGallery
);

router.post(
  "/:disease_id",
  // #swagger.tags = ["Video Gallery"]
  // #swagger.consumes = ["multipart/form-data"]
  // #swagger.requestBody = {}
  // #swagger.parameters["names"] = { in: 'formData', type: 'array', items: { type: 'string' }, collectionFormat: 'multi', required: true }
  // #swagger.parameters["videos"] = { in: "formData", type: "array", items: { type: "file" }, collectionFormat: 'multi', required: true }
  // #swagger.parameters["thumbnails"] = { in: "formData", type: "array", items: { type: "file" }, collectionFormat: 'multi', required: true }
  // #swagger.parameters["descriptions"] = { in: 'formData', type: 'array', items: { type: 'string' }, collectionFormat: 'multi',}
  videoGallery.fields([
    { name: "videos", maxCount: 20 },
    { name: "thumbnails", maxCount: 20 },
  ]),
  addVideoGalleryValidator,
  createVideoGallery
);

router.use(async (err, req, res, next) => {
  console.log(err);
  res.status(400).json({
    message: "Invalid File Format",
  });
});

export default router;
