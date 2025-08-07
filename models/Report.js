import db from "../config/db.js";

const Report = {
  getReportReasons: async () => {
    try {
      const query = "SELECT id, reason from report_reasons";
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getReportTypes: async () => {
    try {
      const query = "SELECT id, type from report_types";
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllReports: async () => {
    try {
      const query =
        "SELECT r.id, r.type_id, rt.type, r.content_id, r.reason_id, rs.reason as reason_name, r.device_id, r.reason, r.created_at FROM reports as r LEFT JOIN report_reasons as rs ON r.reason_id = rs.id LEFT JOIN report_types as rt ON r.type_id = rt.id WHERE deleted_at is NULL";
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      throw err;
    }
  },

  createReport: async ({ type_id, content_id, reason_id, device_id, reason = "" }) => {
    try {
      const query = `INSERT INTO reports (type_id, content_id, reason_id, device_id, reason) VALUES
                        (?, ?, ?, ?, ?)`;
      const [result] = await db.query(query, [type_id, content_id, reason_id, device_id, reason]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateReport: async ({ id, type_id, content_id, reason_id, device_id, reason = "" }) => {
    try {
      const query = `UPDATE reports SET type_id = ?, content_id = ?, reason_id = ?, device_id = ?, reason = ? WHERE id = ?`;
      const [result] = await db.query(query, [
        type_id,
        content_id,
        reason_id,
        device_id,
        reason,
        id,
      ]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  deleteReport: async (id) => {
    try {
      const query = "DELETE FROM reports WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default Report;
