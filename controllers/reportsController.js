import Report from "../models/Report.js";

export const getReportReasons = async (req, res) => {
  // #swagger.tags = ["Reports"]
  try {
    const data = await Report.getReportReasons();
    return res.status(200).json({
      data: data,
      message: "data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getReportTypes = async (req, res) => {
  // #swagger.tags = ["Reports"]
  try {
    const data = await Report.getReportTypes();
    return res.status(200).json({
      data: data,
      message: "data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getReports = async (req, res) => {
  // #swagger.tags = ["Reports"]
  try {
    const data = await Report.getAllReports();
    return res.status(200).json({
      data: data,
      message: "data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addReport = async (req, res) => {
  // #swagger.tags = ["Reports"]
  try {
    const data = await Report.addReport();
    return res.status(200).json({
      data: data,
      message: "data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteReport = async (req, res) => {
  // #swagger.tags = ["Reports"]
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const result = await Report.deleteReport(id);
    if (result === 0) {
      res.status(404).json({
        message: "report not found",
      });
    } else {
      res.status(200).json({
        message: "report deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
