import {HttpMethodEnum} from "./http-method.enum.js";
import {NextFunction, Request, Response} from "express";

export interface RouteInterface {
    path: string;
    method: HttpMethodEnum;
    handler: (req: Request, res: Response, next: NextFunction) => void;
}