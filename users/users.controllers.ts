import { RequestHandler } from "express";
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { StandardResponse } from "../types/response";
import { User, UserModel } from "./users.model";


import 'dotenv/config';


export const signUp: RequestHandler<unknown, any, User, unknown> = async (req, res, next) => {
    try {
        const newUser = req.body;
        const hashed_password = await hash(newUser.password, 10);
        req.body.password = hashed_password;
        const result = await UserModel.create(newUser);
        res.json({ active: true, data: result._id });
    } catch (error) {
        next(error);
    }


};

export const signIn: RequestHandler<unknown, StandardResponse<{ jwt: string }>, User, unknown> = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const my_key: string = process.env.MySecret || '';

        const result = await UserModel.findOne({ email, active: true });
        if (result) {
            const match = await compare(password, result.password);

            if (match) {
                const jwtToken = sign({ user_id: result._id, email }, my_key);

                res.json({ success: true, data: { jwt: jwtToken } });
            } else {
                res.status(401).json({ success: false, error: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ success: false, error: 'User not found or inactive' });
        }
    } catch (error) {
        next(error);
    }
};


// export const signIn: RequestHandler<{ user_id: string; }, unknown, User, unknown> = async (req, res, next) => {
//     try {
//         const { user_id } = req.params;
//         const { email, password } = req.body;
//         const my_key: string = process.env.MySecret || '';

//         const result = await UserModel.findOne({ _id: user_id, active: true });
//         if (result) {
//             const match = await compare(password, result.password);

//             if (match) {
//                 const jwt = sign({ user_id: user_id, email: email }, my_key);

//                 res.json({ jwt });

//             }
//         }
//     }
//     catch (error) {
//         next(error);
//     }
// };







