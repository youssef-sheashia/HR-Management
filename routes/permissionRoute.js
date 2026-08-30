import { createPermission } from "../controllers/permissionController.js";
import express from "express";
import { validate } from "../middlewares/validate.js";
import { createPermissionSchema } from "../validation/permissionValidation.js";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";
const router = express.Router();

router.use(protect);

router.post(
  "/",
  validate(createPermissionSchema),
  restrictTo("employee"),
  createPermission,
);
export default router;
