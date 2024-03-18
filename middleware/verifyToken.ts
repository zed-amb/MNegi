// import { RequestHandler } from "express";
// import { verify } from 'jsonwebtoken';
// import { JWTContent } from "../jwtTypes";

// export const checkAndVerifyToken: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {

//     const token = req.headers.authorization?.split(' ')[1];

//     if (token) {
//         const secret = process.env.mySecret;
//         const results = verify(token, "secret") as JWTContent;
//         if (results) {
//             req.userInfo = results;
//             next();
//         } else {
//             res.json({ message: "you are not authorized" });
//         }
//     }


// };
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAndVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    // console.log('Token:', token);
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token is required' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, error: 'Token is not correct' });
    }

    const decodedToken = jwt.verify(tokenParts[1], process.env.mySecret as string);
    // console.log('Decoded Token:', decodedToken); 
    if (!decodedToken) {
      return res.status(401).json({ success: false, error: 'Wrong Token Signature' });
    }

    // Assuming req.body exists, you can append tokenData to it
    if (!req.body) req.body = {};
    req.body['tokenData'] = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, error: 'Token verification failed' });
  }
};
