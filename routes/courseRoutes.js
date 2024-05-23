import { Router } from "express";
const router = Router();
import {
    getCourse,
    getSemesterCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getTeacherCourses
} from "../controllers/courseControllers.js"




//collages
router.route("/").post(createCourse).get(getAllCourses)
router.route("/semester-courses/:semesterId").get(getSemesterCourses)
router.route("/:id").patch(updateCourse).delete(deleteCourse).get(getCourse);
router.route("/teacher-courses").get(getAllCourses);


export default router;
