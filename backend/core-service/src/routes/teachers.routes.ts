import { Router } from "express";
import * as ctrl from "../controllers/teachers.controller";

const router = Router();

router.get("/", ctrl.listTeachers);
router.get("/:id", ctrl.getTeacherById);
router.post("/", ctrl.createTeacher);

export default router;
