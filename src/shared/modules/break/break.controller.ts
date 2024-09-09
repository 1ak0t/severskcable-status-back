import {BaseControllerAbstract, HttpError, HttpMethodEnum} from "../../libs/rest/index.js";
import {inject, injectable} from "inversify";
import {Component} from "../../types/index.js";
import {LoggerInterface} from "../../libs/logger/index.js";
import {BreakServiceInterface} from "./break-service.interface.js";
import {Request, Response} from "express";
import {fillDTO} from "../../helpers/common.js";
import {BreakRdo} from "./rdo/break.rdo.js";
import {CreateBreakRequestType} from "./create-break-request.type.js";
import {StatusCodes} from "http-status-codes";
import {ParamBreakIdType} from "./types/parem-break.type.js";
import {UpdateBreakDto} from "./dto/update-break.dto.js";

@injectable()
export class BreakController extends BaseControllerAbstract {
    constructor(
        @inject(Component.Logger) protected readonly logger: LoggerInterface,
        @inject(Component.BreakService) private readonly breakService: BreakServiceInterface,
    ) {
        super(logger);

        this.logger.info('Register routes for BreakController...');

        this.addRoute({path: '/', method: HttpMethodEnum.Get, handler: this.getAll});
        this.addRoute({path: '/', method: HttpMethodEnum.Post, handler: this.create});
        this.addRoute({path: '/:breakId', method: HttpMethodEnum.Patch, handler: this.update});
        this.addRoute({path: '/:breakId', method: HttpMethodEnum.Delete, handler: this.delete});
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

    public async update({body, params}: Request<ParamBreakIdType, unknown, UpdateBreakDto>, res: Response): Promise<void> {
        const updatedBreak = await this.breakService.updateById(params.breakId, body);

        if (!updatedBreak) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                `Offer with id ${params.breakId} not found.`,
                'OfferController'
            );
        }

        this.ok(res, fillDTO(BreakRdo, updatedBreak));
    }

    public async delete({params}: Request<ParamBreakIdType>, res: Response): Promise<void> {
        const {breakId} = params;
        const breaks = await this.breakService.deleteById(breakId);

        if (!breaks) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                `Offer with id ${breakId} not found.`,
                'OfferController'
            );
        }

        this.noContent(res, breaks)
    }
}