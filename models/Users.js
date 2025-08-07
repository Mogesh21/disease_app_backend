import db from "../config/db.js";

const UserModel = {
  getAllUsers: async () => {
    try {
      const query = "SELECT * FROM users WHERE isdeleted = 0";
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getUserByEmail: async (email) => {
    try {
      const query = "SELECT * from users WHERE email = ?";
      const [result] = await db.query(query, email);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getUserById: async (email) => {
    try {
      const query = "SELECT * from users WHERE id = ?";
      const [result] = await db.query(query, email);
      return result;
    } catch (err) {
      throw err;
    }
  },
  registerUser: async ({ name, avatar, email, hashedPassword }) => {
    try {
      const query = "INSERT INTO users (name, avatar, email, password) Values (?, ?, ?, ?)";
      const [result] = await db.query(query, [name, avatar, email, hashedPassword]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },
  updateUser: async ({ name, email, password, filename, id }) => {
    try {
      let query = "UPDATE users  SET name = ?, email = ?, avatar = ? ";
      let params = [name, email, filename];

      if (password) {
        query += ", password = ? ";
        params.push(password);
      }

      query += ` WHERE id = ?`;
      params.push(id);

      const [result] = await db.query(query, params);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
  deleteUser: async (id) => {
    try {
      const query = "DELETE FROM users WHERE id= ?";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default UserModel;
