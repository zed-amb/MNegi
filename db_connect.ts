import mongoose from "mongoose";

export function connectDB() {
    if (process.env.DB_URL)
        mongoose.connect(process.env.DB_URL)
            .then(() => console.log("connected to MongoDB"))
            .catch(err => console.log(err));
}