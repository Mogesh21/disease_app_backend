import express from "express";
import multer from "multer";
import { createCategoryValidator, updateCategoryValidator } from "../validators/validator.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoriesController.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const path = "public/categories";
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    } catch (err) {
      throw err;
    }
  },
  filename: function (req, file, cb) {
    try {
      cb(null, Date.now() + "" + Math.floor(Math.random() * 10) + path.extname(file.originalname));
    } catch (err) {
      console.log("Err", err);
      throw err;
    }
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // IMAGE VALIDATION
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  if (allowedImages.test(ext) && allowedImages.test(mime)) {
    return cb(null, true);
  }
  return cb(new Error("Only image files (jpg, png, gif, webp) are allowed for images!"), false);
};

const category = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", category.single("image_file"), createCategoryValidator, createCategory);
router.put("/:id", category.single("image_file"), updateCategoryValidator, updateCategory);
router.delete("/:id", deleteCategory);

router.use(async (err, req, res, next) => {
  res.status(400).json({
    message: "Invalid File Format",
  });
});

export default router;
