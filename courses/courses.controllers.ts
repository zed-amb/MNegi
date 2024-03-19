import { CourseModel } from './courses.model';
import { Request, Response } from 'express';


export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const { userId, fullname, email } = req.body.tokenData;
        const created_by_fullname = typeof fullname === 'string' ? fullname : `${fullname.first} ${fullname.last}`;
        const created_by = { user_id: userId, fullname: created_by_fullname, email };

        const courseData = { title, description, created_by, lectures: [] };

        const newCourse = await CourseModel.create(courseData);
        res.status(201).json(newCourse);
    } catch (error: any) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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


export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const userId = req.body.tokenData?._id; 

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

export const addLectureToCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const userId = req.body.tokenData?._id;
        const course = await CourseModel.findOne({ _id: courseId, 'created_by.user_id': userId }).exec();
        if (!course) {
            return res.status(403).json({ message: 'Unauthorized to add lecture to this course' });
        }

        const { title, description, url } = req.body;
        const newLecture = {
            title,
            description,
            url
        };

        course.lectures.push(newLecture);
        await course.save();
        const lectureUrls = course.lectures.map((lecture: any) => lecture.url);

        res.status(201).json({
            ...course.toJSON(),
            lectures: lectureUrls
        });
    } catch (error) {
        console.error('Error adding lecture to course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllLecturesOfCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;

        const course = await CourseModel.findById(courseId).exec();
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course.lectures);
    } catch (error) {
        console.error('Error fetching lectures of course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateLecture = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.course_id;
        const lectureId = req.params.lecture_id;
        const userId = req.body.tokenData?._id;

        const course = await CourseModel.findOne({ _id: courseId, 'created_by.user_id': userId }).exec();
        if (!course) {
            return res.status(403).json({ message: 'Unauthorized to update lecture in this course' });
        }

        const lecture = course.lectures.id(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        if (req.body.title) {
            lecture.title = req.body.title;
        }
        if (req.body.description) {
            lecture.description = req.body.description;
        }
        if (req.body.url) {
            lecture.url = req.body.url;
        }

        await course.save();

        res.json(course);
    } catch (error) {
        console.error('Error updating lecture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
