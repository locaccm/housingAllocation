import express from "express";
import housingRoutes from "./routes/housingRoute";

const app = express();

app.use(express.json());

app.use("/housing", housingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
