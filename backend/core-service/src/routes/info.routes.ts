import { Router } from "express";
import * as ctrl from "../controllers/info.controller";

const router = Router();

router.get("/", ctrl.getAllInfo);
router.get("/:key", ctrl.getInfoByKey);

export default router;
