import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getMine,
  listValidators,
  postSetDay,
  setDayValidators,
  postBulkWeeks,
  bulkWeekValidators,
  getSummary,
} from "../controllers/schedules.controller.js";

const router = Router();
router.use(authenticate);
router.get("/me", listValidators, getMine);
router.post("/set-day", setDayValidators, postSetDay);
router.post("/bulk-weeks", bulkWeekValidators, postBulkWeeks);
router.get("/summary", authenticate, authorize("ADMIN"), getSummary);
export default router;
