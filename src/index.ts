import express from "express";
import leaseRoutes from "./routes/leaseRoute";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

const app = express();

app.use(express.json());

app.use("/lease", leaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
