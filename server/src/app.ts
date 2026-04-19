import express from "express";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes";
import lgpdRoutes from "./modules/lgpd/lgpd.routes";
import questionnaireRoutes from "./modules/questionnaire/questionnaire.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lgpd", lgpdRoutes);
app.use("/api/questionnaire", questionnaireRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
