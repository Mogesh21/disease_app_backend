import { validationResult } from "express-validator";
import Disease from "../models/Disease.js";
import db from "../config/db.js";
import path from "path";
import fs from "fs";
import removeFile from "../utils/removeFile.js";
import ImageGallery from "../models/ImageGallery.js";
import VideoGallery from "../models/VideoGallery.js";

const imagePath = `${process.env.SERVER}/public/diseases`;

export const getDiseases = async (req, res) => {
  // #swagger.tags = ["Diseases"]
  try {
    const result = await Disease.getDiseases();
    const formattedResult = result.map((value) => ({
      ...value,
      image: `${imagePath}/${value.id}/${value.image}`,
      info: typeof value.info === "string" ? JSON.parse(value.info) : value.info,
    }));

    res.status(200).json({
      data: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createDisease = async (req, res) => {
  // #swagger.tags = ["Diseases"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.requestBody = {}
  // #swagger.parameters["cat_id"]  = {in : 'formData', required: true, type: 'number'}
  // #swagger.parameters["name"]  = {in : 'formData', required: true, type: 'string'}
  // #swagger.parameters["info"]  = {in : 'formData', required: true, type: 'string'}
  // #swagger.parameters["image_file"]  = {in : 'formData', required: true, type: 'file'}

  const tempDir = `public/temp`;
  const conn = await db.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const file = req.file;
    const data = req.body;
    const filename = file.filename;

    data.image = filename;
    data.info = typeof data.info !== "string" ? JSON.stringify(data.info) : data.info;

    conn.beginTransaction();
    const id = await Disease.createDisease(data, conn);

    const dir = `public/diseases/${id}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const srcPath = path.join(process.cwd(), `${tempDir}/${filename}`);
    const destPath = path.join(process.cwd(), `${dir}/${filename}`);
    fs.copyFileSync(srcPath, destPath);

    conn.commit();
    res.status(201).json({
      message: "Data added successfully",
    });
  } catch (err) {
    conn.rollback();
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true });
    conn.release();
  }
};

export const updateDisease = async (req, res) => {
  // #swagger.tags = ["Diseases"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.requestBody = {}
  // #swagger.parameters["id"]  = {in : 'formData', required: true, type: 'number'}
  // #swagger.parameters["cat_id"]  = {in : 'formData', required: true, type: 'number'}
  // #swagger.parameters["name"]  = {in : 'formData', required: true, type: 'string'}
  // #swagger.parameters["info"]  = {in : 'formData', required: true, type: 'string'}
  // #swagger.parameters["image"]  = {in : 'formData', required: true, type: 'string'}
  // #swagger.parameters["image_file"]  = {in : 'formData', type: 'file'}

  const file = req.file;
  const data = req.body;
  const id = req.params.id;
  data.id = id;
  if (data.image.split("/").length > 0) {
    data.image = path.basename(data.image);
  }
  const filename = file ? file.filename : data.image;
  const conn = await db.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const oldImage = file ? data.image : "";

    data.image = filename;
    data.info = typeof data.info !== "string" ? JSON.stringify(data.info) : data.info;

    conn.beginTransaction();
    const result = await Disease.updateDisease(data, conn);

    if (result !== 0) {
      if (oldImage) {
        removeFile(oldImage, `diseases/${data.id}`);
      }
    }
    conn.commit();
    res.status(200).json({
      message: "Data updated successfully",
    });
  } catch (err) {
    conn.rollback();
    if (file?.filename) {
      removeFile(`diseases/${data.id}`, file.filename);
    }
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    conn.release();
  }
};

export const deleteDisease = async (req, res) => {
  // #swagger.tags = ["Diseases"]
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    // delete image_gallery
    const images = await ImageGallery.deleteImagesByDiseaseId(id);
    // images.forEach((image) => removeFile(image, `diseases/${id}/images`));
    // delete video_gallery
    const videos = await VideoGallery.deleteVideosByDiseaseId(id);
    // videos.forEach((video) => {
    //   removeFile(video.video, `diseases/${id}/videos`);
    //   removeFile(video.thumbnail_image, `diseases/${id}/thumbnails`);
    // });

    const result = await Disease.deleteDisease(id);
    if (result !== 0) {
      fs.rmSync(`public/diseases/${id}`, { recursive: true });
    }
    res.status(200).json({
      message: "Disease deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
