// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import 'dotenv/config';
// import { connectDB } from "./db_connect";
// import userRouter from "./users/users.router";
// import pictureRouter from "./picutres/pictures.router";
// import { checkAndVerifyToken } from "./middleware/verifiyToken";
// import courseRouter from "./courses/courses.router";
// connectDB();
// const app = express();


// app.use(cors());
// app.use(express.json())

// app.use(helmet());
// app.use('/users', userRouter);
// app.use('/pictures', checkAndVerifyToken, express.json(), pictureRouter);
// app.use('/courses', checkAndVerifyToken, express.json, courseRouter);


// app.all('*', (req, res, next) => {
//     next(new Error('No Route matched. Try again'));
// });



// app.listen(3000, () => console.log('listening to server 3000'));


import express from "express";
import cors from "cors";
import helmet from "helmet";
// import 'dotenv/config';/
import { connectDB } from "./db_connect";
import userRouter from "./users/users.router";
import pictureRouter from "./picutres/pictures.router";
import courseRouter from "./courses/courses.router"
// import lectureRouter from "./courses/lectures/lectures.router"


connectDB();
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(helmet());

app.use('/users', userRouter);
app.use('/pictures', pictureRouter);
app.use('/courses', courseRouter); 
// app.use('/lectures', lectureRouter);

app.all('*', (req, res, next) => {
    next(new Error('No Route matched. Try again'));
});

app.listen(3000, () => console.log('Listening to server 3000'));

