import express from "express";
import {
  createReportValidator,
  getHomeDetailsValidator,
  reelSearchValidator,
} from "../validators/validator.js";
import {
  createReport,
  getDiseaseDetails,
  getHomeDetails,
  getReelVideos,
  getReportReasons,
  getReportTypes,
  getTrivias,
  getVideosByCatId,
  getVideosByDiseaseId,
  searchReels,
} from "../controllers/apiController.js";

const router = express.Router();

router.post("/trivia", getTrivias);
router.post("/home", getHomeDetailsValidator, getHomeDetails);
router.post("/disease-details", getDiseaseDetails);
router.post("/category/videos", getVideosByCatId);
router.post("/videos", getReelVideos);
router.post("/disease/videos", getVideosByDiseaseId);
router.post("/reels/search", reelSearchValidator, searchReels);
router.post("/report", createReportValidator, createReport);
router.post("/report-types", getReportTypes);
router.post("/report-reasons", getReportReasons);

export default router;
