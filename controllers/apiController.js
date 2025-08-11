import { validationResult } from "express-validator";
import Report from "../models/Report.js";
import Trivia from "../models/Trivia.js";
import Category from "../models/Category.js";
import Disease from "../models/Disease.js";
import ImageGallery from "../models/ImageGallery.js";
import VideoGallery from "../models/VideoGallery.js";

const categoryImagePath = `${process.env.SERVER}/public/categories`;

export const createReport = async (req, res) => {
  // #swagger.tags= ["API"]
  // #swagger.parameters['type_id'] = { in: "formData", required: true, type: "number"}
  // #swagger.parameters['content_id'] = { in: "formData", required: true,  type: "number"}
  // #swagger.parameters['reason_id'] = { in: "formData", required: true,  type: "number"}
  // #swagger.parameters['device_id'] = { in: "formData", required: true,  type: "string"}
  // #swagger.parameters['reason'] = { in: "formData", type: "string"}
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;
    const id = await Report.createReport(data);
    if (id) {
      res.status(200).json({
        result: 1,
        resultData: {
          id: id,
        },
        message: "report submitted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code === "ER_NO_REFERENCED_ROW_2" && err.message.includes("reason_id")) {
      res.status(200).json({
        result: 0,
        resultData: null,
        message: "Invalid reason_id",
      });
    } else if (err.code === "ER_NO_REFERENCED_ROW_2" && err.message.includes("content_id")) {
      console.log(err);
      res.status(200).json({
        result: 0,
        resultData: null,
        message: "Invalid content_id",
      });
    } else if (err.code === "ER_NO_REFERENCED_ROW_2" && err.message.includes("type_id")) {
      res.status(200).json({
        result: 0,
        resultData: null,
        message: "Invalid type_id",
      });
    } else {
      res.status(200).json({
        result: 0,
        resultData: null,
        message: "Internal Server Error",
      });
    }
  }
};

export const getReportReasons = async (req, res) => {
  // #swagger.tags = ["API"]
  try {
    const result = await Report.getReportReasons();
    res.status(200).json({
      result: 1,
      resultData: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getReportTypes = async (req, res) => {
  // #swagger.tags = ["API"]
  try {
    const result = await Report.getReportTypes();
    res.status(200).json({
      result: 1,
      resultData: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getTrivias = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["id"] = { in: "formData", type: "number", required: true }
  try {
    const id = req.body.id;
    const limit = 300;
    if (!id || isNaN(parseInt(id))) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "id is required",
      });
    }
    const result = await Trivia.getTrivias(parseInt(id), limit);

    res.status(200).json({
      result: 1,
      resultData: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getHomeDetails = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["last_cat_id"] = { in: "formData", type: "number", required: true}
  // #swagger.parameters["last_disease_id"] = { in: "formData", type: "number", required: true}
  // #swagger.parameters["last_trivia_id"] = { in: "formData", type: "number", required: true}
  try {
    const data = req.body;
    const limit = 300;
    const categories = await Category.getCategories(data.last_cat_id, limit);
    const filteredCategories = categories.filter((category) => category.status === 1);
    const formattedCategories = filteredCategories.map((category) => {
      delete category.status;
      return {
        ...category,
        image: `${categoryImagePath}/${category.image}`,
      };
    });

    const trivias = await Trivia.getTrivias(data.last_trivia_id, limit);
    const formattedTrivias = trivias.map((trivia) => {
      const newTrivia = {
        id: trivia.id,
        trivia: trivia.content,
      };

      return newTrivia;
    });

    const diseases = await Disease.getDiseaseInfo(data.last_disease_id, limit);

    res.status(200).json({
      result: 1,
      resultData: {
        trivias: formattedTrivias,
        cat_info: formattedCategories,
        disease_info: diseases,
      },
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getDiseaseDetails = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["id"] = { in: "formData", type: "number", required: true }
  try {
    const id = req.body.id;
    if (!id || isNaN(parseInt(id))) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "id is required",
      });
    }

    const [disease] = await Disease.getDiseaseById(id);
    if (disease) {
      const formattedDisease = {
        ...disease,
        image: disease?.image
          ? `${process.env.SERVER}/public/diseases/${disease.id}/${disease.image}`
          : "",
        info: typeof disease.info === "string" ? JSON.parse(disease.info) : disease.info,
      };

      const images = await ImageGallery.getImageByDiseaseId(id);
      const formattedImages = images.map((value) => ({
        ...value,
        image: `${process.env.SERVER}/public/diseases/${id}/images/${value.image}`,
      }));

      const videos = await VideoGallery.getVideosByDiseaseId(id);
      const formattedVideos = videos.map((value) => ({
        ...value,
        video: `${process.env.SERVER}/public/diseases/${id}/videos/${value.video}`,
        thumbnail_image: `${process.env.SERVER}/public/diseases/${id}/thumbnails/${value.thumbnail_image}`,
      }));

      res.status(200).json({
        result: 1,
        resultData: {
          disease_info: formattedDisease,
          photos: formattedImages,
          videos: formattedVideos,
        },
        message: "Data fetched successfully",
      });
    } else {
      res.status(200).json({
        result: 0,
        resultData: null,
        message: "Disease not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getReelVideos = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["last_id"] = { in: 'formData', type: "number", required: true }
  try {
    const last_id = req.body.last_id;
    if (!last_id || isNaN(parseInt(last_id))) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "last_id is required",
      });
    }

    const videos = await VideoGallery.getReelVideos(last_id);
    const formattedVideos = videos.map((value) => ({
      ...value,
      video: `${process.env.SERVER}/public/diseases/${value.disease_id}/videos/${value.video}`,
      thumbnail_image: `${process.env.SERVER}/public/diseases/${value.disease_id}/thumbnails/${value.thumbnail_image}`,
    }));
    res.status(200).json({
      result: 1,
      resultData: formattedVideos,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getVideosByCatId = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["cat_id"] = { in: 'formData', type: "number", required: true }
  try {
    const cat_id = req.body.cat_id;
    if (!cat_id || isNaN(parseInt(cat_id))) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "cat_id is required",
      });
    }
    const videos = await VideoGallery.getVideoByCategoryId(cat_id);
    const formattedVideos = videos.map((value) => ({
      ...value,
      video: `${process.env.SERVER}/public/diseases/${value.disease_id}/videos/${value.video}`,
      thumbnail_image: `${process.env.SERVER}/public/diseases/${value.disease_id}/thumbnails/${value.thumbnail_image}`,
    }));

    res.status(200).json({
      result: 1,
      resultData: formattedVideos,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getVideosByDiseaseId = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["disease_id"] = { in: 'formData', type: "number", required: true }
  try {
    const disease_id = req.body.disease_id;
    if (!disease_id || isNaN(parseInt(disease_id))) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "disease_id is required",
      });
    }
    const videos = await VideoGallery.getVideosByDiseaseId(disease_id);
    const formattedVideos = videos.map((value) => ({
      ...value,
      video: `${process.env.SERVER}/public/diseases/${value.disease_id}/videos/${value.video}`,
      thumbnail_image: `${process.env.SERVER}/public/diseases/${value.disease_id}/thumbnails/${value.thumbnail_image}`,
    }));

    res.status(200).json({
      result: 1,
      resultData: formattedVideos,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const searchReels = async (req, res) => {
  // #swagger.tags = ["API"]
  // #swagger.requestBody = {}
  // #swagger.parameters["search"] = {in: "formData", type: "string", required: true }
  // #swagger.parameters["cat_ids"] = {in: "formData", type: "array", items: { type: "number" } }
  try {
    const seachText = req.body.search;
    const cat_ids = req.body.cat_ids;
    const result = await VideoGallery.searchVideo(seachText, cat_ids);
    const formattedResult = result.map((value) => ({
      ...value,
      video: `${process.env.SERVER}/public/diseases/${value.disease_id}/videos/${value.video}`,
      thumbnail_image: `${process.env.SERVER}/public/diseases/${value.disease_id}/thumbnails/${value.thumbnail_image}`,
    }));

    res.status(200).json({
      result: 1,
      resultData: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};
