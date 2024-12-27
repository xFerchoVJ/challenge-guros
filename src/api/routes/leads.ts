import { Router } from "express";
import {
  createLead,
  getLead,
  getLeadsByStatus,
  updateLeadStatus,
} from "../controllers/leads.controller";

const router = Router();

router.post("/", createLead);
router.get("/", getLeadsByStatus);
router.get("/:identifier", getLead);
router.patch("/:identifier", updateLeadStatus);

export default router;
