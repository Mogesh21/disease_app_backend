import Trivia from "../models/Trivia.js";

export const getTrivias = async (req, res) => {
  // #swagger.tags = ["Trivia"]
  try {
    const limit = 10000000;
    const id = 0;
    const result = await Trivia.getTrivias(id, limit);
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

export const getTriviaById = async (req, res) => {
  // #swagger.tags = ["Trivia"]
  const id = req.params.id;
  if (!id || !parseInt(id)) {
    return res.status(400).json({
      message: "id is required",
    });
  }

  const [result] = await Trivia.getTriviaById(id);
  if (result?.id) {
    res.status(200).json({
      data: result,
      message: "Data fetched successfully",
    });
  } else {
    res.status(200).json({
      message: "Trivia not found",
    });
  }
};

export const addTrivia = async (req, res) => {
  // #swagger.tags = ["Trivia"]
  // #swagger.requestBody= {}
  // #swagger.parameters["content"] = { in: "formData", type: "array", items: { type: "string" }, collectionFormat: "multi", required: true}
  try {
    const data = req.body.content;
    if (!Array.isArray(data)) {
      return res.status(400).json({
        message: "content must be an array",
      });
    }
    const result = await Trivia.addTrivia(data);
    if (result > 0)
      res.status(201).json({
        message: "Trivia added successfully",
      });
    else {
      res.status(422).json({
        message: "Unable to add trivia",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateTrivia = async (req, res) => {
  // #swagger.tags = ["Trivia"]
  // #swagger.requestBody = {}
  // #swagger.parameters["content"] = {in: "formData", type: "string", required: true}
  try {
    const id = req.params?.id;
    const content = req.body?.content;

    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    if (!content || typeof content !== "string") {
      return res.status(400).json({
        message: "content must be a valid string",
      });
    }

    const result = await Trivia.updateTrivia(id, content);
    if (result > 0) {
      res.status(200).json({
        message: "Trivia updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Trivia not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteTrivia = async (req, res) => {
  // #swagger.tags = ["Trivia"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await Trivia.deleteTrivia(id);
    if (result > 0) {
      res.status(200).json({
        message: "Trivia is deleted",
      });
    } else {
      res.status(404).json({
        message: "Trivia not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
