import express from "express";
import {
  deleteReport,
  getReportReasons,
  getReports,
  getReportTypes,
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/reasons", getReportReasons);
router.get("/types", getReportTypes);
router.get("/", getReports);
router.delete("/:id", deleteReport);

export default router;
