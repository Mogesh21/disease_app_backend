import db from "../config/db.js";

const VideoGallery = {
  getVideosByDiseaseId: async (disease_id) => {
    try {
      const query =
        "SELECT id, disease_id, name, video, thumbnail_image, description from video_gallery WHERE disease_id = ?";
      const [result] = await db.query(query, [disease_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getVideosById: async (id, disease_id) => {
    try {
      const query =
        "SELECT id, disease_id, name, video, thumbnail_image, description from video_gallery WHERE id = ? AND disease_id = ?";
      const [result] = await db.query(query, [id, disease_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getVideoByCategoryId: async (cat_id) => {
    try {
      const query = `SELECT
                      v.id, v.disease_id, v.name, v.video, v.thumbnail_image, v.description
                    FROM
                      video_gallery v
                    JOIN 
                      diseases d
                    ON d.id = v.disease_id
                    WHERE
                      d.cat_id = ?`;
      const [result] = await db.query(query, [cat_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  createVideoGallery: async ({ videos, names, thumbnails, disease_id, descriptions }) => {
    try {
      let query =
        "INSERT INTO video_gallery (disease_id, name, video, thumbnail_image, description) VALUES ";
      const values = [];
      videos.forEach((video, index) => {
        values.push(
          `(${disease_id}, '${names[index]}', '${video}', '${thumbnails[index]}', '${descriptions[index]}')`
        );
      });
      query += values.join(", ");
      const [result] = await db.query(query);
      return result.insertIds;
    } catch (err) {
      throw err;
    }
  },

  updateVideoFromGallery: async ({ id, video, thumbnail, name, description, disease_id }) => {
    try {
      const query =
        "UPDATE video_gallery SET disease_id = ?, name = ?, video = ?, thumbnail_image = ?, description = ? WHERE id = ?";
      const [result] = await db.query(query, [disease_id, name, video, thumbnail, description, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteVideosFromGallery: async (ids, disease_id) => {
    try {
      const fetchQuery =
        "SELECT video, thumbnail_image from video_gallery WHERE disease_id = ? AND id IN (?)";
      const [data] = await db.query(fetchQuery, [disease_id, ids]);
      const query = "DELETE FROM video_gallery WHERE disease_id = ? AND id IN (?)";
      const [result] = await db.query(query, [disease_id, ids]);
      if (result.affectedRows > 0) {
        return data;
      }
      return [];
    } catch (err) {
      throw err;
    }
  },

  deleteVideosByDiseaseId: async (disease_id) => {
    try {
      const fetchQuery = "SELECT video, thumbnail_image from video_gallery WHERE disease_id = ?";
      const [data] = await db.query(fetchQuery, [disease_id]);
      const query = "DELETE FROM video_gallery WHERE disease_id = ?";
      const [result] = await db.query(query, [disease_id]);
      if (result.affectedRows > 0) {
        return data;
      }
      return [];
    } catch (err) {
      throw err;
    }
  },

  deleteVideoById: async (id) => {
    try {
      const fetchQuery =
        "SELECT disease_id, video, thumbnail_image from video_gallery WHERE id = ?";
      const [data] = await db.query(fetchQuery, [id]);
      const query = "DELETE FROM video_gallery WHERE id = ?";
      const [result] = await db.query(query, [id]);
      if (result.affectedRows > 0) {
        return data;
      }
      return [];
    } catch (err) {
      throw err;
    }
  },

  searchVideo: async (search, cat_ids) => {
    try {
      let query = "";
      const params = [];
      if (cat_ids) {
        query = `SELECT
                  v.id,
                  v.disease_id,
                  v.name,
                  v.video,
                  v.thumbnail_image,
                  v.description
                  FROM video_gallery v
                  JOIN diseases d
                  ON v.disease_id = d.id
                  WHERE d.name LIKE ? AND d.cat_id IN (?)`;
        params.push(`%${search}%`);
        params.push(cat_ids);
      } else {
        query = `SELECT
                  v.id,
                  v.disease_id,
                  v.name,
                  v.video,
                  v.thumbnail_image,
                  v.description
                  FROM video_gallery v
                  JOIN diseases d
                  ON v.disease_id = d.id
                  WHERE d.name LIKE ?`;
        params.push(`%${search}%`);
      }
      const [result] = await db.query(query, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getReelVideos: async (last_id = 0) => {
    try {
      const query =
        "SELECT id, disease_id, name, video, thumbnail_image, description from video_gallery WHERE id > ?";
      const [result] = await db.query(query, [last_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

export default VideoGallery;
