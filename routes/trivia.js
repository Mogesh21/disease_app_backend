import express from "express";
import {
  addTrivia,
  deleteTrivia,
  getTriviaById,
  getTrivias,
  updateTrivia,
} from "../controllers/triviaController.js";

const router = express.Router();

router.get("/", getTrivias);
router.get("/:id", getTriviaById);
router.post("/", addTrivia);
router.put("/:id", updateTrivia);
router.delete("/:id", deleteTrivia);

export default router;
