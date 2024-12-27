import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import leads from "./routes/leads";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - Reto Técnico Guros👋🌎🌍🌏",
  });
});

router.use("/leads", leads);

export default router;
