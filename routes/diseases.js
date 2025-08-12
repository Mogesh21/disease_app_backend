import express from "express";
import { createDiseaseValidator, updateDiseaseValidator } from "../validators/validator.js";
import {
  createDisease,
  deleteDisease,
  getDiseases,
  updateDisease,
} from "../controllers/diseaseController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const dir = `public/temp/`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      throw err;
    }
  },
  filename: function (req, file, cb) {
    try {
      cb(null, Date.now() + "" + Math.floor(Math.random() * 10) + path.extname(file.originalname));
    } catch (err) {
      throw err;
    }
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const id = req.params.id;
      const dir = `public/diseases/${id}`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
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

const diseaseTemp = multer({
  storage: tempStorage,
  limits: { fileSize: 200 * 1024 },
});

const disease = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 },
});

router.get("/", getDiseases);
router.post("/", diseaseTemp.single("image_file"), createDiseaseValidator, createDisease);
router.put("/:id", disease.single("image_file"), updateDiseaseValidator, updateDisease);
router.delete("/:id", deleteDisease);

export default router;
