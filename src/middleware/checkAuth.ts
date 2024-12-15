import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserData {
  userId: number | undefined;
}

declare global {
  namespace Express {
    interface Request {
      userData?: UserData;
    }
  }
}

export const authMiddleware = function (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    req.userData = { userId: decodedToken.id };
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    return next(error);
  }
}
