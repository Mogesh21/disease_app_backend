import db from "../config/db.js";

const Category = {
  getCategories: async (last_id = 0, limit = 10000000) => {
    try {
      const query =
        "SELECT id, name, image, status from categories WHERE deleted_at is NULL AND id > ? LIMIT ?";
      const [result] = await db.query(query, [last_id, limit]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getCategoryById: async (id) => {
    try {
      const query =
        "SELECT id, name, image, status from categories WHERE id = ? AND deleted_at is NULL";
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  createCategory: async ({ name, image }) => {
    try {
      const query = "INSERT INTO categories(name, image) VALUES (?, ?) ";
      const [result] = await db.query(query, [name, image]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateCategory: async ({ name, image, id, status = 1 }) => {
    try {
      const query = "UPDATE categories SET name = ?, image = ?, status = ? WHERE id = ?";
      const [result] = await db.query(query, [name, image, status, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      const query = `UPDATE categories SET deleted_at = NOW() WHERE id = ?;
      SELECT * FROM categories WHERE id = ?;`;
      const [result] = await db.query(query, [id, id]);
      return result[1];
    } catch (err) {
      throw err;
    }
  },
};

export default Category;
