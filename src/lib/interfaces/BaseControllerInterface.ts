import { Request, Response } from "express";


export default interface BaseControllerInterface {
    POST: (req: Request, res: Response) => Promise<void>;
    GET: (req: Request, res: Response) => Promise<void>;
}