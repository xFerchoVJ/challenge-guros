import { Router } from "express";
import {
  createLead,
  getLead,
  getLeadsByStatus,
  updateLeadStatus,
} from "../controllers/leads.controller";
import { body } from "express-validator";

const validateLeadRequestPost = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("El número de teléfono es requerido"),
  body("email").isEmail().withMessage("El email debe ser válido"),
  body("fullName").notEmpty().withMessage("El nombre completo es requerido"),
  body("status").notEmpty().withMessage("El estatus es requerido"),
  body("postalCode").notEmpty().withMessage("El código postal es requerido"),
  body("birthDate")
    .isDate()
    .withMessage("La fecha de nacimiento debe ser válida"),
  body("gender").notEmpty().withMessage("El género es requerido"),
  body("vehicle").notEmpty().withMessage("El vehículo es requerido"),
];

const router = Router();

router.post("/", validateLeadRequestPost, createLead);
router.get("/", getLeadsByStatus);
router.get("/:identifier", getLead);
router.patch(
  "/:identifier",
  body("status").notEmpty().withMessage("El status es requerido"),
  updateLeadStatus
);

export default router;
