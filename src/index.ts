import express from "express";
import leaseRoutes from "./routes/leaseRoute";

const app = express();

app.use(express.json());
app.use("/lease", leaseRoutes);

const PORT = process.env.PORT || 5000;

// Use for test, unless impossible to finish the test (infinite loop)
const server = app.listen(PORT, () => {});

export { server };  
export default app;
