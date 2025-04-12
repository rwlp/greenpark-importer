import { Response } from "express";

export default class ResponseWrapperDTO<T> {
    message: string;
    status: number;
    data: T;
    totalRecords?: number;
    dataType: string;

    static responseWrapper(res: Response, message: string, status: number, dataType: string, data?: unknown, totalRecords?: number, isCached: boolean = false) {
      if (isCached) {
        res.setHeader('Cache-Control', 'public, max-age=180');
      }
      
      res.status(status).json(new ResponseWrapperDTO<typeof data>(message, status, data, dataType, totalRecords));
    };
  
    constructor(message: string, status: number, data: T, dataType: string, totalRecords?: number) {
      this.message = message;
      this.status = status;
      this.data = data;
      this.totalRecords = totalRecords;
      this.dataType = dataType;
    }
  }



