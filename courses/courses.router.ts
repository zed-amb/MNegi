import express from 'express';

import { createCourse, getAllCourses,getOwnCourses, getCourseById, deleteCourse, updateCourse, addLectureToCourse, getAllLecturesOfCourse} from './courses.controllers';
import { checkAndVerifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/', checkAndVerifyToken, createCourse);
router.get('/', checkAndVerifyToken, getAllCourses);
router.get('/', checkAndVerifyToken, getOwnCourses);
router.get('/:course_id', checkAndVerifyToken, getCourseById);
router.delete('/:course_id', checkAndVerifyToken, deleteCourse);
router.put('/:course_id', checkAndVerifyToken, updateCourse);

router.post('/:course_id/lectures', checkAndVerifyToken, addLectureToCourse);
router.get('/:course_id/lectures', checkAndVerifyToken, getAllLecturesOfCourse);

export default router;
