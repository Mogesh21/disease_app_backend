import db from "../config/db.js";

const Disease = {
  getDiseaseInfo: async (disease_id = 0, limit = 500) => {
    try {
      const query = `SELECT d.id, d.cat_id, d.name FROM diseases d LEFT JOIN categories c ON d.cat_id = c.id WHERE d.id > ? AND c.status = 1 LIMIT ?`;
      const [result] = await db.query(query, [disease_id, limit]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getDiseases: async (disease_id = 0, limit = 500) => {
    try {
      const query = `SELECT id, cat_id, name, image, info FROM diseases WHERE id > ? LIMIT ?`;
      const [result] = await db.query(query, [disease_id, limit]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getDiseaseById: async (id = 0) => {
    try {
      const query = `SELECT id, cat_id, name, image, info FROM diseases WHERE id = ?`;
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // getDiseaseById: async (id) => {
  //   try {
  //     const query = `SELECT
  //                           d.id, d.cat_id, d.name, d.image, d.info,
  //                           JSON_ARRAYAGG(JSON_OBJECT(
  //                                   'id', i.id,
  //                                   'disease_id', i.disease_id,
  //                                   'name', i.name,
  //                                   'image_url', i.image
  //                               )
  //                           ) as images,
  //                           JSON_ARRAYAGG(JSON_OBJECT(
  //                                   'id', v.id,
  //                                   'disease_id', v.disease_id,
  //                                   'name', v.name,
  //                                   'url', v.url,
  //                                   'thumbnail_image', v.thumbnail_image
  //                               )
  //                           ) as videos
  //                       FROM diseases d
  //                       LEFT JOIN image_gallery i ON d.id = i.disease_id
  //                       LEFT JOIN video_gallery v ON d.id = v.disease_id
  //                       WHERE id = ? AND d.deleted_at IS NULL
  //                       GROUP BY d.id
  //                       `;
  //     const [result] = await db.query(query, [id]);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  createDisease: async ({ cat_id, name, image, info }, conn = db) => {
    try {
      const query = `INSERT INTO diseases (cat_id, name, image, info) VALUES (?, ?, ?, ?)`;
      const [result] = await conn.query(query, [cat_id, name, image, info]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateDisease: async ({ cat_id, name, image, info, id }, conn = db) => {
    try {
      const query = `UPDATE diseases SET cat_id = ?, name = ?, image = ?, info = ? WHERE id = ?`;
      const [result] = await conn.query(query, [cat_id, name, image, info, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteDisease: async (id) => {
    try {
      const query = "DELETE FROM diseases WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default Disease;
