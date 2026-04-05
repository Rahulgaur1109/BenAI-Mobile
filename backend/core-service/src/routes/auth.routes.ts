import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

export default router;
