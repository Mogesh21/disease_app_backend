import { validationResult } from "express-validator";
import Category from "../models/Category.js";
import removeFile from "../utils/removeFile.js";
import path from "path";

const imagePath = `${process.env.SERVER}/public/categories`;

export const getAllCategories = async (req, res) => {
  // #swagger.tags = ["Categories"]
  try {
    const result = await Category.getCategories();
    const formattedResult = result.map((record) => ({
      ...record,
      image: `${imagePath}/${record.image}`,
    }));
    res.status(200).json({
      data: formattedResult,
      message: "Category fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCategoryById = async (req, res) => {
  // #swagger.tags = ["Categories"]
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const [result] = await Category.getCategoryById(id);
    const formattedResult = {
      ...result,
      image: `${imagePath}/${result.image}`,
    };

    res.status(200).json({
      data: formattedResult,
      message: "Category fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createCategory = async (req, res) => {
  // #swagger.tags = ["Categories"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.requestBody = {}
  // #swagger.parameters["name"] = { in: 'formData', type: 'string', required: true}
  // #swagger.parameters["image_file"] = { in: 'formData', type: 'file', required: true}

  const filename = req.file?.filename;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      removeFile(filename, "categories");
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;
    data.image = filename;

    const id = await Category.createCategory(data);
    if (id) {
      res.status(201).json({
        id: id,
        message: "Category created successfully",
      });
    } else {
      removeFile(filename, "categories");
      throw new Error("Unable to create category");
    }
  } catch (err) {
    console.log(err);
    if (filename) removeFile(filename, "categories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req, res) => {
  // #swagger.tags = ["Categories"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.requestBody = {}
  // #swagger.parameters["name"] = { in: 'formData', type: 'string', required: true}
  // #swagger.parameters["image"] = { in: 'formData', type: 'string', required: true}
  // #swagger.parameters["image_file"] = { in: 'formData', type: 'file'}

  const filename = req.file ? req.file.filename : "";
  try {
    const id = req.params.id;
    const data = req.body;

    if (data.image.split("/").length > 0) {
      data.image = path.basename(data.image);
    }
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (filename) removeFile(filename, "categories");
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    let oldImage;
    if (filename) {
      oldImage = data.image;
      data.image = filename;
    }
    console.log(data);
    const result = await Category.updateCategory({ ...data, id: id });
    if (result) {
      if (oldImage) removeFile(oldImage, "categories");
      res.status(200).json({
        message: "Category updated successfully",
      });
    } else {
      if (filename) removeFile(filename, "categories");
      res.status(404).json({
        message: "Category not updated",
      });
    }
  } catch (err) {
    console.log(err);
    if (filename) removeFile(filename, "categories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  // #swagger.tags = ["Categories"]
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [data] = await Category.deleteCategory(id);
    if (data.deleted_at) {
      removeFile(data.image, "categories");
      res.status(200).json({
        message: "Category deleted sucessfully",
      });
    } else {
      res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
