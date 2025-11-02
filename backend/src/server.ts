import path from "node:path";
import express from "express";
import cors from "cors";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
app.use(cors());
app.use(express.json());

// Charge la spec YAML depuis le cwd (/app en Docker)
const openapiPath = path.resolve(process.cwd(), "openapi.yaml");
const openapiSpec = YAML.load(openapiPath);

// Routes + docs
app.use("/api", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/api/openapi.json", (_req, res) => res.json(openapiSpec));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}/api`));
