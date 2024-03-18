import express from "express";
import multer from 'multer';
import { post_picture, } from './pictures.controllers';
const pictureRouter = express.Router({ mergeParams: true });
const upload = multer({ dest: 'uploads/' });
pictureRouter.post('/', upload.single("myfile"), post_picture);
//pictureRouter.post('/', delete_picture);
export default pictureRouter;