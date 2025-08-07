import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Disease Dictionary",
    description: "Auto-generated Swagger UI for Disease Dictionary",
  },
  // host: "localhost:8030",
  host: "diseasedictionary.skyraantech.com/server",
  schemes: ["https"],
  tags: [
    {
      name: "API",
      description: "Endpoints for Flutter app",
    },
    {
      name: "Categories",
      description: "Endpoints for Categories",
    },
    {
      name: "Image Gallery",
      description: "Endpoint for Image Gallery",
    },
    {
      name: "Video Gallery",
      description: "Endpoint for Video Gallery",
    },
    {
      name: "Diseases",
      description: "Endpoints for diseases",
    },
    {
      name: "Trivia",
      description: "Endpoints for Trivia",
    },
    {
      name: "Reports",
      description: "Endpoint for Reports",
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../app.js"];
swaggerAutogen()(outputFile, endpointsFiles, doc);
