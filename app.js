import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { config } from "dotenv";
import APIRoutes from "./routes/apis.js";
import CategoryRoutes from "./routes/categories.js";
import DiseaseRoutes from "./routes/diseases.js";
import ReportRoutes from "./routes/reports.js";
import TriviaRoutes from "./routes/trivia.js";
import userRoutes from "./routes/users.js";
import ImageGalleryRoutes from "./routes/imageGallery.js";
import VideoGalleryRoutes from "./routes/videoGallery.js";

const app = express();
config();

const swaggerFile = JSON.parse(
  readFileSync(new URL("./docs/swagger.json", import.meta.url), "utf-8")
);

const options = {
  customCss: `
    .topbar{
      display: none !important;
    }
    .scheme-container{
      display: none !important;
    }
    .description .markdown{
      display: none !important;
    }
    .curl-command {
      display: none !important;
    }
    .headers-wrapper {
      display: none !important;
    }
  `,
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));
app.use("/public", express.static("public"));

app.use("/categories", CategoryRoutes);
app.use("/diseases", DiseaseRoutes);
app.use("/image-gallery", ImageGalleryRoutes);
app.use("/video-gallery", VideoGalleryRoutes);
app.use("/reports", ReportRoutes);
app.use("/trivia", TriviaRoutes);
app.use("/user", userRoutes);
app.use("/api", APIRoutes);

app.use((req, res) => {
  res.redirect("/docs");
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server running at " + process.env.PORT);
  }
});
