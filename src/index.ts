import express from "express";
import leaseRoutes from "./routes/leaseRoute";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use("/lease-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/lease", leaseRoutes);

const PORT = process.env.PORT ?? 5000;

// Use for test, unless impossible to finish the test (infinite loop)
const server = app.listen(PORT, () => {});

export { server };
export default app;
