import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cron from "node-cron";

import * as middlewares from "./middlewares";
import api from "./api";
import { updateLeadStatusJob } from "./jobs/updateLeadsStatusJob";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/v1", api);

cron.schedule("0 * * * *", () => {
  console.log("Iniciando Job para actualizar status de los leads");
  updateLeadStatusJob();
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
