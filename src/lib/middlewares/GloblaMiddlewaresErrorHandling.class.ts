import AppError from "@/utils/AppError.class"
import { NextFunction, Request, Response } from "express";

export default class GloblaMiddlewareErrorHandling {
  static globalErrorMiddleware(err: AppError | Error, _req: Request, res: Response, _next: NextFunction ) {
    if (err instanceof AppError) {
      const errorData = err.getErrorData();
      res.status(errorData.statusCode).json({
        message: errorData.message,
        status: errorData.statusCode
      });
    } else {
      console.log(err)
      res.status(500).json({
        message: "Tente novamente mais tarde, retornamos em breve!",
        status: 500
      });
    }
  }
}