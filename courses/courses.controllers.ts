import { CourseModel } from './courses.model';
import { Request, Response } from 'express';


export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const { _id, fullname, email } = req.body.tokenData;
        
        const created_by = { user_id: _id, fullname, email };
        const courseData = { title, description, created_by, lectures: [] };

        const newCourse = await CourseModel.create(courseData);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const courses = await CourseModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get courses owned by the user with pagination
export const getOwnCourses = async (req: Request, res: Response) => {
    try {
        const userId = req.body.tokenData._id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const courses = await CourseModel.find({ 'created_by.user_id': userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.json(courses);
    } catch (error) {
        console.error('Error fetching own courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific course by course id
export const getCourseById = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const course = await CourseModel.findById(courseId).exec();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a course by course id
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const userId = req.body.tokenData?._id; // I Used optional chaining to access _id

        const course = await CourseModel.findById(courseId).exec();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.created_by || course.created_by.user_id?.toString() !== userId) { // Check if created_by exists and then access user_id
            return res.status(403).json({ message: 'Unauthorized to delete this course' });
        }

        await CourseModel.findByIdAndDelete(courseId).exec();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const userId = req.body.tokenData._id;
        const { title, description } = req.body;
        const course = await CourseModel.findById(courseId).exec();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.created_by?.user_id?.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this course' });
        }

        course.title = title;
        course.description = description;
        await course.save();

        res.json(course);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

















// import { RequestHandler } from "express";
// import { Course, CourseModel } from "./courses.model";
// import { StandardResponse } from "../types/response";

// export const post_course: RequestHandler<unknown, StandardResponse<Course>, Course, unknown> = async (req, res, next) => {
//     try {
//         const { title, description } = req.body;
//         const { userInfo } = req;
//         console.log(userInfo);
//         if (userInfo) {

//             const result = await CourseModel.create({ title, description, created_by: userInfo._id });
//             res.json({ success: true, data: result });
//         }
//     }
//     catch (error) {
//         next(error);
//     }
// };


