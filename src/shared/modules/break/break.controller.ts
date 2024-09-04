import {BaseControllerAbstract, HttpMethodEnum} from "../../libs/rest/index.js";
import {inject, injectable} from "inversify";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {BreakServiceInterface} from "./break-service.interface.js";
import {Request, Response} from "express";
import {fillDTO} from "../../helpers/common.js";
import {BreakRdo} from "./rdo/break.rdo.js";
import {CreateBreakRequestType} from "./create-break-request.type.js";

@injectable()
export class BreakController extends BaseControllerAbstract {
    constructor(
        @inject(Component.Logger) protected readonly logger: LoggerInterface,
        @inject(Component.BreakService) private readonly breakService: BreakServiceInterface,
    ) {
        super(logger);

        this.logger.info('Register routes for BreakController...');

        this.addRoute({path: '/', method: HttpMethodEnum.Get, handler: this.getAll});
        this.addRoute({path: '/create', method: HttpMethodEnum.Post, handler: this.create})
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const breaks = await this.breakService.find();
        const responseData = fillDTO(BreakRdo, breaks);
        this.ok(res, responseData);
    }

    public async create(
        {body}: CreateBreakRequestType,
        res: Response
    ): Promise<void> {
        const result = await this.breakService.create(body);
        this.created(res, fillDTO(BreakRdo, result));
    }
}