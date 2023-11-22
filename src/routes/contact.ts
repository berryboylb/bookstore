import express, { Request } from "express";
import {
  createNew,
  findAll,
  getSingle,
  updateOne,
  deleteRecord,
} from "../controllers/contact.controller";
import { validateSchema } from "../middleware";
import { ContactValidationSchema } from "../validators";

const router = express.Router();
router.post("/", validateSchema(ContactValidationSchema), createNew);
router.get("/", findAll);
router.get("/:id", getSingle);
router.put("/:id", validateSchema(ContactValidationSchema), updateOne);
router.delete("/:id", deleteRecord);
export default router;
