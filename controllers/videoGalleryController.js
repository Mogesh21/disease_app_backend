import { validationResult } from "express-validator";
import VideoGallery from "../models/VideoGallery.js";
import removeFile from "../utils/removeFile.js";
import path from "path";

export const getVideoGallery = async (req, res) => {
  try {
    const disease_id = req.params.disease_id;
    if (!disease_id || !parseInt(disease_id)) {
      return res.status(400).json({
        message: "disease_id is required",
      });
    }

    const result = await VideoGallery.getVideosByDiseaseId(disease_id);
    const formattedResult = result.map((value) => ({
      ...value,
      video: `${process.env.SERVER}/public/diseases/${disease_id}/videos/${value.video}`,
      thumbnail_image: `${process.env.SERVER}/public/diseases/${disease_id}/thumbnails/${value.thumbnail_image}`,
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

export const getVideoById = async (req, res) => {
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

    const [result] = await VideoGallery.getVideosById(id, disease_id);
    if (result) {
      const formattedResult = {
        ...result,
        video: `${process.env.SERVER}/public/diseases/${disease_id}/videos/${result.video}`,
        thumbnail_image: `${process.env.SERVER}/public/diseases/${disease_id}/thumbnails/${result.thumbnail_image}`,
      };
      res.status(200).json({
        data: formattedResult,
        message: "Data fetched successfully",
      });
    } else {
      res.status(404).json({
        message: "Video not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createVideoGallery = async (req, res) => {
  const videos = req.files.videos.map((file) => file.filename);
  const thumbnails = req.files.thumbnails.map((file) => file.filename);
  const data = req.body;
  const disease_id = req.params.disease_id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      videos.forEach((video) => removeFile(video, `diseases/${disease_id}/videos`));
      thumbnails.forEach((thumbnail) => removeFile(thumbnail, `diseases/${disease_id}/thumbnails`));
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const names = typeof data.names === "string" ? JSON.parse(data.names) : data.names;
    const descriptions =
      typeof data.descriptions === "string" ? JSON.parse(data.descriptions) : data.descriptions;

    const payload = {
      disease_id: disease_id,
      names: names,
      videos: videos,
      thumbnails: thumbnails,
      descriptions: descriptions,
    };

    await VideoGallery.createVideoGallery(payload);
    res.status(201).json({
      message: "Videos uploaded successfully",
    });
  } catch (err) {
    console.log(err);
    videos.forEach((video) => removeFile(video, `diseases/${disease_id}/videos`));
    thumbnails.forEach((thumbnail) => removeFile(thumbnail, `diseases/${disease_id}/thumbnails`));
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateVideoFromGallery = async (req, res) => {
  const video_file = req.files.video_file ? req.files.video_file[0] : null;
  const image_file = req.files.image_file ? req.files.image_file[0] : null;
  const data = req.body;
  const video_name = path.basename(data.video);
  const thumbnail_name = path.basename(data.thumbnail);
  const video = video_file ? video_file.filename : video_name;
  const thumbnail_image = image_file ? image_file.filename : thumbnail_name;
  const disease_id = req.params.disease_id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (video_file) removeFile(video_file.filename, `diseases/${disease_id}/videos`);
      if (image_file) removeFile(image_file.filename, `diseases/${disease_id}/thumbnails`);
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const oldVideo = video_file ? video_name : null;
    const oldImage = image_file ? thumbnail_name : null;

    data.disease_id = disease_id;
    data.video = video;
    data.thumbnail = thumbnail_image;

    const result = await VideoGallery.updateVideoFromGallery(data);

    if (result !== 0) {
      if (oldImage) {
        removeFile(oldImage, `diseases/${data.disease_id}/thumbnails`);
      }
      if (oldVideo) {
        removeFile(oldVideo, `diseases/${data.disease_id}/videos`);
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
    if (video_file) removeFile(video_file.filename, `diseases/${disease_id}/videos`);
    if (image_file) removeFile(image_file.filename, `diseases/${disease_id}/thumbnails`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteVideoFromGallery = async (req, res) => {
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

    const result = await VideoGallery.deleteVideosFromGallery(ids, disease_id);
    if (result.length > 0) {
      result.forEach((data) => {
        removeFile(data.video, `diseases/${disease_id}/videos`);
        removeFile(data.thumbnail_image, `diseases/${disease_id}/thumbnails`);
      });
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
