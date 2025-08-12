import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addImageGalleryValidator, updateImageGalleryValidator } from "../validators/validator.js";
import {
  createImageGallery,
  deleteImageFromGallery,
  getImageById,
  getImageGallery,
  updateImageFromGallery,
} from "../controllers/imageGalleryController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const id = req.params.disease_id;
      const dir = `public/diseases/${id}/images`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
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

  // IMAGE VALIDATION
  const allowedImages = /jpeg|jpg|png|webp/;
  if (allowedImages.test(ext) && allowedImages.test(mime)) {
    return cb(null, true);
  }
  return cb(new Error("Only image files (jpg, png, webp) are allowed for images!"), false);
};

const imageGallery = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.get(
  "/:disease_id/:id",
  // #swagger.tags = ["Image Gallery"]
  getImageById
);

router.get(
  "/:disease_id",
  // #swagger.tags = ["Image Gallery"]
  getImageGallery
);

router.put(
  "/:disease_id",
  // #swagger.tags = ["Image Gallery"]
  // #swagger.requestBody = {}
  // #swagger.description = 'Delete one or more images by IDs from the gallery.'
  // #swagger.parameters["ids"] = { in: "formData", type: "array", items: { type: "number" }, collectionFormat: 'multi', required: true }
  deleteImageFromGallery
);

router.post(
  "/update/:disease_id",
  imageGallery.single("image_file"),
  updateImageGalleryValidator,
  // #swagger.tags = ["Image Gallery"]
  // #swagger.requestBody = {}
  // #swagger.parameters["id"] = { in: "formData", type: "number", required: true}
  // #swagger.parameters["name"] = { in: "formData", type: "string", required: true}
  // #swagger.parameters["image"] = { in: "formData", type: "string", required: true}
  // #swagger.parameters["image_file"] = { in: "formData", type: "file"}
  updateImageFromGallery
);

router.post(
  "/:disease_id",
  imageGallery.array("images"),
  addImageGalleryValidator,
  createImageGallery
);

router.use(async (err, req, res, next) => {
  console.log(err);
  res.status(400).json({
    message: "Invalid File Format",
  });
});

export default router;
