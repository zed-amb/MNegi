import express from 'express';

import { createCourse, getAllCourses,getOwnCourses, getCourseById, deleteCourse, updateCourse} from './courses.controllers';
import { checkAndVerifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/', checkAndVerifyToken, createCourse);
router.get('/', checkAndVerifyToken, getAllCourses);
router.get('/', checkAndVerifyToken, getOwnCourses);
router.get('/:course_id', checkAndVerifyToken, getCourseById);
router.delete('/:course_id', checkAndVerifyToken, deleteCourse);
router.put('/:course_id', checkAndVerifyToken, updateCourse);


export default router;
