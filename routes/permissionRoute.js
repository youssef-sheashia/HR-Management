import {
  createPermission,
  getAllPermissions,
  getMYPermissions,
  getpermissionsByManager,
  permissionActionByManager,
  permissionActionByHR,
  deletePermission,
} from "../controllers/permissionController.js";
import express from "express";
import { validate, validateIdParams } from "../middlewares/validate.js";
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
router.get("/", restrictTo("hr", "admin"), getAllPermissions);
router.get("/manager", restrictTo("manager"), getpermissionsByManager);
router.patch(
  "/:id/manager-action",
  restrictTo("manager"),
  validateIdParams,
  permissionActionByManager,
);
router.patch(
  "/:id/hr-action",
  restrictTo("hr"),
  validateIdParams,
  permissionActionByHR,
);
router.delete(
  "/:id",
  restrictTo("employee"),
  validateIdParams,
  deletePermission,
);
router.get("/my", restrictTo("employee"), getMYPermissions);
export default router;
