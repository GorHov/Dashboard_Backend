import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  };

  console.log(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};


export default errorHandler;