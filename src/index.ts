import express from "express";
import leaseRoutes from "./routes/leaseRoute";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import cors from "cors";

const app = express();
const urlFront = process.env.URL_FRONT ?? "http://localhost:5173";

app.use(
  cors({
    origin: urlFront,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type, Authorization, userId"],
    credentials: true,
  }),
); // NOSONAR

app.disable("x-powered-by");

app.use(express.json());

app.use("/lease-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/lease", leaseRoutes);

const PORT = process.env.PORT ?? 5000;

// Use for test, unless impossible to finish the test (infinite loop)
const server = app.listen(PORT, () => {});

export { server };
export default app;
