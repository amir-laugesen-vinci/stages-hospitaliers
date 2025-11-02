import express from "express";
import cors from "cors";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
app.use(cors());
app.use(express.json());

// Charge la spec YAML
const openapiSpec = YAML.load("./openapi.yaml");

// Branche mes routes et la doc
app.use("/api", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Lance mon serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}/api`));
