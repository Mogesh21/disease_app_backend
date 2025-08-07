import express from "express";
import {
  deleteUser,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
const router = express();

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/profile";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const profile = multer({
  storage: profileStorage,
  fileSize: 1024 * 1024 * 5,
});

router.get("/", getUsers);

router.post("/register", profile.single("avatar"), registerUser);

router.post("/login", loginUser);

router.post("/edituser", profile.single("avatar"), updateUser);

router.delete("/deleteuser/:id", deleteUser);

export default router;
