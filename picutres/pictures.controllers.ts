
import { RequestHandler } from 'express';
import multer from 'multer';

import { StandardResponse } from "../types/response";
import { UserModel } from '../users/users.model';
import { GUEST_PICTURE } from '../users/users.model';



export const post_picture: RequestHandler<{ user_id: string; }, StandardResponse<number>, unknown, unknown> = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { userInfo } = req;
        const user_image = req.file;
        if (user_id === userInfo._id) {
            const result = await UserModel.updateOne({ _id: user_id, active: true }, { $set: { picture: user_image } });
            res.json({ success: true, data: result.modifiedCount });
        }

    } catch (error) {
        next(error);
    }

};

export const delete_picture: RequestHandler<{ user_id: string; }, unknown, unknown, unknown> = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { userInfo } = req;
        if (user_id === userInfo._id) {
            const result = await UserModel.updateOne({ _id: user_id, active: true }, { $set: { picture: GUEST_PICTURE } });
            res.json({ success: true, data: result.modifiedCount });
        }

    } catch (error) {
        next(error);
    }

};

export const update_picture: RequestHandler<{ user_id: string; }, unknown, unknown, { action: string; }> = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { userInfo } = req;
        const { action } = req.query;
        if (user_id === userInfo._id) {
            if (action === "deactivate_profile") {
                const result = await UserModel.updateOne({ _id: user_id, active: true }, { $set: { active: false } });
                if (result) {
                    res.json({ success: true, data: result.modifiedCount });
                }
            }
        }
    } catch (error) {
        next(error);
    }
};