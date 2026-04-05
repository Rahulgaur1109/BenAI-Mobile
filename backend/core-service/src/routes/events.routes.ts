import { Router } from "express";
import * as ctrl from "../controllers/events.controller";

const router = Router();

router.get("/", ctrl.listEvents);
router.post("/", ctrl.createEvent);

export default router;
