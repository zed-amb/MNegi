import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAndVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token is required' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, error: 'Token is not correct' });
    }

    const decodedToken = jwt.verify(tokenParts[1], process.env.mySecret as string);
    if (!decodedToken) {
      return res.status(401).json({ success: false, error: 'Wrong Token Signature' });
    }
    if (!req.body) req.body = {};
    req.body['tokenData'] = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, error: 'Token verification failed' });
  }
};
