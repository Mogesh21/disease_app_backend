import UserModel from "../models/Users.js";
import removeFile from "../utils/removeFile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const result = await UserModel.getAllUsers();
    res.status(200).json({
      data: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const registerUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  const avatar = req.file ? req.file.filename : "";
  try {
    const { name, email, password } = req.body;
    const data = await UserModel.getUserByEmail(email);
    if (data.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await UserModel.registerUser({ name, avatar, email, hashedPassword });
    if (result) {
      res.status(201).json({ message: "User created Successfully" });
    } else {
      removeFile(avatar, "profile");
      res.status(400).json({
        message: "Unable to create user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const { email, password } = req.body.credentials;
    const [user] = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.email) {
      const verified = await bcrypt.compare(password, user.password);
      if (verified) {
        delete user.password;
        user.avatar = user.avatar ? `${process.env.SERVER}/public/profile/${user.avatar}` : "";
        const token = jwt.sign({ data: user }, process.env.SECRET_KEY, {
          expiresIn: "3d",
        });
        res.status(200).json({ message: "success", authorization: "Bearer " + token });
      } else {
        res.status(401).json({ message: "Wrong Password" });
      }
    } else {
      res.status(404).json({ message: "name Not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const data = req.body;
    const { name, email, new_password, current_password, old_image, remove_image, id } = data;
    const image = old_image.split("/");
    const image_name = image[image.length - 1];
    const filename = req.file ? req.file.filename : remove_image ? "" : image_name;
    let password = "";
    if (new_password) {
      const [user] = await UserModel.getUserById(id);
      const samePassword = bcrypt.compareSync(current_password, user.password);
      if (samePassword) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(new_password, salt);
        password = hashedPassword;
      } else {
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }
    }
    const result = await UserModel.updateUser({ name, email, password, filename, id });
    const [user] = await UserModel.getUserById(id);
    if (result === 0) {
      res.status(404).json({
        message: "User not updated",
      });
    } else {
      if ((req.file && old_image) || (remove_image && old_image)) {
        removeFile(image_name, "profile");
      }
      delete user.password;
      user.avatar = user.avatar ? `${process.env.SERVER}/public/profile/${user.avatar}` : "";
      const token = jwt.sign({ data: user }, process.env.SECRET_KEY, {
        expiresIn: "3d",
      });
      res.status(200).json({
        token: "Bearer " + token,
        message: "User updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const { id } = req.params;
    if (!id && !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [data] = await UserModel.getUserById(id);
    const result = await UserModel.deleteUser(id);
    if (result === 0) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      if (data.avatar) removeFile(data.avatar, "profile");
      res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
