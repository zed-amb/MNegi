import { RequestHandler } from "express";
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { StandardResponse } from "../types/response";
import { User, UserModel } from "./users.model";


import 'dotenv/config';

export const signUp: RequestHandler<unknown, any, User, unknown> = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email is already in use' });
        }
        const hashedPassword = await hash(password, 10);
        const newUser = await UserModel.create({ fullname, email, password: hashedPassword });
        res.status(201).json({ success: true, data: { userId: newUser._id } });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
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
                const jwtToken = sign({ user_id: result._id, email, fullname: result.fullname }, my_key);

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

