import db from "../config/db.js";

const Trivia = {
  getTrivias: async (id = 0, limit = 300) => {
    try {
      const query = "SELECT id, content FROM trivia WHERE id > ? LIMIT ? ";
      const [result] = await db.query(query, [id, limit]);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getTriviaById: async (id) => {
    try {
      const query = "SELECT id, content FROM trivia WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
  addTrivia: async (data) => {
    try {
      let query = "INSERT INTO trivia (content) VALUES ";
      const params = [];
      data.forEach((value) => {
        params.push(`('${value}')`);
      });
      query += params.join(", ");
      const [result] = await db.query(query);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
  updateTrivia: async (id, content) => {
    try {
      const query = "UPDATE trivia SET content = ? WHERE id = ?";
      const [result] = await db.query(query, [content, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
  deleteTrivia: async (id) => {
    try {
      const query = "DELETE FROM trivia WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default Trivia;
