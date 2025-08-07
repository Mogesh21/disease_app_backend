import { validationResult } from "express-validator";
import ImageGallery from "../models/ImageGallery.js";
import removeFile from "../utils/removeFile.js";
import path from "path";

export const getImageById = async (req, res) => {
  // #swagger.tags = ["Image Gallery"]
  try {
    const disease_id = req.params.disease_id;
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    if (!disease_id || !parseInt(disease_id)) {
      return res.status(400).json({
        message: "disease_id is required",
      });
    }

    const [result] = await ImageGallery.getImageById(id, disease_id);
    if (result) {
      const formattedResult = {
        ...result,
        image: `${process.env.SERVER}/public/diseases/${disease_id}/images/${result.image}`,
      };

      res.status(200).json({
        data: formattedResult,
        message: "Data fetched successfully",
      });
    } else {
      res.status(400).json({
        message: "Image not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getImageGallery = async (req, res) => {
  try {
    const disease_id = req.params.disease_id;
    if (!disease_id || !parseInt(disease_id)) {
      return res.status(400).json({
        message: "disease_id is required",
      });
    }

    const result = await ImageGallery.getImageByDiseaseId(disease_id);
    if (result.length > 0) {
      const formattedResult = result.map((value) => ({
        ...value,
        image: `${process.env.SERVER}/public/diseases/${disease_id}/images/${value.image}`,
      }));

      res.status(200).json({
        data: formattedResult,
        message: "Data fetched successfully",
      });
    } else {
      res.status(400).json({
        message: "Disease not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createImageGallery = async (req, res) => {
  //#swagger.tags = ["Image Gallery"]
  // #swagger.consumes = ["multipart/form-data"]
  // #swagger.requestBody = {}
  // #swagger.parameters["names"] = { in: 'formData', type: 'array', items: { type: 'string' }, collectionFormat: 'multi', required: true }
  // #swagger.parameters["images"] = { in: 'formData', type: 'array', items: { type: 'file' }, collectionFormat: 'multi', required: true }
  const images = req.files.map((file) => file.filename);
  const data = req.body;
  const disease_id = req.params.disease_id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      images.forEach((image) => removeFile(image, `diseases/${disease_id}/images`));
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const names = typeof data.names === "string" ? JSON.parse(data.names) : data.names;

    const payload = {
      disease_id: disease_id,
      images: images,
      names: names,
    };

    await ImageGallery.createImageGallery(payload);
    res.status(201).json({
      message: "Images uploaded successfully",
    });
  } catch (err) {
    console.log(err);
    images.forEach((image) => removeFile(image, `diseases/${disease_id}/images`));
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateImageFromGallery = async (req, res) => {
  const file = req.file;
  const data = req.body;
  const image = path.basename(data.image);
  const filename = file ? file.filename : image;
  const disease_id = req.params.disease_id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (file) removeFile(file.filename, `diseases/${disease_id}/images`);
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const oldImage = file ? image : null;
    data.disease_id = disease_id;
    data.image = filename;
    const result = await ImageGallery.updateImageFromGallery(data);
    if (result !== 0) {
      if (oldImage) {
        removeFile(oldImage, `diseases/${disease_id}/images`);
      }
      res.status(200).json({
        message: "Data updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Data not found",
      });
    }
  } catch (err) {
    console.log(err);
    if (file) {
      removeFile(filename, `diseases/${disease_id}/images`);
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteImageFromGallery = async (req, res) => {
  try {
    const ids = req.body?.ids || "";
    const disease_id = req.params.disease_id;
    if (!disease_id || !parseInt(disease_id)) {
      return res.status(400).json({
        message: "disease_id is required",
      });
    }
    if (!Array.isArray(ids) && typeof JSON.parse(ids) !== "object") {
      return res.status(400).json({
        message: "ids is required and must be an array",
      });
    }

    const result = await ImageGallery.deleteImagesFromGallery(ids, disease_id);
    if (result.length > 0) {
      result.forEach((image) => removeFile(image, `diseases/${disease_id}/images`));
      res.status(200).json({
        message: "Data deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Data not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
