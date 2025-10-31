import express from "express";
import cors from "cors";
import router from "./routes.js";
import { openapiSpec } from "./openapi.js";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}/api`));
