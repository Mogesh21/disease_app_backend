import { body, param } from "express-validator";

export const createReportValidator = [
  body("type_id").trim().notEmpty().withMessage("type_id is required"),
  body("content_id").trim().notEmpty().withMessage("content_id is required"),
  body("reason_id").trim().notEmpty().withMessage("reason_id is required"),
  body("device_id")
    .trim()
    .notEmpty()
    .withMessage("device_id is required")
    .isLength({ max: 40 })
    .withMessage("max length for device_id is 40"),
];

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 30 })
    .withMessage("max length for name is 30"),
  body("image_file").custom((_, { req }) => {
    if (!req.file || !req.file.filename) {
      throw new Error("Image is required");
    }
    return true;
  }),
];

export const updateCategoryValidator = [
  param("id").trim().isNumeric().withMessage("id is required"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 30 })
    .withMessage("max length for name is 30"),
];

export const createDiseaseValidator = [
  body("cat_id").trim().notEmpty().withMessage("cat_id is required"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 30 })
    .withMessage("max length for name is 30"),
  body("image_file").custom((_, { req }) => {
    if (!req.file || !req.file.filename) {
      throw new Error("Image is required");
    }
    return true;
  }),
  body("info").custom((value) => {
    if (!Array.isArray(value) && typeof JSON.parse(value) !== "object") {
      throw new Error("info must be an array");
    }
    return true;
  }),
];

export const updateDiseaseValidator = [
  param("id").trim().notEmpty().withMessage("id is required"),
  body("cat_id").trim().notEmpty().withMessage("cat_id is required"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 30 })
    .withMessage("max length for name is 30"),
  body("image").trim().notEmpty().withMessage("image is required"),
  body("info").custom((value) => {
    if (!Array.isArray(value) && typeof JSON.parse(value) !== "object") {
      throw new Error("info must be an array");
    }
    return true;
  }),
];

export const addImageGalleryValidator = [
  param("disease_id").isNumeric().withMessage("disease_id is required"),
  body("names").custom((value) => {
    if (!Array.isArray(value) && typeof JSON.parse(value) !== "object")
      throw new Error("names must be an array");
    else return true;
  }),
  body("images").custom((_, { req }) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new Error("At least one image is required");
    }
    return true;
  }),
];

export const updateImageGalleryValidator = [
  param("disease_id").isNumeric().withMessage("disease_id is required"),
  body("id").isNumeric().withMessage("id is required"),
  body("name").notEmpty().withMessage("name is required"),
  body("image").notEmpty().withMessage("image is required"),
];

export const addVideoGalleryValidator = [
  param("disease_id").isNumeric().withMessage("disease_id is required"),
  body("names").custom((value) => {
    if (!Array.isArray(value) && typeof JSON.parse(value) !== "object")
      throw new Error("names must be an array");
    else return true;
  }),
  body("videos").custom((_, { req }) => {
    if (!req.files || !Array.isArray(req.files.videos) || req.files.length === 0) {
      throw new Error("At least one video is required");
    }
    return true;
  }),
  body("thumbnails").custom((_, { req }) => {
    if (!req.files || !Array.isArray(req.files.thumbnails) || req.files.length === 0) {
      throw new Error("At least one thumbnails is required");
    }
    return true;
  }),
  // body("descriptions").custom((descriptions) => {
  //   if (!Array.isArray(descriptions) || typeof JSON.parse(descriptions) !== "object") {
  //     throw new Error("At least one description is required");
  //   }
  //   return true;
  // }),
];

export const updateVideoGalleryValidator = [
  param("disease_id").isNumeric().withMessage("disease_id is required"),
  body("id").isNumeric().withMessage("id is required"),
  body("name").notEmpty().withMessage("name is required"),
  body("video").notEmpty().withMessage("video is required"),
  body("thumbnail").notEmpty().withMessage("thumbnail is required"),
  body("description").notEmpty().withMessage("description is required"),
];

export const getHomeDetailsValidator = [
  body("last_cat_id").trim().notEmpty().withMessage("last_cat_id is required"),
  body("last_disease_id").trim().notEmpty().withMessage("last_disease_id is required"),
  body("last_trivia_id").trim().notEmpty().withMessage("last_trivia_id is required"),
];

export const reelSearchValidator = [
  body("search").trim().notEmpty().withMessage("search is required"),
  // body("cat_ids").custom((value) => {
  //   if (!Array.isArray(value) && typeof JSON.parse(value) !== "object")
  //     throw new Error("cat_ids must be an array");
  //   else return true;
  // }),
];
