import db from "../config/db.js";

const ImageGallery = {
  getImageByDiseaseId: async (disease_id) => {
    try {
      const query = "SELECT id, disease_id, name, image from image_gallery WHERE disease_id = ?";
      const [result] = await db.query(query, [disease_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getImageById: async (id, disease_id) => {
    try {
      const query =
        "SELECT id, disease_id, name, image from image_gallery WHERE id = ? AND disease_id = ?";
      const [result] = await db.query(query, [id, disease_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  createImageGallery: async ({ images, names, disease_id }) => {
    try {
      let query = "INSERT INTO image_gallery (disease_id, name, image) VALUES ";
      const values = [];
      images.forEach((image, index) => {
        values.push(`(${disease_id}, '${names[index]}', '${image}')`);
      });
      query += values.join(", ");
      const [result] = await db.query(query);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateImageFromGallery: async ({ id, image, name, disease_id }) => {
    try {
      const query = "UPDATE image_gallery SET image = ?, name = ?, disease_id = ? WHERE id = ?";
      const [result] = await db.query(query, [image, name, disease_id, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteImagesFromGallery: async (ids, disease_id) => {
    try {
      const fetchQuery = "SELECT image from image_gallery WHERE disease_id = ? AND id IN (?)";
      const [data] = await db.query(fetchQuery, [disease_id, ids]);
      const query = "DELETE FROM image_gallery WHERE disease_id = ? AND id IN (?)";
      const [result] = await db.query(query, [disease_id, ids]);
      if (result.affectedRows > 0) {
        return data.map((value) => value.image);
      }
      return [];
    } catch (err) {
      throw err;
    }
  },

  deleteImagesByDiseaseId: async (disease_id) => {
    try {
      const fetchQuery = "SELECT image from image_gallery WHERE disease_id = ?";
      const [data] = await db.query(fetchQuery, [disease_id]);
      const query = "DELETE FROM image_gallery WHERE disease_id = ?";
      const [result] = await db.query(query, [disease_id]);
      if (result.affectedRows > 0) {
        return data.map((value) => value.image);
      }
      return [];
    } catch (err) {
      throw err;
    }
  },
};

export default ImageGallery;
